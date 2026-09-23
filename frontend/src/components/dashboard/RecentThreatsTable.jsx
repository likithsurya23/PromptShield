'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ActionBadge, CategoryPill } from '@/components/ui/Badge';
import { ArrowRight, X } from 'lucide-react';
import { getRiskColor } from '@/lib/utils';

export function RecentThreatsTable({ threats = [], onViewAll }) {
  const [selectedThreat, setSelectedThreat] = useState(null);

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Recent Threats</h3>
        <button
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
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-2.5 font-medium">Time</th>
              <th className="pb-2.5 font-medium">Prompt (Truncated)</th>
              <th className="pb-2.5 font-medium">Category</th>
              <th className="pb-2.5 font-medium text-center">Risk</th>
              <th className="pb-2.5 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {threats.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                onClick={() => setSelectedThreat(row)}
              >
                <td className="py-2.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                  {row.time}
                </td>
                <td className="py-2.5 text-slate-200 max-w-[180px] sm:max-w-[220px] truncate pr-3">
                  <span className="group-hover:text-blue-300 transition-colors">
                    {row.prompt}
                  </span>
                </td>
                <td className="py-2.5 whitespace-nowrap">
                  <CategoryPill category={row.category} />
                </td>
                <td className="py-2.5 text-center whitespace-nowrap">
                  <span className={`font-mono text-xs ${getRiskColor(row.risk)}`}>
                    {Number(row.risk).toFixed(1)}
                  </span>
                </td>
                <td className="py-2.5 text-right whitespace-nowrap">
                  <ActionBadge action={row.action} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedThreat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setSelectedThreat(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0f172a] border border-slate-700/90 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ActionBadge action={selectedThreat.action} />
                <span className="text-sm font-semibold text-white">Threat Details</span>
              </div>
              <button
                onClick={() => setSelectedThreat(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Full Prompt:</span>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-200 font-mono leading-relaxed">
                  {selectedThreat.prompt}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Timestamp</span>
                  <span className="text-slate-200 font-semibold font-mono">{selectedThreat.time}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Category</span>
                  <span className="text-slate-200 font-semibold">{selectedThreat.category}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Risk Score</span>
                  <span className={`font-semibold font-mono ${getRiskColor(selectedThreat.risk)}`}>
                    {selectedThreat.risk} / 100
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedThreat(null)}
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
