'use client';

import React from 'react';
import { AuthNavbar } from '@/components/auth/AuthNavbar';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthShowcase } from '@/components/auth/AuthShowcase';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200 antialiased">
      {/* Top Navbar */}
      <AuthNavbar />

      {/* Main Split Container matching wireframe */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl rounded-3xl bg-[#090e1c]/80 border border-slate-800/80 shadow-2xl shadow-black/80 backdrop-blur-xl p-4 sm:p-6 md:p-8">
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

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
