'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { SocialButtons } from './SocialButtons';
import { registerWithCredentials } from '@/lib/auth';

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700', text: 'text-slate-500' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-sky-400', text: 'text-sky-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await registerWithCredentials(username, email, password);
      if (res.success) {
        router.push('/login');
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An error occurred during account creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-2 sm:p-4">
      <div>
        {/* Header Tag and Title */}
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1 block">
          CREATE ACCOUNT
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Join <span className="text-rose-600 dark:text-[#f57b83]">PromptShield</span>
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 mb-5 leading-relaxed">
          Create your account and start securing your LLM applications today.
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Username</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Kurosaki Ichigo"
                className="w-full bg-slate-50 dark:bg-[#140c17] border border-slate-300 dark:border-[#2c1622] rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
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
                className="w-full bg-slate-50 dark:bg-[#140c17] border border-slate-300 dark:border-[#2c1622] rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
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
                className="w-full bg-slate-50 dark:bg-[#140c17] border border-slate-300 dark:border-[#2c1622] rounded-xl py-2 pl-10 pr-10 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono tracking-wider shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            <div className="flex items-center justify-between gap-3 pt-1.5 px-0.5">
              <div className="grid grid-cols-4 gap-1.5 flex-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[11px] font-semibold tracking-wide ${strength.text}`}>
                {strength.label || 'Strong'}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Confirm Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-[#140c17] border border-slate-300 dark:border-[#2c1622] rounded-xl py-2 pl-10 pr-10 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono tracking-wider shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Agree Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11px] text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-100 dark:bg-[#140c17] border-slate-300 dark:border-[#2c1622] text-rose-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-rose-600 mt-0.5"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-rose-600 dark:text-[#f57b83] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-rose-600 dark:text-[#f57b83] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50 mt-3 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Social Logins */}
        <SocialButtons />
      </div>

      {/* Footer Switch */}
      <div className="text-center pt-5 text-xs text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-rose-600 dark:text-[#f57b83] hover:underline font-semibold transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}
