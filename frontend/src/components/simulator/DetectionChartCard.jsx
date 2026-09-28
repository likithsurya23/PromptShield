'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function DetectionChartCard({ data = [], chartData = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const items = (chartData && chartData.length > 0) ? chartData : (data || []);

  const width = 500;
  const height = 150;
  const padding = { top: 15, bottom: 35, left: 30, right: 15 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;

  const maxItemTotal = Math.max(5, ...items.map((d) => (d.detected || 0) + (d.missed || 0)));
  const maxY = Math.ceil(maxItemTotal / 5) * 5 || 10;
  const barWidth = 24;
  const barSpacing = items.length > 1 ? (chartWidth - barWidth * items.length) / (items.length - 1) : 0;

  const yTicks = [0, Math.round(maxY * 0.25), Math.round(maxY * 0.5), Math.round(maxY * 0.75), maxY];

  return (
    <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c1222]/80 shadow-xl mb-4 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Detection Performance</h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Detected
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Missed
          </span>
        </div>
      </div>

      {(!items || items.length === 0) ? (
        <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400">No simulation performance data yet.</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Run a simulation above to visualize detection vs missed metrics.</p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-36 overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Y Axis Grid Lines & Labels */}
            {yTicks.map((val) => {
              const y = padding.top + chartHeight - (val / maxY) * chartHeight;
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Stacked Bars */}
            {items.map((item, idx) => {
              const x = padding.left + idx * (barWidth + barSpacing);
              const detectedHeight = ((item.detected || 0) / maxY) * chartHeight;
              const missedHeight = ((item.missed || 0) / maxY) * chartHeight;

              const detectedY = padding.top + chartHeight - detectedHeight;
              const missedY = detectedY - missedHeight;

              const isHovered = hoveredIdx === idx;

              return (
                <g
                  key={item.category || idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Detected Segment (Green) */}
                  <rect
                    x={x}
                    y={detectedY}
                    width={barWidth}
                    height={detectedHeight}
                    fill={isHovered ? '#34D399' : '#10B981'}
                    rx={item.missed > 0 ? 0 : 3}
                    className="transition-colors"
                  />

                  {/* Missed Segment (Red Stacked on Top) */}
                  {item.missed > 0 && (
                    <rect
                      x={x}
                      y={missedY}
                      width={barWidth}
                      height={missedHeight}
                      fill={isHovered ? '#F87171' : '#EF4444'}
                      rx={3}
                      className="transition-colors"
                    />
                  )}

                  {/* X Axis Short Category Label */}
                  <text
                    x={x + barWidth / 2}
                    y={height - 18}
                    textAnchor="middle"
                    className="text-[8px] fill-slate-600 dark:fill-slate-400 font-sans font-medium"
                  >
                    {(item.category || '').split(' ')[0]}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={height - 9}
                    textAnchor="middle"
                    className="text-[8px] fill-slate-400 dark:fill-slate-500 font-sans"
                  >
                    {(item.category || '').split(' ').slice(1).join(' ')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredIdx !== null && items[hoveredIdx] && (
            <div
              className="absolute top-1 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-xs shadow-xl pointer-events-none z-10"
              style={{
                left: `${Math.min(
                  Math.max((hoveredIdx / Math.max(items.length - 1, 1)) * 100, 15),
                  85
                )}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="font-semibold text-slate-900 dark:text-white text-[11px] mb-1">
                {items[hoveredIdx].category}
              </div>
              <div className="flex flex-col gap-0.5 text-[10px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Detected: {items[hoveredIdx].detected}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  Missed: {items[hoveredIdx].missed}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
