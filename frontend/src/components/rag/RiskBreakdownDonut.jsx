'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function RiskBreakdownDonut({ riskScore = 72.4, breakdown = [] }) {
  // SVG Multi-color ring calculations
  const radius = 46;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  // Percentages: High (16.7%), Medium (27.8%), Low (55.5%)
  const highDash = (16.7 / 100) * circumference;
  const medDash = (27.8 / 100) * circumference;
  const lowDash = (55.5 / 100) * circumference;

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
              {/* Medium Risk (Amber) */}
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
              {/* Low Risk (Green) */}
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
