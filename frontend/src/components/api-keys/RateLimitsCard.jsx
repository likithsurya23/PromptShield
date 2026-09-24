'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Bot } from 'lucide-react';

export function RateLimitsCard({ rateLimits }) {
  const getProviderIcon = (name) => {
    switch (name) {
      case 'OpenAI':
        return (
          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
            O
          </span>
        );
      case 'Anthropic':
        return (
          <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
            A
          </span>
        );
      case 'Gemini':
        return (
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
            G
          </span>
        );
      case 'Hugging Face':
        return (
          <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-[10px]">
            🤗
          </span>
        );
      default:
        return (
          <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-[10px]">
            <Bot className="w-3 h-3" />
          </span>
        );
    }
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Rate Limits (Today)
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {(!rateLimits || rateLimits.length === 0) ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No active rate limits monitored. Connect API keys to track usage thresholds.
            </div>
          ) : (
            rateLimits.map((item) => (
            <div key={item.provider} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {getProviderIcon(item.provider)}
                  <span className="font-semibold text-slate-200">
                    {item.provider}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-300 text-[11px]">
                    {item.used.toLocaleString()} / {item.total.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-[11px] font-bold w-7 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          )))}
        </div>
      </div>
    </Card>
  );
}
