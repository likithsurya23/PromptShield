'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function RiskScoreDistributionCard({ distribution }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxY = 2000;
  const height = 180;
  const yTicks = [0, 500, 1000, 1500, 2000];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight mb-4">
          Risk Score Distribution
        </h2>

        <div className="relative flex items-end gap-3 pt-6 pb-2">
          {/* Y Axis Legend and Labels */}
          <div className="flex flex-col justify-between h-[150px] text-[10px] text-slate-400 font-mono pr-2 border-r border-slate-800 text-right select-none">
            {yTicks.reverse().map((tick) => (
              <span key={tick}>{tick.toLocaleString()}</span>
            ))}
          </div>

          {/* Histogram Bars */}
          <div className="flex-1 flex items-end justify-between h-[150px] gap-2 pt-2">
            {distribution.map((bucket, idx) => {
              const barHeightPercent = (bucket.count / maxY) * 100;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={bucket.range}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-7 z-20 bg-slate-900 border border-slate-700 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                      {bucket.count.toLocaleString()} prompts
                    </div>
                  )}

                  {/* Colored Bar */}
                  <div
                    className="w-full max-w-[42px] rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                    style={{
                      height: `${barHeightPercent}%`,
                      backgroundColor: bucket.color,
                      opacity: hoveredIdx !== null && !isHovered ? 0.6 : 1,
                    }}
                  />

                  {/* Bucket Label */}
                  <span className="text-[10px] font-mono text-slate-400 mt-2 truncate">
                    {bucket.range}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* X Axis Label */}
        <div className="text-center text-[10px] text-slate-400 font-medium mt-1">
          Risk Score Range
        </div>
      </div>
    </Card>
  );
}
