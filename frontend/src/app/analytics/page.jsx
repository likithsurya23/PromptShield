'use client';

import React, { useState } from 'react';
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
import {
  ANALYTICS_METRICS,
  SCAN_TRENDS_DATA,
  ATTACK_CATEGORIES_DISTRIBUTION,
  RISK_SCORE_DISTRIBUTION,
  MODEL_PERFORMANCE_METRICS,
  DETECTION_ENGINE_COMPARISON,
  SCAN_SOURCES_DATA,
  TOP_ATTACK_KEYWORDS,
  ANALYTICS_INSIGHTS,
} from '@/lib/analytics';
import { CheckCircle2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('Sep 15, 2026 - Sep 21, 2026');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: selectedRange,
      metrics: ANALYTICS_METRICS,
      topKeywords: TOP_ATTACK_KEYWORDS,
      attackCategories: ATTACK_CATEGORIES_DISTRIBUTION,
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

  const handleCompareModels = () => {
    showToast('Benchmark comparison loaded: DistilBERT (ML) + Heuristic Rule Engine.');
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-xl border border-blue-400/40 flex items-center gap-2 text-sm animate-fade-in">
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
        />

        {/* Row 1: 4 KPI Metric Cards */}
        <AnalyticsMetricCards metrics={ANALYTICS_METRICS} />

        {/* Row 2: Scan Trends, Attack Category Distribution, Risk Score Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5">
            <ScanTrendsCard trendsData={SCAN_TRENDS_DATA} />
          </div>
          <div className="lg:col-span-4">
            <AttackCategoryDistributionCard data={ATTACK_CATEGORIES_DISTRIBUTION} />
          </div>
          <div className="lg:col-span-3">
            <RiskScoreDistributionCard distribution={RISK_SCORE_DISTRIBUTION} />
          </div>
        </div>

        {/* Row 3: Model Performance, Detection Engine Comparison, Scan Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5">
            <ModelPerformanceCard metrics={MODEL_PERFORMANCE_METRICS} />
          </div>
          <div className="lg:col-span-4">
            <DetectionEngineComparisonCard comparisonData={DETECTION_ENGINE_COMPARISON} />
          </div>
          <div className="lg:col-span-3">
            <ScanSourcesCard sourcesData={SCAN_SOURCES_DATA} />
          </div>
        </div>

        {/* Row 4: Top Attack Keywords, Insights, Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5">
            <TopKeywordsCard keywords={TOP_ATTACK_KEYWORDS} />
          </div>
          <div className="lg:col-span-4">
            <AnalyticsInsightsCard insights={ANALYTICS_INSIGHTS} />
          </div>
          <div className="lg:col-span-3">
            <AnalyticsQuickActionsCard
              onGenerateReport={handleGenerateReport}
              onCompareModels={handleCompareModels}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
