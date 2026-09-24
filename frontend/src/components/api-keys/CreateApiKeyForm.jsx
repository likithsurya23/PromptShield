'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Plus, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { PROVIDERS } from '@/lib/api-keys';

export function CreateApiKeyForm({ onAddKey }) {
  const [providerId, setProviderId] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [environment, setEnvironment] = useState('Production');

  const selectedProvider =
    PROVIDERS.find((p) => p.id === providerId) || PROVIDERS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    const newKeyItem = {
      id: `key-${Date.now()}`,
      name: keyName.trim() || `${selectedProvider.name} - ${environment}`,
      provider: selectedProvider.name,
      providerId: selectedProvider.id,
      key: apiKey,
      maskedKey: `${apiKey.slice(0, 4)}................................`,
      environment,
      environmentColor:
        environment === 'Production'
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : environment === 'Development'
          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          : 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
      createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never',
      status: 'Active',
      statusColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      purpose: purpose.trim() || 'Prompt scanning & protection',
    };

    onAddKey(newKeyItem);
    setApiKey('');
    setKeyName('');
    setPurpose('');
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">
          Create New API Key
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          Add a new API key to use with LLM providers or external services.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Provider / Service */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 block">
              Provider / Service
            </label>
            <div className="relative">
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0f172a]">
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 block">
              API Key <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={selectedProvider.placeholder}
                required
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-9 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                aria-label="Toggle password view"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Key Name (Optional) */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 block">
              Key Name (Optional)
            </label>
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g., OpenAI - Production"
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Usage Purpose */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 block">
              Usage Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Prompt scanning, LLM playground"
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Environment */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 block">
              Environment
            </label>
            <div className="relative">
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="Production">Production</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Staging">Staging</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add API Key</span>
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}
