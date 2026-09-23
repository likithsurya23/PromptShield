'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Shield, ChevronDown } from 'lucide-react';

export function SecurityConfigurationCard({
  security,
  onSecurityChange,
  onSaveSecurity,
}) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">
          Security Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-5">
          Control how PromptShield detects and handles malicious prompts.
        </p>

        <div className="space-y-4">
          {/* Detection Mode */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 block">
              Detection Mode
            </label>
            <div className="relative">
              <select
                value={security.detectionMode}
                onChange={(e) => onSecurityChange('detectionMode', e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="Hybrid (ML + Rules)">Hybrid (ML + Rules)</option>
                <option value="ML Only (DistilBERT)">ML Only (DistilBERT)</option>
                <option value="Rules Only (Signatures)">Rules Only (Signatures)</option>
                <option value="Strict Paranoia Mode">Strict Paranoia Mode</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Toggle 1: ML Detection */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80">
            <div>
              <h4 className="text-xs font-semibold text-white tracking-tight">
                ML Detection (DistilBERT)
              </h4>
              <p className="text-[11px] text-slate-400">
                Use AI model to detect prompt injection attempts
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSecurityChange('mlDetection', !security.mlDetection)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                security.mlDetection ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                  security.mlDetection ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Rule-based Detection */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80">
            <div>
              <h4 className="text-xs font-semibold text-white tracking-tight">
                Rule-based Detection
              </h4>
              <p className="text-[11px] text-slate-400">
                Use predefined security rules and patterns
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSecurityChange('ruleDetection', !security.ruleDetection)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                security.ruleDetection ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                  security.ruleDetection ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Auto-block High Risk */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80">
            <div>
              <h4 className="text-xs font-semibold text-white tracking-tight">
                Auto-block High Risk Prompts
              </h4>
              <p className="text-[11px] text-slate-400">
                Automatically block prompts with high risk score
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onSecurityChange('autoBlockHighRisk', !security.autoBlockHighRisk)
              }
              className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                security.autoBlockHighRisk ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                  security.autoBlockHighRisk ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Risk Score Thresholds Visual Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 mb-1.5">
              <span>Risk Score Thresholds</span>
            </div>

            {/* Segmented Gradient Bar */}
            <div className="relative w-full h-3 rounded-full overflow-hidden flex mb-2 shadow-inner">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${security.allowThreshold}%` }}
                title="Allow Zone"
              />
              <div
                className="bg-amber-400 h-full transition-all"
                style={{
                  width: `${security.warnThreshold - security.allowThreshold}%`,
                }}
                title="Warn Zone"
              />
              <div
                className="bg-rose-500 h-full transition-all"
                style={{ width: `${100 - security.warnThreshold}%` }}
                title="Block Zone"
              />
            </div>

            {/* Threshold Number markers */}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 mb-4">
              <span>0 (Allow)</span>
              <span className="text-emerald-400 font-bold">{security.allowThreshold}</span>
              <span className="text-amber-400 font-bold">{security.warnThreshold}</span>
              <span className="text-rose-400 font-bold">{security.blockThreshold}</span>
              <span>100 (Block)</span>
            </div>

            {/* Numeric Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  Allow Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={security.allowThreshold}
                  onChange={(e) =>
                    onSecurityChange('allowThreshold', Number(e.target.value))
                  }
                  className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs text-white text-center font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  Warn Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={security.warnThreshold}
                  onChange={(e) =>
                    onSecurityChange('warnThreshold', Number(e.target.value))
                  }
                  className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs text-white text-center font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  Block Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={security.blockThreshold}
                  onChange={(e) =>
                    onSecurityChange('blockThreshold', Number(e.target.value))
                  }
                  className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs text-white text-center font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Security Settings Button */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onSaveSecurity}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Save Security Settings</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
