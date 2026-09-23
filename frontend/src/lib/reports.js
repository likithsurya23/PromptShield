'use client';

// Top 4 Metrics matching wireframe
export const REPORTS_METRICS = {
  totalReports: '24',
  totalReportsChange: '↑ 20% from last month',
  scheduledReports: '8',
  scheduledReportsChange: '↑ 33% from last month',
  threatReports: '6',
  threatReportsChange: '↓ 14% from last month',
  usageReports: '10',
  usageReportsChange: '↑ 25% from last month',
};

// Filter dropdown options
export const REPORTS_FILTER_OPTIONS = {
  reportTypes: [
    'All Reports',
    'Security Scan',
    'Threat Analysis',
    'Model Usage',
    'RAG Security',
    'Attack Simulation',
    'System',
  ],
  dateRanges: [
    'Sep 15, 2026 - Sep 21, 2026',
    'Sep 01, 2026 - Sep 21, 2026',
    'Aug 21, 2026 - Sep 21, 2026',
    'Last 30 Days',
    'Last 90 Days',
  ],
  dataSources: ['All Sources', 'Scanner', 'Playground', 'RAG Security', 'API'],
  formats: ['PDF', 'CSV', 'JSON'],
};

// Reports by Type Donut Data (Total 24)
export const REPORTS_BY_TYPE = [
  { name: 'Security Scan Reports', percentage: 37.5, count: 9, color: '#3b82f6' }, // blue
  { name: 'Threat Analysis Reports', percentage: 25.0, count: 6, color: '#f43f5e' }, // red/rose
  { name: 'Model Usage Reports', percentage: 16.7, count: 4, color: '#10b981' }, // green/emerald
  { name: 'RAG Security Reports', percentage: 8.3, count: 2, color: '#a855f7' }, // purple
  { name: 'Attack Simulation Reports', percentage: 8.3, count: 2, color: '#f59e0b' }, // yellow/amber
  { name: 'Other', percentage: 4.2, count: 1, color: '#64748b' }, // slate
];

// Reports Generated Over Time Line Chart Data
export const REPORTS_OVER_TIME = [
  { date: 'Sep 15', count: 2 },
  { date: 'Sep 16', count: 5 },
  { date: 'Sep 17', count: 5 },
  { date: 'Sep 18', count: 12 }, // Peak
  { date: 'Sep 19', count: 8 },
  { date: 'Sep 20', count: 10 },
  { date: 'Sep 21', count: 14 },
];

// Report Status Donut Data
export const REPORT_STATUS_DATA = [
  { status: 'Completed', count: 18, percentage: 75.0, color: '#10b981' }, // green
  { status: 'Generating', count: 2, percentage: 8.3, color: '#3b82f6' }, // blue
  { status: 'Scheduled', count: 3, percentage: 12.5, color: '#f59e0b' }, // amber
  { status: 'Failed', count: 1, percentage: 4.2, color: '#ef4444' }, // red
];

// Initial Recent Reports List (6 items matching wireframe)
export const INITIAL_RECENT_REPORTS = [
  {
    id: 'rep-1',
    name: 'Weekly Security Summary',
    type: 'Security Scan',
    typeBadge: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    dateGenerated: 'Sep 21, 2026',
    status: 'Completed',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    format: 'PDF',
    size: '2.4 MB',
  },
  {
    id: 'rep-2',
    name: 'Prompt Injection Analysis',
    type: 'Threat Analysis',
    typeBadge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    dateGenerated: 'Sep 20, 2026',
    status: 'Completed',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    format: 'PDF',
    size: '3.8 MB',
  },
  {
    id: 'rep-3',
    name: 'Model Usage Report',
    type: 'Usage',
    typeBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    dateGenerated: 'Sep 19, 2026',
    status: 'Completed',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    format: 'PDF',
    size: '1.9 MB',
  },
  {
    id: 'rep-4',
    name: 'RAG Security Assessment',
    type: 'RAG Security',
    typeBadge: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    dateGenerated: 'Sep 18, 2026',
    status: 'Generating',
    statusBadge: 'bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse',
    format: 'PDF',
    size: 'In progress',
  },
  {
    id: 'rep-5',
    name: 'Attack Simulation Results',
    type: 'Attack Simulation',
    typeBadge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    dateGenerated: 'Sep 17, 2026',
    status: 'Completed',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    format: 'PDF',
    size: '4.2 MB',
  },
  {
    id: 'rep-6',
    name: 'Monthly Activity Report',
    type: 'System',
    typeBadge: 'bg-slate-700/40 text-slate-300 border border-slate-700',
    dateGenerated: 'Sep 15, 2026',
    status: 'Failed',
    statusBadge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    format: 'PDF',
    size: '0 KB',
  },
];

// Scheduled Reports Data
export const INITIAL_SCHEDULED_REPORTS = [
  {
    id: 'sch-1',
    name: 'Weekly Security Report',
    schedule: 'Every Monday, 9:00 AM',
    enabled: true,
  },
  {
    id: 'sch-2',
    name: 'Monthly Usage Report',
    schedule: '1st of every month',
    enabled: true,
  },
  {
    id: 'sch-3',
    name: 'Threat Summary Report',
    schedule: 'Every Friday, 5:00 PM',
    enabled: false,
  },
];

// Report Insights Data
export const REPORT_INSIGHTS = [
  {
    id: 'ins-1',
    type: 'trend',
    title: '20% increase in scans',
    subtitle: 'Compared to last month',
    iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  },
  {
    id: 'ins-2',
    type: 'threat',
    title: '14% decrease in threats',
    subtitle: 'Security measures are improving',
    iconColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
  },
];
