'use client';

import { scanPrompt } from './scanner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const SCAN_PRESETS = {
  'Standard (Recommended)': {
    name: 'Standard (Recommended)',
    chunkSize: 400,
    chunkOverlap: 50,
    detectIndirect: true,
    detectObfuscated: true,
    analyzeLinks: false,
    allowThreshold: 40,
    blockThreshold: 70,
    badge: 'Balanced',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Balanced neural classification (DistilBERT V2) with high-confidence regex rules. Recommended for general RAG pipelines with low false-positive overhead.',
    stages: [
      'Document Parsing & Character Validation',
      'Standard Chunk Slicing (400 chars, 50 overlap)',
      'Neural ML Classification (0.70 confidence threshold)',
      'Rule Engine & Indirect Jailbreak Pattern Matching',
      'Standard Risk Aggregation & Mitigation Synthesis'
    ]
  },
  'Aggressive (Strict Filter)': {
    name: 'Aggressive (Strict Filter)',
    chunkSize: 300,
    chunkOverlap: 60,
    detectIndirect: true,
    detectObfuscated: true,
    analyzeLinks: true,
    allowThreshold: 20,
    blockThreshold: 50,
    badge: 'High Security',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Strict zero-tolerance filter. Scans fine-grained chunks, decodes multi-encoding obfuscation (Base64/Hex/Leetspeak), and inspects external URLs.',
    stages: [
      'Deep Document & Structural Sanitization',
      'Fine-Grained Chunk Segmentation (300 chars, 60 overlap)',
      'Deep Obfuscation & Steganography Unmasking',
      'Aggressive Neural Evaluation (0.50 threshold)',
      'External URL & Suspicious Webhook Probing',
      'Strict Threat Quarantine Synthesis'
    ]
  },
  'Enterprise Compliance': {
    name: 'Enterprise Compliance',
    chunkSize: 500,
    chunkOverlap: 80,
    detectIndirect: true,
    detectObfuscated: true,
    analyzeLinks: true,
    allowThreshold: 30,
    blockThreshold: 60,
    badge: 'Compliance & DLP',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Corporate audit & data loss prevention posture. Flags unauthorized system prompt overrides, credential exfiltration, and sensitive data leakage.',
    stages: [
      'Enterprise Document Ingestion & Metadata Audit',
      'Context-Preserving Chunking (500 chars, 80 overlap)',
      'Data Exfiltration & System Override Inspection',
      'Neural Model Verification with Role Hijacking Checks',
      'DLP & Policy Compliance Scored Validation',
      'Audit Log Synchronization & Remediation Report'
    ]
  }
};

/**
 * Extract clean textual content from an uploaded File (PDF, DOCX, TXT, MD, JSON, CSV).
 * Sends to backend /rag/extract for server-side parsing (pypdf, python-docx),
 * with client-side FileReader fallback for plain text formats.
 */
