'use client';

const STORAGE_KEY = 'promptshield_generated_reports';
const SCHEDULES_KEY = 'promptshield_scheduled_reports';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const REPORTS_FILTER_OPTIONS = {
  reportTypes: [
    'All Reports',
    'Security Scan',
    'Threat Analysis',
    'Model Usage',
    'RAG Security',
    'Attack Simulation',
  ],
  dateRanges: [
    'Today',
    'Past 7 Days',
    'Past 30 Days',
    'All Time',
  ],
  dataSources: ['All Sources', 'Scanner', 'Playground', 'RAG Security', 'API'],
  formats: ['JSON', 'CSV'],
};

export const DEFAULT_SCHEDULES = [
  {
    id: 'sched-1',
    name: 'Weekly Threat Intelligence Digest',
    frequency: 'Weekly on Mondays (08:00 UTC)',
    format: 'JSON',
    recipients: 'security-team@promptshield.io',
    enabled: true,
  },
  {
    id: 'sched-2',
    name: 'Daily High-Risk Prompt Audit',
    frequency: 'Daily at 23:59 UTC',
    format: 'CSV',
    recipients: 'compliance@promptshield.io',
    enabled: false,
  },
  {
    id: 'sched-3',
    name: 'Monthly Executive Security KPI Report',
    frequency: '1st of every month',
    format: 'JSON',
    recipients: 'ciso@promptshield.io',
    enabled: true,
  },
];

export function getStoredReports() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveReport(report) {
  if (typeof window === 'undefined') return;
  const current = getStoredReports();
  const updated = [report, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteStoredReport(id) {
  if (typeof window === 'undefined') return [];
  const current = getStoredReports();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getStoredSchedules() {
  if (typeof window === 'undefined') return DEFAULT_SCHEDULES;
  const raw = localStorage.getItem(SCHEDULES_KEY);
  if (!raw) return DEFAULT_SCHEDULES;
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SCHEDULES;
  }
}

export function saveSchedules(schedules) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
}

export async function generateSecurityReport({
  name = 'Security Audit Summary',
  type = 'Security Scan',
  format = 'JSON',
  dateRange = 'Past 7 Days',
}) {
  let summary = { total_scans: 0, allowed: 0, warned: 0, blocked: 0, top_attack_categories: {} };
  let scans = [];

  try {
    const [summaryRes, scansRes] = await Promise.allSettled([
      fetch(`${API_BASE}/analytics/summary`),
      fetch(`${API_BASE}/scans?limit=100`),
    ]);
    if (summaryRes.status === 'fulfilled' && summaryRes.value.ok) {
      summary = await summaryRes.value.json();
    }
    if (scansRes.status === 'fulfilled' && scansRes.value.ok) {
      scans = await scansRes.value.json();
    }
  } catch {}

  const newReport = {
    id: `rep-${Date.now().toString(36)}`,
    name: name || `${type} Report`,
    type,
    typeBadge:
      type === 'Threat Analysis'
        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    dateGenerated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: 'Completed',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    format: format || 'JSON',
    size: `${(Math.max(1, JSON.stringify(scans).length) / 1024).toFixed(1)} KB`,
    data: {
      generatedAt: new Date().toISOString(),
      dateRange,
      totalScansEvaluated: summary.total_scans || scans.length,
      allowed: summary.allowed || 0,
      warned: summary.warned || 0,
      blocked: summary.blocked || 0,
      topAttackCategories: summary.top_attack_categories || {},
      recentScans: scans,
    },
  };

  saveReport(newReport);
  return newReport;
}

export function computeReportMetrics(reports = [], schedules = []) {
  const total = reports.length;
  const threatReports = reports.filter((r) => r.type === 'Threat Analysis').length;
  const scanReports = reports.filter((r) => r.type === 'Security Scan').length;
  const activeSchedules = schedules.filter((s) => s.enabled).length;

  return {
    totalReports: total.toString(),
    totalReportsChange: total > 0 ? `${total} generated` : 'No reports yet',
    scheduledReports: activeSchedules.toString(),
    scheduledReportsChange: `${activeSchedules} active schedules`,
    threatReports: threatReports.toString(),
    threatReportsChange: `${threatReports} threat audits`,
    usageReports: scanReports.toString(),
    usageReportsChange: `${scanReports} scan audits`,
  };
}
