'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { AttackConfigCard } from '@/components/simulator/AttackConfigCard';
import { SimulationResultsCard } from '@/components/simulator/SimulationResultsCard';
import { AttackCategoriesTable } from '@/components/simulator/AttackCategoriesTable';
import { DetectionChartCard } from '@/components/simulator/DetectionChartCard';
import { RecentSimulationLogs } from '@/components/simulator/RecentSimulationLogs';
import { INITIAL_SIMULATION_DATA, runAttackSimulation } from '@/lib/simulator';
import { Wrench, BookOpen } from 'lucide-react';

export default function AttackSimulatorPage() {
  const [config, setConfig] = useState({
    attackType: 'Jailbreak',
    samples: 20,
    difficulty: 'Medium',
    includeObfuscated: true,
    includeMultiTurn: false,
    testOutputScan: true,
  });

  const [data, setData] = useState(INITIAL_SIMULATION_DATA);
  const [loading, setLoading] = useState(false);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await runAttackSimulation(config);
      setData(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig({
      attackType: 'Jailbreak',
      samples: 20,
      difficulty: 'Medium',
      includeObfuscated: true,
      includeMultiTurn: false,
      testOutputScan: true,
    });
    setData(INITIAL_SIMULATION_DATA);
  };

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Attack Simulator
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Test your security model against various prompt injection attack types.
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/docs"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>View Documentation</span>
          </Link>
        </div>
      </div>

      {/* Top 2-Column Section: Configuration & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-stretch">
        <div className="lg:col-span-6">
          <AttackConfigCard
            config={config}
            setConfig={setConfig}
            onRun={handleRunSimulation}
            onReset={handleReset}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-6">
          <SimulationResultsCard data={data} />
        </div>
      </div>

      {/* Bottom 2-Column Section: Categories & Performance/Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Attack Categories Table */}
        <div className="lg:col-span-6">
          <AttackCategoriesTable categories={data.categories} />
        </div>

        {/* Right Column: Stacked Chart & Logs */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <DetectionChartCard data={data.chartData} />
          <RecentSimulationLogs logs={data.logs} />
        </div>
      </div>
    </AppShell>
  );
}
