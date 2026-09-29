'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#docs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060207]/90 backdrop-blur-md border-b border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#190612] border border-rose-500/40 text-[#f43f5e] shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-transform group-hover:scale-105 shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-500/25 stroke-[#f43f5e]" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Prompt<span className="text-[#f43f5e]">Shield</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-white rounded-xl border border-rose-950/80 bg-[#12050c] hover:border-rose-500/40 hover:bg-[#1a0812] transition-all shadow-sm"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] hover:opacity-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_18px_rgba(244,63,94,0.4)] active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-950/60 bg-[#0a030b]/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-1 text-sm text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-rose-950/30 transition-colors min-h-[44px] flex items-center"
              >
                {link.name}
              </a>
            ))}
          </div>
          {/* Equal 50/50 Button Row in Mobile View */}
          <div className="pt-3 border-t border-rose-950/60 grid grid-cols-2 gap-2 w-full">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-3 rounded-xl border border-rose-950/80 bg-[#12050c] text-xs sm:text-sm font-medium text-slate-200 min-h-[44px] flex items-center justify-center truncate hover:bg-[#1a0812]"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-900/40 min-h-[44px] flex items-center justify-center truncate hover:opacity-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
