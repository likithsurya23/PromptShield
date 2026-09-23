'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Info } from 'lucide-react';

export function SystemPromptCard({ systemPrompt, setSystemPrompt }) {
  const maxLength = 2000;

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">
            2. System Prompt <span className="text-slate-500 font-normal">(Optional)</span>
          </h2>
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200 cursor-pointer" />
            <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block w-52 p-2 bg-slate-900 border border-slate-700 rounded-lg text-[10px] text-slate-300 shadow-xl z-20">
              Defines foundational instructions and boundary constraints for the LLM assistant persona.
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mb-3">
        Use a system prompt to define the assistant&apos;s behavior.
      </p>

      <div className="relative">
        <textarea
          rows={3}
          maxLength={maxLength}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
          className="w-full bg-[#080d19] border border-slate-800/90 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono resize-none leading-relaxed"
        />
        <div className="text-right text-[10px] font-mono text-slate-500 mt-1">
          {systemPrompt.length}/{maxLength}
        </div>
      </div>
    </Card>
  );
}
