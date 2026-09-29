'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function ActionDistribution({ data }) {
  if (!data) return null;

  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const allowedStroke = (data.allowed.percentage / 100) * circumference;
  const warnedStroke = (data.warned.percentage / 100) * circumference;
  const blockedStroke = (data.blocked.percentage / 100) * circumference;

  const allowedOffset = 0;
  const warnedOffset = -allowedStroke;
  const blockedOffset = -(allowedStroke + warnedStroke);

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-white">Action Distribution</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        <div className="relative flex items-center justify-center">
          <svg width="150" height="150" viewBox="0 0 150 150" className="transform -rotate-90">
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="rgba(30, 41, 59, 0.5)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${allowedStroke} ${circumference}`}
              strokeDashoffset={allowedOffset}
              fill="transparent"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#F59E0B"
              strokeWidth={strokeWidth}
              strokeDasharray={`${warnedStroke} ${circumference}`}
              strokeDashoffset={warnedOffset}
              fill="transparent"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#EF4444"
              strokeWidth={strokeWidth}
              strokeDasharray={`${blockedStroke} ${circumference}`}
              strokeDashoffset={blockedOffset}
              fill="transparent"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-base font-bold text-white tracking-tight leading-tight">
              {data.total.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
              Total
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2 sm:gap-3 text-xs w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-0 sm:mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium">Allowed</span>
              <span className="text-[11px] text-slate-400">
                {data.allowed.percentage}% <span className="hidden sm:inline">({data.allowed.count.toLocaleString()})</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-0 sm:mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium">Warned</span>
              <span className="text-[11px] text-slate-400">
                {data.warned.percentage}% <span className="hidden sm:inline">({data.warned.count.toLocaleString()})</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-0 sm:mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium">Blocked</span>
              <span className="text-[11px] text-slate-400">
                {data.blocked.percentage}% <span className="hidden sm:inline">({data.blocked.count.toLocaleString()})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
