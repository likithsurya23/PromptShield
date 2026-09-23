'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, Skull } from 'lucide-react';

export function ScannerResult({ result }) {
  if (!result) return null;

  const isBlock = result.action === 'BLOCK';
  const isWarn = result.action === 'WARN';

  const getStatusBanner = () => {
    if (isBlock) {
      return {
        bg: 'bg-rose-950/20 border-rose-500/30',
        iconBg: 'bg-rose-500/10 border-rose-500/30 text-rose-500',
        title: 'BLOCK',
        titleColor: 'text-rose-500',
        subtitle: 'Malicious prompt detected',
        desc: 'This prompt shows strong indicators of a prompt injection attack.',
        icon: ShieldAlert,
      };
    }
    if (isWarn) {
      return {
        bg: 'bg-amber-950/20 border-amber-500/30',
        iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
        title: 'WARN',
        titleColor: 'text-amber-400',
        subtitle: 'Suspicious prompt flagged',
        desc: 'Prompt exhibits subtle adversarial characteristics requiring review.',
        icon: AlertTriangle,
      };
    }
    return {
      bg: 'bg-emerald-950/20 border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
      title: 'ALLOW',
      titleColor: 'text-emerald-400',
      subtitle: 'Safe prompt analyzed',
      desc: 'No adversarial prompt injection patterns or jailbreak signatures detected.',
      icon: CheckCircle2,
    };
  };

  const banner = getStatusBanner();
  const BannerIcon = banner.icon;

  return (
    <Card className="flex flex-col justify-between p-6 h-full border-slate-800/80 bg-[#0c1222]/80 shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">2. Scan Result</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Scanned at {result.timestamp}</span>
          </div>
        </div>

        {/* Big Status Banner */}
        <div className={`p-4 rounded-xl border ${banner.bg} flex items-start gap-4 mb-4 transition-all`}>
          <div className={`p-2.5 rounded-xl border ${banner.iconBg} shrink-0 mt-0.5`}>
            <BannerIcon className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-xl font-bold tracking-tight ${banner.titleColor}`}>
              {banner.title}
            </div>
            <div className="text-xs font-semibold text-white mt-0.5">
              {banner.subtitle}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {banner.desc}
            </div>
          </div>
        </div>

        {/* 4 Metric Tiles in a Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* 1. Risk Score */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Risk Score</span>
            <div className="my-1">
              <span className="text-lg font-bold text-white font-mono">
                {result.risk_score}
              </span>
              <span className="text-[11px] text-slate-400 font-mono"> / 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isBlock ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(result.risk_score, 100)}%` }}
              />
            </div>
          </div>

          {/* 2. ML Confidence */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">ML Confidence</span>
            <div className="text-lg font-bold text-white font-mono my-1">
              {result.ml_confidence}%
            </div>
            <div className="text-[9px] text-slate-400 font-mono leading-tight">
              <div>Malicious: {result.malicious_prob}</div>
              <div>Benign: {result.benign_prob}</div>
            </div>
          </div>

          {/* 3. Action */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Action</span>
            <div className="my-auto py-1">
              <span
                className={`inline-block text-center font-bold text-xs px-3 py-1.5 rounded-lg w-full tracking-wider ${
                  isBlock
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-900/40'
                    : isWarn
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-900/40'
                    : 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-900/40'
                }`}
              >
                {result.action}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Enforcement rule</span>
          </div>

          {/* 4. Prediction */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Prediction</span>
            <div className="my-auto py-1 flex items-center gap-1.5">
              {result.prediction === 'malicious' ? (
                <>
                  <Skull className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs font-bold text-rose-400">Malicious</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-emerald-400">Benign</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Classifier output</span>
          </div>
        </div>

        {/* Attack Categories & Matched Rules Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Attack Categories */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-white block mb-2.5">
              Attack Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {result.attack_categories && result.attack_categories.length > 0 ? (
                result.attack_categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No attack categories detected</span>
              )}
            </div>
          </div>

          {/* Matched Rules */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-white block mb-2">
              Matched Rules
            </span>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              {result.matched_rules && result.matched_rules.length > 0 ? (
                result.matched_rules.map((rule, i) => (
                  <li key={i} className="text-slate-300 text-[11px] truncate">
                    {rule}
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-[11px] italic list-none">No rules triggered</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
