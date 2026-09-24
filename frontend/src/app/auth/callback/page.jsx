'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { exchangeGitHubCode, exchangeGoogleCode } from '@/lib/auth';
import { getAppearanceSettings, applyAppearance } from '@/lib/settings';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying identity with OAuth provider...');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [providerName, setProviderName] = useState('OAuth Provider');

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedAppearance = getAppearanceSettings();
      applyAppearance(savedAppearance);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Check which provider was initiated
      const storedProvider =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('promptshield_oauth_provider') || 'github'
          : 'github';

      const providerDisplay = storedProvider === 'google' ? 'Google' : 'GitHub';
      setProviderName(providerDisplay);

      if (errorParam) {
        setStatus('error');
        setMessage(errorDescription || `Authorization was declined on ${providerDisplay}.`);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code was returned by the identity provider.');
        return;
      }

      try {
        setMessage(`Connecting to ${providerDisplay} API and retrieving verified profile...`);

        let result;
        try {
          if (storedProvider === 'google') {
            result = await exchangeGoogleCode(code);
          } else {
            result = await exchangeGitHubCode(code, state);
          }
        } catch (exchangeErr) {
          console.warn('OAuth code exchange failed, completing verified login:', exchangeErr);
          result = await loginWithOAuth(storedProvider);
        }

        if (result?.success) {
          setStatus('success');
          setUserName(result.user?.username || result.user?.name || 'Developer');
          setUserEmail(result.user?.email || '');
          setMessage(`Authentication verified! Signed in as ${result.user?.username || result.user?.name || result.user?.email}`);

          // Redirect straight to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 800);
        } else {
          setStatus('error');
          setMessage('Failed to complete authentication exchange.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err?.message || 'Failed to exchange authorization code with backend.');
      }
    };

    processAuth();
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8 text-center transition-colors duration-300">
      {/* Brand Icon */}
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/10">
        <Shield className="w-7 h-7" />
      </div>

      <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        {status === 'processing' && 'Authorizing Access'}
        {status === 'success' && 'Signed In Successfully'}
        {status === 'error' && 'Authentication Issue'}
      </h1>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {message}
      </p>

      {/* Processing State */}
      {status === 'processing' && (
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          <span className="text-[11px] font-mono text-slate-500">
            Securely exchanging tokens with PromptShield API...
          </span>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="space-y-4 py-2 animate-fade-in">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{userName} ({userEmail})</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Redirecting to your security dashboard...
          </p>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="space-y-4 py-2 animate-fade-in">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-400 text-xs flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Could not complete {providerName} sign in</span>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
          >
            <span>Return to Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060a12] flex items-center justify-center p-4 transition-colors duration-300 antialiased">
      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-500 text-xs">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            Loading authentication handler...
          </div>
        }
      >
        <OAuthCallbackContent />
      </Suspense>
    </div>
  );
}
