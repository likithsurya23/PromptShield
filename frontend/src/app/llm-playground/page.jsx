'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ModelSettings } from '@/components/playground/ModelSettings';
import { SystemPromptCard } from '@/components/playground/SystemPromptCard';
import { UserPromptCard } from '@/components/playground/UserPromptCard';
import { SecurityAnalysisCard } from '@/components/playground/SecurityAnalysisCard';
import { LLMResponseCard } from '@/components/playground/LLMResponseCard';
import { OutputScanCard } from '@/components/playground/OutputScanCard';
import { ExamplePromptsRow } from '@/components/playground/ExamplePromptsRow';
import { executePlaygroundPrompt } from '@/lib/playground';
import { getApiSettings } from '@/lib/settings';
import { BarChart3, CheckCircle2, RotateCcw } from 'lucide-react';

export default function LLMPlaygroundPage() {
  const [provider, setProvider] = useState('OpenAI');
  const [model, setModel] = useState('GPT-4o');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);

  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful assistant. Provide accurate, harmless and concise responses.'
  );
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const [scanResult, setScanResult] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [response, setResponse] = useState(null);
  const [latency, setLatency] = useState(null);
  const [outputSafe, setOutputSafe] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const apiSettings = getApiSettings();
      if (apiSettings) {
        if (apiSettings.defaultProvider) setProvider(apiSettings.defaultProvider);
        if (apiSettings.defaultModel) setModel(apiSettings.defaultModel);
        if (apiSettings.temperature !== undefined) setTemperature(apiSettings.temperature);
        if (apiSettings.maxTokens !== undefined) setMaxTokens(apiSettings.maxTokens);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExecute = async () => {
    if (!userPrompt.trim()) return;
    setLoading(true);

    try {
      const res = await executePlaygroundPrompt({
        userPrompt,
        systemPrompt,
        provider,
        model,
        temperature,
        maxTokens,
      });

      setScanResult(res.scanResult);
      setPipeline(res.pipeline);
      setResponse(res.response);
      setLatency(res.latency);
      setOutputSafe(res.outputScan ? res.outputScan.passed : true);

      if (res.scanResult.action === 'BLOCK') {
        showToast('Prompt blocked by PromptShield firewall!');
      } else if (res.scanResult.action === 'WARN') {
        showToast('Prompt flagged with security warning.');
      } else {
        showToast('Prompt evaluated clean and forwarded.');
      }
    } catch (err) {
      console.error('Playground error:', err);
      showToast('Error during evaluation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExample = (ex) => {
    setUserPrompt(ex);
  };

  const handleReset = () => {
    setUserPrompt('');
    setScanResult(null);
    setPipeline([]);
    setResponse(null);
    setLatency(null);
    setOutputSafe(null);
    showToast('Playground cleared.');
  };

  return (
    <AppShell>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#e11d48] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-rose-400/40 flex items-center gap-2 text-xs font-semibold animate-fade-in shadow-rose-950/50">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            LLM Playground
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test LLM prompts with PromptShield multi-layered security analysis and live interception.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Playground</span>
          </button>

          <Link
            href="/analytics"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-xs font-semibold text-slate-200 transition-colors shadow-sm cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            <span>View Usage</span>
          </Link>
        </div>
      </div>

      {/* Main 3-Column Layout matching wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Model & Prompts */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <ModelSettings
            provider={provider}
            setProvider={setProvider}
            model={model}
            setModel={setModel}
            temperature={temperature}
            setTemperature={setTemperature}
            maxTokens={maxTokens}
            setMaxTokens={setMaxTokens}
          />
          <SystemPromptCard
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
          />
          <UserPromptCard
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            onExecute={handleExecute}
            loading={loading}
          />
        </div>

        {/* Column 2: Security Analysis & Pipeline */}
        <div className="lg:col-span-4 flex flex-col">
          <SecurityAnalysisCard
            scanResult={scanResult}
            pipeline={pipeline}
            onRescan={handleExecute}
            loading={loading}
          />
        </div>

        {/* Column 3: LLM Response & Output Security Scan */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <LLMResponseCard
            model={model}
            response={response}
            latency={latency}
            loading={loading}
          />
          <OutputScanCard isSafe={outputSafe} />
        </div>
      </div>

      {/* Bottom Example Prompts Row */}
      <div className="mt-5">
        <ExamplePromptsRow onSelectExample={handleSelectExample} />
      </div>
    </AppShell>
  );
}
