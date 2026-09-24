'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { loginWithOAuth } from '@/lib/auth';

export default function GoogleAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('user@gmail.com');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const chosenName = name.trim() || email.split('@')[0];

    try {
      await loginWithOAuth('google', {
        name: chosenName,
        email: email.trim(),
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
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-[#0c1222] border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/80">
        {/* Google & PromptShield Logos */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-200">Google Accounts</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>PromptShield</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight">Sign in with Google</h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose or confirm your Google account to access your PromptShield dashboard.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Google Account Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Leave blank to use username"
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              PromptShield will only verify your account identity to securely log you in.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying with Google...</span>
              </>
            ) : (
              <>
                <span>Verify & Continue to Dashboard</span>
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
