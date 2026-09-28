import base64
import io
import logging
import re
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from pydantic import BaseModel, Field

from app.db.database import db_manager
from app.security.auth import get_optional_user
from app.security.scanner import PromptScanner

try:
    import pypdf
except ImportError:
    pypdf = None

try:
    import docx
except ImportError:
    docx = None

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/rag", tags=["RAG Document Security"])


class RagScanRequest(BaseModel):
    document_name: str = Field(..., description="Filename or title of document")
    content: str = Field(..., min_length=1, description="Raw text content of the document")
    chunk_size: int = Field(400, ge=100, le=2000, description="Target chunk size in characters")
    chunk_overlap: int = Field(50, ge=0, le=500, description="Overlap in characters between adjacent chunks")
    detection_mode: str = Field("Standard (Recommended)", description="Standard, Aggressive, or Enterprise Compliance")
    detect_indirect: bool = Field(True, description="Detect indirect prompt injections")
    detect_obfuscated: bool = Field(True, description="Check for obfuscated content")
    analyze_links: bool = Field(False, description="Scan and analyze external URLs")
    allow_threshold: Optional[float] = None
    block_threshold: Optional[float] = None


class RagSanitizeRequest(BaseModel):
    document_name: str
    content: str
    redaction_token: str = Field("[PROMPTSHIELD REDACTED INJECTION]", description="Token to replace malicious text with")
    chunk_size: int = 400
    chunk_overlap: int = 50


def get_scanner(request: Request) -> PromptScanner:
    scanner = getattr(request.app.state, "scanner", None)
    if scanner is None or scanner.ml_detector is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="PromptShield security engine / ML model is not loaded yet."
        )
    return scanner


