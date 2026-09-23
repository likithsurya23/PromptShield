'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Bookmark, ChevronDown, Play, RotateCcw } from 'lucide-react';

export function AttackConfigCard({
  config,
  setConfig,
  onRun,
  onReset,
  loading,
}) {
  const attackTypes = [
    'Jailbreak',
    'Direct Injection',
    'Indirect Injection',
    'Obfuscation',
    'Role Manipulation',
    'System Prompt Extraction',
    'Instruction Override',
    'All Combined',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard', 'Extreme'];

  return (
    <Card className="p-6 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold text-white mb-4">
          1. Select Attack Configuration
        </h2>

        {/* 3 Selectors in a Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
          {/* 1. Attack Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 block">
              Attack Type
            </label>
            <div className="relative">
              <select
                value={config.attackType}
                onChange={(e) =>
                  setConfig({ ...config, attackType: e.target.value })
                }
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 pl-8 pr-7 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                {attackTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#0f172a]">
                    {t}
                  </option>
                ))}
              </select>
              <Bookmark className="w-3.5 h-3.5 text-blue-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Number of Samples */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 block">
              Number of Samples
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="100"
                step="5"
                value={config.samples}
                onChange={(e) =>
                  setConfig({ ...config, samples: parseInt(e.target.value) || 20 })
                }
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs font-semibold text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 3. Difficulty Level */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 block">
              Difficulty Level
            </label>
            <div className="relative">
              <select
                value={config.difficulty}
                onChange={(e) =>
                  setConfig({ ...config, difficulty: e.target.value })
                }
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-7 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d} className="bg-[#0f172a]">
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Additional Options (Toggles) */}
        <div className="mb-5">
          <span className="text-xs font-semibold text-slate-300 block mb-3">
            Additional Options
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Toggle 1: Include Obfuscated Prompts */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() =>
                  setConfig({
                    ...config,
                    includeObfuscated: !config.includeObfuscated,
                  })
                }
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  config.includeObfuscated ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    config.includeObfuscated ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-[11px] text-slate-300">
                Include Obfuscated Prompts
              </span>
            </label>

            {/* Toggle 2: Include Multi-turn Prompts */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() =>
                  setConfig({
                    ...config,
                    includeMultiTurn: !config.includeMultiTurn,
                  })
                }
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  config.includeMultiTurn ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    config.includeMultiTurn ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-[11px] text-slate-300">
                Include Multi-turn Prompts
              </span>
            </label>

            {/* Toggle 3: Test Against Output Scanning */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() =>
                  setConfig({
                    ...config,
                    testOutputScan: !config.testOutputScan,
                  })
                }
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  config.testOutputScan ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    config.testOutputScan ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-[11px] text-slate-300">
                Test Against Output Scanning
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className="sm:col-span-8 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/40 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Simulation</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className="sm:col-span-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </Card>
  );
}
