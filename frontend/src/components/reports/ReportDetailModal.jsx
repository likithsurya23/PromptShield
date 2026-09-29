'use client';

import React from 'react';
import { X, Download, FileText } from 'lucide-react';

export function ReportDetailModal({ isOpen, onClose, report, onDownload }) {
  if (!isOpen || !report) return null;

  const data = report.data || {};
  const recentScans = data.recentScans || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 text-left relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800 pr-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {report.name}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${report.typeBadge}`}>
                {report.type}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Compiled on {report.dateGenerated} &bull; Format: {report.format} &bull; Scope: {data.dateRange || 'Live'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3 rounded-xl bg-[#080d19] border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">Total Evaluated</span>
              <span className="text-base font-bold text-white font-mono">
                {data.totalScansEvaluated ?? recentScans.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#080d19] border border-slate-800 text-center">
              <span className="text-[10px] text-emerald-400 block mb-0.5">Allowed</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {data.allowed ?? 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#080d19] border border-slate-800 text-center">
              <span className="text-[10px] text-amber-400 block mb-0.5">Warned</span>
              <span className="text-base font-bold text-amber-400 font-mono">
                {data.warned ?? 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#080d19] border border-slate-800 text-center">
              <span className="text-[10px] text-rose-400 block mb-0.5">Blocked</span>
              <span className="text-base font-bold text-rose-400 font-mono">
                {data.blocked ?? 0}
              </span>
            </div>
          </div>

          {/* Top Threat Categories */}
          {data.topAttackCategories && Object.keys(data.topAttackCategories).length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800">
              <h4 className="text-xs font-semibold text-white mb-2">Detected Threat Categories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(data.topAttackCategories).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-300 truncate">{cat}</span>
                    <span className="text-rose-400 font-mono font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evaluated Prompts Sample */}
          {recentScans.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#080d19] border border-slate-800">
              <h4 className="text-xs font-semibold text-white mb-2">Sample Evaluated Prompts in Report</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {recentScans.slice(0, 8).map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${
                        s.action === 'BLOCK' ? 'bg-rose-500/15 text-rose-400' : (s.action === 'WARN' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400')
                      }`}>
                        {s.action}
                      </span>
                      <span className="text-slate-300 truncate">
                        {s.prompt}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      Score: {s.risk_score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="grid grid-cols-2 gap-2 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-800 w-full">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[40px] flex items-center justify-center px-2 sm:px-4 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors text-center"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onDownload(report)}
            className="w-full min-h-[40px] flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shadow-md shadow-blue-600/30"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Download ({report.format})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
