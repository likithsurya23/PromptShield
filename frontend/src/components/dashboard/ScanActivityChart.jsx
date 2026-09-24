'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ChevronDown } from 'lucide-react';

export function ScanActivityChart({ data = [] }) {
  const [timeframe] = useState('Last 7 Days');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const width = 500;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxY = 400;

  const getY = (val) => {
    const num = Number(val) || 0;
    return padding.top + chartHeight - (num / maxY) * chartHeight;
  };

  const getX = (index) => {
    if (!data || data.length <= 1) {
      return padding.left + chartWidth / 2;
    }
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const generatePath = (key) => {
    if (!data || !data.length) return '';
    if (data.length === 1) {
      const x = getX(0);
      const y = getY(data[0][key]);
      return `M ${x - 5},${y} L ${x + 5},${y}`;
    }
    return data.reduce((acc, pt, i) => {
      const x = getX(i);
      const y = getY(pt[key]);
      return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  };

  const allowedPath = generatePath('allowed');
  const warnedPath = generatePath('warned');
  const blockedPath = generatePath('blocked');

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Scan Activity</h3>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Allowed
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Warned
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Blocked
            </span>
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-lg">
              <span>{timeframe}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Multi-series Line Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
          preserveAspectRatio="none"
        >
          {[0, 100, 200, 300, 400].map((val) => {
            const y = getY(val);
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
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-500 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          <path
            d={allowedPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={warnedPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={blockedPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((pt, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={pt.date}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="rgba(148, 163, 184, 0.3)"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={x}
                  cy={getY(pt.allowed)}
                  r={isHovered ? 4.5 : 3}
                  fill="#10B981"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                <circle
                  cx={x}
                  cy={getY(pt.warned)}
                  r={isHovered ? 4.5 : 3}
                  fill="#F59E0B"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                <circle
                  cx={x}
                  cy={getY(pt.blocked)}
                  r={isHovered ? 4.5 : 3}
                  fill="#EF4444"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />

                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-sans"
                >
                  {pt.date}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute top-2 bg-slate-900/95 border border-slate-700/80 rounded-lg p-2 text-xs shadow-xl pointer-events-none z-10 transition-all"
            style={{
              left: `${Math.min(
                Math.max(
                  data.length > 1
                    ? (hoveredIndex / (data.length - 1)) * 100
                    : 50,
                  15
                ),
                80
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-white mb-1">
              {data[hoveredIndex].date}
            </div>
            <div className="flex flex-col gap-0.5 text-[11px]">
              <span className="text-emerald-400">
                Allowed: {data[hoveredIndex].allowed}
              </span>
              <span className="text-amber-400">
                Warned: {data[hoveredIndex].warned}
              </span>
              <span className="text-rose-400">
                Blocked: {data[hoveredIndex].blocked}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
