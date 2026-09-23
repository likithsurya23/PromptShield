'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function TopKeywordsCard({ keywords }) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight mb-4">
          Top Attack Keywords
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-medium">
                <th className="pb-2 w-6 text-slate-500">#</th>
                <th className="pb-2">Keyword / Pattern</th>
                <th className="pb-2 text-center">Count</th>
                <th className="pb-2 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {keywords.map((item) => (
                <tr key={item.rank} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 font-mono text-[11px] text-slate-500">
                    {item.rank}
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-200">
                    {item.keyword}
                  </td>
                  <td className="py-2.5 font-mono text-center text-slate-300">
                    {item.count}
                  </td>
                  <td className="py-2.5 font-mono text-right text-rose-400 font-medium">
                    {item.trend}
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
