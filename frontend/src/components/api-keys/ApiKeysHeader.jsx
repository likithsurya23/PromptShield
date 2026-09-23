'use client';

import React from 'react';
import { Key, BookOpen } from 'lucide-react';

export function ApiKeysHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Title & Description */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
            API Keys
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your API keys for LLM providers and external services securely.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <a
        href="#docs"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm w-fit"
      >
        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
        <span>View Documentation</span>
      </a>
    </div>
  );
}
