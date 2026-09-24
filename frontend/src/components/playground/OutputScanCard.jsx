'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export function OutputScanCard({ isSafe = null }) {
  if (isSafe === null) {
    return (
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl">
        <h2 className="text-sm font-semibold text-white mb-2">
          6. Output Security Scan
        </h2>
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-500 text-xs">
          Awaiting execution. Output will be evaluated post-generation.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl">
      <h2 className="text-sm font-semibold text-white mb-3">
        6. Output Security Scan
      </h2>

      <div
        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
          isSafe
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl border shrink-0 ${
              isSafe
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            }`}
          >
            {isSafe ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <div
              className={`text-xs font-bold ${
                isSafe ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isSafe ? 'Safe Response' : 'Harmful Output Detected'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isSafe
                ? 'The model response is safe and does not contain harmful content.'
                : 'Output violated safety guidelines and was suppressed.'}
            </div>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
      </div>
    </Card>
  );
}
