'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-[#0b080e] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow Box Container */}
        <div className="relative rounded-2xl overflow-hidden border border-rose-500/35 bg-gradient-to-b from-[#1a0c17]/95 via-[#260f20]/90 to-[#130713]/95 p-10 sm:p-14 text-center shadow-[0_0_50px_-15px_rgba(244,63,94,0.35)]">
          
          {/* Bottom neon red/rose accent glow */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-[80px] bg-[#e11d48]/35 blur-[45px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-[40px] bg-[#f57b83]/30 blur-[25px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3.5">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight">
              Build Safer AI Today
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Join developers and organizations securing their LLM applications with PromptShield.
            </p>

            <div className="pt-3 flex justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white text-sm font-semibold transition-all shadow-md shadow-rose-950/40 active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
