'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Lightbulb, ArrowRight, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

export function SecurityInsights({ insights = [], onViewAll }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'trending-up':
        return {
          icon: TrendingUp,
          box: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
      case 'shield-check':
        return {
          icon: ShieldCheck,
          box: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        };
      default:
        return {
          icon: AlertCircle,
          box: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        };
    }
  };

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Security Insights</h3>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3 my-auto">
        {insights.map((item) => {
          const { icon: Icon, box } = getIcon(item.icon);

          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-start gap-3"
            >
              <div className={`p-2 rounded-lg border shrink-0 ${box}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white leading-tight">
                  {item.title}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
                <span className="text-[10px] text-slate-500 font-mono block mt-1.5">
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
