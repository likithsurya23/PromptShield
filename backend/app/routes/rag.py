import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field

from app.db.database import db_manager
from app.security.auth import get_optional_user
from app.security.scanner import PromptScanner

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/rag", tags=["RAG Document Security"])


class RagScanRequest(BaseModel):
    document_name: str = Field(..., description="Filename or title of document")
    content: str = Field(..., min_length=1, description="Raw text content of the document")
    chunk_size: int = Field(400, ge=100, le=2000, description="Target chunk size in characters")
    chunk_overlap: int = Field(50, ge=0, le=500, description="Overlap in characters between adjacent chunks")
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


@router.post("/scan", summary="Scan Document Chunks for Prompt Injections")
async def scan_rag_document(
    request: RagScanRequest,
    req: Request,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
) -> Dict[str, Any]:
    scanner = get_scanner(req)
    chunks = chunk_text(request.content, request.chunk_size, request.chunk_overlap)

    suspicious_chunks = []
    safe_count = 0
    total_risk = 0.0

    user_id = current_user.get("sub") if current_user else None

    for idx, chunk in enumerate(chunks):
        res = scanner.scan(
            prompt=chunk,
            allow_threshold=request.allow_threshold,
            block_threshold=request.block_threshold
        )
        score = res["risk_score"]
        total_risk += score

        is_malicious = res["action"] in ("BLOCK", "WARN")
        if is_malicious:
            suspicious_chunks.append({
                "id": idx + 1,
                "chunkNumber": idx + 1,
                "preview": (chunk[:80] + "...") if len(chunk) > 80 else chunk,
                "page": max(1, (idx // 3) + 1),
                "category": res["attack_categories"][0] if res["attack_categories"] else "Direct Injection",
                "categoryColor": "bg-rose-500/15 text-rose-400 border-rose-500/30" if score >= 70 else "bg-amber-500/15 text-amber-400 border-amber-500/30",
                "riskScore": score,
                "fullText": chunk,
                "matchedRules": res.get("matched_rules", []),
                "action": res["action"]
            })
            # Log malicious chunk to audit log
            await db_manager.log_scan({
                **res,
                "prompt": f"[{request.document_name} Chunk #{idx+1}] {chunk[:200]}"
            }, user_id=user_id)
        else:
            safe_count += 1

    total_chunks = len(chunks)
    avg_risk = round(total_risk / total_chunks, 1) if total_chunks > 0 else 0.0
    susp_count = len(suspicious_chunks)

    return {
        "document": {
            "name": request.document_name,
            "size": f"{len(request.content.encode('utf-8')) / 1024:.1f} KB",
            "pages": max(1, (total_chunks // 3) + 1),
            "characters": len(request.content),
            "chunksCount": total_chunks,
        },
        "results": {
            "totalChunks": total_chunks,
            "safeChunks": safe_count,
            "safePercentage": f"{round((safe_count / total_chunks) * 100, 1)}%" if total_chunks else "0%",
            "suspiciousChunks": susp_count,
            "suspiciousPercentage": f"{round((susp_count / total_chunks) * 100, 1)}%" if total_chunks else "0%",
            "documentRisk": avg_risk,
            "riskBadge": "High Risk" if avg_risk >= 70 else ("Medium Risk" if avg_risk >= 40 else "Low Risk"),
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
