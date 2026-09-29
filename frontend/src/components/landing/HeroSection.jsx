'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Database,
  Lock,
  BarChart3,
  ArrowRight,
  Play,
  X,
} from 'lucide-react';
import { SecurityAnimation } from './SecurityAnimation';

export function HeroSection() {
  const [demoOpen, setDemoOpen] = useState(false);

  const bottomFeatures = [
    {
      icon: Shield,
      title: 'Prompt Injection',
      subtitle: 'Detection',
    },
    {
      icon: Database,
      title: 'RAG Security',
      subtitle: '',
    },
    {
      icon: Lock,
      title: 'Jailbreak Protection',
      subtitle: '',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      subtitle: '',
    },
  ];

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-10 pb-12 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Pill, Subtitle, CTA buttons */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            {/* Headline matching image exactly */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.12] break-words">
              Stop Prompt Injection<br className="hidden sm:inline" />
              {' '}Before It Reaches<br className="hidden sm:inline" />
              {' '}
              <span className="bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#fb7185] bg-clip-text text-transparent">
                Your LLM
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base leading-relaxed text-slate-300/90 max-w-lg">
              PromptShield uses advanced machine learning and rule-based detection to
              analyze and block malicious prompts in real time.
            </p>

            {/* CTA Buttons: [ Get Started -> ] and [ ▶ Watch Demo ] */}
            {/* Equal 50/50 size on mobile in the same row */}
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:items-center sm:gap-3.5 pt-2 w-full">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#e11d48] hover:opacity-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_22px_rgba(244,63,94,0.45)] active:scale-95 cursor-pointer text-center min-h-[44px]"
              >
                <span className="truncate">Get Started</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-3 sm:px-6 py-3 rounded-xl border border-rose-950/80 hover:border-rose-500/50 bg-[#12050e]/90 hover:bg-[#1f0918] text-slate-200 text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer text-center min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5 fill-[#f43f5e] text-[#f43f5e] shrink-0" />
                <span className="truncate">Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Animated Security Shield */}
          <div className="lg:col-span-6 relative flex items-center justify-center overflow-visible w-full pt-2 lg:pt-0">
            <SecurityAnimation />
          </div>

        </div>

        {/* Bottom 4 Feature Cards Section with Anchor & Heading */}
        <div id="features" className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-rose-950/40 scroll-mt-20 sm:scroll-mt-24">
          {/* Feature Heading */}
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-9">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#f43f5e] mb-1.5 sm:mb-2">
              FEATURES
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-[30px] font-extrabold text-white tracking-tight leading-tight">
              Core Security Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
              Comprehensive threat defense engineered specifically for generative AI and LLM workloads.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {bottomFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-[#0f050d]/85 border border-rose-950/60 hover:border-rose-500/35 transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-[#240818] to-[#12030d] border border-rose-500/30 text-[#f43f5e] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(244,63,94,0.25)]">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-100 block">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-100 block">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Demo Modal for Watch Demo */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#12050f] border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-950/60">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-[#f43f5e] text-[#f43f5e]" />
                <h3 className="text-base font-bold text-white">PromptShield In Action</h3>
              </div>
              <button
                type="button"
                onClick={() => setDemoOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-rose-950/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video rounded-xl bg-black/60 border border-rose-950/40 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse">
                <Shield className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-white">
                Live Interactive Defense Sandbox
              </p>
              <p className="text-xs text-slate-400 max-w-md">
                Experience real-time prompt injection filtering, RAG context analysis, and jailbreak protection in the attack simulator.
              </p>
              <Link
                href="/login"
                onClick={() => setDemoOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] text-white text-xs font-semibold shadow-lg shadow-rose-900/40"
              >
                <span>Launch Attack Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
