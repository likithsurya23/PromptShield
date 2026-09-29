'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { X } from 'lucide-react';

export function RecentSimulationLogs({ logs = [] }) {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c1222]/80 shadow-xl transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Recent Simulation Logs
        </h2>
        {logs && logs.length > 0 && (
          <span className="text-xs text-slate-500 font-mono">
            {logs.length} vector{logs.length === 1 ? '' : 's'} recorded
          </span>
        )}
      </div>

      <div className="overflow-x-auto -mx-1 sm:mx-0">
        <table className="w-full min-w-[500px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-medium pb-2">
              <th className="pb-2 font-medium">Time</th>
              <th className="pb-2 font-medium">Attack Type</th>
              <th className="pb-2 font-medium">Prompt (truncated)</th>
              <th className="pb-2 font-medium text-center">Result</th>
              <th className="pb-2 font-medium text-right">Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
            {(!logs || logs.length === 0) ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-slate-400 dark:text-slate-500">
                  No simulation logs recorded yet. Run a simulation to inspect live attack vectors.
                </td>
              </tr>
            ) : (
              logs.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelectedLog(row)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
              >
                <td className="py-2.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {row.time}
                </td>
                <td className="py-2.5 text-slate-800 dark:text-slate-200 font-medium text-xs">
                  <span className="inline-flex items-center gap-1">
                    {row.attackType}
                  </span>
                </td>
                <td className="py-2.5 text-slate-600 dark:text-slate-300 max-w-[140px] sm:max-w-[240px] truncate pr-2">
                  <span className="group-hover:text-rose-600 dark:group-hover:text-blue-300 transition-colors">
                    {row.prompt}
                  </span>
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                      row.result === 'Detected'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {row.result}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono font-medium text-xs text-slate-800 dark:text-slate-200">
                  {row.riskScore}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Simulation Attack Log Detail
              </span>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Adversarial Prompt:</span>
                <div className="bg-slate-50 dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedLog.prompt}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Time</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold font-mono">{selectedLog.time}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Attack Type</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedLog.attackType}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Result</span>
                  <span className={`font-semibold ${selectedLog.result === 'Detected' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {selectedLog.result}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="min-h-[38px] px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
