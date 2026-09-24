'use client';

import React, { useEffect } from 'react';
import { AuthNavbar } from '@/components/auth/AuthNavbar';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthShowcase } from '@/components/auth/AuthShowcase';
import { getAppearanceSettings, applyAppearance } from '@/lib/settings';

export default function LoginPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = getAppearanceSettings();
      applyAppearance(saved);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b080e] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-600/30 selection:text-rose-500 dark:selection:text-[#f57b83] antialiased transition-colors duration-300">
      {/* Top Navbar */}
      <AuthNavbar />

      {/* Main Split Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl rounded-3xl bg-white/95 dark:bg-[#120a14]/85 border border-slate-200/90 dark:border-[#2c1622] shadow-2xl shadow-slate-200/60 dark:shadow-black/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column: Form */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <LoginForm />
            </div>

            {/* Right Column: Graphic Showcase */}
            <div className="lg:col-span-6 hidden md:block">
              <AuthShowcase mode="login" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
