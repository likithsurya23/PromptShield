'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Shield, AlertTriangle, Target } from 'lucide-react';

export function SimulationResultsCard({ data }) {
  if (!data) {
    return (
      <Card className="p-6 border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-center items-center text-center min-h-[320px] transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4 shadow-lg shadow-blue-500/5">
          <Target className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">Simulation Standby</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
          Configure attack parameters or generate custom vectors on the left, then click &quot;Run Simulation&quot; to test your DistilBERT model against live adversarial prompts.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse"></span>
          Awaiting execution
        </div>
      </Card>
    );
  }

  // SVG Radial Donut calculation
  const radius = 45;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (data.detectionRate / 100) * circumference;

  return (
    <Card className="p-6 border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Simulation Results
            </h2>
            {data.isCustom && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Custom Benchmark
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Last run: {data.timestamp}
          </span>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {/* 1. Total Attacks */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] mb-1">
              <Shield className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Total Attacks</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {data.totalAttacks}
            </div>
          </div>

          {/* 2. Detected */}
          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-slate-900/80 border border-emerald-200/50 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-slate-400 text-[10px] mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Detected</span>
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {data.detected}
            </div>
          </div>

          {/* 3. Missed */}
          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-slate-900/80 border border-rose-200/50 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-slate-400 text-[10px] mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
              <span>Missed</span>
            </div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono">
              {data.missed}
            </div>
          </div>

          {/* 4. Detection Rate */}
          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-900/80 border border-purple-200/50 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-slate-400 text-[10px] mb-1">
              <Target className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>Detection Rate</span>
            </div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono">
              {data.detectionRate}%
            </div>
          </div>
        </div>

        {/* Gauge & Breakdown Container */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Radial Donut Gauge */}
          <div className="relative flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#10B981"
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeDash} ${circumference}`}
                fill="transparent"
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {data.detectionRate}%
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400">Detection Rate</span>
            </div>
          </div>

          {/* Stats Breakdown List */}
          <div className="space-y-2.5 text-xs w-full sm:w-48">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Detected</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {data.detected}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Missed</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {data.missed}
              </span>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Coverage</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {data.detectionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
