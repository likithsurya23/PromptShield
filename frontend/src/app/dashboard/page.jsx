'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { ScanActivityChart } from '@/components/dashboard/ScanActivityChart';
import { ActionDistribution } from '@/components/dashboard/ActionDistribution';
import { AttackCategories } from '@/components/dashboard/AttackCategories';
import { RecentThreatsTable } from '@/components/dashboard/RecentThreatsTable';
import { RiskDistribution } from '@/components/dashboard/RiskDistribution';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { SecurityInsights } from '@/components/dashboard/SecurityInsights';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardPage() {
  const { data, timeRange, setTimeRange } = useDashboardData();

  return (
    <AppShell>
      {/* Dashboard Top Header */}
      <DashboardHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* Top 5 Stat Metric Cards */}
      <MetricCards metrics={data.metrics} />

      {/* Row 2: Scan Activity, Action Distribution, Attack Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
        <div className="lg:col-span-5">
          <ScanActivityChart data={data.scanActivity} />
        </div>
        <div className="lg:col-span-3">
          <ActionDistribution data={data.actionDistribution} />
        </div>
        <div className="lg:col-span-4">
          <AttackCategories categories={data.attackCategories} />
        </div>
      </div>

      {/* Row 3: Recent Threats, Risk Distribution, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
        <div className="lg:col-span-6">
          <RecentThreatsTable threats={data.recentThreats} />
        </div>
        <div className="lg:col-span-3">
          <RiskDistribution data={data.riskDistribution} />
        </div>
        <div className="lg:col-span-3">
          <QuickActions actions={data.quickActions} />
        </div>
      </div>

      {/* Row 4: Recent Activity, System Status, Security Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div>
          <SystemStatus status={data.systemStatus} />
        </div>
        <div>
          <SecurityInsights insights={data.securityInsights} />
        </div>
      </div>
    </AppShell>
  );
}
