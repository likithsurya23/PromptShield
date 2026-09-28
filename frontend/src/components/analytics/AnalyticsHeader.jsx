'use client';

import React, { useState } from 'react';
import { BarChart3, Calendar, ChevronDown, RefreshCw } from 'lucide-react';

export function AnalyticsHeader({
  selectedRange = 'All Time (Live Telemetry)',
  onRangeChange,
  onRefresh,
  loading = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ranges = [
    'All Time (Live Telemetry)',
    'Past 24 Hours',
    'Past 7 Days',
    'Past 30 Days',
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Title & Subtitle */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              Threat Analytics & Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry, model benchmark indicators, and attack vector trends from live audit evaluations.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        )}

        {/* Date Range Picker Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#080d19] border border-slate-800 shadow-2xl py-1 z-50 text-xs">
              {ranges.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    if (onRangeChange) onRangeChange(range);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer ${
                    range === selectedRange
                      ? 'bg-blue-600/20 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
