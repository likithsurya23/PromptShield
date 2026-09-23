'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export function DashboardHeader({ timeRange, onTimeRangeChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const options = [
    'Sep 15, 2026 - Sep 21, 2026',
    'Sep 08, 2026 - Sep 14, 2026',
    'Sep 01, 2026 - Sep 30, 2026',
    'Custom Range...',
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Overview of your AI security activity and threat landscape.
        </p>
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 shadow-sm transition-all"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f172a] border border-slate-700/80 shadow-xl shadow-black/80 py-1.5 z-20">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onTimeRangeChange?.(opt);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                  opt === timeRange
                    ? 'bg-blue-600/20 text-blue-400 font-medium'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
