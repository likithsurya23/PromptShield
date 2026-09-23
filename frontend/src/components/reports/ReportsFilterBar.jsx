'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Calendar, ChevronDown, Sparkles } from 'lucide-react';

export function ReportsFilterBar({
  filters,
  onFilterChange,
  filterOptions,
  onGenerateQuickReport,
}) {
  return (
    <Card className="p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-xl mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        {/* 1. Report Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 block">
            Report Type
          </label>
          <div className="relative">
            <select
              value={filters.reportType}
              onChange={(e) => onFilterChange('reportType', e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer truncate"
            >
              {filterOptions.reportTypes.map((t) => (
                <option key={t} value={t} className="bg-[#0f172a]">
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 2. Date Range */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 block">
            Date Range
          </label>
          <div className="relative">
            <div className="flex items-center bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <select
                value={filters.dateRange}
                onChange={(e) => onFilterChange('dateRange', e.target.value)}
                className="w-full bg-transparent font-medium text-white focus:outline-none appearance-none cursor-pointer truncate pr-4"
              >
                {filterOptions.dateRanges.map((r) => (
                  <option key={r} value={r} className="bg-[#0f172a]">
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. Data Source */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 block">
            Data Source
          </label>
          <div className="relative">
            <select
              value={filters.dataSource}
              onChange={(e) => onFilterChange('dataSource', e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer truncate"
            >
              {filterOptions.dataSources.map((s) => (
                <option key={s} value={s} className="bg-[#0f172a]">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 4. Format */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 block">
            Format
          </label>
          <div className="relative">
            <select
              value={filters.format}
              onChange={(e) => onFilterChange('format', e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              {filterOptions.formats.map((f) => (
                <option key={f} value={f} className="bg-[#0f172a]">
                  {f}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 5. Action Button */}
        <div>
          <button
            type="button"
            onClick={onGenerateQuickReport}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
