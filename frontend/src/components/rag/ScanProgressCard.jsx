'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Circle } from 'lucide-react';

export function ScanProgressCard({ progress }) {
  if (!progress) return null;

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-white">
            3. Scan Progress
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{progress.status} {progress.percent}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        {/* 6-Step Timeline */}
        <div className="space-y-3">
          {progress.steps.map((step) => (
            <div key={step.id} className="flex items-start justify-between gap-2 text-xs">
              <div className="flex items-start gap-2.5">
                {step.status === 'completed' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {step.status === 'in-progress' && (
                  <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                )}
                {step.status === 'pending' && (
                  <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                )}

                <div>
                  <span
                    className={`font-medium block leading-tight ${
                      step.status === 'pending' ? 'text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.detail && (
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                      {step.detail}
                    </span>
                  )}
                </div>
              </div>

              {step.time && (
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {step.time}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
