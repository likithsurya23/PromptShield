'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Shield, ShieldAlert, AlertTriangle, Target } from 'lucide-react';

export function SimulationResultsCard({ data }) {
  if (!data) return null;

  // SVG Radial Donut calculation
  const radius = 45;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (data.detectionRate / 100) * circumference;

  return (
    <Card className="p-6 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">
            Simulation Results
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Last run: {data.timestamp}
          </span>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {/* 1. Total Attacks */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Total Attacks</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {data.totalAttacks}
            </div>
          </div>

          {/* 2. Detected */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Detected</span>
            </div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {data.detected}
            </div>
          </div>

          {/* 3. Missed */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Missed</span>
            </div>
            <div className="text-xl font-bold text-rose-400 font-mono">
              {data.missed}
            </div>
          </div>

          {/* 4. Detection Rate */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span>Detection Rate</span>
            </div>
            <div className="text-xl font-bold text-purple-400 font-mono">
              {data.detectionRate}%
            </div>
          </div>
        </div>

        {/* Gauge & Breakdown Container */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Radial Donut Gauge */}
          <div className="relative flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="rgba(30, 41, 59, 0.6)"
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
              <span className="text-sm font-bold text-white font-mono">
                {data.detectionRate}%
              </span>
              <span className="text-[9px] text-slate-400">Detection Rate</span>
            </div>
          </div>

          {/* Stats Breakdown List */}
          <div className="space-y-2.5 text-xs w-full sm:w-48">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Detected</span>
              </div>
              <span className="font-mono font-semibold text-white">
                {data.detected}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Missed</span>
              </div>
              <span className="font-mono font-semibold text-white">
                {data.missed}
              </span>
            </div>

            <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Accuracy</span>
              <span className="font-mono font-bold text-emerald-400">
                {data.detectionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
