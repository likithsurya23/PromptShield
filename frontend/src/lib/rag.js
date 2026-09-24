'use client';

import { scanPrompt } from './scanner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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

export async function scanDocumentChunks(docName, fullText, config = {}) {
  const chunkSize = config.chunkSize || 400;
  const chunkOverlap = config.chunkOverlap || 50;

  // Attempt backend /rag/scan first
  try {
    const res = await fetch(`${API_BASE}/rag/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_name: docName,
        content: fullText,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend /rag/scan error, falling back to client-side pipeline:', err);
  }

  // Fallback: Client-side sequential scanning through /scan API
  const chunks = chunkText(fullText, chunkSize, chunkOverlap);
  if (chunks.length === 0) {
    throw new Error('Document content is empty.');
  }

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
        preview: chunkContent.length > 80 ? chunkContent.slice(0, 80) + '...' : chunkContent,
        page: Math.floor(i / 3) + 1,
        category: scanRes.attack_categories?.[0] || 'Direct Injection',
        categoryColor:
          score >= 70
            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            : 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        riskScore: score,
        fullText: chunkContent,
        matchedRules: scanRes.matched_rules || [],
        action: scanRes.action,
      });
    } else {
      safeCount++;
    }
  }

  const total = chunks.length;
  const avgRisk = Math.round((totalRisk / total) * 10) / 10;
  const suspCount = suspiciousChunks.length;

  return {
    document: {
      name: docName,
      size: `${(fullText.length / 1024).toFixed(1)} KB`,
      pages: Math.max(1, Math.ceil(chunks.length / 3)),
      characters: fullText.length,
      chunksCount: total,
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

export function sanitizeDocument(fullText, suspiciousChunks = [], redactionToken = '[PROMPTSHIELD REDACTED INJECTION]') {
  if (!fullText) return '';
  if (!suspiciousChunks || suspiciousChunks.length === 0) return fullText;

  let sanitized = fullText;
  for (const chunk of suspiciousChunks) {
    if (chunk.fullText && sanitized.includes(chunk.fullText)) {
      sanitized = sanitized.replace(
        chunk.fullText,
        `\n\n${redactionToken} (Risk Score: ${chunk.riskScore}, Vector: ${chunk.category})\n\n`
      );
    }
  }
  return sanitized;
}
