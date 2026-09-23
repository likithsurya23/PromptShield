'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Download, Trash2 } from 'lucide-react';

export function DataManagementCard({ onExportData, onClearData }) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">
          Data Management
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">
          Manage your scan history and application data.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Export Scan History */}
          <button
            type="button"
            onClick={onExportData}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#080d19] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Scan History</span>
          </button>

          {/* Clear Scan History */}
          <button
            type="button"
            onClick={onClearData}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-950/20 border border-rose-800/40 hover:border-rose-600 hover:bg-rose-950/40 text-xs font-semibold text-rose-400 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear Scan History</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
