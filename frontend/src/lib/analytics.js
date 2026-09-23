'use client';

// Top 4 Metrics matching wireframe
export const ANALYTICS_METRICS = {
  totalScans: '12,482',
  totalScansChange: '↑ 12% from last week',
  allowed: '10,006',
  allowedPercentage: '80.2%',
  warned: '634',
  warnedPercentage: '5.1%',
  blocked: '1,842',
  blockedPercentage: '14.7%',
};

// Scan Trends Multi-series Chart Data (7D, 30D, 90D)
export const SCAN_TRENDS_DATA = {
  '7D': {
    labels: ['Sep 15', 'Sep 16', 'Sep 17', 'Sep 18', 'Sep 19', 'Sep 20', 'Sep 21'],
    total: [1150, 1450, 1600, 1480, 1380, 1550, 1720],
    allowed: [920, 1180, 1310, 1200, 1100, 1260, 1390],
    warned: [100, 120, 150, 130, 110, 130, 140],
    blocked: [130, 150, 140, 150, 170, 160, 190],
  },
  '30D': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    total: [7200, 8400, 9600, 12482],
    allowed: [5800, 6750, 7700, 10006],
    warned: [400, 480, 550, 634],
    blocked: [1000, 1170, 1350, 1842],
  },
  '90D': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    total: [22000, 29000, 37400],
    allowed: [17800, 23400, 30100],
    warned: [1300, 1700, 2100],
    blocked: [2900, 3900, 5200],
  },
};

// Attack Category Distribution Donut Chart
export const ATTACK_CATEGORIES_DISTRIBUTION = [
  { name: 'Direct Injection', percentage: 28.3, count: 521, color: '#f43f5e' }, // rose
  { name: 'Indirect Injection', percentage: 18.6, count: 343, color: '#3b82f6' }, // blue
  { name: 'Jailbreak', percentage: 15.2, count: 280, color: '#a855f7' }, // purple
  { name: 'Obfuscation', percentage: 12.4, count: 228, color: '#10b981' }, // emerald
  { name: 'Role Manipulation', percentage: 10.1, count: 186, color: '#f59e0b' }, // amber
  { name: 'System Extraction', percentage: 8.7, count: 160, color: '#06b6d4' }, // cyan
  { name: 'Instruction Override', percentage: 6.8, count: 125, color: '#ec4899' }, // pink
  { name: 'Others', percentage: 9.9, count: 182, color: '#64748b' }, // slate
];

// Risk Score Distribution Histogram (Number of prompts in 5 buckets)
export const RISK_SCORE_DISTRIBUTION = [
  { range: '0-20', count: 820, color: '#10b981' }, // teal/emerald
  { range: '21-40', count: 1580, color: '#3b82f6' }, // blue
  { range: '41-60', count: 960, color: '#eab308' }, // yellow
  { range: '61-80', count: 680, color: '#f97316' }, // orange
  { range: '81-100', count: 420, color: '#ef4444' }, // red
];

// Model Performance (Clustered bars across 7 attack types)
export const MODEL_PERFORMANCE_METRICS = [
  { category: 'Direct Injection', precision: 82, recall: 88, f1: 85 },
  { category: 'Indirect Injection', precision: 68, recall: 72, f1: 70 },
  { category: 'Jailbreak', precision: 65, recall: 78, f1: 71 },
  { category: 'Obfuscation', precision: 75, recall: 68, f1: 71 },
  { category: 'Role Manipulation', precision: 60, recall: 74, f1: 66 },
  { category: 'System Extraction', precision: 68, recall: 75, f1: 71 },
  { category: 'Instruction Override', precision: 76, recall: 70, f1: 73 },
];

// Detection Engine Comparison (Rule-based vs DistilBERT ML)
export const DETECTION_ENGINE_COMPARISON = [
  { metric: 'Precision', ruleBased: 0.82, mlDistilBert: 0.91 },
  { metric: 'Recall', ruleBased: 0.79, mlDistilBert: 0.89 },
  { metric: 'F1-Score', ruleBased: 0.80, mlDistilBert: 0.90 },
];

// Scan Sources Donut Chart
export const SCAN_SOURCES_DATA = [
  { source: 'Web App', percentage: 62.1, count: 7751, color: '#3b82f6' }, // blue
  { source: 'API', percentage: 24.3, count: 3033, color: '#10b981' }, // green
  { source: 'Playground', percentage: 9.8, count: 1223, color: '#a855f7' }, // purple
  { source: 'Others', percentage: 3.8, count: 475, color: '#64748b' }, // slate
];

// Top Attack Keywords Table
export const TOP_ATTACK_KEYWORDS = [
  { rank: 1, keyword: 'ignore previous instructions', count: 432, trend: '↑ 12%' },
  { rank: 2, keyword: 'act as', count: 389, trend: '↑ 8%' },
  { rank: 3, keyword: 'system prompt', count: 276, trend: '↑ 25%' },
  { rank: 4, keyword: 'jailbreak', count: 231, trend: '↑ 18%' },
  { rank: 5, keyword: 'reveal confidential', count: 189, trend: '↑ 7%' },
];

// AI Security Insights
export const ANALYTICS_INSIGHTS = [
  {
    id: 'insight-1',
    type: 'increase',
    title: 'Blocked prompts increased by 14.7%',
    subtitle: 'More jailbreak attempts detected this week.',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    id: 'insight-2',
    type: 'decrease',
    title: 'Average risk score decreased by 8%',
    subtitle: 'Improved detection and filtering.',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'insight-3',
    type: 'info',
    title: 'Most common attack type',
    subtitle: 'Direct Injection (28.3% of all attacks)',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
];
