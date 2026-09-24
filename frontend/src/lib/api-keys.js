'use client';

const STORAGE_KEY = 'promptshield_user_api_keys';

export const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', defaultModel: 'gpt-4o', placeholder: 'sk-proj-...' },
  { id: 'anthropic', name: 'Anthropic', defaultModel: 'claude-3-5-sonnet', placeholder: 'sk-ant-api03-...' },
  { id: 'gemini', name: 'Google Gemini', defaultModel: 'gemini-1.5-pro', placeholder: 'AIzaSy...' },
  { id: 'huggingface', name: 'Hugging Face', defaultModel: 'meta-llama/Llama-3', placeholder: 'hf_...' },
  { id: 'custom', name: 'Custom LLM', defaultModel: 'vLLM / Ollama', placeholder: 'custom-secret-key' },
  { id: 'cohere', name: 'Cohere', defaultModel: 'command-r-plus', placeholder: 'co-...' },
];

export function getStoredApiKeys() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveNewApiKey({ name, provider, environment = 'Production', purpose = '' }) {
  if (typeof window === 'undefined') return null;

  const current = getStoredApiKeys();
  const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const rawKey = `ps_live_${randomHex}`;
  const maskedKey = `ps_live_••••••••••••${randomHex.slice(-4)}`;

  const newKey = {
    id: `key-${Date.now().toString(36)}`,
    name: name || 'API Key',
    provider: provider || 'OpenAI',
    providerId: (provider || 'openai').toLowerCase(),
    maskedKey,
    environment,
    environmentColor:
      environment === 'Production'
        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    lastUsed: 'Never',
    status: 'Active',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    purpose: purpose || 'Application integration',
  };

  const updated = [newKey, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { newKey, secret: rawKey };
}

export function deleteStoredApiKey(id) {
  if (typeof window === 'undefined') return [];
  const current = getStoredApiKeys();
  const updated = current.filter((k) => k.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function computeApiKeyMetrics(keys = []) {
  const total = keys.length;
  const active = keys.filter((k) => k.status === 'Active').length;
  const expired = keys.filter((k) => k.status === 'Expired').length;
  const revoked = keys.filter((k) => k.status === 'Revoked').length;

  return {
    totalKeys: total.toString(),
    totalKeysChange: total > 0 ? `${total} active keys` : 'No keys generated',
    activeKeys: active.toString(),
    activeKeysPercentage: total > 0 ? `${Math.round((active / total) * 100)}%` : '0%',
    expiredKeys: expired.toString(),
    expiredKeysPercentage: total > 0 ? `${Math.round((expired / total) * 100)}%` : '0%',
    revokedKeys: revoked.toString(),
    revokedKeysPercentage: '0%',
  };
}

export const SECURITY_TIPS = [
  'Never commit raw API keys to version control. Always use environment variables.',
  'Grant only the minimum permissions required for each integration key.',
  'Rotate API keys every 90 days to minimize risk of credential exposure.',
  'Monitor API key usage and revoke unused keys promptly.',
];
