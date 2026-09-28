'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';

export function ScanProgressCard({ progress }) {
  if (!progress) return null;

  const isCompleted = progress.percent === 100;
  const isScanning = progress.percent > 0 && progress.percent < 100;

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-white">
            3. Real-Time Scan Progress
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
            {isScanning && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
            {isCompleted && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
            <span className={isCompleted ? 'text-emerald-400' : (isScanning ? 'text-blue-400' : 'text-slate-400')}>
              {progress.percent}%
            </span>
          </div>
        </div>

        {/* Current Status Message */}
        <div className="flex items-center justify-between text-[11px] mb-2 text-slate-400">
          <span className="truncate">{progress.status || 'Ready for scan'}</span>
          {isScanning && (
            <span className="text-[10px] text-blue-400 animate-pulse font-mono">
              Live Pipeline
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-4 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400'
            }`}
            style={{ width: `${Math.max(2, progress.percent)}%` }}
          />
        </div>

        {/* 6-Stage Timeline */}
        <div className="space-y-2.5">
          {progress.steps.map((step) => {
            const isStepCompleted = step.status === 'completed';
            const isStepInProgress = step.status === 'in-progress';
            const isStepError = step.status === 'error';

            return (
              <div
                key={step.id}
                className={`p-2 rounded-xl transition-colors ${
                  isStepInProgress
                    ? 'bg-blue-600/10 border border-blue-500/25'
                    : isStepCompleted
                    ? 'bg-slate-900/40'
                    : 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2.5 min-w-0">
                    {isStepCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isStepInProgress && (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0 mt-0.5" />
                    )}
                    {isStepError && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    {!isStepCompleted && !isStepInProgress && !isStepError && (
                      <Circle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}

                    <div className="min-w-0">
                      <span
                        className={`font-semibold block text-xs leading-tight ${
                          isStepCompleted
                            ? 'text-slate-100'
                            : isStepInProgress
                            ? 'text-blue-300 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </span>
                      {step.detail && (
                        <span className="text-[10px] text-slate-400 block leading-tight mt-0.5 truncate">
                          {step.detail}
                        </span>
                      )}
                    </div>
                  </div>

                  {step.time && (
                    <span className="text-[10px] font-mono text-slate-500 shrink-0 pt-0.5">
                      {step.time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
