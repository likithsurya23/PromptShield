'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkline } from '@/components/ui/Sparkline';
import { FileText, ShieldAlert, AlertCircle, CheckCircle2, Gauge } from 'lucide-react';

export function MetricCards({ metrics }) {
  const getIcon = (type) => {
    switch (type) {
      case 'scans':
        return {
          icon: FileText,
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        };
      case 'blocked':
        return {
          icon: ShieldAlert,
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        };
      case 'allowed':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        };
      case 'risk':
        return {
          icon: Gauge,
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
        };
      default:
        return {
          icon: FileText,
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        };
    }
  };

  const getChangeColor = (color) => {
    switch (color) {
      case 'green':
        return 'text-emerald-400';
      case 'red':
        return 'text-rose-400';
      case 'amber':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {metrics.map((metric) => {
        const { icon: Icon, bg } = getIcon(metric.iconType);
        const changeTextColor = getChangeColor(metric.changeColor);

        return (
          <Card
            key={metric.id}
            className="p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all group"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg border ${bg} transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-400">{metric.title}</span>
              </div>

              <div className="text-2xl font-bold text-white tracking-tight my-1">
                {metric.value}
              </div>

              <div className={`text-[11px] font-medium ${changeTextColor}`}>
                {metric.change}
              </div>
            </div>

            <div className="mt-3 pt-1">
              <Sparkline
                data={metric.sparklineData}
                color={metric.sparklineColor}
                height={32}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
