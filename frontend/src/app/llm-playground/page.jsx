'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ModelSettings } from '@/components/playground/ModelSettings';
import { SystemPromptCard } from '@/components/playground/SystemPromptCard';
import { UserPromptCard } from '@/components/playground/UserPromptCard';
import { SecurityAnalysisCard } from '@/components/playground/SecurityAnalysisCard';
import { LLMResponseCard } from '@/components/playground/LLMResponseCard';
import { OutputScanCard } from '@/components/playground/OutputScanCard';
import { ExamplePromptsRow } from '@/components/playground/ExamplePromptsRow';
import { executePlaygroundPrompt, SAMPLE_RESPONSES } from '@/lib/playground';
import { BarChart3 } from 'lucide-react';

export default function LLMPlaygroundPage() {
  const [provider, setProvider] = useState('OpenAI');
  const [model, setModel] = useState('GPT-4o');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);

  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful assistant. Provide accurate, harmless and concise responses.'
  );
  const [userPrompt, setUserPrompt] = useState(
    'Explain quantum computing in simple terms.'
  );

  const [loading, setLoading] = useState(false);

  // Initial wireframe states
  const [scanResult, setScanResult] = useState({
    action: 'ALLOW',
    risk_score: 3.2,
    ml_confidence: 98.7,
    prediction: 'benign',
    attack_categories: [],
    matched_rules: [],
  });

  const [pipeline, setPipeline] = useState([
    {
      name: 'Input Scanning',
      desc: 'Prompt analyzed using DistilBERT + rule engine',
      status: 'Safe',
      completed: true,
      color: 'text-emerald-400',
    },
    {
      name: 'Risk Analysis',
      desc: 'Risk score calculated',
      status: '3.2',
      completed: true,
      color: 'text-emerald-400',
    },
    {
      name: 'Policy Check',
      desc: 'Below threshold',
      status: 'Passed',
      completed: true,
      color: 'text-emerald-400',
    },
    {
      name: 'Sent to LLM',
      desc: 'Prompt forwarded to model',
      status: 'Completed',
      completed: true,
      color: 'text-emerald-400',
    },
  ]);

  const [response, setResponse] = useState(SAMPLE_RESPONSES.quantum);
  const [latency, setLatency] = useState('2.8s');
  const [outputSafe, setOutputSafe] = useState(true);

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
      setOutputSafe(res.outputSafe);
    } catch (err) {
      console.error('Playground error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExample = (ex) => {
    setUserPrompt(ex);
  };

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            LLM Playground
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test LLM responses with PromptShield security analysis. Your prompts are scanned before being sent to the model.
          </p>
        </div>

        <div>
          <Link
            href="/analytics"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            <span>View Usage</span>
          </Link>
        </div>
      </div>

      {/* Main 3-Column Layout matching wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Model & Prompts */}
        <div className="lg:col-span-4 flex flex-col">
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
        <div className="lg:col-span-4 flex flex-col">
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
      <ExamplePromptsRow onSelectExample={handleSelectExample} />
    </AppShell>
  );
}
