'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ReportsHeader } from '@/components/reports/ReportsHeader';
import { ReportsFilterBar } from '@/components/reports/ReportsFilterBar';
import { ReportsMetricCards } from '@/components/reports/ReportsMetricCards';
import { ReportsByTypeCard } from '@/components/reports/ReportsByTypeCard';
import { ReportsOverTimeCard } from '@/components/reports/ReportsOverTimeCard';
import { ReportStatusCard } from '@/components/reports/ReportStatusCard';
import { RecentReportsTable } from '@/components/reports/RecentReportsTable';
import { ScheduledReportsCard } from '@/components/reports/ScheduledReportsCard';
import { ReportInsightsCard } from '@/components/reports/ReportInsightsCard';
import { GenerateReportModal } from '@/components/reports/GenerateReportModal';
import { ReportDetailModal } from '@/components/reports/ReportDetailModal';
import {
  REPORTS_FILTER_OPTIONS,
  getStoredReports,
  deleteStoredReport,
  getStoredSchedules,
  saveSchedules,
  generateSecurityReport,
  computeReportMetrics,
} from '@/lib/reports';
import { CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [scheduledList, setScheduledList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load from storage after client mount to prevent SSR hydration mismatch
  useEffect(() => {
    const syncReports = () => {
      setReports(getStoredReports());
      setScheduledList(getStoredSchedules());
    };
    const timer = setTimeout(syncReports, 0);
    window.addEventListener('storage', syncReports);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', syncReports);
    };
  }, []);

  // Filter state
  const [filters, setFilters] = useState({
    reportType: 'All Reports',
    dateRange: 'Past 7 Days',
    dataSource: 'All Sources',
    format: 'JSON',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (
        filters.reportType !== 'All Reports' &&
        rep.type !== filters.reportType
      ) {
        return false;
      }
      return true;
    });
  }, [reports, filters]);

  // Dynamic Metrics
  const metrics = computeReportMetrics(reports, scheduledList);

  // Dynamic Reports by Type
  const reportsByType = useMemo(() => {
    if (reports.length === 0) return [];
    const types = [
      'Security Scan',
      'Threat Analysis',
      'Model Usage',
      'RAG Security',
      'Attack Simulation',
    ];
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B'];
    return types
      .map((t, idx) => ({
        label: t,
        count: reports.filter((r) => r.type === t).length,
        color: colors[idx % colors.length],
      }))
      .filter((t) => t.count > 0);
  }, [reports]);

  // Dynamic Reports over time
  const reportsOverTime = useMemo(() => {
    if (reports.length === 0) return [];
    const grouped = {};
    reports.forEach((r) => {
      const d = r.dateGenerated || 'Recent';
      grouped[d] = (grouped[d] || 0) + 1;
    });
    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));
  }, [reports]);

  // Dynamic Report Status
  const reportStatus = useMemo(() => {
    if (reports.length === 0) return [];
    const completed = reports.filter((r) => r.status === 'Completed').length;
    const pending = reports.filter((r) => r.status !== 'Completed').length;
    return [
      { label: 'Completed', count: completed, color: '#10B981' },
      { label: 'Pending', count: pending, color: '#F59E0B' },
    ].filter((s) => s.count > 0);
  }, [reports]);

  // Quick report generation from filter bar
  const handleGenerateQuickReport = async () => {
    try {
      const newReport = await generateSecurityReport({
        type:
          filters.reportType === 'All Reports'
            ? 'Security Scan'
            : filters.reportType,
        format: filters.format,
        dateRange: filters.dateRange,
      });
      setReports((prev) => [newReport, ...prev]);
      showToast(`Generated: ${newReport.name} (${newReport.format})`);
    } catch (err) {
      console.error('Failed to generate quick report:', err);
      showToast('Error generating report.');
    }
  };

  // Toggle scheduled item
  const handleToggleSchedule = (id) => {
    const updated = scheduledList.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    setScheduledList(updated);
    saveSchedules(updated);
    const target = updated.find((i) => i.id === id);
    if (target) {
      showToast(
        `${target.name} ${target.enabled ? 'activated' : 'paused'}.`
      );
    }
  };

  // Download real report content
  const handleDownloadReport = (rep) => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(rep.data || rep, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${rep.name.toLowerCase().replace(/\s+/g, '-')}.${(rep.format || 'json').toLowerCase()}`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Downloaded: ${rep.name}`);
  };

  // View report details
  const handleViewReport = (rep) => {
    setViewingReport(rep);
  };

  // Delete report
  const handleDeleteReport = (id) => {
    const updated = deleteStoredReport(id);
    setReports(updated);
    showToast('Report deleted from archive.');
  };

  // Created from modal
  const handleReportCreated = (newRep) => {
    setReports((prev) => [newRep, ...prev]);
    showToast(`New Report "${newRep.name}" compiled and saved.`);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#e11d48] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-rose-400/40 flex items-center gap-2 text-xs font-semibold animate-fade-in shadow-rose-950/50">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Generate Report Modal */}
        <GenerateReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handleReportCreated}
        />

        {/* View Report Detail Modal */}
        <ReportDetailModal
          isOpen={Boolean(viewingReport)}
          onClose={() => setViewingReport(null)}
          report={viewingReport}
          onDownload={handleDownloadReport}
        />

        {/* Top Header */}
        <ReportsHeader onOpenGenerateModal={() => setIsModalOpen(true)} />

        {/* Filter and Config Bar */}
        <ReportsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={REPORTS_FILTER_OPTIONS}
          onGenerateQuickReport={handleGenerateQuickReport}
        />

        {/* Row 1: 4 Metric Cards */}
        <ReportsMetricCards metrics={metrics} />

        {/* Row 2: 3 Chart Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-4">
            <ReportsByTypeCard data={reportsByType} />
          </div>
          <div className="lg:col-span-4">
            <ReportsOverTimeCard data={reportsOverTime} />
          </div>
          <div className="lg:col-span-4">
            <ReportStatusCard statusData={reportStatus} />
          </div>
        </div>

        {/* Row 3: Split Table & Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Recent Reports Table (8 Cols) */}
          <div className="lg:col-span-8">
            <RecentReportsTable
              reports={filteredReports}
              onDownloadReport={handleDownloadReport}
              onViewReport={handleViewReport}
              onDeleteReport={handleDeleteReport}
            />
          </div>

          {/* Right: Scheduled Reports & Insights (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <ScheduledReportsCard
              scheduledList={scheduledList}
              onToggleSchedule={handleToggleSchedule}
            />
            <ReportInsightsCard insights={[]} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
