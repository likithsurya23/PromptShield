'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { initiateGoogleOAuth, initiateGitHubOAuth } from '@/lib/auth';

export function SocialButtons() {
  const router = useRouter();

  const handleGoogleClick = () => {
    const realClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (realClientId) {
      initiateGoogleOAuth(realClientId);
    } else {
      router.push('/auth/google');
    }
  };

  const handleGitHubClick = () => {
    const realClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (realClientId) {
      initiateGitHubOAuth(realClientId);
    } else {
      router.push('/auth/github');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-200 dark:border-[#2c1622] w-full" />
        <span className="bg-white dark:bg-[#120a14] px-3 text-[11px] text-slate-500 font-medium whitespace-nowrap">
          or continue with
        </span>
        <div className="border-t border-slate-200 dark:border-[#2c1622] w-full" />
      </div>

      {/* Social Provider Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-[#140c17] border border-slate-200 dark:border-[#2c1622] hover:border-slate-300 dark:hover:border-rose-500/40 hover:bg-slate-100 dark:hover:bg-[#1f0f1f] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-sm group cursor-pointer active:scale-95"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          <span>Google</span>
        </button>

        {/* GitHub OAuth Button */}
        <button
          type="button"
          onClick={handleGitHubClick}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-[#140c17] border border-slate-200 dark:border-[#2c1622] hover:border-slate-300 dark:hover:border-rose-500/40 hover:bg-slate-100 dark:hover:bg-[#1f0f1f] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-sm group cursor-pointer active:scale-95"
        >
          <svg
            className="w-4 h-4 shrink-0 fill-slate-800 dark:fill-slate-200 group-hover:fill-black dark:group-hover:fill-white"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>
    </div>
  );
}
