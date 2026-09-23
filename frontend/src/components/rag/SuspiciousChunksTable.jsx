'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';

export function SuspiciousChunksTable({
  chunks = [],
  selectedChunkId,
  onSelectChunk,
  onViewAll,
}) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-white">Suspicious Chunks</h2>
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            <span>View All Chunks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mb-4">
          Chunks that may contain prompt injections attempts.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-medium pb-2">
                <th className="pb-2.5 font-medium w-8">#</th>
                <th className="pb-2.5 font-medium">Content Preview</th>
                <th className="pb-2.5 font-medium text-center">Page</th>
                <th className="pb-2.5 font-medium">Category</th>
                <th className="pb-2.5 font-medium text-center">Risk Score</th>
                <th className="pb-2.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {chunks.map((row) => {
                const isSelected = selectedChunkId === row.id;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectChunk(row)}
                    className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-600/10' : ''
                    }`}
                  >
                    <td className="py-3 text-slate-500 font-mono text-xs">
                      {row.chunkNumber}
                    </td>

                    <td className="py-3 text-slate-300 max-w-[160px] sm:max-w-[200px] truncate pr-2">
                      <span className="italic">{row.preview}</span>
                    </td>

                    <td className="py-3 text-center text-slate-400 font-mono text-xs">
                      {row.page}
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${row.categoryColor}`}
                      >
                        {row.category}
                      </span>
                    </td>

                    <td className="py-3 text-center font-mono font-semibold text-xs text-rose-400">
                      {row.riskScore}
                    </td>

                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectChunk(row);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
