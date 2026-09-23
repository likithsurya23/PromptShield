'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2 } from 'lucide-react';

export function SystemStatus({ status }) {
  if (!status) return null;

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">System Status</h3>
      </div>

      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-300">
            {status.allOperational ? 'All Systems Operational' : 'Partial Degradation'}
          </span>
        </div>

        <span className="text-xs font-semibold text-emerald-400 font-mono">
          {status.uptime}
        </span>
      </div>

      <div className="space-y-2 my-auto">
        {(status.services || []).map((svc) => (
          <div
            key={svc.name}
            className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-none"
          >
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{svc.name}</span>
            </div>

            <span className="text-emerald-400 text-[11px] font-medium font-mono">
              {svc.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
