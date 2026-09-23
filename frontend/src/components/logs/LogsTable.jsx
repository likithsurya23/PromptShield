'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export function LogsTable({
  logs = [],
  selectedLogId,
  onSelectLog,
}) {
  const [selectedAll, setSelectedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const toggleAll = () => {
    const next = !selectedAll;
    setSelectedAll(next);
    const map = {};
    logs.forEach((l) => {
      map[l.id] = next;
    });
    setCheckedItems(map);
  };

  const toggleItem = (id, e) => {
    e.stopPropagation();
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getResultBadge = (result) => {
    switch (result) {
      case 'Blocked':
        return 'bg-rose-500 text-white font-bold';
      case 'Warned':
        return 'bg-amber-500 text-slate-950 font-bold';
      case 'Allowed':
        return 'bg-emerald-500 text-slate-950 font-bold';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Direct Injection':
      case 'Instruction Override':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      case 'Indirect Injection':
      case 'System Extraction':
      case 'Obfuscation':
        return 'bg-purple-500/15 text-purple-300 border border-purple-500/30';
      case 'Jailbreak':
        return 'bg-rose-500/15 text-rose-300 border border-rose-500/30';
      case 'Role Manipulation':
        return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
      case 'Benign':
        return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-rose-400 font-bold';
    if (score >= 50) return 'text-amber-400 font-bold';
    return 'text-emerald-400 font-bold';
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">
              Logs <span className="text-slate-400 font-normal">(12,482)</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select className="bg-[#080d19] border border-slate-800 rounded-lg py-1 px-2 text-xs text-white">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>per page</span>
            </div>

            <span className="font-mono text-[11px]">1-10 of 12,482</span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="p-1 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-medium pb-2">
                <th className="pb-2.5 w-7">
                  <input
                    type="checkbox"
                    checked={selectedAll}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded bg-[#080d19] border-slate-700 accent-blue-600 cursor-pointer"
                  />
                </th>
                <th className="pb-2.5 font-medium">Time</th>
                <th className="pb-2.5 font-medium">Prompt / Document (Truncated)</th>
                <th className="pb-2.5 font-medium">Type</th>
                <th className="pb-2.5 font-medium">Category</th>
                <th className="pb-2.5 font-medium text-center">Risk Score</th>
                <th className="pb-2.5 font-medium text-center">Result</th>
                <th className="pb-2.5 font-medium">Source</th>
                <th className="pb-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {logs.map((row) => {
                const isSelected = selectedLogId === row.id;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectLog(row)}
                    className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-600/10' : ''
                    }`}
                  >
                    <td className="py-2.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!checkedItems[row.id]}
                        onChange={(e) => toggleItem(row.id, e)}
                        className="w-3.5 h-3.5 rounded bg-[#080d19] border-slate-700 accent-blue-600 cursor-pointer"
                      />
                    </td>

                    <td className="py-2.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {row.time}
                    </td>

                    <td className="py-2.5 text-slate-200 max-w-[140px] sm:max-w-[170px] truncate pr-2 font-mono text-[11px]">
                      {row.truncatedPrompt}
                    </td>

                    <td className="py-2.5 text-slate-300 text-[11px]">
                      {row.type}
                    </td>

                    <td className="py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${getCategoryColor(
                          row.category
                        )}`}
                      >
                        {row.category}
                      </span>
                    </td>

                    <td className="py-2.5 text-center font-mono text-xs">
                      <span className={getRiskColor(row.riskScore)}>
                        {row.riskScore}
                      </span>
                    </td>

                    <td className="py-2.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${getResultBadge(
                          row.result
                        )}`}
                      >
                        {row.result}
                      </span>
                    </td>

                    <td className="py-2.5 text-slate-400 text-[11px]">
                      {row.source}
                    </td>

                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLog(row);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
