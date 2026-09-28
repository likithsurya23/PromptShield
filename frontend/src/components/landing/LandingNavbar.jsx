'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import {
  getAppearanceSettings,
  saveAppearanceSettings,
  applyAppearance,
} from '@/lib/settings';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('Dark');

  useEffect(() => {
    const saved = getAppearanceSettings();
    applyAppearance(saved);
    setTheme(saved?.theme || 'Dark');

    const handleAppearanceUpdate = (e) => {
      if (e.detail?.theme) setTheme(e.detail.theme);
    };
    window.addEventListener('promptshield:appearance_updated', handleAppearanceUpdate);
    return () => {
      window.removeEventListener('promptshield:appearance_updated', handleAppearanceUpdate);
    };
  }, []);

  const toggleTheme = () => {
    const current = getAppearanceSettings();
    const nextTheme = theme === 'Light' ? 'Dark' : 'Light';
    setTheme(nextTheme);
    const updated = { ...current, theme: nextTheme };
    saveAppearanceSettings(updated);
    applyAppearance(updated);
  };

  const isLight = theme === 'Light';

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#docs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0b080e]/90 backdrop-blur-md transition-colors border-b border-slate-200 dark:border-rose-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-400 shadow-md shadow-rose-900/20 transition-transform group-hover:scale-105">
            <Shield className="w-5 h-5 fill-rose-500/20 stroke-rose-500 dark:stroke-rose-400" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Prompt<span className="text-rose-600 dark:text-[#f57b83]">Shield</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-9 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? (
              <Sun className="w-5 h-5 text-amber-500 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-blue-400 transition-transform hover:-rotate-12" />
            )}
          </button>

          <Link
            href="/login"
            className="px-5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-rose-100 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-rose-950/60 bg-slate-100 dark:bg-[#140b17]/80 hover:bg-slate-200 dark:hover:bg-[#1d0e22] transition-all shadow-sm"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#9f1239] hover:opacity-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-rose-900/35 active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Actions: Theme Toggle + Menu Button */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-blue-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800/60 bg-white/98 dark:bg-[#080d19]/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-rose-950/60 bg-slate-100 dark:bg-[#140b17]/80 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#9f1239] text-sm font-semibold text-white shadow-lg shadow-rose-900/35"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
