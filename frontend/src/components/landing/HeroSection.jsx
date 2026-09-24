'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Database,
  Lock,
  BarChart3,
  ArrowRight,
  Play,
} from 'lucide-react';
import { SecurityAnimation } from './SecurityAnimation';

export function HeroSection() {
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
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Pill, Subtitle, CTA buttons */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Tag */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-[#1e0a14]/80 text-[#f57b83] text-[11px] font-semibold tracking-wider uppercase shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-pulse" />
                <span>AI SECURITY FOR A SAFER TOMORROW</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.12]">
              Stop Prompt<br />
              Injection Before<br />
              It Reaches{' '}
              <span className="bg-gradient-to-r from-[#f57b83] via-[#e11d48] to-[#fdc6cb] bg-clip-text text-transparent">
                Your LLM
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
              PromptShield uses advanced machine learning and rule-based detection to
              analyze and block malicious prompts in real time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white text-sm font-semibold transition-all shadow-lg shadow-rose-950/40 active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-rose-900/40 hover:border-rose-500/40 bg-[#140b12]/80 hover:bg-[#1f101c] text-white text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[#f57b83]">
                  <Play className="w-2.5 h-2.5 fill-[#f57b83] ml-0.5" />
                </div>
                <span>Learn More</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Animated Security Shield */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <SecurityAnimation />
          </div>

        </div>

        {/* Bottom Feature Badges Bar */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-rose-950/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bottomFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#130b14]/70 border border-rose-950/60 hover:border-rose-500/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1a0e1c] border border-rose-500/25 text-[#f57b83] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white block">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white block">
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
    </section>
  );
}
