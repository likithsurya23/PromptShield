'use client';

import React from 'react';
import { FileText, Plus } from 'lucide-react';

export function ReportsHeader({ onOpenGenerateModal }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
      {/* Title & Description */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reports
          </h1>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onOpenGenerateModal}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-95 cursor-pointer w-fit"
      >
        <Plus className="w-4 h-4" />
        <span>Generate New Report</span>
      </button>
    </div>
  );
}
