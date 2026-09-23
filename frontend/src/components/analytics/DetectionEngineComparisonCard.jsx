'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function DetectionEngineComparisonCard({ comparisonData }) {
  const xTicks = ['0.0', '0.2', '0.4', '0.6', '0.8', '1.0'];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Detection Engine Comparison
          </h2>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Rule-based</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>DistilBERT (ML)</span>
            </span>
          </div>
        </div>

        {/* Horizontal Bars */}
        <div className="space-y-4 pt-2">
          {comparisonData.map((item) => (
            <div key={item.metric} className="space-y-1.5">
              <span className="text-[11px] font-medium text-slate-300 block">
                {item.metric}
              </span>

              {/* Rule-based Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${item.ruleBased * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 w-8 text-right font-semibold">
                  {item.ruleBased.toFixed(2)}
                </span>
              </div>

              {/* DistilBERT ML Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${item.mlDistilBert * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-purple-400 w-8 text-right font-semibold">
                  {item.mlDistilBert.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* X-axis scale */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 mt-4 px-1">
          {xTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}
