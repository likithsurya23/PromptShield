'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, ArrowRight } from 'lucide-react';

export function ScheduledReportsCard({
  scheduledList,
  onToggleSchedule,
}) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Scheduled Reports
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {(!scheduledList || scheduledList.length === 0) ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No scheduled reports configured.
            </div>
          ) : (
            scheduledList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-tight leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {item.schedule}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => onToggleSchedule(item.id)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative ${
                  item.enabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
                aria-label={`Toggle ${item.name}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    item.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )))}
        </div>
      </div>
    </Card>
  );
}
