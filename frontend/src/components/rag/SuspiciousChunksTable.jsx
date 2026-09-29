'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function SuspiciousChunksTable({
  chunks = [],
  selectedChunk,
  selectedChunkId,
  onSelectChunk,
  onViewAll,
}) {
  const activeId = selectedChunk?.id ?? selectedChunkId;

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Suspicious Chunks</h2>
            {chunks.length > 0 && (
              <span className="text-[10px] bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono px-2 py-0.5 rounded-full font-bold">
                {chunks.length} Flagged
              </span>
            )}
          </div>
          {chunks.length > 0 && onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mb-3.5">
          Ingestion chunks containing prompt injections, role switching, obfuscated commands, or suspicious links.
        </p>

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full min-w-[520px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-medium">
                <th className="pb-2.5 font-medium w-8">#</th>
                <th className="pb-2.5 font-medium">Content Preview</th>
                <th className="pb-2.5 font-medium text-center">Page</th>
                <th className="pb-2.5 font-medium">Detected Threat</th>
                <th className="pb-2.5 font-medium text-center">Risk</th>
                <th className="pb-2.5 font-medium text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {(!chunks || chunks.length === 0) ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/60" />
                      <span className="text-xs text-slate-300 font-medium">No suspicious chunks found!</span>
                      <span className="text-[11px] text-slate-500">The document is clean and ready for RAG ingestion.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                chunks.map((row) => {
                  const isSelected = activeId === row.id;

                  return (
                    <tr
                      key={row.id}
                      onClick={() => onSelectChunk(row)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${isSelected ? 'bg-blue-600/15 border-l-2 border-l-blue-500' : ''
                        }`}
                    >
                      <td className="py-3 text-slate-400 font-mono text-xs pl-1">
                        {row.chunkNumber || row.id}
                      </td>

                      <td className="py-3 text-slate-300 max-w-[160px] sm:max-w-[220px] truncate pr-2">
                        <span className="italic font-mono text-[11px]">{row.preview}</span>
                      </td>

                      <td className="py-3 text-center text-slate-400 font-mono text-xs">
                        {row.page || 1}
                      </td>

                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${row.categoryColor}`}
                        >
                          {row.category}
                        </span>
                      </td>

                      <td className="py-3 text-center font-mono font-bold text-xs text-rose-400">
                        {row.riskScore}
                      </td>

                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectChunk(row);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-blue-600/20 text-slate-300 hover:text-blue-300'
                            }`}
                        >
                          {isSelected ? 'Active' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
