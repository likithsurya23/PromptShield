'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { FileText, ListOrdered, BarChart2, ArrowRight } from 'lucide-react';

export function AnalyticsQuickActionsCard({ onGenerateReport, onCompareModels }) {
  const actions = [
    {
      title: 'Generate Report',
      description: 'Download detailed analytics report',
      icon: FileText,
      onClick: onGenerateReport,
      href: null,
    },
    {
      title: 'View Security Logs',
      description: 'Analyze individual scan results',
      icon: ListOrdered,
      onClick: null,
      href: '/security-logs',
    },
    {
      title: 'Compare Models',
      description: 'View model performance metrics',
      icon: BarChart2,
      onClick: onCompareModels,
      href: null,
    },
  ];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight mb-4">
          Quick Actions
        </h2>

        <div className="space-y-3">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            const content = (
              <div className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 hover:border-blue-500/50 hover:bg-[#0f172a] transition-all group cursor-pointer text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            );

            if (act.href) {
              return (
                <Link key={idx} href={act.href} className="block">
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={act.onClick}
                className="w-full block"
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
