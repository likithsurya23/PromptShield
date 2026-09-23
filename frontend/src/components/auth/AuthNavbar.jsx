'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export function AuthNavbar() {
  return (
    <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-500 shadow-lg shadow-blue-500/10 transition-transform group-hover:scale-105">
          <Shield className="w-6 h-6 fill-blue-600/20 stroke-blue-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-white tracking-tight leading-none">
            PromptShield
          </span>
          <span className="text-[11px] text-slate-400 tracking-tight mt-1">
            Secure AI. Safer Tomorrow.
          </span>
        </div>
      </Link>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-blue-400 font-medium transition-colors group"
      >
        <span>Back to Home</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
      </Link>
    </header>
  );
}
