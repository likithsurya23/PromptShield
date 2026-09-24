'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Shield, ChevronDown, RotateCcw } from 'lucide-react';

export function SecurityConfigurationCard({
  security,
  onSecurityChange,
  onSaveSecurity,
}) {
  const handleModeChange = (mode) => {
    if (mode === 'Hybrid (ML + Rules)') {
      onSecurityChange('detectionMode', mode);
      onSecurityChange('mlDetection', true);
      onSecurityChange('ruleDetection', true);
    } else if (mode === 'ML Only (DistilBERT)') {
      onSecurityChange('detectionMode', mode);
      onSecurityChange('mlDetection', true);
      onSecurityChange('ruleDetection', false);
    } else if (mode === 'Rules Only (Signatures)') {
      onSecurityChange('detectionMode', mode);
      onSecurityChange('mlDetection', false);
      onSecurityChange('ruleDetection', true);
    } else if (mode === 'Strict Paranoia Mode') {
      onSecurityChange('detectionMode', mode);
      onSecurityChange('mlDetection', true);
      onSecurityChange('ruleDetection', true);
      onSecurityChange('allowThreshold', 15);
      onSecurityChange('warnThreshold', 45);
      onSecurityChange('blockThreshold', 70);
    }
  };

  const applyPreset = (preset) => {
    if (preset === 'balanced') {
      onSecurityChange('detectionMode', 'Hybrid (ML + Rules)');
      onSecurityChange('mlDetection', true);
      onSecurityChange('ruleDetection', true);
      onSecurityChange('autoBlockHighRisk', true);
      onSecurityChange('allowThreshold', 30);
      onSecurityChange('warnThreshold', 70);
      onSecurityChange('blockThreshold', 90);
    } else if (preset === 'strict') {
      onSecurityChange('detectionMode', 'Strict Paranoia Mode');
      onSecurityChange('mlDetection', true);
      onSecurityChange('ruleDetection', true);
      onSecurityChange('autoBlockHighRisk', true);
      onSecurityChange('allowThreshold', 15);
      onSecurityChange('warnThreshold', 45);
      onSecurityChange('blockThreshold', 70);
    } else if (preset === 'permissive') {
      onSecurityChange('detectionMode', 'Hybrid (ML + Rules)');
      onSecurityChange('mlDetection', true);
      onSecurityChange('ruleDetection', true);
      onSecurityChange('autoBlockHighRisk', false);
      onSecurityChange('allowThreshold', 50);
      onSecurityChange('warnThreshold', 80);
      onSecurityChange('blockThreshold', 95);
    }
  };

  const handleThresholdChange = (key, val) => {
    let num = Math.max(0, Math.min(100, Number(val) || 0));
    onSecurityChange(key, num);
  };

  const allowWidth = Math.max(0, Math.min(100, security.allowThreshold));
  const warnWidth = Math.max(0, Math.min(100 - allowWidth, security.warnThreshold - allowWidth));
  const blockWidth = Math.max(0, 100 - allowWidth - warnWidth);

  return (
    <Card className="p-5 border-[#2c1622] bg-[#120a14]/85 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Security Configuration
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Engine Active
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">
          Control how PromptShield detects, scores, and mitigates prompt injection attacks.
        </p>

        {/* Quick Presets */}
        <div className="mb-4">
          <span className="text-[10px] font-medium text-slate-400 block mb-1.5 uppercase tracking-wider">
            Quick Security Presets
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => applyPreset('balanced')}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                security.detectionMode === 'Hybrid (ML + Rules)' && security.allowThreshold === 30
                  ? 'bg-rose-600/15 border-rose-500/50 text-[#f57b83] font-semibold'
                  : 'bg-[#140c17] border-[#2c1622] text-slate-400 hover:text-white hover:border-rose-500/40'
              }`}
            >
              <span className="text-[11px] block leading-none">Balanced</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">30 / 70 / 90</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('strict')}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                security.detectionMode === 'Strict Paranoia Mode' || security.allowThreshold === 15
                  ? 'bg-rose-600/15 border-rose-500/50 text-rose-400 font-semibold'
                  : 'bg-[#080d19] border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-[11px] block leading-none">Strict</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">15 / 45 / 70</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('permissive')}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                security.allowThreshold === 50
                  ? 'bg-amber-600/15 border-amber-500/50 text-amber-400 font-semibold'
                  : 'bg-[#080d19] border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-[11px] block leading-none">Permissive</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">50 / 80 / 95</span>
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Detection Mode */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 block">
              Detection Mode
            </label>
            <div className="relative">
              <select
                value={security.detectionMode}
                onChange={(e) => handleModeChange(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer transition-colors"
              >
                <option value="Hybrid (ML + Rules)">Hybrid (ML + Rules) — Recommended</option>
                <option value="ML Only (DistilBERT)">ML Only (DistilBERT V2)</option>
                <option value="Rules Only (Signatures)">Rules Only (Signatures)</option>
                <option value="Strict Paranoia Mode">Strict Paranoia Mode (Low Tolerance)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Toggle 1: ML Detection */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80">
            <div>
              <h4 className="text-xs font-semibold text-white tracking-tight">
                ML Detection (DistilBERT V2)
              </h4>
              <p className="text-[11px] text-slate-400">
                Use fine-tuned deep learning classifier for injection scoring
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextVal = !security.mlDetection;
                onSecurityChange('mlDetection', nextVal);
                if (!nextVal && security.ruleDetection) {
                  onSecurityChange('detectionMode', 'Rules Only (Signatures)');
                } else if (nextVal && !security.ruleDetection) {
                  onSecurityChange('detectionMode', 'ML Only (DistilBERT)');
                } else if (nextVal && security.ruleDetection) {
                  onSecurityChange('detectionMode', 'Hybrid (ML + Rules)');
                }
              }}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer ${
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
                Rule-based Signature Detection
              </h4>
              <p className="text-[11px] text-slate-400">
                Match against 50+ adversarial regexes & bypass patterns
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextVal = !security.ruleDetection;
                onSecurityChange('ruleDetection', nextVal);
                if (nextVal && !security.mlDetection) {
                  onSecurityChange('detectionMode', 'Rules Only (Signatures)');
                } else if (!nextVal && security.mlDetection) {
                  onSecurityChange('detectionMode', 'ML Only (DistilBERT)');
                } else if (nextVal && security.mlDetection) {
                  onSecurityChange('detectionMode', 'Hybrid (ML + Rules)');
                }
              }}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer ${
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
                Enforce BLOCK action when risk score exceeds block threshold
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onSecurityChange('autoBlockHighRisk', !security.autoBlockHighRisk)
              }
              className={`w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer ${
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
              <span>Dynamic Risk Score Thresholds</span>
              <span className="text-[10px] text-slate-500 font-mono">0 to 100 Scale</span>
            </div>

            {/* Segmented Gradient Bar */}
            <div className="relative w-full h-3.5 rounded-full overflow-hidden flex mb-2 shadow-inner bg-slate-900 border border-slate-800">
              <div
                className="bg-emerald-500 h-full transition-all duration-300 relative group"
                style={{ width: `${allowWidth}%` }}
                title={`Allow Zone: 0 - ${security.allowThreshold}`}
              />
              <div
                className="bg-amber-400 h-full transition-all duration-300 relative group"
                style={{ width: `${warnWidth}%` }}
                title={`Warn Zone: ${security.allowThreshold} - ${security.warnThreshold}`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300 relative group"
                style={{ width: `${blockWidth}%` }}
                title={`Block Zone: ${security.warnThreshold} - 100`}
              />
            </div>

            {/* Threshold Number markers */}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 mb-3">
              <span className="text-emerald-400">0 (Allow Safe)</span>
              <span className="text-emerald-400 font-bold">&le; {security.allowThreshold}</span>
              <span className="text-amber-400 font-bold">{security.warnThreshold}</span>
              <span className="text-rose-400 font-bold">&ge; {security.blockThreshold}</span>
              <span className="text-rose-400">100 (Block)</span>
            </div>

            {/* Numeric Inputs and Sliders */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-[#080d19]/80 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-medium text-emerald-400">
                    Allow Limit
                  </label>
                  <span className="text-[11px] font-mono font-bold text-white">
                    {security.allowThreshold}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={security.allowThreshold}
                  onChange={(e) => handleThresholdChange('allowThreshold', e.target.value)}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#080d19]/80 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-medium text-amber-400">
                    Warn Limit
                  </label>
                  <span className="text-[11px] font-mono font-bold text-white">
                    {security.warnThreshold}
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="85"
                  value={security.warnThreshold}
                  onChange={(e) => handleThresholdChange('warnThreshold', e.target.value)}
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#080d19]/80 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-medium text-rose-400">
                    Block Limit
                  </label>
                  <span className="text-[11px] font-mono font-bold text-white">
                    {security.blockThreshold}
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={security.blockThreshold}
                  onChange={(e) => handleThresholdChange('blockThreshold', e.target.value)}
                  className="w-full accent-rose-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Security Settings Button */}
        <div className="mt-5 pt-4 border-t border-[#2c1622] flex items-center justify-between">
          <button
            type="button"
            onClick={onSaveSecurity}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-rose-950/40 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Save Security Settings</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
