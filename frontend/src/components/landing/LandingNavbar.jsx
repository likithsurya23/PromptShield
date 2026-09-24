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
    <header className="sticky top-0 z-50 w-full bg-[#0b080e]/90 backdrop-blur-md transition-colors border-b border-rose-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-md shadow-rose-900/20 transition-transform group-hover:scale-105">
            <Shield className="w-5 h-5 fill-rose-500/20 stroke-rose-400" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Prompt<span className="text-[#f57b83]">Shield</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-9 text-xs sm:text-sm font-medium text-slate-300">
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
        <div className="hidden md:flex items-center gap-3.5">
          <Link
            href="/login"
            className="px-5 py-2 text-xs sm:text-sm font-medium text-rose-100 hover:text-white rounded-xl border border-rose-950/60 bg-[#140b17]/80 hover:bg-[#1d0e22] transition-all shadow-sm"
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800/60 bg-[#080d19]/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-2 text-sm text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-sm font-medium text-slate-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg bg-[#1d61f2] text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
