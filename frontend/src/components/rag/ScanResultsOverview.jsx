'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, ShieldCheck, ShieldAlert, Target } from 'lucide-react';

export function ScanResultsOverview({ results }) {
  if (!results) return null;

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Scan Results</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Analysis completed. Found {results.suspiciousChunks} suspicious chunks.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Scanned at: {results.timestamp}
          </span>
        </div>

        {/* 4 KPI Tiles in a Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Chunks */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Chunks</span>
              <span className="text-lg font-bold text-white font-mono leading-tight">
                {results.totalChunks}
              </span>
            </div>
          </div>

          {/* Safe Chunks */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Safe Chunks</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-white font-mono leading-tight">
                  {results.safeChunks}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {results.safePercentage}
                </span>
              </div>
            </div>
          </div>

          {/* Suspicious Chunks */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-600/10 border border-rose-500/20 text-rose-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Suspicious Chunks</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-rose-400 font-mono leading-tight">
                  {results.suspiciousChunks}
                </span>
                <span className="text-[10px] text-rose-400 font-mono">
                  {results.suspiciousPercentage}
                </span>
              </div>
            </div>
          </div>

          {/* Document Risk */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Document Risk</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-base font-bold text-white font-mono leading-tight">
                  {results.documentRisk}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">/100</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-500 text-white uppercase tracking-wider">
                  {results.riskBadge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
