'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ChevronDown, Sliders, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { SCAN_PRESETS } from '@/lib/rag';

export function ScanConfigCard({ config, setConfig }) {
  const modes = [
    'Standard (Recommended)',
    'Aggressive (Strict Filter)',
    'Enterprise Compliance',
  ];

  const handleModeChange = (modeName) => {
    const preset = SCAN_PRESETS[modeName];
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        detectionMode: modeName,
        chunkSize: preset.chunkSize,
        chunkOverlap: preset.chunkOverlap,
        detectIndirect: preset.detectIndirect,
        detectObfuscated: preset.detectObfuscated,
        analyzeLinks: preset.analyzeLinks,
      }));
    } else {
      setConfig((prev) => ({ ...prev, detectionMode: modeName }));
    }
  };

  const currentPreset = SCAN_PRESETS[config.detectionMode] || SCAN_PRESETS['Standard (Recommended)'];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-white">
            2. Scan Configuration
          </h2>
          <span className={`text-[10px] border px-2 py-0.5 rounded-full font-medium ${currentPreset.badgeColor}`}>
            {currentPreset.badge}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          Configure chunk parameters, detection sensitivity, and rule enforcement pipelines.
        </p>

        {/* 3 Inputs in a Row */}
        <div className="grid grid-cols-3 gap-2.5 mb-3.5">
          {/* Chunk Size */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Chunk Size
            </label>
            <input
              type="number"
              step="50"
              min="100"
              max="2000"
              value={config.chunkSize}
              onChange={(e) =>
                setConfig({ ...config, chunkSize: parseInt(e.target.value) || 400 })
              }
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs font-mono font-semibold text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Chunk Overlap */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Chunk Overlap
            </label>
            <input
              type="number"
              step="10"
              min="0"
              max="500"
              value={config.chunkOverlap}
              onChange={(e) =>
                setConfig({ ...config, chunkOverlap: parseInt(e.target.value) || 50 })
              }
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-1.5 px-2.5 text-xs font-mono font-semibold text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Detection Mode */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block truncate">
              Detection Mode
            </label>
            <div className="relative">
              <select
                value={config.detectionMode}
                onChange={(e) => handleModeChange(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-1.5 px-2 pr-6 text-[11px] font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer truncate"
              >
                {modes.map((m) => (
                  <option key={m} value={m} className="bg-[#0f172a]">
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3 Toggle Switches */}
        <div className="space-y-2.5 pt-0.5 mb-3.5">
          {/* Toggle 1: Detect indirect prompt injections */}
          <div className="flex items-start justify-between gap-3">
            <div
              onClick={() =>
                setConfig({ ...config, detectIndirect: !config.detectIndirect })
              }
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 mt-0.5 ${
                config.detectIndirect ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  config.detectIndirect ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-slate-200 block leading-tight">
                Detect indirect prompt injections
              </span>
              <span className="text-[10px] text-slate-400">
                Find hidden instructions, jailbreak prefixes, and system overrides
              </span>
            </div>
          </div>

          {/* Toggle 2: Check for obfuscated content */}
          <div className="flex items-start justify-between gap-3">
            <div
              onClick={() =>
                setConfig({ ...config, detectObfuscated: !config.detectObfuscated })
              }
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 mt-0.5 ${
                config.detectObfuscated ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  config.detectObfuscated ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-slate-200 block leading-tight">
                Check for obfuscated content
              </span>
              <span className="text-[10px] text-slate-400">
                Detect Base64 payloads, hex encoding, zero-width chars & leetspeak
              </span>
            </div>
          </div>

          {/* Toggle 3: Analyze external links */}
          <div className="flex items-start justify-between gap-3">
            <div
              onClick={() =>
                setConfig({ ...config, analyzeLinks: !config.analyzeLinks })
              }
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 mt-0.5 ${
                config.analyzeLinks ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  config.analyzeLinks ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-slate-200 block leading-tight">
                Analyze external links
              </span>
              <span className="text-[10px] text-slate-400">
                Audit URLs, webhooks, and exfiltration endpoints in document text
              </span>
            </div>
          </div>
        </div>

        {/* Predefined Scanning Stages & Instructions Banner */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Predefined Instructions & Pipeline:</span>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            {currentPreset.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#080d19] border border-slate-800 text-slate-300">
              Chunk: {config.chunkSize} / {config.chunkOverlap} overlap
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#080d19] border border-slate-800 text-slate-300">
              Thresholds: Allow &lt;{currentPreset.allowThreshold}, Block &gt;{currentPreset.blockThreshold}
            </span>
            {config.detectIndirect && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                Indirect Filter
              </span>
            )}
            {config.detectObfuscated && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                Obfuscation Decoder
              </span>
            )}
            {config.analyzeLinks && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Link Analyzer
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
