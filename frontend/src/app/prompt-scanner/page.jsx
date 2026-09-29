'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ScannerInput } from '@/components/scanner/ScannerInput';
import { ScannerResult } from '@/components/scanner/ScannerResult';
import { ScannerTabs } from '@/components/scanner/ScannerTabs';
import { ScannerActions } from '@/components/scanner/ScannerActions';
import { scanPrompt } from '@/lib/scanner';
import { BookOpen } from 'lucide-react';

export default function PromptScannerPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await scanPrompt(prompt);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Inference service error. Please ensure the backend is running.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setError(null);
  };

  const handleReset = () => {
    setPrompt('');
    setResult(null);
    setError(null);
  };

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Prompt Scanner</h1>
        </div>

        <div>
          <Link
            href="/docs"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>View API Docs</span>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Section: Input & Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-stretch">
        <div className="lg:col-span-6">
          <ScannerInput
            prompt={prompt}
            setPrompt={setPrompt}
            onScan={handleScan}
            loading={loading}
            onClear={handleClear}
          />
        </div>
        <div className="lg:col-span-6">
          <ScannerResult result={result} loading={loading} error={error} />
        </div>
      </div>

      {/* Detailed Analysis Tabs */}
      {result && <ScannerTabs result={result} />}

      {/* Bottom Utility Actions */}
      <ScannerActions
        result={result}
        prompt={prompt}
        onReset={handleReset}
      />
    </AppShell>
  );
}
