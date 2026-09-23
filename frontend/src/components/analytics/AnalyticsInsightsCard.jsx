'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Lightbulb, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export function AnalyticsInsightsCard({ insights }) {
  const getIcon = (type) => {
    switch (type) {
      case 'increase':
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        );
      case 'decrease':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Insights
          </h2>
        </div>

        <div className="space-y-3">
          {insights.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              {getIcon(item.type)}
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white tracking-tight leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
