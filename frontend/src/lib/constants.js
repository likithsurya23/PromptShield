export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/' },
  { id: 'prompt-scanner', label: 'Prompt Scanner', icon: 'ShieldAlert', href: '#scanner' },
  { id: 'llm-playground', label: 'LLM Playground', icon: 'MessageSquare', href: '#playground' },
  { id: 'attack-simulator', label: 'Attack Simulator', icon: 'Crosshair', href: '#simulator' },
  { id: 'rag-security', label: 'RAG Security', icon: 'Layers', href: '#rag' },
  { id: 'security-logs', label: 'Security Logs', icon: 'List', href: '#logs' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3', href: '#analytics' },
  { id: 'reports', label: 'Reports', icon: 'FileText', href: '#reports' },
  { id: 'api-keys', label: 'API Keys', icon: 'Key', href: '#keys' },
  { id: 'settings', label: 'Settings', icon: 'Settings', href: '#settings' },
];

export const INITIAL_DASHBOARD_DATA = {
  metrics: [
    {
      id: 'total-scans',
      title: 'Total Scans',
      value: '0',
      change: 'No scans yet',
      changeDirection: 'neutral',
      changeColor: 'slate',
      iconType: 'scans',
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      sparklineColor: '#38BDF8',
    },
    {
      id: 'blocked',
      title: 'Blocked',
      value: '0',
      change: '0% of total',
      changeDirection: 'neutral',
      changeColor: 'slate',
      iconType: 'blocked',
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      sparklineColor: '#F87171',
    },
    {
      id: 'warnings',
      title: 'Warnings',
      value: '0',
      change: '0% of total',
      changeDirection: 'neutral',
      changeColor: 'slate',
      iconType: 'warning',
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      sparklineColor: '#FB923C',
    },
    {
      id: 'allowed',
      title: 'Allowed',
      value: '0',
      change: '0% of total',
      changeDirection: 'neutral',
      changeColor: 'slate',
      iconType: 'allowed',
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      sparklineColor: '#34D399',
    },
    {
      id: 'avg-risk',
      title: 'Avg. Risk Score',
      value: '0.0',
      change: 'Baseline security',
      changeDirection: 'neutral',
      changeColor: 'slate',
      iconType: 'risk',
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      sparklineColor: '#A78BFA',
    },
  ],

  scanActivity: [],

  actionDistribution: {
    allowed: { count: 0, percentage: 0 },
    warned: { count: 0, percentage: 0 },
    blocked: { count: 0, percentage: 0 },
    total: 0,
  },

  attackCategories: [],

  recentThreats: [],

  riskDistribution: [
    { range: '0-20', count: 0 },
    { range: '21-40', count: 0 },
    { range: '41-60', count: 0 },
    { range: '61-80', count: 0 },
    { range: '81-100', count: 0 },
  ],

  quickActions: [
    {
      id: 'scan-prompt',
      title: 'Scan a Prompt',
      description: 'Analyze a prompt for security risks',
      icon: 'scan',
      color: '#3B82F6',
    },
    {
      id: 'llm-playground',
      title: 'Open LLM Playground',
      description: 'Test with real LLM responses',
      icon: 'llm',
      color: '#A855F7',
    },
    {
      id: 'attack-simulator',
      title: 'Run Attack Simulator',
      description: 'Generate and test adversarial prompts',
      icon: 'simulator',
      color: '#EF4444',
    },
    {
      id: 'upload-document',
      title: 'Upload Document',
      description: 'Scan files for indirect injection',
      icon: 'upload',
      color: '#10B981',
    },
  ],

  recentActivity: [],

  systemStatus: {
    allOperational: true,
    uptime: 'PromptShield Active',
    services: [
      { name: 'ML Model (DistilBERT V2)', status: 'Operational' },
      { name: 'Rule Engine', status: 'Operational' },
      { name: 'API Services', status: 'Operational' },
      { name: 'Audit Storage', status: 'Operational' },
      { name: 'Firewall Filter', status: 'Operational' },
    ],
  },

  securityInsights: [],
};
