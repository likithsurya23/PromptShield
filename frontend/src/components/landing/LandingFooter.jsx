'use client';

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-rose-950/40 bg-white/95 dark:bg-[#0b080e] py-10 text-slate-500 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-[#1a0e1c] border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-[#f57b83] flex items-center justify-center shadow-sm dark:shadow-inner">
              <Shield className="w-4 h-4 fill-rose-500/20 stroke-rose-600 dark:stroke-[#f57b83]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Prompt<span className="text-rose-600 dark:text-[#f57b83]">Shield</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Secure AI. Safer Tomorrow.
              </span>
            </div>
          </Link>

          {/* Right: Nav Links, Socials & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2.5">
            {/* Links & Socials Row */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
              <a href="#docs" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Docs
              </a>
              <a href="#privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Contact
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-3.5 pl-1 text-slate-400">
                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label="X / Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              © 2026 PromptShield. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
