'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

export function ReportInsightsCard({ insights }) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between mt-5">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Report Insights
          </h2>
        </div>

        <div className="space-y-3">
          {(!insights || insights.length === 0) ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              No audit insights yet. Generate security reports to extract automated insights.
            </div>
          ) : (
            insights.map((item) => {
              const isTrend = item.type === 'trend';
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${item.iconColor}`}
                >
                  {isTrend ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </Card>
  );
}
