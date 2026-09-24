'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export function ApiUsageChartCard({ seriesData }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!seriesData || !seriesData.dates || seriesData.dates.length === 0) {
    return (
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-center items-center text-center h-full min-h-[220px]">
        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-2">
          <span className="font-mono text-xs">API</span>
        </div>
        <h3 className="text-xs font-semibold text-slate-300 mb-1">No API Usage Data</h3>
        <p className="text-[11px] text-slate-500 max-w-xs">
          Requests through PromptShield SDK or proxy will display provider volume and throughput here.
        </p>
      </Card>
    );
  }

  const { dates, openai, anthropic, gemini, huggingface } = seriesData;

  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 8000;

  const getY = (val) => {
    return height - paddingBottom - (val / maxY) * chartHeight;
  };

  const getX = (idx) => {
    if (!dates || dates.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (idx / (dates.length - 1)) * chartWidth;
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

  const yTicks = [
    { label: '8K', val: 8000 },
    { label: '6K', val: 6000 },
    { label: '4K', val: 4000 },
    { label: '2K', val: 2000 },
    { label: '0', val: 0 },
  ];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-white tracking-tight">
            API Usage (Last 30 Days)
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>OpenAI</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Anthropic</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Gemini</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>Hugging Face</span>
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
          >
            {/* Horizontal Grid */}
            {yTicks.map((tick) => {
              const y = getY(tick.val);
              return (
                <g key={tick.label}>
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
                    {tick.label}
                  </text>
                </g>
              );
            })}

            {/* X Labels */}
            {dates.map((d, idx) => {
              const x = getX(idx);
              return (
                <text
                  key={d}
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {d}
                </text>
              );
            })}

            {/* OpenAI (Emerald) */}
            <path
              d={buildPath(openai)}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Gemini (Blue) */}
            <path
              d={buildPath(gemini)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Anthropic (Purple) */}
            <path
              d={buildPath(anthropic)}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Hugging Face (Yellow) */}
            <path
              d={buildPath(huggingface)}
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Dots */}
            {dates.map((_, idx) => {
              const x = getX(idx);
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <circle cx={x} cy={getY(openai[idx])} r={3} fill="#10b981" />
                  <circle cx={x} cy={getY(gemini[idx])} r={3} fill="#3b82f6" />
                  <circle cx={x} cy={getY(anthropic[idx])} r={3} fill="#a855f7" />
                  <circle cx={x} cy={getY(huggingface[idx])} r={3} fill="#eab308" />
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredIdx !== null && (
            <div
              className="absolute top-2 pointer-events-none bg-[#080d19]/95 border border-slate-700 shadow-xl rounded-xl p-2 text-xs text-white z-20 space-y-0.5"
              style={{
                left: `calc(${(hoveredIdx / (dates.length - 1)) * 80}% + 20px)`,
              }}
            >
              <div className="font-semibold text-slate-300 pb-0.5 border-b border-slate-800 text-[10px]">
                {dates[hoveredIdx]}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                OpenAI: {openai[hoveredIdx]}
              </div>
              <div className="text-[10px] text-blue-400 font-mono">
                Gemini: {gemini[hoveredIdx]}
              </div>
              <div className="text-[10px] text-purple-400 font-mono">
                Anthropic: {anthropic[hoveredIdx]}
              </div>
              <div className="text-[10px] text-yellow-400 font-mono">
                Hugging Face: {huggingface[hoveredIdx]}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
