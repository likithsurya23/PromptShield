'use client';

// Top 4 Metric Cards matching wireframe
export const API_KEYS_METRICS = {
  totalKeys: '6',
  totalKeysChange: '↑ 2 added this month',
  activeKeys: '5',
  activeKeysPercentage: '83.3%',
  expiredKeys: '1',
  expiredKeysPercentage: '16.7%',
  revokedKeys: '0',
  revokedKeysPercentage: '0%',
};

// Providers metadata
export const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', defaultModel: 'gpt-4o', placeholder: 'sk-proj-...' },
  { id: 'anthropic', name: 'Anthropic', defaultModel: 'claude-3-5-sonnet', placeholder: 'sk-ant-api03-...' },
  { id: 'gemini', name: 'Google Gemini', defaultModel: 'gemini-1.5-pro', placeholder: 'AIzaSy...' },
  { id: 'huggingface', name: 'Hugging Face', defaultModel: 'meta-llama/Llama-3', placeholder: 'hf_...' },
  { id: 'custom', name: 'Custom LLM', defaultModel: 'vLLM / Ollama', placeholder: 'custom-secret-key' },
  { id: 'cohere', name: 'Cohere', defaultModel: 'command-r-plus', placeholder: 'co-...' },
];

// Initial API Keys Table Data (6 items matching wireframe)
export const INITIAL_API_KEYS = [
  {
    id: 'key-1',
    name: 'OpenAI - Main',
    provider: 'OpenAI',
    providerId: 'openai',
    key: 'sk-proj-99482710492817293847120394857201',
    maskedKey: 'sk-................................',
    environment: 'Production',
    environmentColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    createdOn: 'Sep 10, 2026',
    lastUsed: 'Sep 21, 2026',
    status: 'Active',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    purpose: 'Production customer chatbot & prompt firewall',
  },
  {
    id: 'key-2',
    name: 'Anthropic Claude',
    provider: 'Anthropic',
    providerId: 'anthropic',
    key: 'sk-ant-api03-29481029384719283746192837461298',
    maskedKey: 'sk-................................',
    environment: 'Development',
    environmentColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    createdOn: 'Sep 05, 2026',
    lastUsed: 'Sep 20, 2026',
    status: 'Active',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    purpose: 'Internal R&D experimentation and evaluations',
  },
  {
    id: 'key-3',
    name: 'Gemini API',
    provider: 'Google Gemini',
    providerId: 'gemini',
    key: 'AIzaSyA82947192837461928374619283746192',
    maskedKey: 'AIza...............................',
    environment: 'Production',
    environmentColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    createdOn: 'Aug 28, 2026',
    lastUsed: 'Sep 21, 2026',
    status: 'Active',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    purpose: 'Multimodal security checks and document processing',
  },
  {
    id: 'key-4',
    name: 'Hugging Face',
    provider: 'Hugging Face',
    providerId: 'huggingface',
    key: 'hf_9283746192837461928374619283746192',
    maskedKey: 'hf_................................',
    environment: 'Development',
    environmentColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    createdOn: 'Aug 15, 2026',
    lastUsed: 'Sep 18, 2026',
    status: 'Active',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    purpose: 'Local embeddings and open-weight model testing',
  },
  {
    id: 'key-5',
    name: 'OpenAI - Old',
    provider: 'OpenAI',
    providerId: 'openai',
    key: 'sk-proj-00192837461928374619283746192837',
    maskedKey: 'sk-................................',
    environment: 'Testing',
    environmentColor: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
    createdOn: 'Jul 10, 2026',
    lastUsed: 'Aug 12, 2026',
    status: 'Expired',
    statusColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    purpose: 'Legacy QA testing cluster (deprecated)',
  },
  {
    id: 'key-6',
    name: 'Custom LLM',
    provider: 'Custom',
    providerId: 'custom',
    key: 'custom-secret-bearer-token-1928374619',
    maskedKey: 'cust...............................',
    environment: 'Development',
    environmentColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    createdOn: 'Jun 28, 2026',
    lastUsed: 'Sep 17, 2026',
    status: 'Active',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    purpose: 'Self-hosted vLLM instance in private VPC',
  },
];

// Rate Limits (Today) Data
export const RATE_LIMITS_DATA = [
  {
    provider: 'OpenAI',
    used: 1240,
    total: 5000,
    percentage: 25,
    color: '#3b82f6', // blue
  },
  {
    provider: 'Anthropic',
    used: 890,
    total: 5000,
    percentage: 18,
    color: '#a855f7', // purple
  },
  {
    provider: 'Gemini',
    used: 2340,
    total: 15000,
    percentage: 16,
    color: '#06b6d4', // cyan
  },
  {
    provider: 'Hugging Face',
    used: 320,
    total: 5000,
    percentage: 6,
    color: '#f59e0b', // yellow
  },
];

// API Usage (Last 30 Days) Multi-series Line Chart
export const API_USAGE_SERIES = {
  dates: ['Aug 22', 'Aug 27', 'Sep 01', 'Sep 06', 'Sep 11', 'Sep 16', 'Sep 21'],
  openai: [3200, 4100, 3900, 5200, 5000, 6400, 6800], // emerald
  anthropic: [1800, 2200, 2600, 2800, 3100, 3400, 3700], // purple
  gemini: [2100, 3400, 3200, 3500, 3800, 4200, 5100], // blue
  huggingface: [800, 1100, 1400, 1300, 1500, 1600, 1800], // yellow
};

// Security Tips List
export const SECURITY_TIPS = [
  'Store your API keys securely and never share them publicly.',
  'Use environment-specific keys (Development, Testing, Production).',
  'Rotate your keys periodically.',
  'Revoke unused or compromised keys immediately.',
  'Monitor usage for unusual activity.',
];
