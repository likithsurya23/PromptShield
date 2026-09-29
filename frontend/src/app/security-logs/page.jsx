'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { LogsMetricCards } from '@/components/logs/LogsMetricCards';
import { LogsFilterBar } from '@/components/logs/LogsFilterBar';
import { LogsTable } from '@/components/logs/LogsTable';
import { LogDetailsCard } from '@/components/logs/LogDetailsCard';
import {
  FILTER_OPTIONS,
  fetchLiveLogs,
  fetchLiveMetrics,
} from '@/lib/logs';
import { Download, CheckCircle2, Shield, List, RefreshCw } from 'lucide-react';

export default function SecurityLogsPage() {
  const [metrics, setMetrics] = useState({
    totalScans: '0',
    totalScansChange: 'No operations yet',
    allowed: '0',
    allowedPercentage: '0%',
    warned: '0',
    warnedPercentage: '0%',
    blocked: '0',
    blockedPercentage: '0%',
  });
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([fetchLiveLogs(), fetchLiveMetrics()]).then(([logsRes, metricsRes]) => {
      if (!mounted) return;
      if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)) {
        setLogs(logsRes.value);
        if (logsRes.value.length > 0) {
          setSelectedLog(logsRes.value[0]);
        }
      }
      if (metricsRes.status === 'fulfilled' && metricsRes.value) {
        setMetrics(metricsRes.value);
      }
      setLoading(false);
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
      if (activeFilters.status !== 'All' && log.result !== activeFilters.status) {
        return false;
      }
      if (activeFilters.category !== 'All' && log.category !== activeFilters.category) {
        return false;
      }
      if (activeFilters.source !== 'All' && log.source !== activeFilters.source) {
        return false;
      }
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

  const handleExport = () => {
    if (logs.length === 0) {
      showToast('No logs available to export.');
      return;
    }
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `promptshield-security-logs-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported audit logs successfully.');
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [logsRes, metricsRes] = await Promise.allSettled([
        fetchLiveLogs(),
        fetchLiveMetrics(),
      ]);
      if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)) {
        setLogs(logsRes.value);
        if (logsRes.value.length > 0 && !selectedLog) {
          setSelectedLog(logsRes.value[0]);
        }
      }
      if (metricsRes.status === 'fulfilled' && metricsRes.value) {
        setMetrics(metricsRes.value);
      }
      showToast('Security logs refreshed from API.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <AppShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1a0e1c] border border-rose-500/30 text-[#f57b83] backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#f57b83]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Logs</h1>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full min-h-[38px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-[11px] sm:text-xs font-semibold text-slate-200 transition-colors shadow-sm cursor-pointer text-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#f57b83] shrink-0 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="truncate">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="w-full min-h-[38px] flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-[11px] sm:text-xs font-semibold text-slate-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
          >
            <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Export (JSON)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#2c1622] bg-[#120a14]/85 p-16 text-center shadow-xl mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#1a0e1c] border border-rose-500/30 flex items-center justify-center text-[#f57b83] mb-4">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1">Loading Security Logs...</h2>
          <p className="text-xs text-slate-400">Fetching live audit stream from PromptShield API.</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-[#2c1622] bg-[#120a14]/85 p-12 text-center shadow-xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#1a0e1c] border border-rose-500/30 flex items-center justify-center text-[#f57b83] mb-4">
            <List className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No security logs yet.</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Run a scan to generate your first security event. All evaluated prompts and inspection telemetry will appear here.
          </p>
          <Link
            href="/prompt-scanner"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Scan a Prompt</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Top 4 Stat Metric Cards */}
          <LogsMetricCards metrics={metrics} />

          {/* Filter Bar */}
          <LogsFilterBar
            filters={filters}
            setFilters={setFilters}
            options={FILTER_OPTIONS}
            onApply={handleApply}
            onReset={handleReset}
          />

          {/* 2-Column Main Section: Logs Table (Left) + Details Card (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8">
              <LogsTable
                logs={filteredLogs}
                selectedLog={selectedLog}
                onSelectLog={setSelectedLog}
              />
            </div>
            <div className="lg:col-span-4 sticky top-6">
              <LogDetailsCard
                log={selectedLog || filteredLogs[0]}
                onExport={handleExport}
              />
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
