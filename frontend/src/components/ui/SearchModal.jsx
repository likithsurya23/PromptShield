'use client';

import React, { useState } from 'react';
import { Search, X, ShieldAlert, Cpu, Crosshair, FileText, ArrowRight } from 'lucide-react';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'Scan a prompt for jailbreaks', icon: ShieldAlert, category: 'Tools' },
    { label: 'LLM Playground testing session', icon: Cpu, category: 'Features' },
    { label: 'Run Attack Simulator (Direct Injection)', icon: Crosshair, category: 'Simulations' },
    { label: 'Export Security Audit Report PDF', icon: FileText, category: 'Reports' },
  ];

  const filteredLinks = query
    ? quickLinks.filter((l) => l.label.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#130a15] border border-[#2c1622] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-[#2c1622]">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search scans, prompts, reports..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-[#1f0f1f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-[#f57b83] uppercase tracking-wider">
            Quick Navigation & Tools
          </div>
          {filteredLinks.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={onClose}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-[#200f1c] hover:text-[#fecdd3] group transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-[#1f0f1f] group-hover:bg-[#6a1a24]/40 text-[#f57b83] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{item.category}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#f57b83] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e0710] border-t border-[#2c1622] text-[11px] text-slate-400">
          <span>Press ESC to close</span>
          <span className="font-mono">PromptShield v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
