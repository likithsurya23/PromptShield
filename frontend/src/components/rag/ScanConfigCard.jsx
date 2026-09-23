'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ChevronDown } from 'lucide-react';

export function ScanConfigCard({ config, setConfig }) {
  const modes = [
    'Standard (Recommended)',
    'Aggressive (Strict Filter)',
    'Enterprise Compliance',
  ];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">
          2. Scan Configuration
        </h2>

        {/* 3 Inputs in a Row */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {/* Chunk Size */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Chunk Size
            </label>
            <input
              type="number"
              step="50"
              value={config.chunkSize}
              onChange={(e) =>
                setConfig({ ...config, chunkSize: parseInt(e.target.value) || 500 })
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
                onChange={(e) =>
                  setConfig({ ...config, detectionMode: e.target.value })
                }
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
        <div className="space-y-3 pt-1">
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
                Find hidden malicious instructions
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
                Detect encoded or disguised prompts
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
                Scan URLs and referenced content
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
