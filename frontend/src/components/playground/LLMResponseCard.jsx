'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Copy, Check, Sparkles } from 'lucide-react';

export function LLMResponseCard({
  model = 'GPT-4o',
  response = '',
  latency = '2.8s',
  loading,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl mb-4 flex flex-col justify-between min-h-[380px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-semibold text-white">
            5. LLM Response
          </h2>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!response || loading}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 transition-colors"
            title="Copy Response"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Model Info Badge */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 mb-4 text-xs">
          <div className="flex items-center gap-2 text-white font-semibold">
            <div className="p-1 rounded-md bg-blue-600/20 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>{model}</span>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            {loading ? 'Generating...' : `Response generated in ${latency}`}
          </span>
        </div>

        {/* Response Body */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <span className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs">Processing prompt through PromptShield firewall...</span>
          </div>
        ) : !response ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-center">
            <p className="text-xs">No response generated yet.</p>
            <p className="text-[11px] text-slate-600 mt-1">Prompt responses and firewall interception notices will be displayed here.</p>
          </div>
        ) : (
          <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap selection:bg-blue-600/30">
            {response}
          </div>
        )}
      </div>
    </Card>
  );
}
