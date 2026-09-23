'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function ScanSourcesCard({ sourcesData }) {
  const radius = 55;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  const segments = React.useMemo(() => {
    let acc = 0;
    return sourcesData.map((item) => {
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = `-${(acc / 100) * circumference}`;
      acc += item.percentage;
      return { ...item, strokeDasharray, strokeDashoffset };
    });
  }, [sourcesData, circumference]);

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight mb-4">
          Scan Sources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Donut Chart */}
          <div className="sm:col-span-6 flex items-center justify-center relative">
            <svg viewBox="0 0 160 160" className="w-36 h-36 -rotate-90">
              {segments.map((item, idx) => (
                <circle
                  key={idx}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={item.strokeDasharray}
                  strokeDashoffset={item.strokeDashoffset}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </svg>

            {/* Centered Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-sm font-extrabold text-white font-mono leading-none">
                12,482
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Total Scans
              </span>
            </div>
          </div>

          {/* Right Legend */}
          <div className="sm:col-span-6 space-y-2 text-xs">
            {sourcesData.map((src, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[11px] group cursor-pointer hover:bg-slate-800/40 p-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: src.color }}
                  />
                  <span className="text-slate-300 truncate group-hover:text-white">
                    {src.source}
                  </span>
                </div>
                <span className="font-mono text-slate-400 shrink-0 font-semibold">
                  {src.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
