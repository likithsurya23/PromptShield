'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsMetricCards } from '@/components/analytics/AnalyticsMetricCards';
import { ScanTrendsCard } from '@/components/analytics/ScanTrendsCard';
import { AttackCategoryDistributionCard } from '@/components/analytics/AttackCategoryDistributionCard';
import { RiskScoreDistributionCard } from '@/components/analytics/RiskScoreDistributionCard';
import { ModelPerformanceCard } from '@/components/analytics/ModelPerformanceCard';
import { DetectionEngineComparisonCard } from '@/components/analytics/DetectionEngineComparisonCard';
import { ScanSourcesCard } from '@/components/analytics/ScanSourcesCard';
import { TopKeywordsCard } from '@/components/analytics/TopKeywordsCard';
import { AnalyticsInsightsCard } from '@/components/analytics/AnalyticsInsightsCard';
import { AnalyticsQuickActionsCard } from '@/components/analytics/AnalyticsQuickActionsCard';
import { fetchAnalyticsData } from '@/lib/analytics';
import { CheckCircle2, BarChart3, Shield, RefreshCw } from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('All Time (Live Telemetry)');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchAnalyticsData().then((res) => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateReport = () => {
    if (!data?.hasData) {
      showToast('No scan data available to generate report.');
      return;
    }
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: selectedRange,
      metrics: data.metrics,
      topKeywords: data.topKeywords,
      attackCategories: data.attackCategories,
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `promptshield-analytics-report-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Analytics executive report generated and downloaded.');
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetchAnalyticsData();
      setData(res);
      showToast('Threat analytics refreshed from live database.');
    } catch (err) {
      showToast('Error refreshing analytics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareModels = () => {
    showToast('Benchmark evaluation: DistilBERT V2 (ML Classifier) + Regex Rule Engine.');
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#e11d48] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-rose-400/40 flex items-center gap-2 text-xs font-semibold animate-fade-in shadow-rose-950/50">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Analytics Top Header with Date Range */}
        <AnalyticsHeader
          selectedRange={selectedRange}
          onRangeChange={(range) => {
            setSelectedRange(range);
            showToast(`Time window updated to ${range}`);
          }}
          onRefresh={handleRefresh}
          loading={loading}
        />

        {loading ? (
          <div className="rounded-2xl border border-[#2c1622] bg-[#120a14]/85 p-16 text-center shadow-xl">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#1a0e1c] border border-rose-500/30 flex items-center justify-center text-[#f57b83] mb-4">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1">Loading Analytics Engine...</h2>
            <p className="text-xs text-slate-400">Aggregating actual scan records and detection rate metrics.</p>
          </div>
        ) : !data || !data.hasData || data.totalScans === 0 ? (
          <div className="rounded-2xl border border-[#2c1622] bg-[#120a14]/85 p-12 text-center shadow-xl">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#1a0e1c] border border-rose-500/30 flex items-center justify-center text-[#f57b83] mb-4">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No analytics data available.</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Perform security scans to generate analytics, trend curves, and risk distributions from actual evaluations.
            </p>
            <Link
              href="/prompt-scanner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Perform First Security Scan</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Row 1: 4 KPI Metric Cards */}
            <AnalyticsMetricCards metrics={data.metrics} />

            {/* Row 2: Scan Trends, Attack Category Distribution, Risk Score Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-5">
                <ScanTrendsCard trendsData={data.scanTrends} />
              </div>
              <div className="lg:col-span-4">
                <AttackCategoryDistributionCard data={data.attackCategories} />
              </div>
              <div className="lg:col-span-3">
                <RiskScoreDistributionCard distribution={data.riskScoreDistribution} />
              </div>
            </div>

            {/* Row 3: Model Performance, Detection Engine Comparison, Scan Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-5">
                <ModelPerformanceCard metrics={data.modelPerformance} />
              </div>
              <div className="lg:col-span-4">
                <DetectionEngineComparisonCard comparisonData={data.detectionEngineComparison} />
              </div>
              <div className="lg:col-span-3">
                <ScanSourcesCard sourcesData={data.scanSources} />
              </div>
            </div>

            {/* Row 4: Top Attack Keywords, Insights, Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-5">
                <TopKeywordsCard keywords={data.topKeywords} />
              </div>
              <div className="lg:col-span-4">
                <AnalyticsInsightsCard insights={data.insights} />
              </div>
              <div className="lg:col-span-3">
                <AnalyticsQuickActionsCard
                  onGenerateReport={handleGenerateReport}
                  onCompareModels={handleCompareModels}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
