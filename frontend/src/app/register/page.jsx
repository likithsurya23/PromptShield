'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { getAppearanceSettings, applyAppearance } from '@/lib/settings';

export default function RegisterPage() {
  const [, setTheme] = useState('dark');

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = getAppearanceSettings();
      setTheme(saved?.theme || 'dark');
      applyAppearance(saved);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b080e] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-3 sm:p-4 selection:bg-rose-600/30 selection:text-rose-500 transition-colors duration-200 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] bg-rose-600/10 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Header: Brand & Theme Toggle */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 px-1">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-[#1a0e1c] border border-slate-200 dark:border-rose-500/30 text-[#f57b83] shadow-md shadow-rose-950/15 transition-transform group-hover:scale-105 shrink-0">
            <Shield className="w-4 h-4 fill-[#f57b83]/20 stroke-[#f57b83]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-pulse" />
            </div>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            Prompt<span className="text-rose-600 dark:text-[#f57b83]">Shield</span>
          </span>
        </Link>
      </div>

      {/* Modern Centered Register Card (Sized to fit comfortably in 640px height) */}
      <div className="relative w-full max-w-sm rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#120a14]/90 border border-slate-200/90 dark:border-[#2c1622] shadow-xl shadow-slate-200/60 dark:shadow-black/70 backdrop-blur-md p-4 sm:p-5 transition-colors duration-200">
        <RegisterForm />
      </div>

    </div>
  );
}
