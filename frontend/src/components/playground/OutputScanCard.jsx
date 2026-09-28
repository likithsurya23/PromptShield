'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export function OutputScanCard({ isSafe = null, outputScan = null }) {
  if (isSafe === null) {
    return (
      <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c1222]/80 shadow-xl transition-colors">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          6. Output Guardrail Inspection
        </h2>
        <div className="p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-500 text-xs">
          Awaiting execution. Output tokens will be evaluated for sensitive leaks, PII, and unsafe content post-generation.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c1222]/80 shadow-xl transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          6. Output Guardrail Inspection
        </h2>
        {outputScan?.tokensScanned > 0 && (
          <span className="text-[10px] font-mono text-slate-500">
            {outputScan.tokensScanned} tokens checked
          </span>
        )}
      </div>

      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isSafe
            ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30'
            : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl border shrink-0 ${
              isSafe
                ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-100 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-600 dark:text-rose-500'
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
                isSafe ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
              }`}
            >
              {isSafe ? 'Output Verified Clean' : 'Harmful Output Detected'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {isSafe
                ? 'No credential leaks, unauthorized PII, or unsafe responses detected.'
                : 'Output violated safety guidelines and was suppressed.'}
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <Lock className="w-3 h-3 text-emerald-500" />
            0 Leaks
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            PII Clean
          </span>
        </div>
      </div>
    </Card>
  );
}
