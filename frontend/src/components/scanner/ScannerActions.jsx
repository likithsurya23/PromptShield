'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { RotateCcw, Copy, Download, Bookmark, Check } from 'lucide-react';

export function ScannerActions({ result, prompt, onReset }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopyJson = () => {
    if (!result) return;
    const exportData = {
      prompt,
      scan_result: result,
      exported_at: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const exportData = {
      prompt,
      scan_result: result,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptshield-scan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Scan Another Prompt */}
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-semibold text-white">Scan Another Prompt</h3>
          <p className="text-[11px] text-slate-400 mt-1 mb-4">
            Modify your prompt and scan again.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-xs font-semibold text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </Card>

      {/* 2. Export Result */}
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-semibold text-white">Export Result</h3>
          <p className="text-[11px] text-slate-400 mt-1 mb-4">
            Download or copy the scan result.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-xs font-semibold text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
        </div>
      </Card>

      {/* 3. Add to Test Collection */}
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-semibold text-white">Add to Test Collection</h3>
          <p className="text-[11px] text-slate-400 mt-1 mb-4">
            Save this prompt for future testing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-xs font-semibold text-slate-200 transition-colors"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved!' : 'Save Prompt'}</span>
        </button>
      </Card>
    </div>
  );
}
