'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SecurityPipelineSection } from '@/components/landing/SecurityPipelineSection';
import { CtaBanner } from '@/components/landing/CtaBanner';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CyberBackgroundAnimation } from '@/components/landing/CyberBackgroundAnimation';

export default function LandingHomePage() {
  return (
    <div className="landing-page-root relative min-h-screen bg-[#0b080e] text-slate-100 font-sans selection:bg-rose-600 selection:text-white flex flex-col">
      {/* Background Cyber Animation with prefers-reduced-motion accessibility */}
      <CyberBackgroundAnimation />

      {/* 1. Header Navbar */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Hero Section matching uploaded design with 3D Shield & 4 Features */}
        <HeroSection />

        {/* 3. How It Works (5-Stage Security Pipeline) */}
        <SecurityPipelineSection />

        {/* 4. Call To Action (Build Safer AI Today) */}
        <CtaBanner />
      </main>

      {/* 6. Footer */}
      <LandingFooter />
    </div>
  );
}
