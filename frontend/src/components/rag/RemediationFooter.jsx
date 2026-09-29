'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, Trash2, Download, RotateCcw, Check } from 'lucide-react';

export function RemediationFooter({
  onSanitize,
  onDownloadReport,
  onRescan,
  sanitized,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
      {/* Left: Risk Analysis Advisory */}
      <Card className="lg:col-span-6 p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white">Risk Analysis</h3>
            <span className="text-[10px] text-slate-400">ⓘ</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            This document contains potential prompt injection attempts that could manipulate the behavior of an AI system when used in a RAG pipeline. Review and remove suspicious content before indexing.
          </p>
        </div>
      </Card>

      {/* Right: Recommended Actions */}
      <Card className="lg:col-span-6 p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
        <h3 className="text-xs font-bold text-white mb-2.5">Recommended Actions</h3>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Remove Flagged Content */}
          <button
            type="button"
            onClick={onSanitize}
            className="min-h-[38px] flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {sanitized ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{sanitized ? 'Content Redacted' : 'Remove Flagged Content'}</span>
          </button>

          {/* Download Report */}
          <button
            type="button"
            onClick={onDownloadReport}
            className="min-h-[38px] flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>

          {/* Re-scan */}
          <button
            type="button"
            onClick={onRescan}
            className="min-h-[38px] flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-scan</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
