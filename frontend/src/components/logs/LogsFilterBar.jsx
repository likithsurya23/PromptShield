'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Calendar, ChevronDown, Search, RotateCcw } from 'lucide-react';

export function LogsFilterBar({
  filters,
  setFilters,
  onApply,
  onReset,
}) {
  const statuses = ['All', 'Blocked', 'Warned', 'Allowed'];
  const categories = [
    'All',
    'Direct Injection',
    'Indirect Injection',
    'Jailbreak',
    'Obfuscation',
    'Role Manipulation',
    'System Extraction',
    'Instruction Override',
    'Benign',
  ];
  const sources = ['All', 'Scanner', 'Playground', 'RAG'];

  return (
    <Card className="p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-xl mb-5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Selectors Group */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          {/* Date Range */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Date Range
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between bg-[#080d19] border border-slate-800 rounded-xl py-2 px-2.5 text-xs text-slate-200"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{filters.dateRange}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Status
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-2.5 pr-7 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="bg-[#0f172a]">
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Category
            </label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-2.5 pr-7 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer truncate"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#0f172a]">
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Source
            </label>
            <div className="relative">
              <select
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-2.5 pr-7 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                {sources.map((src) => (
                  <option key={src} value={src} className="bg-[#0f172a]">
                    {src}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search & Actions Group */}
        <div className="flex flex-col sm:flex-row items-end gap-2.5 w-full lg:w-auto">
          {/* Keyword Search Input */}
          <div className="space-y-1 w-full sm:w-64">
            <div className="relative mt-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search prompts, results, or keywords..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onApply}
              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
