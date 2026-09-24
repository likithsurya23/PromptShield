'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { SocialButtons } from './SocialButtons';
import { loginWithCredentials } from '@/lib/auth';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loginWithCredentials(email, password, rememberMe);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-2 sm:p-4">
      <div>
        {/* Header Tag and Title */}
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1 block">
          WELCOME BACK
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Login to <span className="text-rose-600 dark:text-[#f57b83]">PromptShield</span>
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
          Continue to your account to scan, analyze and secure your AI applications.
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Email</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 dark:bg-[#140c17] border border-slate-300 dark:border-[#2c1622] rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-[#140c17] border border-slate-300 dark:border-[#2c1622] rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono tracking-wider shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-100 dark:bg-[#140c17] border-slate-300 dark:border-[#2c1622] text-rose-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-rose-600"
              />
              <span>Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-xs text-rose-600 dark:text-[#f57b83] hover:underline font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Social Logins */}
        <SocialButtons />
      </div>

      {/* Footer Switch */}
      <div className="text-center pt-6 text-xs text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-rose-600 dark:text-[#f57b83] hover:underline font-semibold transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
}
