'use client';

import React from 'react';
import {
  Shield,
  BarChart2,
  Lock,
  Users,
  GraduationCap,
  Database,
} from 'lucide-react';

export function AuthShowcase({ mode = 'login' }) {
  const isLogin = mode === 'login';

  const loginContent = {
    title: 'Secure Every Prompt',
    tags: 'Detect · Analyze · Prevent',
    features: [
      {
        icon: Shield,
        title: 'AI-Powered Detection',
        desc: 'Stop malicious prompts before they reach your LLM.',
      },
      {
        icon: BarChart2,
        title: 'Real-time Analysis',
        desc: 'Get instant security insights.',
      },
      {
        icon: Lock,
        title: 'Built for Developers',
        desc: 'Easily integrate with your existing applications.',
      },
    ],
    quote: '“A safer AI future starts with better security.”',
  };

  const registerContent = {
    title: 'Be Part of a Safer AI Future',
    tags: 'Detect · Analyze · Prevent · Enable',
    features: [
      {
        icon: Users,
        title: 'Join a Growing Community',
        desc: 'Researchers, developers and security enthusiasts.',
      },
      {
        icon: GraduationCap,
        title: 'Access Research Tools',
        desc: 'Test, analyze and learn.',
      },
      {
        icon: Database,
        title: 'Build Secure AI Applications',
        desc: 'From idea to production.',
      },
    ],
    quote: '“Security is a feature, not an afterthought.”',
  };

  const content = isLogin ? loginContent : registerContent;

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0e172a] via-[#09101f] to-[#060a14] border border-blue-900/40 p-8 flex flex-col justify-between overflow-hidden shadow-2xl h-full min-h-[580px]">
      {/* Background Graphic: Mountains & Glowing Neon Stream with Shield */}
      <div className="relative w-full flex flex-col items-center justify-center pt-4 pb-6">
        {/* Glowing aura */}
        <div className="absolute top-10 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Graphic matching wireframe */}
        <svg
          viewBox="0 0 320 180"
          className="w-full max-w-[280px] h-auto overflow-visible select-none drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="mountainGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B1120" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="mountainGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Distant Mountain Silhouettes */}
          <path
            d="M 10 160 L 70 80 L 130 140 L 200 65 L 260 130 L 310 160 Z"
            fill="url(#mountainGrad2)"
          />
          <path
            d="M -10 170 L 60 105 L 110 150 L 160 95 L 230 160 L 330 170 Z"
            fill="url(#mountainGrad1)"
          />

          {/* Winding Cyber Stream */}
          <path
            d="M 160 110 Q 155 130 140 145 T 190 175"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="3.5"
            filter="url(#neonGlow)"
            strokeLinecap="round"
          />

          {/* Glowing Shield Emblem in Center */}
          <g transform="translate(136, 25)">
            {/* Outer glow ring */}
            <circle cx="24" cy="28" r="32" fill="#3B82F6" opacity="0.15" />
            {/* Outer Shield */}
            <path
              d="M 24 2 C 38 2 48 10 48 10 C 48 32 36 50 24 56 C 12 50 0 32 0 10 C 0 10 10 2 24 2 Z"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="2"
              filter="url(#neonGlow)"
            />
            {/* Inner Shield Accent */}
            <path
              d="M 24 10 C 33 10 39 16 39 16 C 39 30 30 42 24 46 C 18 42 9 30 9 16 C 9 16 15 10 24 10 Z"
              fill="#1D4ED8"
              opacity="0.4"
            />
            {/* Shield Center Icon */}
            <path
              d="M 24 16 L 24 38 M 16 26 L 24 18 L 32 26"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {/* Title and Tags */}
        <div className="text-center mt-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {content.title}
          </h2>
          <p className="text-xs text-blue-400/90 font-medium tracking-wide mt-1">
            {content.tags}
          </p>
        </div>
      </div>

      {/* 3 Bullet Features */}
      <div className="space-y-4 my-auto pt-2">
        {content.features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5 shadow-sm shadow-blue-900/20">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-100">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {item.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote at Bottom */}
      <div className="pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs italic text-slate-400">
          {content.quote}
        </p>
      </div>
    </div>
  );
}
