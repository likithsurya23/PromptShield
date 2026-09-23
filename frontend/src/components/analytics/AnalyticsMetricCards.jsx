'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export function AnalyticsMetricCards({ metrics }) {
  const cards = [
    {
      title: 'Total Scans',
      value: metrics.totalScans,
      subtitle: metrics.totalScansChange,
      subtitleColor: 'text-emerald-400 font-medium',
      icon: FileText,
      iconBg: 'bg-blue-600/10 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Allowed',
      value: metrics.allowed,
      subtitle: metrics.allowedPercentage,
      subtitleColor: 'text-emerald-400 font-medium',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Warned',
      value: metrics.warned,
      subtitle: metrics.warnedPercentage,
      subtitleColor: 'text-amber-400 font-medium',
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Blocked',
      value: metrics.blocked,
      subtitle: metrics.blockedPercentage,
      subtitleColor: 'text-rose-400 font-medium',
      icon: ShieldAlert,
      iconBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="p-4 border-slate-800/80 bg-[#0c1222]/80 shadow-lg flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1 font-mono">
                {card.value}
              </h3>
              <p className={`text-xs mt-0.5 ${card.subtitleColor}`}>
                {card.subtitle}
              </p>
            </div>

            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
