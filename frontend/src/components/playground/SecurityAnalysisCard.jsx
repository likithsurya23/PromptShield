'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { RotateCw, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function SecurityAnalysisCard({
  scanResult,
  pipeline = [],
  onRescan,
  loading,
}) {
  if (!scanResult) return null;

  const isBlocked = scanResult.action === 'BLOCK';

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-semibold text-white">
            4. Security Analysis
          </h2>
          <button
            type="button"
            onClick={onRescan}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Rescan</span>
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 mb-4 transition-all ${
            isBlocked
              ? 'bg-rose-950/20 border-rose-500/30'
              : 'bg-emerald-950/20 border-emerald-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isBlocked
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {isBlocked ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <div
                className={`text-lg font-bold tracking-tight ${
                  isBlocked ? 'text-rose-500' : 'text-emerald-400'
                }`}
              >
                {scanResult.action}
              </div>
              <div className="text-[11px] text-slate-400">
                {isBlocked
                  ? 'Malicious prompt intercepted. Unsafe to send.'
                  : 'This prompt is safe to send to the LLM.'}
              </div>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
        </div>

        {/* 3 Metric Tiles */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {/* Risk Score */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Risk Score</span>
            <div className="my-1">
              <span className="text-base font-bold text-white font-mono">
                {scanResult.risk_score}
              </span>
              <span className="text-[10px] text-slate-400 font-mono"> / 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isBlocked ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(scanResult.risk_score, 100)}%` }}
              />
            </div>
          </div>

          {/* ML Confidence */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">ML Confidence</span>
            <div className="text-base font-bold text-white font-mono my-1">
              {scanResult.ml_confidence}%
            </div>
            <span className="text-[9px] text-slate-500 block">DistilBERT V2</span>
          </div>

          {/* Prediction */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Prediction</span>
            <div
              className={`text-base font-bold my-1 ${
                isBlocked ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isBlocked ? 'Malicious' : 'Benign'}
            </div>
            <span className="text-[9px] text-slate-500 block">Class result</span>
          </div>
        </div>

        {/* Attack Categories & Matched Rules */}
        <div className="space-y-3 mb-5">
          <div>
            <span className="text-xs font-semibold text-white block mb-1.5">
              Attack Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {scanResult.attack_categories && scanResult.attack_categories.length > 0 ? (
                scanResult.attack_categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  None detected
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-white block mb-1.5">
              Matched Rules
            </span>
            {scanResult.matched_rules && scanResult.matched_rules.length > 0 ? (
              <ul className="space-y-1 text-xs text-rose-300 list-disc list-inside">
                {scanResult.matched_rules.map((rule, i) => (
                  <li key={i} className="text-[11px]">
                    {rule}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>No harmful patterns detected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Pipeline Checklist */}
      <div className="pt-4 border-t border-slate-800/80">
        <span className="text-xs font-semibold text-white block mb-3">
          Security Pipeline
        </span>
        <div className="space-y-2.5">
          {pipeline.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-none"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    step.status === 'Failed' || step.status === 'Flagged'
                      ? 'text-rose-500'
                      : step.status === 'Halted'
                      ? 'text-slate-600'
                      : 'text-emerald-400'
                  }`}
                />
                <div>
                  <span className="text-slate-200 font-medium block leading-tight">
                    {step.name}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    {step.desc}
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-mono font-semibold ${step.color}`}
              >
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
