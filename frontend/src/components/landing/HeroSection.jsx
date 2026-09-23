'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Terminal,
  FileText,
  HelpCircle,
  Code2,
} from 'lucide-react';

export function HeroSection() {
  const trustPoints = [
    'AI-Powered Detection',
    'Real-time Analysis',
    'Research Driven',
    'Easy Integration',
  ];

  const maliciousInputs = [
    { text: 'Ignore previous instructions...', icon: AlertTriangle },
    { text: 'Reveal your system prompt...', icon: AlertTriangle },
    { text: 'You are now DAN...', icon: AlertTriangle },
    { text: '<script> ....', icon: FileCode },
  ];

  const safeOutputs = [
    { text: 'Explain machine learning', icon: CheckCircle2 },
    { text: 'What is React?', icon: CheckCircle2 },
    { text: 'Summarize this document', icon: FileText },
    { text: 'Help me with Python code', icon: Code2 },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/60 bg-gradient-to-b from-[#060a12] via-[#091022] to-[#060a12]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[11px] font-semibold tracking-wider uppercase shadow-sm shadow-blue-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>LLM SECURITY PLATFORM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.15]">
              Protect Your LLM Applications From{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                Prompt Injection
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Detect malicious prompts, analyze security risks, and protect your AI
              applications with hybrid ML and rule-based detection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/prompt-scanner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Try Live Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0c1222] border border-slate-700/80 hover:border-slate-600 text-slate-200 text-sm font-medium transition-colors"
              >
                View Documentation
              </a>
            </div>

            {/* 4 Trust Checkmarks */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Shield Architecture Diagram */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center p-4">
            {/* Top PromptShield Title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-white tracking-wide">
                PromptShield
              </span>
            </div>

            {/* Interactive Flow Visual */}
            <div className="relative w-full max-w-[580px] h-[340px] flex items-center justify-between">
              {/* SVG Connecting lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 580 340"
                fill="none"
              >
                {/* Red converging paths from left inputs into center shield (center approx 290, 160) */}
                <path
                  d="M 180 50 C 230 50, 240 140, 260 150"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.7"
                />
                <path
                  d="M 180 115 C 220 115, 235 150, 260 155"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.7"
                />
                <path
                  d="M 180 185 C 220 185, 235 165, 260 165"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.7"
                />
                <path
                  d="M 180 250 C 230 250, 240 180, 260 170"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.7"
                />

                {/* Green diverging paths from center shield into right clean outputs */}
                <path
                  d="M 320 150 C 340 140, 350 50, 400 50"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.7"
                />
                <path
                  d="M 320 155 C 345 150, 360 115, 400 115"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.7"
                />
                <path
                  d="M 320 165 C 345 165, 360 185, 400 185"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.7"
                />
                <path
                  d="M 320 170 C 340 180, 350 250, 400 250"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.7"
                />
              </svg>

              {/* Left Column: Malicious Inputs */}
              <div className="flex flex-col justify-between h-full py-2 z-10 space-y-2.5 w-[185px]">
                {maliciousInputs.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#13111c]/90 border border-rose-500/30 shadow-md shadow-rose-950/20 text-left group hover:border-rose-500/60 transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 truncate">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Center Glowing Shield */}
              <div className="relative z-20 flex flex-col items-center justify-center">
                {/* Glow rings */}
                <div className="absolute w-36 h-36 rounded-full bg-blue-500/15 blur-xl animate-pulse" />
                <div className="relative w-28 h-32 rounded-3xl bg-gradient-to-b from-blue-600/30 via-blue-900/40 to-[#0c1a35] border-2 border-blue-400/60 shadow-[0_0_40px_rgba(59,130,246,0.35)] flex flex-col items-center justify-center backdrop-blur-md">
                  <Shield className="w-16 h-16 text-blue-400/40 absolute" />
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-white shadow-inner">
                    <Lock className="w-6 h-6 text-white drop-shadow" />
                  </div>
                  <span className="relative z-10 text-[9px] font-bold tracking-wider uppercase text-blue-300 mt-2">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Right Column: Clean Safe Outputs */}
              <div className="flex flex-col justify-between h-full py-2 z-10 space-y-2.5 w-[185px]">
                {safeOutputs.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#0c1d18]/90 border border-emerald-500/30 shadow-md shadow-emerald-950/20 text-left group hover:border-emerald-500/60 transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200 truncate">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Tagline below shield */}
            <div className="mt-4 text-center">
              <span className="text-xs font-semibold tracking-wider text-slate-400">
                Detect <span className="text-blue-500">·</span> Analyze{' '}
                <span className="text-blue-500">·</span> Prevent{' '}
                <span className="text-blue-500">·</span> Enable Safe AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
