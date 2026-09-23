'use client';

import React, { useState, useMemo } from 'react';
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
import {
  REPORTS_METRICS,
  REPORTS_FILTER_OPTIONS,
  REPORTS_BY_TYPE,
  REPORTS_OVER_TIME,
  REPORT_STATUS_DATA,
  INITIAL_RECENT_REPORTS,
  INITIAL_SCHEDULED_REPORTS,
  REPORT_INSIGHTS,
} from '@/lib/reports';
import { CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState(INITIAL_RECENT_REPORTS);
  const [scheduledList, setScheduledList] = useState(INITIAL_SCHEDULED_REPORTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    reportType: 'All Reports',
    dateRange: 'Sep 15, 2026 - Sep 21, 2026',
    dataSource: 'All Sources',
    format: 'PDF',
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

  // Quick report generation from filter bar
  const handleGenerateQuickReport = () => {
    const newReport = {
      id: `rep-${Date.now()}`,
      name: `${filters.reportType === 'All Reports' ? 'System Overview' : filters.reportType} Report`,
      type: filters.reportType === 'All Reports' ? 'Security Scan' : filters.reportType,
      typeBadge: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
      dateGenerated: 'Sep 22, 2026',
      status: 'Completed',
      statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      format: filters.format,
      size: '2.1 MB',
    };
    setReports((prev) => [newReport, ...prev]);
    showToast(`Generated: ${newReport.name} (${newReport.format})`);
  };

  // Toggle scheduled item
  const handleToggleSchedule = (id) => {
    setScheduledList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    const updated = scheduledList.find((i) => i.id === id);
    showToast(
      `${updated.name} schedule is now ${!updated.enabled ? 'Active' : 'Paused'}.`
    );
  };

  // Download simulation
  const handleDownloadReport = (rep) => {
    const dummyContent = {
      reportId: rep.id,
      title: rep.name,
      type: rep.type,
      generated: rep.dateGenerated,
      format: rep.format,
      metrics: REPORTS_METRICS,
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(dummyContent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${rep.name.toLowerCase().replace(/\s+/g, '-')}.${rep.format.toLowerCase()}`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Downloaded: ${rep.name} (${rep.format})`);
  };

  // View report details
  const handleViewReport = (rep) => {
    showToast(`Viewing report details for: ${rep.name}`);
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
          <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-xl border border-blue-400/40 flex items-center gap-2 text-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal */}
        <GenerateReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handleReportCreated}
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
        <ReportsMetricCards metrics={REPORTS_METRICS} />

        {/* Row 2: 3 Chart Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-4">
            <ReportsByTypeCard data={REPORTS_BY_TYPE} />
          </div>
          <div className="lg:col-span-4">
            <ReportsOverTimeCard data={REPORTS_OVER_TIME} />
          </div>
          <div className="lg:col-span-4">
            <ReportStatusCard statusData={REPORT_STATUS_DATA} />
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
            />
          </div>

          {/* Right: Scheduled Reports & Insights (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <ScheduledReportsCard
              scheduledList={scheduledList}
              onToggleSchedule={handleToggleSchedule}
            />
            <ReportInsightsCard insights={REPORT_INSIGHTS} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
