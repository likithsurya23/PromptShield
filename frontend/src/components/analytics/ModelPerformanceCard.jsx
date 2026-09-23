'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function ModelPerformanceCard({ metrics }) {
  const yTicks = ['100%', '75%', '50%', '25%', '0%'];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Model Performance
          </h2>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Precision</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Recall</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>F1-Score</span>
            </span>
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="flex items-end gap-3 pt-4">
          {/* Y Axis */}
          <div className="flex flex-col justify-between h-[150px] text-[10px] text-slate-400 font-mono pr-2 border-r border-slate-800 text-right select-none">
            {yTicks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>

          {/* Clustered Bars Container */}
          <div className="flex-1 flex items-end justify-between h-[150px] gap-2 overflow-x-auto pb-1">
            {metrics.map((item) => (
              <div
                key={item.category}
                className="flex-1 flex flex-col items-center h-full justify-end min-w-[50px] group cursor-pointer"
              >
                {/* Triple Bars */}
                <div className="flex items-end gap-0.5 h-[120px] w-full justify-center">
                  {/* Precision */}
                  <div
                    className="w-2.5 rounded-t bg-sky-400 hover:brightness-110 transition-all"
                    style={{ height: `${item.precision}%` }}
                    title={`Precision: ${item.precision}%`}
                  />
                  {/* Recall */}
                  <div
                    className="w-2.5 rounded-t bg-emerald-400 hover:brightness-110 transition-all"
                    style={{ height: `${item.recall}%` }}
                    title={`Recall: ${item.recall}%`}
                  />
                  {/* F1 */}
                  <div
                    className="w-2.5 rounded-t bg-purple-400 hover:brightness-110 transition-all"
                    style={{ height: `${item.f1}%` }}
                    title={`F1-Score: ${item.f1}%`}
                  />
                </div>

                {/* X Category Label */}
                <span className="text-[9px] font-mono text-slate-400 mt-2 text-center truncate max-w-[60px] group-hover:text-slate-200">
                  {item.category.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
