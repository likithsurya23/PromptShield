'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

export function ReportsMetricCards({ metrics }) {
  const cards = [
    {
      title: 'Total Reports',
      value: metrics.totalReports,
      change: metrics.totalReportsChange,
      changeColor: 'text-emerald-400',
      icon: FileText,
      iconBg: 'bg-blue-600/15 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Scheduled Reports',
      value: metrics.scheduledReports,
      change: metrics.scheduledReportsChange,
      changeColor: 'text-emerald-400',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Threat Reports',
      value: metrics.threatReports,
      change: metrics.threatReportsChange,
      changeColor: 'text-rose-400',
      icon: AlertTriangle,
      iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    },
    {
      title: 'Usage Reports',
      value: metrics.usageReports,
      change: metrics.usageReportsChange,
      changeColor: 'text-emerald-400',
      icon: Users,
      iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
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
              <p className="text-xs text-slate-400 font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1 font-mono">
                {card.value}
              </h3>
              <p className={`text-xs mt-0.5 ${card.changeColor}`}>
                {card.change}
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
