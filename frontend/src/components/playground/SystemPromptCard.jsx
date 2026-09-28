'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Info } from 'lucide-react';

export function SystemPromptCard({ systemPrompt, setSystemPrompt }) {
  const maxLength = 2000;

  return (
    <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c1222]/80 shadow-xl mb-4 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            2. System Prompt <span className="text-slate-400 font-normal">(Optional)</span>
          </h2>
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" />
            <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block w-52 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] text-slate-700 dark:text-slate-300 shadow-xl z-20">
              Defines foundational instructions and boundary constraints for the LLM assistant persona.
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
        Use a system prompt to define the assistant&apos;s behavior and boundary rules.
      </p>

      <div className="relative">
        <textarea
          rows={3}
          maxLength={maxLength}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
          className="w-full bg-slate-50 dark:bg-[#080d19] border border-slate-200 dark:border-slate-800/90 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono resize-none leading-relaxed"
        />
        <div className="text-right text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">
          {systemPrompt.length}/{maxLength}
        </div>
      </div>
    </Card>
  );
}
