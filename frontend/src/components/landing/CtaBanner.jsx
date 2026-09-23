'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="py-16 bg-[#060a12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950/80 via-[#0e214d]/70 to-[#0c1836]/90 border border-blue-500/40 p-8 sm:p-12 shadow-[0_0_60px_rgba(37,99,235,0.15)]">
          {/* Subtle curved glow behind */}
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-blue-400 bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full">
                JOIN THE MOVEMENT
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Let&apos;s Build a{' '}
                <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]">
                  Safer AI Future
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                Start securing your LLM applications with PromptShield today. Instant setup, zero infrastructure overhead.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/prompt-scanner"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-medium transition-colors"
                >
                  View Documentation
                </a>
              </div>
            </div>

            {/* Right Emblem & Watermark */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="flex items-center gap-3 opacity-90 p-4 rounded-2xl bg-blue-900/20 border border-blue-400/20 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/40 text-blue-400 flex items-center justify-center">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-tight">
                    Secure AI.
                  </span>
                  <span className="text-xs text-blue-300 tracking-tight">
                    Safer Tomorrow.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
