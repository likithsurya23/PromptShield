'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function RiskDistribution({ data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxY = 2000;
  const height = 180;
  const padding = { top: 15, bottom: 25, left: 38, right: 15 };
  const chartHeight = height - padding.top - padding.bottom;
  const width = 340;
  const chartWidth = width - padding.left - padding.right;
  const barWidth = 36;
  const spacing = data.length > 1 ? (chartWidth - barWidth * data.length) / (data.length - 1) : 0;

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Risk Score Distribution</h3>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="riskBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="riskBarHoverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {[0, 500, 1000, 1500, 2000].map((val) => {
            const y = padding.top + chartHeight - (val / maxY) * chartHeight;
            const label = val === 0 ? '0' : val >= 1000 ? `${(val / 1000).toFixed(0)},000` : `${val}`;

            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(51, 65, 85, 0.4)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {data.map((bucket, i) => {
            const x = padding.left + i * (barWidth + spacing);
            const barH = (bucket.count / maxY) * chartHeight;
            const y = padding.top + chartHeight - barH;
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={bucket.range}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="4"
                  fill={isHovered ? 'url(#riskBarHoverGrad)' : 'url(#riskBarGrad)'}
                  className="transition-all duration-200"
                />

                <text
                  x={x + barWidth / 2}
                  y={height - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {bucket.range}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute top-1 bg-slate-900/95 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs shadow-xl pointer-events-none z-10"
            style={{
              left: `${Math.min(
                Math.max((hoveredIndex / (data.length - 1)) * 100, 20),
                80
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-[10px] text-slate-400">Range: {data[hoveredIndex].range}</div>
            <div className="font-semibold text-sky-400 font-mono">
              {data[hoveredIndex].count.toLocaleString()} scans
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
