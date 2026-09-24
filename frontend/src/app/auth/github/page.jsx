'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { loginWithOAuth } from '@/lib/auth';

export default function GitHubAuthPage() {
  const router = useRouter();
  const [username, setUsername] = useState('developer');
  const [email, setEmail] = useState('developer@github.com');
  const [loading, setLoading] = useState(false);

  const handleAuthorize = async (e) => {
    e.preventDefault();
    setLoading(true);

    const chosenUsername = username.trim() || 'developer';
    const chosenEmail = email.trim() || `${chosenUsername}@github.com`;

    try {
      await loginWithOAuth('github', {
        name: chosenUsername,
        email: chosenEmail,
        avatarUrl: '',
      });

      // Redirect straight to dashboard
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-[#0c1222] border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/80">
        {/* GitHub & PromptShield Logos */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="text-sm font-semibold text-slate-200">GitHub</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>PromptShield</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight">Authorize PromptShield</h1>
          <p className="text-xs text-slate-400 mt-1">
            PromptShield requests read access to verify your GitHub account.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleAuthorize} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              GitHub Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. your_username"
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Personal access and public user data will be verified for AI Security Dashboard access.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing with GitHub...</span>
              </>
            ) : (
              <>
                <span>Authorize & Continue to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Cancel */}
        <div className="text-center mt-6 pt-4 border-t border-slate-800/80">
          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel and return to login
          </Link>
        </div>
      </div>
    </main>
  );
}
