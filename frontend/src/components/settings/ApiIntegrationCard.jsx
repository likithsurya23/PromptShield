'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Settings2, Key, ChevronRight } from 'lucide-react';

export function ApiIntegrationCard({ onConfigureDefaultApi }) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">
          API & Integration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">
          Configure default API settings and integrations.
        </p>

        <div className="space-y-3">
          {/* Default API Configuration */}
          <button
            type="button"
            onClick={onConfigureDefaultApi}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 hover:border-slate-700 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Settings2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                  Default API Configuration
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage your default LLM API settings
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
                <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                  Manage API Keys
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Add or update your API keys
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
