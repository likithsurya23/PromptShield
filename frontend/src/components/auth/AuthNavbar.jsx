'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Sun, Moon } from 'lucide-react';
import { getAppearanceSettings, saveAppearanceSettings, applyAppearance } from '@/lib/settings';

export function AuthNavbar() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = getAppearanceSettings();
      setTheme(saved?.theme || 'dark');
      applyAppearance(saved);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    const current = getAppearanceSettings();
    const updated = { ...current, theme: nextTheme };
    saveAppearanceSettings(updated);
    applyAppearance(updated);
  };

  return (
    <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#1a0e1c] border border-rose-500/30 text-[#f57b83] shadow-lg shadow-rose-950/20 transition-transform group-hover:scale-105">
          <Shield className="w-6 h-6 fill-[#f57b83]/20 stroke-[#f57b83]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            Prompt<span className="text-[#f57b83]">Shield</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 tracking-tight mt-1">
            Secure AI. Safer Tomorrow.
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {/* Quick Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Light/Dark Theme"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-[#f57b83] hover:border-rose-400/50 transition-all cursor-pointer shadow-sm"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-rose-600 animate-fade-in" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 animate-fade-in" />
          )}
        </button>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-[#f57b83] font-medium transition-colors group px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50"
        >
          <span>Back to Home</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-[#f57b83] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </header>
  );
}
