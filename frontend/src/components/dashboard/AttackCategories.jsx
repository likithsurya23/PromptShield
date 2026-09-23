'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';

export function AttackCategories({ categories = [], onViewAll }) {
  const maxCount = Math.max(...categories.map((c) => c.count), 500);

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Attack Categories</h3>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2.5 my-auto">
        {categories.map((cat) => {
          const widthPercent = (cat.count / maxCount) * 100;

          return (
            <div key={cat.name} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 w-44 truncate text-[11px] font-medium">
                {cat.name}
              </span>

              <div className="flex-1 bg-slate-800/80 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>

              <span className="text-slate-300 font-mono text-[11px] w-8 text-right font-medium">
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
