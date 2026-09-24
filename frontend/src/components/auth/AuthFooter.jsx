'use client';

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export function AuthFooter() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 mt-16 py-8 px-6 text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">PromptShield</span>
            <span className="text-[11px] text-slate-500 block">Secure AI. Safer Tomorrow.</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-6 text-[12px]">
          <Link href="/about" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">About</Link>
          <Link href="/features" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Features</Link>
          <Link href="/docs" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Docs</Link>
          <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Contact</Link>
        </div>

        {/* Right: Social Icons & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-400">
            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors" title="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors" title="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors" title="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors" title="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
          <span className="text-[11px] text-slate-500">© 2026 PromptShield. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
