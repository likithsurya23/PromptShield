'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function ReportsOverTimeCard({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-center items-center text-center h-full min-h-[220px]">
        <h2 className="text-sm font-bold text-white tracking-tight mb-2 self-start">Reports Generated Over Time</h2>
        <div className="py-6 flex flex-col items-center">
          <p className="text-xs text-slate-500">No report timeline data available.</p>
          <p className="text-[11px] text-slate-600 mt-1">Audit generation activity over time will be graphed here.</p>
        </div>
      </Card>
    );
  }

  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = Math.max(10, ...data.map(d => d.count || 0));

  const getY = (val) => {
    return height - paddingBottom - (val / maxY) * chartHeight;
  };

  const getX = (idx) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (idx / (data.length - 1)) * chartWidth;
  };

  const pathString = data
    .map((d, idx) => {
      const x = getX(idx);
      const y = getY(d.count);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Gradient area path
  const areaString = `${pathString} L ${getX(data.length - 1)} ${getY(0)} L ${getX(
    0
  )} ${getY(0)} Z`;

  const yTicks = [20, 15, 10, 5, 0];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight mb-2">
          Reports Generated Over Time
        </h2>

        <div className="relative w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
          >
            <defs>
              <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {yTicks.map((tick) => {
              const y = getY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* X Labels */}
            {data.map((d, idx) => {
              const x = getX(idx);
              return (
                <text
                  key={d.date}
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {d.date}
                </text>
              );
            })}

            {/* Area Fill */}
            <path d={areaString} fill="url(#reportsGrad)" />

            {/* Smooth Blue Stroke Line */}
            <path
              d={pathString}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data Dots and Active Tooltip */}
            {data.map((d, idx) => {
              const x = getX(idx);
              const y = getY(d.count);
              const isSelected = hoveredIdx === idx;

              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                >
                  {/* Invisible hit box */}
                  <rect
                    x={x - 15}
                    y={paddingTop}
                    width={30}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Outer circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    fill="#080d19"
                    stroke="#3b82f6"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Callout */}
          {hoveredIdx !== null && (
            <div
              className="absolute pointer-events-none -top-2 transform -translate-x-1/2 bg-[#080d19]/95 border border-slate-700 shadow-xl rounded-lg px-2.5 py-1 text-center z-20"
              style={{
                left: `${(getX(hoveredIdx) / width) * 100}%`,
              }}
            >
              <p className="text-[10px] text-slate-400">
                {data[hoveredIdx].date}, 2026
              </p>
              <p className="text-xs font-bold text-white font-mono">
                {data[hoveredIdx].count} reports
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
