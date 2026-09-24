'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function RiskBreakdownDonut({ riskScore = null, breakdown = [] }) {
  if (riskScore === null || !breakdown || breakdown.length === 0) {
    return (
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-center items-center text-center min-h-[220px]">
        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-2">
          <span className="font-mono text-sm">--</span>
        </div>
        <h3 className="text-xs font-semibold text-slate-300 mb-1">No Risk Breakdown</h3>
        <p className="text-[11px] text-slate-500 max-w-xs">
          Upload and scan a document to compute chunk-level risk distribution.
        </p>
      </Card>
    );
  }

  // SVG Multi-color ring calculations
  const radius = 46;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  // Extract counts or percentages
  const highItem = breakdown.find(b => b.label.toLowerCase().includes('high')) || { count: 0 };
  const medItem = breakdown.find(b => b.label.toLowerCase().includes('medium')) || { count: 0 };
  const lowItem = breakdown.find(b => b.label.toLowerCase().includes('low')) || { count: 0 };

  const total = (highItem.count + medItem.count + lowItem.count) || 1;
  const highPercent = (highItem.count / total) * 100;
  const medPercent = (medItem.count / total) * 100;
  const lowPercent = (lowItem.count / total) * 100;

  const highDash = (highPercent / 100) * circumference;
  const medDash = (medPercent / 100) * circumference;
  const lowDash = (lowPercent / 100) * circumference;

  const highOffset = 0;
  const medOffset = -highDash;
  const lowOffset = -(highDash + medDash);

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold text-white mb-2">Risk Breakdown</h2>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
          {/* Donut Gauge */}
          <div className="relative flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="rgba(30, 41, 59, 0.6)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* High Risk (Red) */}
              {highDash > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#EF4444"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${highDash} ${circumference}`}
                  strokeDashoffset={highOffset}
                  fill="transparent"
                  strokeLinecap="round"
                />
              )}
              {/* Medium Risk (Amber) */}
              {medDash > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#F59E0B"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${medDash} ${circumference}`}
                  strokeDashoffset={medOffset}
                  fill="transparent"
                  strokeLinecap="round"
                />
              )}
              {/* Low Risk (Green) */}
              {lowDash > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#10B981"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${lowDash} ${circumference}`}
                  strokeDashoffset={lowOffset}
                  fill="transparent"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-base font-bold text-white font-mono leading-tight">
                {riskScore}
              </span>
              <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                Risk Score
              </span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="space-y-2 text-xs w-full sm:w-auto">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300">{item.label}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {item.count} chunks ({item.percentage})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
