'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowRight, X } from 'lucide-react';

export function RecentSimulationLogs({ logs = [], onViewAll }) {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">
          Recent Simulation Logs
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-medium pb-2">
              <th className="pb-2 font-medium">Time</th>
              <th className="pb-2 font-medium">Attack Type</th>
              <th className="pb-2 font-medium">Prompt (truncated)</th>
              <th className="pb-2 font-medium text-center">Result</th>
              <th className="pb-2 font-medium text-right">Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-xs">
            {logs.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelectedLog(row)}
                className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
              >
                <td className="py-2.5 text-slate-400 font-mono text-[11px]">
                  {row.time}
                </td>
                <td className="py-2.5 text-slate-200 font-medium text-xs">
                  {row.attackType}
                </td>
                <td className="py-2.5 text-slate-300 max-w-[140px] sm:max-w-[180px] truncate pr-2">
                  <span className="group-hover:text-blue-300 transition-colors">
                    {row.prompt}
                  </span>
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                      row.result === 'Detected'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {row.result}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono font-medium text-xs text-slate-200">
                  {row.riskScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-semibold text-white">
                Simulation Attack Log
              </span>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Adversarial Prompt:</span>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-200 font-mono leading-relaxed">
                  {selectedLog.prompt}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Time</span>
                  <span className="text-slate-200 font-semibold font-mono">{selectedLog.time}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Attack Type</span>
                  <span className="text-slate-200 font-semibold">{selectedLog.attackType}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Result</span>
                  <span className={`font-semibold ${selectedLog.result === 'Detected' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedLog.result}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
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
