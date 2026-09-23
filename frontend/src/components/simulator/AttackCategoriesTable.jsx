'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Zap, FileText, AlertTriangle, Shield, Users, Cpu, FileCode } from 'lucide-react';

export function AttackCategoriesTable({ categories = [], onViewAll }) {
  const getCategoryIcon = (iconName, color) => {
    const iconClass = 'w-3.5 h-3.5';
    switch (iconName) {
      case 'zap':
        return <Zap className={iconClass} style={{ color }} />;
      case 'file-text':
        return <FileText className={iconClass} style={{ color }} />;
      case 'alert-triangle':
        return <AlertTriangle className={iconClass} style={{ color }} />;
      case 'shield':
        return <Shield className={iconClass} style={{ color }} />;
      case 'users':
        return <Users className={iconClass} style={{ color }} />;
      case 'cpu':
        return <Cpu className={iconClass} style={{ color }} />;
      case 'file-code':
        return <FileCode className={iconClass} style={{ color }} />;
      default:
        return <Zap className={iconClass} style={{ color }} />;
    }
  };

  return (
    <Card className="p-6 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Attack Categories</h2>
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
                <th className="pb-2.5 font-medium">Category</th>
                <th className="pb-2.5 font-medium text-center">Total</th>
                <th className="pb-2.5 font-medium text-center">Detected</th>
                <th className="pb-2.5 font-medium text-center">Missed</th>
                <th className="pb-2.5 font-medium text-left pl-3">Detection Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {categories.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Category Name & Icon */}
                  <td className="py-2.5 text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="p-1.5 rounded-lg border flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${row.color}15`,
                          borderColor: `${row.color}35`,
                        }}
                      >
                        {getCategoryIcon(row.icon, row.color)}
                      </div>
                      <span className="font-medium text-xs text-slate-200">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-2.5 text-center text-slate-300 font-mono text-xs">
                    {row.total}
                  </td>

                  {/* Detected */}
                  <td className="py-2.5 text-center text-slate-300 font-mono text-xs">
                    {row.detected}
                  </td>

                  {/* Missed */}
                  <td className="py-2.5 text-center font-mono text-xs">
                    <span className={row.missed > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {row.missed}
                    </span>
                  </td>

                  {/* Detection Rate & Progress Bar */}
                  <td className="py-2.5 pl-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                          style={{ width: `${row.rate}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-300 w-9 text-right font-medium">
                        {row.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
