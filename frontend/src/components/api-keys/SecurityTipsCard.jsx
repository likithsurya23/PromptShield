'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Lightbulb, ExternalLink } from 'lucide-react';

export function SecurityTipsCard({ tips }) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Security Tips
          </h2>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-300">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-800/80 mt-4">
        <a
          href="#security-docs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Learn more about API key security</span>
        </a>
      </div>
    </Card>
  );
}
