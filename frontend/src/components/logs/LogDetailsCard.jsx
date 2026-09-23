'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  X,
  Copy,
  Check,
  BarChart2,
  ShieldPlus,
  AlertCircle,
  FileText,
} from 'lucide-react';

export function LogDetailsCard({ log, onClose }) {
  const [copied, setCopied] = useState(false);
  const [allowlisted, setAllowlisted] = useState(false);

  if (!log) {
    return (
      <Card className="p-6 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col items-center justify-center text-center text-slate-500">
        <FileText className="w-8 h-8 mb-2 text-slate-600" />
        <p className="text-xs">Select any log from the table to view full forensic analysis.</p>
      </Card>
    );
  }

  const isBlocked = log.result === 'Blocked';
  const isWarned = log.result === 'Warned';

  const handleCopy = () => {
    navigator.clipboard.writeText(log.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAllowlist = () => {
    setAllowlisted(true);
    setTimeout(() => setAllowlisted(false), 2500);
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-semibold text-white">Log Details</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 mb-4 ${
            isBlocked
              ? 'bg-rose-950/20 border-rose-500/30'
              : isWarned
              ? 'bg-amber-950/20 border-amber-500/30'
              : 'bg-emerald-950/20 border-emerald-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isBlocked
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : isWarned
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {isBlocked ? (
                <ShieldAlert className="w-5 h-5" />
              ) : isWarned ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div
                className={`text-base font-bold ${
                  isBlocked
                    ? 'text-rose-400'
                    : isWarned
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {log.result}
              </div>
              <div className="text-[11px] text-slate-300">
                {isBlocked
                  ? 'Malicious prompt detected'
                  : isWarned
                  ? 'Suspicious content flagged'
                  : 'Safe prompt processed'}
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] font-mono text-slate-400">
            <div>{log.time.split(',')[0]}</div>
            <div>{log.time.split(',')[1]}</div>
          </div>
        </div>

        {/* Prompt Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-300">Prompt</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-white transition-colors"
              title="Copy prompt"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed max-h-24 overflow-y-auto">
            {log.prompt}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4 text-xs">
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Type</span>
            <span className="text-slate-200 font-medium">{log.type}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Source</span>
            <span className="text-slate-200 font-medium">{log.source}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 truncate">
            <span className="text-[10px] text-slate-400 block">Category</span>
            <span className="text-rose-400 font-semibold truncate block text-[11px]">
              {log.category}
            </span>
          </div>
        </div>

        {/* Risk Score & Model Confidence */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Risk Score</span>
              <span className="font-mono font-bold text-rose-400">
                {log.riskScore} <span className="text-slate-500 font-normal">/ 100</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isBlocked ? 'bg-rose-500' : isWarned ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(log.riskScore, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
            <span className="text-slate-400">Model Confidence</span>
            <span className="font-mono font-bold text-white">
              {log.modelConfidence}
            </span>
          </div>
        </div>

        {/* Matched Rules */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-300 block mb-1.5">
            Matched Rules
          </span>
          {log.matchedRules && log.matchedRules.length > 0 ? (
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              {log.matchedRules.map((r, i) => (
                <li key={i} className="text-[11px]">
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[11px] text-slate-500 italic">No rules matched</div>
          )}
        </div>

        {/* Suggested Action Box */}
        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-2.5 mb-4">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-300 leading-relaxed">
            <span className="font-semibold text-rose-300 block">Suggested Action</span>
            {log.suggestedAction}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
          <span>View Full Analysis</span>
        </button>

        <button
          type="button"
          onClick={handleAllowlist}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          {allowlisted ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ShieldPlus className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>{allowlisted ? 'Allowlisted' : 'Add to Allowlist'}</span>
        </button>
      </div>
    </Card>
  );
}
