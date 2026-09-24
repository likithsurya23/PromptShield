import { INITIAL_DASHBOARD_DATA } from './constants';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchDashboardData() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const [summaryRes, scansRes] = await Promise.allSettled([
      fetch(`${API_BASE}/analytics/summary`, { signal: controller.signal }),
      fetch(`${API_BASE}/scans?limit=50`, { signal: controller.signal }),
    ]);

    clearTimeout(timeoutId);

    const data = JSON.parse(JSON.stringify(INITIAL_DASHBOARD_DATA));

    let summary = null;
    let scans = [];

    if (summaryRes.status === 'fulfilled' && summaryRes.value.ok) {
      summary = await summaryRes.value.json();
    }

    if (scansRes.status === 'fulfilled' && scansRes.value.ok) {
      const rawScans = await scansRes.value.json();
      if (Array.isArray(rawScans)) {
        scans = rawScans;
      }
    }

    const totalScans = summary?.total_scans ?? scans.length;

    if (!totalScans || totalScans === 0) {
      // Clean zero state - absolutely no dummy numbers
      return {
        ...data,
        totalScans: 0,
        hasData: false,
      };
    }

    const allowed = summary?.allowed ?? scans.filter((s) => s.action === 'ALLOW').length;
    const warned = summary?.warned ?? scans.filter((s) => s.action === 'WARN').length;
    const blocked = summary?.blocked ?? scans.filter((s) => s.action === 'BLOCK').length;

    // Calculate actual average risk score from real scans
    const totalRisk = scans.reduce((acc, curr) => acc + (curr.risk_score || 0), 0);
    const avgRisk = scans.length > 0 ? (totalRisk / scans.length).toFixed(1) : '0.0';

    // Top Metric Cards
    data.metrics[0].value = totalScans.toLocaleString();
    data.metrics[0].change = `${totalScans} verified scans`;

    data.metrics[1].value = blocked.toLocaleString();
    data.metrics[1].change = `${Math.round((blocked / totalScans) * 100)}% of total`;

    data.metrics[2].value = warned.toLocaleString();
    data.metrics[2].change = `${Math.round((warned / totalScans) * 100)}% of total`;

    data.metrics[3].value = allowed.toLocaleString();
    data.metrics[3].change = `${Math.round((allowed / totalScans) * 100)}% of total`;

    data.metrics[4].value = avgRisk;
    data.metrics[4].change = `From ${scans.length} active samples`;

    // Action Distribution
    data.actionDistribution.total = totalScans;
    data.actionDistribution.allowed = {
      count: allowed,
      percentage: Math.round((allowed / totalScans) * 100),
    };
    data.actionDistribution.warned = {
      count: warned,
      percentage: Math.round((warned / totalScans) * 100),
    };
    data.actionDistribution.blocked = {
      count: blocked,
      percentage: Math.round((blocked / totalScans) * 100),
    };

    // Attack Categories from real summary top_attack_categories
    const categoryColors = ['#3B82F6', '#06B6D4', '#EC4899', '#F97316', '#EAB308', '#14B8A6', '#10B981', '#6366F1'];
    const catEntries = Object.entries(summary?.top_attack_categories || {});
    data.attackCategories = catEntries.map(([name, count], idx) => ({
      name,
      count,
      color: categoryColors[idx % categoryColors.length],
    }));

    // Recent Threats from real scans
    data.recentThreats = scans.slice(0, 6).map((s, idx) => ({
      id: s.id || `scan-${idx}`,
      time: s.created_at
        ? new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now',
      prompt: s.prompt || 'Scan prompt',
      category: s.attack_categories?.[0] || '—',
      risk: Math.round((s.risk_score || 0) * 10) / 10,
      action: s.action || (s.prediction === 'malicious' ? 'BLOCK' : 'ALLOW'),
    }));

    // Risk distribution buckets from real scans
    const buckets = [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 },
    ];
    scans.forEach((s) => {
      const score = s.risk_score || 0;
      if (score <= 20) buckets[0].count++;
      else if (score <= 40) buckets[1].count++;
      else if (score <= 60) buckets[2].count++;
      else if (score <= 80) buckets[3].count++;
      else buckets[4].count++;
    });
    data.riskDistribution = buckets;

    // Scan Activity by date
    const dateMap = {};
    scans.forEach((s) => {
      const d = s.created_at
        ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Today';
      if (!dateMap[d]) {
        dateMap[d] = { date: d, allowed: 0, warned: 0, blocked: 0 };
      }
      if (s.action === 'BLOCK') dateMap[d].blocked++;
      else if (s.action === 'WARN') dateMap[d].warned++;
      else dateMap[d].allowed++;
    });
    data.scanActivity = Object.values(dateMap);

    // Recent Activity list
    data.recentActivity = scans.slice(0, 5).map((s, idx) => ({
      id: s.id || `act-${idx}`,
      title: s.action === 'BLOCK' ? 'Malicious prompt blocked' : (s.action === 'WARN' ? 'Suspicious prompt flagged' : 'Safe prompt analyzed'),
      detail: s.prompt && s.prompt.length > 36 ? `"${s.prompt.slice(0, 36)}..."` : `"${s.prompt || 'Scan query'}"`,
      time: s.created_at ? new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
      type: s.action === 'BLOCK' ? 'malicious' : (s.action === 'WARN' ? 'warning' : 'safe'),
    }));

    return {
      ...data,
      totalScans,
      hasData: true,
    };
  } catch {
    return {
      ...JSON.parse(JSON.stringify(INITIAL_DASHBOARD_DATA)),
      totalScans: 0,
      hasData: false,
      error: true,
    };
  }
}
