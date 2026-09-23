'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Key, ShieldCheck, EyeOff, AlertTriangle } from 'lucide-react';

export function ApiKeysMetricCards({ metrics }) {
  const cards = [
    {
      title: 'Total API Keys',
      value: metrics.totalKeys,
      change: metrics.totalKeysChange,
      changeColor: 'text-emerald-400',
      icon: Key,
      iconBg: 'bg-blue-600/15 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Active Keys',
      value: metrics.activeKeys,
      change: metrics.activeKeysPercentage,
      changeColor: 'text-emerald-400',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Expired Keys',
      value: metrics.expiredKeys,
      change: metrics.expiredKeysPercentage,
      changeColor: 'text-rose-400',
      icon: EyeOff,
      iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    },
    {
      title: 'Revoked Keys',
      value: metrics.revokedKeys,
      change: metrics.revokedKeysPercentage,
      changeColor: 'text-slate-400',
      icon: AlertTriangle,
      iconBg: 'bg-slate-700/30 border-slate-700 text-slate-400',
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
