'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function DetectionChartCard({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const width = 500;
  const height = 150;
  const padding = { top: 15, bottom: 35, left: 30, right: 15 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;

  const maxY = 20;
  const barWidth = 24;
  const barSpacing = data.length > 1 ? (chartWidth - barWidth * data.length) / (data.length - 1) : 0;

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-white">Detection Performance</h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Detected
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Missed
          </span>
        </div>
      </div>

      {(!data || data.length === 0) ? (
        <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-lg">
          <p className="text-xs text-slate-500">No simulation performance data yet.</p>
          <p className="text-[11px] text-slate-600 mt-1">Run a simulation above to visualize detection vs missed metrics.</p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
          className="w-full h-36 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Y Axis Grid Lines & Labels */}
          {[0, 5, 10, 15, 20].map((val) => {
            const y = padding.top + chartHeight - (val / maxY) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(51, 65, 85, 0.3)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Stacked Bars */}
          {data.map((item, idx) => {
            const x = padding.left + idx * (barWidth + barSpacing);
            const detectedHeight = (item.detected / maxY) * chartHeight;
            const missedHeight = (item.missed / maxY) * chartHeight;

            const detectedY = padding.top + chartHeight - detectedHeight;
            const missedY = detectedY - missedHeight;

            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={item.category}
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
                  className="text-[8px] fill-slate-400 font-sans"
                >
                  {item.category.split(' ')[0]}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={height - 9}
                  textAnchor="middle"
                  className="text-[8px] fill-slate-500 font-sans"
                >
                  {item.category.split(' ').slice(1).join(' ')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="absolute top-1 bg-slate-900/95 border border-slate-700/80 rounded-lg p-2 text-xs shadow-xl pointer-events-none z-10"
            style={{
              left: `${Math.min(
                Math.max((hoveredIdx / (data.length - 1)) * 100, 15),
                85
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-white text-[11px] mb-1">
              {data[hoveredIdx].category}
            </div>
            <div className="flex flex-col gap-0.5 text-[10px]">
              <span className="text-emerald-400">
                Detected: {data[hoveredIdx].detected}
              </span>
              <span className="text-rose-400">
                Missed: {data[hoveredIdx].missed}
              </span>
            </div>
          </div>
        )}
      </div>
      )}
    </Card>
  );
}
