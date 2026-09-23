'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export function LogsMetricCards({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {/* 1. Total Scans */}
      <Card className="p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Total Scans</span>
          <div className="text-xl font-bold text-white font-mono leading-tight my-0.5">
            {metrics.totalScans}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            {metrics.totalScansChange}
          </span>
        </div>
      </Card>

      {/* 2. Allowed */}
      <Card className="p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Allowed</span>
          <div className="text-xl font-bold text-white font-mono leading-tight my-0.5">
            {metrics.allowed}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            {metrics.allowedPercentage}
          </span>
        </div>
      </Card>

      {/* 3. Warned */}
      <Card className="p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Warned</span>
          <div className="text-xl font-bold text-white font-mono leading-tight my-0.5">
            {metrics.warned}
          </div>
          <span className="text-[11px] text-amber-400 font-mono">
            {metrics.warnedPercentage}
          </span>
        </div>
      </Card>

      {/* 4. Blocked */}
      <Card className="p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-400 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Blocked</span>
          <div className="text-xl font-bold text-white font-mono leading-tight my-0.5">
            {metrics.blocked}
          </div>
          <span className="text-[11px] text-rose-400 font-mono">
            {metrics.blockedPercentage}
          </span>
        </div>
      </Card>
    </div>
  );
}
