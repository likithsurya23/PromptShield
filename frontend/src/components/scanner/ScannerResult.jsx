'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Skull } from 'lucide-react';

export function ScannerResult({ result, loading, error }) {
  if (loading) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 h-full border-[#2c1622] bg-[#120a14]/85 shadow-xl min-h-[360px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#1a0e1c] border border-rose-500/30 flex items-center justify-center mb-4">
          <RefreshCw className="w-6 h-6 text-[#f57b83] animate-spin" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">Scanning in Progress...</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          DistilBERT V2 PyTorch model and pattern matching engine are analyzing tokens for injection and extraction vectors.
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 h-full border-rose-900/40 bg-[#1e0a14]/50 shadow-xl min-h-[360px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">Inference Service Unavailable</h3>
        <p className="text-xs text-rose-300/80 max-w-sm mb-3">{error}</p>
        <p className="text-[11px] text-slate-400">
          Ensure FastAPI backend is running.
        </p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 h-full border-[#2c1622] bg-[#120a14]/85 shadow-xl min-h-[360px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#1a0e1c] border border-rose-500/30 flex items-center justify-center mb-4 text-[#f57b83]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">Ready for Prompt Scan</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Type or paste a prompt in the input box and click <span className="text-[#f57b83] font-medium">Scan Prompt</span> to run live ML injection analysis.
        </p>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-[#140c17] px-3 py-1.5 rounded-lg border border-[#2c1622]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Security Engine Online (DistilBERT V2)</span>
        </div>
      </Card>
    );
  }

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
    <Card className="flex flex-col justify-between p-4 sm:p-6 h-full border-[#2c1622] bg-[#120a14]/85 shadow-xl">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
          <h2 className="text-sm font-semibold text-white">2. Scan Result</h2>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Scanned at {result.timestamp}</span>
          </div>
        </div>

        {/* Big Status Banner */}
        <div className={`p-3.5 sm:p-4 rounded-xl border ${banner.bg} flex items-start gap-3 sm:gap-4 mb-4 transition-all`}>
          <div className={`p-2 sm:p-2.5 rounded-xl border ${banner.iconBg} shrink-0 mt-0.5`}>
            <BannerIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className={`text-lg sm:text-xl font-bold tracking-tight ${banner.titleColor}`}>
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
          <div className="p-3 rounded-xl bg-[#140c17] border border-[#2c1622] flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Risk Score</span>
            <div className="my-1">
              <span className="text-lg font-bold text-white font-mono">
                {result.risk_score}
              </span>
              <span className="text-[11px] text-slate-400 font-mono"> / 100</span>
            </div>
            <div className="w-full bg-[#1e0a14] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isBlock ? 'bg-[#f43f5e]' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(result.risk_score, 100)}%` }}
              />
            </div>
          </div>

          {/* 2. ML Confidence */}
          <div className="p-3 rounded-xl bg-[#140c17] border border-[#2c1622] flex flex-col justify-between">
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
          <div className="p-3 rounded-xl bg-[#140c17] border border-[#2c1622] flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Action</span>
            <div className="my-auto py-1">
              <span
                className={`inline-block text-center font-bold text-xs px-3 py-1.5 rounded-lg w-full tracking-wider ${
                  isBlock
                    ? 'bg-[#f43f5e] text-white shadow-sm shadow-rose-900/40'
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
          <div className="p-3 rounded-xl bg-[#140c17] border border-[#2c1622] flex flex-col justify-between">
            <span className="text-[11px] text-slate-400">Prediction</span>
            <div className="my-auto py-1 flex items-center gap-1.5">
              {result.prediction === 'malicious' ? (
                <>
                  <Skull className="w-4 h-4 text-[#f43f5e] shrink-0" />
                  <span className="text-xs font-bold text-[#f57b83]">Malicious</span>
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
          <div className="p-3.5 rounded-xl bg-[#140c17] border border-[#2c1622]">
            <span className="text-xs font-semibold text-white block mb-2.5">
              Attack Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {result.attack_categories && result.attack_categories.length > 0 ? (
                result.attack_categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#240e1e] text-[#fecdd3] border border-rose-500/30"
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
          <div className="p-3.5 rounded-xl bg-[#140c17] border border-[#2c1622]">
            <span className="text-xs font-semibold text-white block mb-2">
              Matched Rules
            </span>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              {result.matched_rules && result.matched_rules.length > 0 ? (
                result.matched_rules.map((rule, i) => (
                  <li key={i} className="text-slate-300 text-[11px] break-words">
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
