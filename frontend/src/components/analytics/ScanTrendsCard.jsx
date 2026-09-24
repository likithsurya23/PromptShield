'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function ScanTrendsCard({ trendsData }) {
  const [activeRange, setActiveRange] = useState('7D');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const current = trendsData[activeRange] || trendsData['7D'];
  const { labels, total, allowed, warned, blocked } = current;

  // Chart dimensions
  const width = 600;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 2000;

  const getY = (val) => {
    return height - paddingBottom - (val / maxY) * chartHeight;
  };

  const getX = (idx) => {
    if (!labels || labels.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (idx / (labels.length - 1)) * chartWidth;
  };

  const buildPath = (values) => {
    return values
      .map((val, idx) => {
        const x = getX(idx);
        const y = getY(val);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const yTicks = [0, 500, 1000, 1500, 2000];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header & Range Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Scan Trends
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Total</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Allowed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Warned</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Blocked</span>
              </span>
            </div>

            {/* Time Toggle Pills */}
            <div className="flex items-center bg-[#080d19] border border-slate-800 rounded-lg p-0.5">
              {['7D', '30D', '90D'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setActiveRange(range)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    activeRange === range
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
          >
            {/* Horizontal Grid lines and Y labels */}
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
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {tick.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {labels.map((lbl, idx) => {
              const x = getX(idx);
              return (
                <text
                  key={lbl}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {lbl}
                </text>
              );
            })}

            {/* Total Line (Blue) */}
            <path
              d={buildPath(total)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Allowed Line (Green) */}
            <path
              d={buildPath(allowed)}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Warned Line (Yellow) */}
            <path
              d={buildPath(warned)}
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Blocked Line (Red) */}
            <path
              d={buildPath(blocked)}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Data Dots & Hover Detection */}
            {labels.map((_, idx) => {
              const x = getX(idx);
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Invisible hover trigger strip */}
                  <rect
                    x={x - 15}
                    y={paddingTop}
                    width={30}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Circle points on active */}
                  <circle
                    cx={x}
                    cy={getY(total[idx])}
                    r={hoveredIdx === idx ? 5 : 3.5}
                    fill="#3b82f6"
                    className="transition-all"
                  />
                  <circle
                    cx={x}
                    cy={getY(allowed[idx])}
                    r={hoveredIdx === idx ? 4.5 : 3}
                    fill="#10b981"
                    className="transition-all"
                  />
                  <circle
                    cx={x}
                    cy={getY(warned[idx])}
                    r={hoveredIdx === idx ? 4.5 : 3}
                    fill="#eab308"
                    className="transition-all"
                  />
                  <circle
                    cx={x}
                    cy={getY(blocked[idx])}
                    r={hoveredIdx === idx ? 4.5 : 3}
                    fill="#f43f5e"
                    className="transition-all"
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredIdx !== null && (
            <div
              className="absolute top-2 pointer-events-none bg-[#080d19]/95 border border-slate-700 shadow-xl rounded-xl p-2.5 text-xs text-white z-20 space-y-1"
              style={{
                left: `calc(${(hoveredIdx / (labels.length - 1)) * 75}% + 30px)`,
              }}
            >
              <div className="font-semibold text-slate-300 pb-1 border-b border-slate-800 text-[11px]">
                {labels[hoveredIdx]}
              </div>
              <div className="flex items-center justify-between gap-4 text-blue-400">
                <span>Total:</span>
                <span className="font-mono font-bold">
                  {total[hoveredIdx].toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-emerald-400">
                <span>Allowed:</span>
                <span className="font-mono font-bold">
                  {allowed[hoveredIdx].toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-amber-400">
                <span>Warned:</span>
                <span className="font-mono font-bold">
                  {warned[hoveredIdx].toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-rose-400">
                <span>Blocked:</span>
                <span className="font-mono font-bold">
                  {blocked[hoveredIdx].toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
