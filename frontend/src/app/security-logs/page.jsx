'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { LogsMetricCards } from '@/components/logs/LogsMetricCards';
import { LogsFilterBar } from '@/components/logs/LogsFilterBar';
import { LogsTable } from '@/components/logs/LogsTable';
import { LogDetailsCard } from '@/components/logs/LogDetailsCard';
import {
  MOCK_SECURITY_LOGS,
  SECURITY_METRICS,
  fetchLiveLogs,
  fetchLiveMetrics,
} from '@/lib/logs';
import { Download,CheckCircle2 } from 'lucide-react';

export default function SecurityLogsPage() {
  const [metrics, setMetrics] = useState(SECURITY_METRICS);
  const [logs, setLogs] = useState(MOCK_SECURITY_LOGS);
  const [selectedLog, setSelectedLog] = useState(MOCK_SECURITY_LOGS[0]);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([fetchLiveLogs(), fetchLiveMetrics()]).then(([logsRes, metricsRes]) => {
      if (!mounted) return;
      if (logsRes.status === 'fulfilled' && logsRes.value?.length) {
        setLogs(logsRes.value);
        setSelectedLog(logsRes.value[0]);
      }
      if (metricsRes.status === 'fulfilled' && metricsRes.value) {
        setMetrics(metricsRes.value);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Filter state
  const [filters, setFilters] = useState({
    dateRange: 'Past 24 Hours',
    status: 'All',
    category: 'All',
    source: 'All',
    search: '',
  });

  const [activeFilters, setActiveFilters] = useState(filters);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApply = () => {
    setActiveFilters({ ...filters });
    showToast('Filters applied successfully');
  };

  const handleReset = () => {
    const reset = {
      dateRange: 'Past 24 Hours',
      status: 'All',
      category: 'All',
      source: 'All',
      search: '',
    };
    setFilters(reset);
    setActiveFilters(reset);
    showToast('Filters reset to default');
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Status filter
      if (activeFilters.status !== 'All' && log.result !== activeFilters.status) {
        return false;
      }
      // Category filter
      if (activeFilters.category !== 'All' && log.category !== activeFilters.category) {
        return false;
      }
      // Source filter
      if (activeFilters.source !== 'All' && log.source !== activeFilters.source) {
        return false;
      }
      // Search query filter
      if (activeFilters.search.trim()) {
        const query = activeFilters.search.toLowerCase();
        const matchesPrompt = log.prompt && log.prompt.toLowerCase().includes(query);
        const matchesCategory = log.category && log.category.toLowerCase().includes(query);
        const matchesSource = log.source && log.source.toLowerCase().includes(query);
        const matchesId = log.id && log.id.toLowerCase().includes(query);
        if (!matchesPrompt && !matchesCategory && !matchesSource && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [logs, activeFilters]);

  // Export logs simulation
  const handleExportLogs = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `security-logs-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${filteredLogs.length} security log entries.`);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-xl border border-blue-400/40 flex items-center gap-2 text-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header section matching Wireframe */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h1 className="text-xl font-bold text-white tracking-tight">
                Security Logs
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Audit trail, real-time threat intelligence, and detailed prompt scan records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportLogs}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <LogsMetricCards metrics={metrics} />

        {/* Filter Bar */}
        <LogsFilterBar
          filters={filters}
          setFilters={setFilters}
          onApply={handleApply}
          onReset={handleReset}
        />

        {/* Split Layout: Table (Left 8 cols) & Details (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <LogsTable
              logs={filteredLogs}
              selectedLogId={selectedLog?.id}
              onSelectLog={(log) => setSelectedLog(log)}
            />
          </div>

          <div className="lg:col-span-4 sticky top-6">
            <LogDetailsCard
              log={selectedLog}
              onActionClick={(action, log) => {
                if (action === 'allowlist') {
                  showToast(`Rule added: Signature for ${log.id} has been allowlisted.`);
                } else if (action === 'analysis') {
                  showToast(`Opening deep diagnostic report for ${log.id}...`);
                }
              }}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
