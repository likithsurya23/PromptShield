'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, RefreshCw } from 'lucide-react';

export function DashboardHeader({ timeRange, onTimeRangeChange, onRefresh, loading = false }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const options = [
    'All Time (Live)',
    'Past 24 Hours',
    'Past 7 Days',
    'Past 30 Days',
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security Dashboard</h1>
      </div>

      <div className="flex items-center gap-2.5">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-xs font-semibold text-slate-200 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh dashboard telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#f57b83] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-xs font-medium text-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#130a15] border border-[#2c1622] shadow-xl shadow-black/80 py-1.5 z-20">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onTimeRangeChange?.(opt);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                    opt === timeRange
                      ? 'bg-[#6a1a24]/30 text-[#f57b83] font-medium'
                      : 'text-slate-300 hover:bg-[#1f0f1f]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
