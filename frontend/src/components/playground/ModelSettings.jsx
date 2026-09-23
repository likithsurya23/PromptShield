'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Cpu, ChevronDown, Sparkles } from 'lucide-react';

export function ModelSettings({
  provider,
  setProvider,
  model,
  setModel,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
}) {
  const providers = ['OpenAI', 'Anthropic', 'Mistral', 'Meta'];
  const modelsByProvider = {
    OpenAI: ['GPT-4o', 'GPT-4o-mini', 'o1-preview'],
    Anthropic: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku'],
    Mistral: ['Mistral Large 2', 'Mistral Nemo'],
    Meta: ['Llama 3.3 70B', 'Llama 3.1 8B'],
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    setModel(modelsByProvider[newProvider][0]);
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl mb-4">
      <h2 className="text-sm font-semibold text-white mb-3.5">
        1. Model & Settings
      </h2>

      {/* Provider & Model Dropdowns */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Provider */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-400 block">
            Provider
          </label>
          <div className="relative">
            <select
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 pl-8 pr-7 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              {providers.map((p) => (
                <option key={p} value={p} className="bg-[#0f172a] text-white">
                  {p}
                </option>
              ))}
            </select>
            <Sparkles className="w-3.5 h-3.5 text-blue-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Model */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-400 block">
            Model
          </label>
          <div className="relative">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 pl-8 pr-7 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              {(modelsByProvider[provider] || []).map((m) => (
                <option key={m} value={m} className="bg-[#0f172a] text-white">
                  {m}
                </option>
              ))}
            </select>
            <Cpu className="w-3.5 h-3.5 text-indigo-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Sliders: Temperature & Max Tokens */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Temperature</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">
              {temperature}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-blue-600 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Max Tokens</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">
              {maxTokens}
            </span>
          </div>
          <input
            type="range"
            min="128"
            max="4096"
            step="128"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full accent-blue-600 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
}
