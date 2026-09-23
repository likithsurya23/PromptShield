'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export function ScannerTabs({ result }) {
  const [activeTab, setActiveTab] = useState('detailed');

  if (!result) return null;

  const tabs = [
    { id: 'detailed', label: 'Detailed Analysis' },
    { id: 'risk', label: 'Risk Breakdown' },
    { id: 'rules', label: 'Matched Rules' },
    { id: 'model', label: 'Model Output' },
  ];

  const isBlock = result.action === 'BLOCK';

  return (
    <Card className="p-6 border-slate-800/80 bg-[#0c1222]/80 shadow-xl mb-5">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Detailed Analysis */}
      {activeTab === 'detailed' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Analysis Summary */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-white mb-1.5">
                Analysis Summary
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.analysis_summary}
              </p>
            </div>

            {/* Risk Callout Box */}
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3.5 ${
                isBlock
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}
            >
              <div
                className={`p-2 rounded-lg border shrink-0 ${
                  isBlock
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {isBlock ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <div
                  className={`text-xs font-bold ${
                    isBlock ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {result.risk_level}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {result.risk_advice}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Risk Score Breakdown */}
          <div className="md:col-span-6 space-y-3">
            <h3 className="text-xs font-semibold text-white mb-1">
              Risk Score Breakdown
            </h3>

            {(result.risk_breakdown || []).map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="text-slate-400 font-mono">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Risk Breakdown */}
      {activeTab === 'risk' && (
        <div className="space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed">
            Composite risk calculation utilizes weighted ensemble metrics from the fine-tuned DistilBERT transformer classifier combined with heuristic regex pattern weights.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Machine Learning Confidence</span>
              <span className="text-sm font-bold text-white font-mono">{result.ml_confidence}%</span>
              <p className="text-[11px] text-slate-400 mt-1">Direct token logits probability mapped via Softmax.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Rule Heuristic Penalty</span>
              <span className="text-sm font-bold text-white font-mono">
                {result.matched_rules?.length ? `${result.matched_rules.length * 25}%` : '0%'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Fixed penalty applied per high-severity rule breach.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Matched Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-300 mb-2">
            All rule patterns matched against the input prompt buffer:
          </div>
          {result.matched_rules?.length ? (
            result.matched_rules.map((rule, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-200">{rule}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Critical Signature
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic">No heuristic rules were triggered by this prompt.</div>
          )}
        </div>
      )}

      {/* Tab Content: Model Output */}
      {activeTab === 'model' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
            <pre>
              {JSON.stringify(
                {
                  prediction: result.prediction,
                  risk_score: result.risk_score,
                  action: result.action,
                  probabilities: {
                    malicious: result.malicious_prob,
                    benign: result.benign_prob,
                  },
                  matched_rules: result.matched_rules,
                  attack_categories: result.attack_categories,
                  timestamp: result.timestamp,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}