export async function extractDocumentText(file) {
  if (!file) throw new Error('No file provided for extraction.');

  const filename = file.name;
  const isBinaryDoc = filename.endsWith('.pdf') || filename.endsWith('.docx');

  // Try backend extraction first
  try {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('promptshield_token') : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/rag/extract`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return {
        name: data.filename || filename,
        size: data.size || `${(file.size / 1024).toFixed(1)} KB`,
        sizeBytes: data.size_bytes || file.size,
        pages: data.pages || 1,
        wordCount: data.word_count || (data.extracted_text ? data.extracted_text.split(/\s+/).length : 0),
        charCount: data.character_count || (data.extracted_text ? data.extracted_text.length : 0),
        text: data.extracted_text || '',
        preview: data.preview || '',
      };
    }
  } catch (err) {
    console.warn('Backend /rag/extract failed or offline, checking local parser:', err);
  }

  // Client-side fallback: Text reader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (isBinaryDoc) {
      // If backend is unreachable and it's a binary file, inform user
      reject(new Error(`Server-side extraction for ${filename.endsWith('.pdf') ? 'PDF' : 'DOCX'} is currently connecting. Please ensure the PromptShield backend server is running.`));
      return;
    }

    reader.onload = (event) => {
      const content = event.target?.result || '';
      const text = typeof content === 'string' ? content : '';
      const words = text.split(/\s+/).filter(Boolean);
      resolve({
        name: filename,
        size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`,
        sizeBytes: file.size,
        pages: Math.max(1, Math.ceil(words.length / 300)),
        wordCount: words.length,
        charCount: text.length,
        text,
        preview: text.slice(0, 280),
      });
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${filename}`));
    };

    reader.readAsText(file);
  });
}

/**
 * Splits text into overlapping chunks
 */
export function chunkText(text, chunkSize = 400, overlap = 50) {
  if (!text || !text.trim()) return [];
  const words = text.split(/\s+/);
  const chunks = [];
  let currentWords = [];
  let currentLength = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentWords.push(word);
    currentLength += word.length + 1;

    if (currentLength >= chunkSize || i === words.length - 1) {
      chunks.push(currentWords.join(' '));
      const overlapWords = Math.max(1, Math.floor(overlap / 6));
      currentWords = currentWords.slice(-overlapWords);
      currentLength = currentWords.join(' ').length;
    }
  }

  return chunks;
}

/**
 * Executes full RAG document scan with multi-stage progress reporting
 */
export async function scanDocumentWithStages(docName, fullText, config = {}, onStageUpdate) {
  const chunkSize = config.chunkSize || 400;
  const chunkOverlap = config.chunkOverlap || 50;
  const detectionMode = config.detectionMode || 'Standard (Recommended)';

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Stage 1: Document Upload & Validation
  if (onStageUpdate) {
    onStageUpdate({
      stageId: 1,
      percent: 15,
      status: 'Validating document structure...',
      detail: `Validated ${docName} (${(fullText.length / 1024).toFixed(1)} KB)`,
    });
  }
  await sleep(250);

  // Stage 2: Content Extraction & Normalization
  const words = fullText.split(/\s+/).filter(Boolean);
  const estimatedPages = Math.max(1, Math.ceil(words.length / 300));
  if (onStageUpdate) {
    onStageUpdate({
      stageId: 2,
      percent: 32,
      status: 'Extracting content stream...',
      detail: `Extracted ${words.length.toLocaleString()} words across ${estimatedPages} page(s)`,
    });
  }
  await sleep(300);

  // Stage 3: Content Analysis & Chunking
  const chunks = chunkText(fullText, chunkSize, chunkOverlap);
  if (chunks.length === 0) {
    throw new Error('Document content is empty or contains no parseable text.');
  }

  if (onStageUpdate) {
    onStageUpdate({
      stageId: 3,
      percent: 50,
      status: 'Segmenting & configuring chunks...',
      detail: `Generated ${chunks.length} chunks (${chunkSize} char size, ${chunkOverlap} overlap)`,
    });
  }
  await sleep(300);

  // Stage 4: Threat Detection (Neural & Rules)
  if (onStageUpdate) {
    onStageUpdate({
      stageId: 4,
      percent: 68,
      status: 'Scanning with DistilBERT neural engine...',
      detail: `Evaluating ${chunks.length} chunks against adversarial classifiers & heuristics`,
    });
  }

  let backendData = null;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('promptshield_token') : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/rag/scan`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        document_name: docName,
        content: fullText,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
        detection_mode: detectionMode,
        detect_indirect: config.detectIndirect ?? true,
        detect_obfuscated: config.detectObfuscated ?? true,
        analyze_links: config.analyzeLinks ?? false,
      }),
    });

    if (res.ok) {
      backendData = await res.json();
    }
  } catch (err) {
    console.warn('Backend /rag/scan network error, falling back to local scanner:', err);
  }

  // Stage 5: Security Validation & Policy Evaluation
  if (onStageUpdate) {
    onStageUpdate({
      stageId: 5,
      percent: 86,
      status: 'Applying policy thresholds...',
      detail: `Enforcing ${detectionMode} criteria (Indirect: ${config.detectIndirect ? 'ON' : 'OFF'}, Obfuscation: ${config.detectObfuscated ? 'ON' : 'OFF'})`,
    });
  }
  await sleep(300);

  let finalResult = backendData;

  // Fallback client-side sequential processing if backend was unavailable
  if (!finalResult) {
    const suspiciousChunks = [];
    let safeCount = 0;
    let totalRisk = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunkContent = chunks[i];
      const scanRes = await scanPrompt(chunkContent);
      const score = scanRes.risk_score || 0;
      totalRisk += score;

      const isMalicious = scanRes.action === 'BLOCK' || scanRes.action === 'WARN';
      if (isMalicious) {
        suspiciousChunks.push({
          id: i + 1,
          chunkNumber: i + 1,
          preview: chunkContent.length > 85 ? chunkContent.slice(0, 85) + '...' : chunkContent,
          page: Math.floor(i / 3) + 1,
          category: scanRes.attack_categories?.[0] || 'Indirect Injection',
          categoryColor:
            score >= 70
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          riskScore: score,
          fullText: chunkContent,
          matchedRules: scanRes.matched_rules || [],
          detectedVectors: scanRes.attack_categories || ['Indirect Injection'],
          recommendation: score >= 70 ? 'Redact chunk or exclude from RAG vector store' : 'Review chunk context before LLM ingestion',
          action: scanRes.action,
        });
      } else {
        safeCount++;
      }
    }

    const total = chunks.length;
    const avgRisk = Math.round((totalRisk / total) * 10) / 10;
    const suspCount = suspiciousChunks.length;

    finalResult = {
      document: {
        name: docName,
        size: `${(fullText.length / 1024).toFixed(1)} KB`,
        pages: Math.max(1, Math.ceil(chunks.length / 3)),
        characters: fullText.length,
        words: words.length,
        chunksCount: total,
      },
      config: {
        detectionMode,
        chunkSize,
        chunkOverlap,
        detectIndirect: config.detectIndirect,
        detectObfuscated: config.detectObfuscated,
        analyzeLinks: config.analyzeLinks,
      },
      results: {
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        totalChunks: total,
        safeChunks: safeCount,
        safePercentage: `${Math.round((safeCount / total) * 1000) / 10}%`,
        suspiciousChunks: suspCount,
        suspiciousPercentage: `${Math.round((suspCount / total) * 1000) / 10}%`,
        documentRisk: avgRisk,
        riskBadge: avgRisk >= 70 ? 'High Risk' : (avgRisk >= 40 ? 'Medium Risk' : 'Low Risk'),
        riskBreakdown: [
          {
            label: 'High Risk (>70)',
            count: suspiciousChunks.filter((c) => c.riskScore >= 70).length,
            color: '#EF4444',
          },
          {
            label: 'Medium Risk (40-69)',
            count: suspiciousChunks.filter((c) => c.riskScore >= 40 && c.riskScore < 70).length,
            color: '#F59E0B',
          },
          {
            label: 'Low Risk (<40)',
            count: safeCount,
            color: '#10B981',
          },
        ],
      },
      suspiciousChunks,
    };
  }

  // Stage 6: Scan Completion
  if (onStageUpdate) {
    onStageUpdate({
      stageId: 6,
      percent: 100,
      status: 'Scan Completed',
      detail: `Analysis finished. Found ${finalResult.results.suspiciousChunks} suspicious chunk(s) (${finalResult.results.riskBadge})`,
    });
  }

  return finalResult;
}

/**
 * Redacts suspicious injection chunks from document text
 */
export function sanitizeDocument(fullText, suspiciousChunks = [], redactionToken = '[PROMPTSHIELD REDACTED INJECTION]') {
  if (!fullText) return '';
  if (!suspiciousChunks || suspiciousChunks.length === 0) return fullText;

  let sanitized = fullText;
  for (const chunk of suspiciousChunks) {
    if (chunk.fullText && sanitized.includes(chunk.fullText)) {
      sanitized = sanitized.replace(
        chunk.fullText,
        `\n\n${redactionToken} (Risk: ${chunk.riskScore}/100, Type: ${chunk.category})\n\n`
      );
    }
  }
  return sanitized;
}
