'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import {
  Settings2,
  Key,
  ChevronRight,
  X,
  CheckCircle2,
  Cpu,

} from 'lucide-react';
import { getStoredApiKeys } from '@/lib/api-keys';
import { DEFAULT_SETTINGS, getApiSettings, saveApiSettings } from '@/lib/settings';

export function ApiIntegrationCard({ onShowToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState(DEFAULT_SETTINGS.api);
  const [keyCount, setKeyCount] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const syncData = () => {
      const keys = getStoredApiKeys();
      setKeyCount(keys.length);
      setApiConfig(getApiSettings());
    };

    const timer = setTimeout(syncData, 0);

    const handleStorage = () => {
      syncData();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleSaveModal = (e) => {
    e.preventDefault();
    saveApiSettings(apiConfig);
    setSavedSuccess(true);
    if (onShowToast) {
      onShowToast('Default LLM API configuration updated successfully.');
    }
    setTimeout(() => {
      setSavedSuccess(false);
      setIsModalOpen(false);
    }, 800);
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">
            API & Model Integration
          </h2>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            LLM Gateway
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Configure default inference providers, endpoints, and credentials.
        </p>

        <div className="space-y-3">
          {/* Default API Configuration */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 hover:border-slate-700 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Settings2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                    Default API Configuration
                  </h4>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    {apiConfig.defaultProvider}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Model: <span className="text-slate-300 font-mono">{apiConfig.defaultModel}</span> &bull; Timeout: {apiConfig.timeoutSeconds}s
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </button>

          {/* Manage API Keys */}
          <Link
            href="/api-keys"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 hover:border-slate-700 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Manage API Keys
                  </h4>
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700">
                    {keyCount} {keyCount === 1 ? 'key' : 'keys'} stored
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Generate, rotate, or revoke external integration keys
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>

      {/* Modal: Default API Configuration */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-6 text-left relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Default LLM Configuration</h3>
                <p className="text-xs text-slate-400">
                  Configure default inference parameters for downstream integrations.
                </p>
              </div>
            </div>

            {savedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-xs my-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Configuration saved successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSaveModal} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Provider
                    </label>
                    <select
                      value={apiConfig.defaultProvider}
                      onChange={(e) =>
                        setApiConfig((prev) => ({ ...prev, defaultProvider: e.target.value }))
                      }
                      className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="OpenAI">OpenAI</option>
                      <option value="Anthropic">Anthropic</option>
                      <option value="Google Gemini">Google Gemini</option>
                      <option value="Ollama (Local)">Ollama (Local / vLLM)</option>
                      <option value="Hugging Face">Hugging Face</option>
                      <option value="Cohere">Cohere</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Target Model
                    </label>
                    <input
                      type="text"
                      value={apiConfig.defaultModel}
                      onChange={(e) =>
                        setApiConfig((prev) => ({ ...prev, defaultModel: e.target.value }))
                      }
                      className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      placeholder="e.g. gpt-4o, claude-3-5-sonnet"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Temperature ({apiConfig.temperature})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={apiConfig.temperature}
                      onChange={(e) =>
                        setApiConfig((prev) => ({
                          ...prev,
                          temperature: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      min="128"
                      max="8192"
                      value={apiConfig.maxTokens}
                      onChange={(e) =>
                        setApiConfig((prev) => ({
                          ...prev,
                          maxTokens: Number(e.target.value),
                        }))
                      }
                      className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white font-mono text-center focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Timeout (sec)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={apiConfig.timeoutSeconds}
                      onChange={(e) =>
                        setApiConfig((prev) => ({
                          ...prev,
                          timeoutSeconds: Number(e.target.value),
                        }))
                      }
                      className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white font-mono text-center focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Interception Fallback Behavior
                  </label>
                  <select
                    value={apiConfig.blockBehavior || 'Block & Warning'}
                    onChange={(e) =>
                      setApiConfig((prev) => ({ ...prev, blockBehavior: e.target.value }))
                    }
                    className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Block & Warning">Block prompt & return security advisory</option>
                    <option value="Sanitize & Proceed">Sanitize prompt injection tokens & proceed</option>
                    <option value="Log Only">Audit / Log only without blocking downstream request</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#080d19] border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shadow-md shadow-blue-600/30"
                  >
                    Save API Configuration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
