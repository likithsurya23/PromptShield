'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, ShieldAlert, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';

export function RecentActivity({ activities = [] }) {
  const getItemIcon = (type) => {
    switch (type) {
      case 'scan':
        return {
          icon: FileText,
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        };
      case 'malicious':
        return {
          icon: ShieldAlert,
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        };
      case 'safe':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        };
      case 'document':
        return {
          icon: FileCode,
          color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        };
      default:
        return {
          icon: FileText,
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        };
    }
  };

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-3.5 my-auto">
        {activities.map((item) => {
          const { icon: Icon, color } = getItemIcon(item.type);

          return (
            <div key={item.id} className="flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`p-1.5 rounded-lg border shrink-0 ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-medium truncate text-xs">
                    {item.title}
                  </span>
                  <span className="text-slate-400 text-[11px] truncate mt-0.5">
                    {item.detail}
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-slate-500 font-mono shrink-0 whitespace-nowrap mt-0.5">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
