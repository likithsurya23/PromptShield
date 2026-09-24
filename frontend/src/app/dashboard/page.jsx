'use client';

import React from 'react';
import Link from 'next/link';
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
import { ShieldAlert, Shield, ArrowRight, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { data, loading, refresh, timeRange, setTimeRange } = useDashboardData();

  return (
    <AppShell>
      {/* Dashboard Top Header */}
      <DashboardHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={refresh}
        loading={loading}
      />

      {loading ? (
        <div className="rounded-2xl border border-[#2c1622] bg-[#120a14]/85 p-16 text-center shadow-xl mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#1a0e1c] border border-rose-500/30 flex items-center justify-center text-[#f57b83] mb-4">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1">Loading Security Telemetry...</h2>
          <p className="text-xs text-slate-400">Connecting to PromptShield API and aggregating audit records.</p>
        </div>
      ) : !data.hasData || data.totalScans === 0 ? (
        /* Empty State */
        <div className="mb-6 space-y-6">
          <div className="rounded-2xl border border-[#2c1622] bg-[#120a14]/85 p-12 text-center shadow-xl">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#1a0e1c] border border-rose-500/30 flex items-center justify-center text-[#f57b83] mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No scan data available yet.</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Run your first prompt scan to see security analytics, threat detection breakdowns, and model confidence scores.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/prompt-scanner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Run Your First Scan</span>
              </Link>
              <Link
                href="/attack-simulator"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
              >
                <span>Launch Attack Simulator</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Quick Actions & System Status in zero state */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <QuickActions actions={data.quickActions} />
            </div>
            <div className="lg:col-span-5">
              <SystemStatus status={data.systemStatus} />
            </div>
          </div>
        </div>
      ) : (
        /* Real Populated Data View */
        <>
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
        </>
      )}
    </AppShell>
  );
}