def extract_text_from_bytes(filename: str, file_bytes: bytes) -> Dict[str, Any]:
    lower_name = filename.lower()
    page_count = 1
    extracted_text = ""

    if lower_name.endswith(".pdf"):
        if pypdf is None:
            raise HTTPException(status_code=500, detail="PDF parser (pypdf) is not installed on the server.")
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            page_count = len(reader.pages)
            pages = []
            for p in reader.pages:
                txt = p.extract_text() or ""
                if txt.strip():
                    pages.append(txt.strip())
            extracted_text = "\n\n".join(pages)
            if not extracted_text.strip():
                extracted_text = "[No selectable text found in PDF. Document may contain scanned images or empty pages.]"
        except Exception as e:
            logger.error(f"Error parsing PDF {filename}: {e}")
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF document: {str(e)}")

    elif lower_name.endswith(".docx"):
        if docx is None:
            raise HTTPException(status_code=500, detail="DOCX parser (python-docx) is not installed on the server.")
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        paragraphs.append(row_text)
            extracted_text = "\n\n".join(paragraphs)
            page_count = max(1, len(extracted_text.split()) // 300)
            if not extracted_text.strip():
                extracted_text = "[Empty or non-text Word document.]"
        except Exception as e:
            logger.error(f"Error parsing DOCX {filename}: {e}")
            raise HTTPException(status_code=400, detail=f"Failed to parse Word document: {str(e)}")

    else:
        # Text, Markdown, JSON, CSV, Log
        try:
            extracted_text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            try:
                extracted_text = file_bytes.decode("latin-1")
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to decode text document: {str(e)}")
        page_count = max(1, len(extracted_text.split()) // 300)

    word_count = len(extracted_text.split())
    char_count = len(extracted_text)
    size_kb = round(len(file_bytes) / 1024, 1)

    return {
        "filename": filename,
        "size": f"{size_kb} KB" if size_kb < 1024 else f"{round(size_kb / 1024, 2)} MB",
        "size_bytes": len(file_bytes),
        "pages": max(1, page_count),
        "word_count": word_count,
        "character_count": char_count,
        "extracted_text": extracted_text,
        "preview": (extracted_text[:280] + "...") if len(extracted_text) > 280 else extracted_text,
    }


@router.post("/extract", summary="Extract text from uploaded document (PDF, DOCX, TXT, MD, etc.)")
async def extract_document_content(
    file: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    Extracts text from uploaded documents of different formats (PDF, DOCX, TXT, MD, JSON, CSV).
    Returns character count, page count, word count, and extracted clean text.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file missing filename.")

    try:
        content_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    if not content_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

    return extract_text_from_bytes(file.filename, content_bytes)


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
    words = text.split()
    chunks = []
    current_words = []
    current_len = 0

    for word in words:
        current_words.append(word)
        current_len += len(word) + 1
        if current_len >= chunk_size:
            chunks.append(" ".join(current_words))
            overlap_words = max(1, int(overlap / 6))
            current_words = current_words[-overlap_words:]
            current_len = sum(len(w) + 1 for w in current_words)

    if current_words:
        chunks.append(" ".join(current_words))

    return chunks if chunks else [text]


def check_obfuscation(chunk: str) -> List[str]:
    """Check for Base64 payloads, hex sequences, zero-width characters, and leetspeak."""
    findings = []

    # Zero-width spaces / invisible characters
    if re.search(r"[\u200B-\u200D\uFEFF]", chunk):
        findings.append("Zero-Width Invisible Characters (Steganography / Evasion)")

    # Base64 strings (>= 20 chars ending with or without =)
    b64_matches = re.findall(r"\b[A-Za-z0-9+/]{20,}={0,2}\b", chunk)
    for b64 in b64_matches:
        try:
            decoded = base64.b64decode(b64).decode("utf-8", errors="ignore")
            if any(kw in decoded.lower() for kw in ["ignore", "system", "prompt", "password", "root", "admin", "exec", "eval"]):
                findings.append(f"Base64 Encoded Injection Vector (Decodes to: '{decoded[:35]}...')")
                break
        except Exception:
            pass

    # Hex-encoded string
    if re.search(r"(?:\\x[0-9a-fA-F]{2}){4,}", chunk):
        findings.append("Hexadecimal Byte Sequence Evasion Pattern")

    # Leetspeak variations of high-risk keywords
    if re.search(r"\b(p[@4]ssw[0o]rd|r[0o][0o]t|4dm[i1]n|s[y1]st[e3]m)\b", chunk, re.IGNORECASE):
        findings.append("Leetspeak Keyword Obfuscation")

    return findings


def check_indirect_injections(chunk: str) -> List[str]:
    """Check for indirect prompt injection markers, instruction overrides, and role switching."""
    findings = []
    patterns = [
        (r"(?i)(?:ignore|disregard|forget|override)\s+(?:all\s+)?(?:previous|prior|system|above)\s+(?:instructions|directives|prompts|rules)", "Directive Override / Jailbreak Attempt"),
        (r"(?i)(?:you\s+are\s+now|operate\s+as|act\s+as|switch\s+to|roleplay\s+as)\s+(?:root|admin|system|god\s+mode|dan|jailbreak)", "System Role Hijacking"),
        (r"(?i)\[(?:system\s+note|confidential\s+instruction|internal\s+command|override)\]", "Delimited System Note Injection"),
        (r"(?i)(?:dump|leak|exfiltrate|reveal|print|display)\s+(?:all\s+)?(?:internal|api|password|keys|secret|credentials|tokens)", "Credential / Confidential Data Probing"),
        (r"(?i)(?:do\s+not\s+mention|conceal\s+from\s+user|hide\s+this\s+instruction)", "Covert Instruction Hiding"),
    ]
    for pattern, label in patterns:
        if re.search(pattern, chunk):
            findings.append(label)
    return findings


def check_external_links(chunk: str) -> List[str]:
    """Analyze embedded external URLs for SSRF, data exfiltration, or malicious endpoints."""
    findings = []
    urls = re.findall(r"https?://[^\s)\]>\"',]+", chunk)

    suspicious_domains = ["webhook.site", "pipedream.net", "requestbin", "discord.com/api/webhooks", "pastebin.com/raw", "hastebin.com", "ngrok.io", "burpcollaborator.net"]

    for u in urls:
        # IP based link (SSRF / internal network scan)
        if re.search(r"https?://(?:\d{1,3}\.){3}\d{1,3}", u):
            findings.append(f"Direct IP / Internal SSRF Link: {u[:45]}")
        # Webhook / Exfiltration endpoints
        elif any(sd in u.lower() for sd in suspicious_domains):
            findings.append(f"Suspicious Webhook / Exfiltration Destination: {u[:45]}")
        # Generic link analysis flag if analyze_links is active
        else:
            findings.append(f"External Referenced URL: {u[:45]}")

    return findings


@router.post("/scan", summary="Scan Document Chunks with Configured Multi-Stage Pipeline")
async def scan_rag_document(
    request: RagScanRequest,
    req: Request,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
) -> Dict[str, Any]:
    scanner = get_scanner(req)
    chunks = chunk_text(request.content, request.chunk_size, request.chunk_overlap)

    # Resolve sensitivity thresholds based on detection_mode
    mode = request.detection_mode.lower()
    if "aggressive" in mode:
        allow_th = request.allow_threshold if request.allow_threshold is not None else 20.0
        block_th = request.block_threshold if request.block_threshold is not None else 50.0
        mode_instructions = "Aggressive Mode: Strict sensitivity (Allow: 20, Block: 50). Full adversarial heuristics & strict unmasking."
    elif "enterprise" in mode or "compliance" in mode:
        allow_th = request.allow_threshold if request.allow_threshold is not None else 30.0
        block_th = request.block_threshold if request.block_threshold is not None else 60.0
        mode_instructions = "Enterprise Compliance: Strict DLP & policy enforcement (Allow: 30, Block: 60). Scans for exfiltration, PII leakage, and role overrides."
    else:
        allow_th = request.allow_threshold if request.allow_threshold is not None else 40.0
        block_th = request.block_threshold if request.block_threshold is not None else 70.0
        mode_instructions = "Standard Mode: Balanced neural & rule scanning (Allow: 40, Block: 70). Optimized for low false-positive rate."

    suspicious_chunks = []
    safe_count = 0
    total_risk = 0.0
    detected_issues_set = set()

    user_id = current_user.get("sub") if current_user else None

    for idx, chunk in enumerate(chunks):
        res = scanner.scan(
            prompt=chunk,
            allow_threshold=allow_th,
            block_threshold=block_th
        )
        base_score = float(res.get("risk_score", 0.0))
        detected_vectors = []

        # 1. Indirect Injection Heuristics
        if request.detect_indirect:
            indirect_findings = check_indirect_injections(chunk)
            if indirect_findings:
                detected_vectors.extend(indirect_findings)
                base_score = max(base_score, 75.0)
                for f in indirect_findings:
                    detected_issues_set.add(f)

        # 2. Obfuscation Detection
        if request.detect_obfuscated:
            obf_findings = check_obfuscation(chunk)
            if obf_findings:
                detected_vectors.extend(obf_findings)
                base_score = max(base_score, 80.0)
                for f in obf_findings:
                    detected_issues_set.add(f)

        # 3. External Links Analysis
        if request.analyze_links:
            link_findings = check_external_links(chunk)
            if link_findings:
                detected_vectors.extend(link_findings)
                base_score = max(base_score, 65.0)
                for f in link_findings:
                    detected_issues_set.add(f)

        total_risk += base_score

        # Determine action
        if base_score >= block_th:
            action = "BLOCK"
        elif base_score >= allow_th:
            action = "WARN"
        else:
            action = "ALLOW"

        is_malicious = action in ("BLOCK", "WARN")
        if is_malicious:
            # Determine category
            category = "Indirect Injection"
            if any("Role" in v or "Jailbreak" in v for v in detected_vectors):
                category = "Role Hijacking"
            elif any("Base64" in v or "Hex" in v or "Leetspeak" in v for v in detected_vectors):
                category = "Obfuscated Vector"
            elif any("SSRF" in v or "Webhook" in v for v in detected_vectors):
                category = "Data Exfiltration Link"
            elif res.get("attack_categories"):
                category = res["attack_categories"][0]

            preview_text = (chunk[:85] + "...") if len(chunk) > 85 else chunk

            suspicious_chunks.append({
                "id": idx + 1,
                "chunkNumber": idx + 1,
                "preview": preview_text,
                "page": max(1, (idx // 3) + 1),
                "category": category,
                "categoryColor": "bg-rose-500/15 text-rose-400 border-rose-500/30" if base_score >= 70 else "bg-amber-500/15 text-amber-400 border-amber-500/30",
                "riskScore": round(base_score, 1),
                "fullText": chunk,
                "matchedRules": res.get("matched_rules", []),
                "detectedVectors": detected_vectors,
                "recommendation": "Redact chunk or exclude from RAG vector store" if base_score >= 70 else "Review chunk context before LLM ingestion",
                "action": action
            })

            # Log to DB audit log
            await db_manager.log_scan({
                **res,
                "risk_score": base_score,
                "action": action,
                "prompt": f"[{request.document_name} Chunk #{idx+1}] {chunk[:200]}"
            }, user_id=user_id)
        else:
            safe_count += 1

    total_chunks = len(chunks)
    avg_risk = round(total_risk / total_chunks, 1) if total_chunks > 0 else 0.0
    susp_count = len(suspicious_chunks)

    # Format detected issues list
    issues_summary = []
    for issue in sorted(detected_issues_set):
        count = sum(1 for c in suspicious_chunks if issue in c.get("detectedVectors", []))
        issues_summary.append({
            "title": issue,
            "count": count or 1,
            "severity": "HIGH" if "Override" in issue or "Base64" in issue or "SSRF" in issue else "MEDIUM"
        })

    return {
        "document": {
            "name": request.document_name,
            "size": f"{len(request.content.encode('utf-8')) / 1024:.1f} KB",
            "pages": max(1, (total_chunks // 3) + 1),
            "characters": len(request.content),
            "words": len(request.content.split()),
            "chunksCount": total_chunks,
        },
        "config": {
            "detectionMode": request.detection_mode,
            "chunkSize": request.chunk_size,
            "chunkOverlap": request.chunk_overlap,
            "detectIndirect": request.detect_indirect,
            "detectObfuscated": request.detect_obfuscated,
            "analyzeLinks": request.analyze_links,
            "allowThreshold": allow_th,
            "blockThreshold": block_th,
            "modeInstructions": mode_instructions,
        },
        "results": {
            "timestamp": datetime.now().strftime("%b %d, %Y, %I:%M %p"),
            "totalChunks": total_chunks,
            "safeChunks": safe_count,
            "safePercentage": f"{round((safe_count / total_chunks) * 100, 1)}%" if total_chunks else "0%",
            "suspiciousChunks": susp_count,
            "suspiciousPercentage": f"{round((susp_count / total_chunks) * 100, 1)}%" if total_chunks else "0%",
            "documentRisk": avg_risk,
            "riskBadge": "High Risk" if avg_risk >= 70 else ("Medium Risk" if avg_risk >= 40 else "Low Risk"),
            "detectedIssues": issues_summary,
            "riskBreakdown": [
                {
                    "label": "High Risk (>70)",
                    "count": sum(1 for c in suspicious_chunks if c["riskScore"] >= 70),
                    "color": "#EF4444"
                },
                {
                    "label": "Medium Risk (40-69)",
                    "count": sum(1 for c in suspicious_chunks if 40 <= c["riskScore"] < 70),
                    "color": "#F59E0B"
                },
                {
                    "label": "Low Risk (<40)",
                    "count": safe_count,
                    "color": "#10B981"
                },
            ]
        },
        "suspiciousChunks": suspicious_chunks
    }


@router.post("/sanitize", summary="Sanitize Document by Redacting Suspicious Injection Vectors")
async def sanitize_rag_document(
    request: RagSanitizeRequest,
    req: Request
) -> Dict[str, Any]:
    scanner = get_scanner(req)
    chunks = chunk_text(request.content, request.chunk_size, request.chunk_overlap)

    sanitized_chunks = []
    redacted_count = 0

    for chunk in chunks:
        res = scanner.scan(prompt=chunk)
        if res["action"] in ("BLOCK", "WARN"):
            sanitized_chunks.append(f"{request.redaction_token} (Risk Score: {res['risk_score']})")
            redacted_count += 1
        else:
            sanitized_chunks.append(chunk)

    sanitized_content = "\n\n".join(sanitized_chunks)

    return {
        "document_name": request.document_name,
        "original_length": len(request.content),
        "sanitized_length": len(sanitized_content),
        "redacted_chunks_count": redacted_count,
        "sanitized_content": sanitized_content
    }
