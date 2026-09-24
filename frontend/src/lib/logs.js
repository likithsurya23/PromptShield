'use client';

export const FILTER_OPTIONS = {
  dateRanges: ['Past 24 Hours', 'Past 7 Days', 'Past 30 Days', 'Custom Range'],
  statuses: ['All', 'Blocked', 'Warned', 'Allowed'],
  categories: [
    'All',
    'Direct Injection',
    'Indirect Injection',
    'Jailbreak',
    'Obfuscation / Encoding',
    'Context Manipulation',
    'System Prompt Extraction',
    'Instruction Override',
    'Benign',
  ],
  sources: ['All', 'Scanner', 'Playground', 'RAG', 'Simulator'],
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchLiveLogs() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(`${API_BASE}/scans?limit=100`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    const scans = await res.json();
    if (!Array.isArray(scans) || scans.length === 0) {
      return [];
    }

    return scans.map((item, idx) => ({
      id: item.id || `log-${idx}`,
      time: item.created_at
        ? new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Just now',
      prompt: item.prompt || 'Scan query prompt',
      truncatedPrompt:
        item.prompt && item.prompt.length > 32
          ? item.prompt.slice(0, 32) + '...'
          : item.prompt || 'Scan query',
      type: item.prompt?.includes('.pdf') ? 'Document' : 'Prompt',
      category:
        item.attack_categories?.[0] ||
        (item.prediction === 'malicious' ? 'Direct Injection' : 'Benign'),
      riskScore: Math.round((item.risk_score || 0) * 10) / 10,
      result:
        item.action === 'BLOCK'
          ? 'Blocked'
          : item.action === 'WARN'
          ? 'Warned'
          : 'Allowed',
      source: 'Scanner',
      modelConfidence: item.ml_confidence
        ? `${Math.round(item.ml_confidence * 1000) / 10}%`
        : '100%',
      matchedRules: item.matched_rules || [],
      suggestedAction:
        item.action === 'BLOCK'
          ? 'Block this prompt and do not send it to the LLM.'
          : item.action === 'WARN'
          ? 'Review suspicious context manipulation before execution.'
          : 'Allow standard model processing.',
    }));
  } catch {
    return [];
  }
}

export async function fetchLiveMetrics() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${API_BASE}/analytics/summary`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        totalScans: '0',
        totalScansChange: 'No operations yet',
        allowed: '0',
        allowedPercentage: '0%',
        warned: '0',
        warnedPercentage: '0%',
        blocked: '0',
        blockedPercentage: '0%',
      };
    }

    const s = await res.json();
    const total = s.total_scans || 0;

    if (total === 0) {
      return {
        totalScans: '0',
        totalScansChange: 'No operations yet',
        allowed: '0',
        allowedPercentage: '0%',
        warned: '0',
        warnedPercentage: '0%',
        blocked: '0',
        blockedPercentage: '0%',
      };
    }

    return {
      totalScans: total.toLocaleString(),
      totalScansChange: `${total} verified events`,
      allowed: (s.allowed || 0).toLocaleString(),
      allowedPercentage: `${Math.round(((s.allowed || 0) / total) * 1000) / 10}%`,
      warned: (s.warned || 0).toLocaleString(),
      warnedPercentage: `${Math.round(((s.warned || 0) / total) * 1000) / 10}%`,
      blocked: (s.blocked || 0).toLocaleString(),
      blockedPercentage: `${Math.round(((s.blocked || 0) / total) * 1000) / 10}%`,
    };
  } catch {
    return {
      totalScans: '0',
      totalScansChange: 'Telemetry offline',
      allowed: '0',
      allowedPercentage: '0%',
      warned: '0',
      warnedPercentage: '0%',
      blocked: '0',
      blockedPercentage: '0%',
    };
  }
}
