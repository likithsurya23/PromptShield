'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="py-12 sm:py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow Box Container matching reference image */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-rose-500/35 bg-gradient-to-b from-[#180715]/95 via-[#22091d]/90 to-[#0e020b]/98 p-6 xs:p-8 sm:p-14 text-center shadow-[0_0_60px_-10px_rgba(244,63,94,0.3)]">
          
          {/* Deep Ambient Nebula behind the banner */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[120px] bg-rose-600/15 blur-[60px] rounded-full pointer-events-none" />

          {/* Curved Planetary Laser Horizon Arc at the bottom */}
          <div className="absolute -bottom-10 inset-x-0 h-44 pointer-events-none overflow-hidden flex items-end justify-center">
            {/* Ambient Red Horizon Glow */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#e11d48]/30 via-rose-600/10 to-transparent blur-2xl" />
            
            {/* Vector Curved Dome Laser Horizon */}
            <svg
              viewBox="0 0 1000 240"
              preserveAspectRatio="none"
              className="w-full h-44 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)] opacity-85"
            >
              <defs>
                <linearGradient id="horizonLaser" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#881337" stopOpacity="0.1" />
                  <stop offset="25%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="75%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#881337" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="horizonMesh" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0e020b" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Curved Horizon Underbody Mesh */}
              <path
                d="M -100 240 Q 500 20 1100 240 Z"
                fill="url(#horizonMesh)"
              />

              {/* Laser Core Horizon Arc */}
              <path
                d="M -100 240 Q 500 20 1100 240"
                fill="none"
                stroke="url(#horizonLaser)"
                strokeWidth="2.5"
              />

              {/* Wireframe Perspective Radial Lines */}
              <line x1="500" y1="20" x2="100" y2="240" stroke="rgba(244,63,94,0.18)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="500" y1="20" x2="300" y2="240" stroke="rgba(244,63,94,0.18)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="500" y1="20" x2="500" y2="240" stroke="rgba(244,63,94,0.22)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="500" y1="20" x2="700" y2="240" stroke="rgba(244,63,94,0.18)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="500" y1="20" x2="900" y2="240" stroke="rgba(244,63,94,0.18)" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Build Safer AI Today
            </h2>

            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-lg mx-auto">
              Join developers and organizations securing their LLM applications with PromptShield in real time.
            </p>

            {/* Glowing CTA Button */}
            <div className="pt-2 flex justify-center">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#e11d48] hover:opacity-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_25px_rgba(244,63,94,0.55)] active:scale-95 cursor-pointer min-h-[44px]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
