'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Cpu,
  FileCheck2,
  BarChart2,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      num: 1,
      title: 'User Prompt',
      subtitle: 'Raw input query',
      icon: MessageSquare,
    },
    {
      num: 2,
      title: 'ML Detection',
      subtitle: '(DistilBERT)',
      icon: Cpu,
    },
    {
      num: 3,
      title: 'Rule Engine',
      subtitle: 'Regex & signatures',
      icon: FileCheck2,
    },
    {
      num: 4,
      title: 'Risk Analysis',
      subtitle: 'Confidence score',
      icon: BarChart2,
    },
    {
      num: 5,
      title: 'ALLOW / WARN / BLOCK',
      subtitle: 'Policy enforcement',
      icon: ShieldAlert,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 border-t border-slate-800/60 bg-[#070c17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How{' '}
              <span className="text-blue-500">
                PromptShield
              </span>{' '}
              Works
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl">
              A multi-layered security pipeline to detect and prevent prompt injection attacks.
            </p>
          </div>

          <Link
            href="/prompt-scanner"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-blue-500/50 text-xs font-semibold text-slate-200 hover:text-white transition-all w-fit group"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.num} className="relative flex items-center">
                <div className="w-full h-full p-5 rounded-2xl bg-[#0c1222]/90 border border-slate-800/90 hover:border-blue-500/40 transition-all flex flex-col items-center text-center group shadow-md hover:shadow-blue-500/5">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Step number */}
                  <span className="text-xs font-mono text-slate-400 mb-1">
                    {step.num}
                  </span>

                  {/* Step title */}
                  <h4 className="text-xs font-bold text-white tracking-tight mb-1">
                    {step.title}
                  </h4>

                  {/* Subtitle */}
                  <p className="text-[11px] text-slate-400 font-mono">
                    {step.subtitle}
                  </p>
                </div>

                {/* Connecting Arrow between cards (visible on desktop) */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3 z-20 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 items-center justify-center text-slate-400">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
