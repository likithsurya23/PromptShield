'use client';

import React, { useState } from 'react';
import { BarChart3, Calendar, ChevronDown } from 'lucide-react';

export function AnalyticsHeader({
  selectedRange = 'Sep 15, 2026 - Sep 21, 2026',
  onRangeChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ranges = [
    'Sep 15, 2026 - Sep 21, 2026',
    'Sep 01, 2026 - Sep 21, 2026',
    'Aug 21, 2026 - Sep 21, 2026',
    'Custom Range...',
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
              Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gain insights into prompt injection threats, detection performance, and system usage.
          </p>
        </div>
      </div>

      {/* Date Range Picker Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm"
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
                className={`w-full text-left px-3.5 py-2 transition-colors ${
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
  );
}
