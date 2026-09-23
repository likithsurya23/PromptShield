import { INITIAL_DASHBOARD_DATA } from './constants';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchDashboardData() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const [summaryRes, scansRes] = await Promise.allSettled([
      fetch(`${API_BASE}/analytics/summary`, { signal: controller.signal }),
      fetch(`${API_BASE}/scans?limit=6`, { signal: controller.signal }),
    ]);

    clearTimeout(timeoutId);

    const data = JSON.parse(JSON.stringify(INITIAL_DASHBOARD_DATA));

    if (summaryRes.status === 'fulfilled' && summaryRes.value.ok) {
      const summary = await summaryRes.value.json();
      if (summary.total_scans > 0) {
        data.metrics[0].value = summary.total_scans.toLocaleString();
        data.metrics[1].value = summary.blocked.toLocaleString();
        data.metrics[2].value = summary.warned.toLocaleString();
        data.metrics[3].value = summary.allowed.toLocaleString();

        data.actionDistribution.total = summary.total_scans;
        data.actionDistribution.allowed.count = summary.allowed;
        data.actionDistribution.allowed.percentage = Math.round((summary.allowed / summary.total_scans) * 100);
        data.actionDistribution.warned.count = summary.warned;
        data.actionDistribution.warned.percentage = Math.round((summary.warned / summary.total_scans) * 100);
        data.actionDistribution.blocked.count = summary.blocked;
        data.actionDistribution.blocked.percentage = Math.round((summary.blocked / summary.total_scans) * 100);
      }
    }

    if (scansRes.status === 'fulfilled' && scansRes.value.ok) {
      const scans = await scansRes.value.json();
      if (Array.isArray(scans) && scans.length > 0) {
        data.recentThreats = scans.slice(0, 6).map((s, idx) => ({
          id: s._id || `scan-${idx}`,
          time: s.timestamp ? new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          prompt: s.prompt || 'Scan prompt query',
          category: s.attack_categories?.[0] || 'Direct Injection',
          risk: Math.round((s.risk_score || 0) * 10) / 10,
          action: s.action || (s.prediction === 'malicious' ? 'BLOCK' : 'ALLOW'),
        }));
      }
    }

    return data;
  } catch (e) {
    return INITIAL_DASHBOARD_DATA;
  }
}
