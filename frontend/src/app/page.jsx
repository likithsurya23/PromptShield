'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { TryItYourselfWidget } from '@/components/landing/TryItYourselfWidget';
import { AttackCategoriesSection } from '@/components/landing/AttackCategoriesSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { CtaBanner } from '@/components/landing/CtaBanner';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingHomePage() {
  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* 1. Header Navbar */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Hero Section with Security Shield Graphic */}
        <HeroSection />

        {/* 3. 4 Core Features Cards */}
        <FeaturesGrid />

        {/* 4. How PromptShield Works 5-Step Pipeline */}
        <HowItWorksSection />

        {/* 5. Metrics / Stats Row */}
        <StatsSection />

        {/* 6. Try It Yourself Live Analyzer Widget */}
        <TryItYourselfWidget />

        {/* 7. Attack Categories 8-Card Grid */}
        <AttackCategoriesSection />

        {/* 8. Modern Technology Stack */}
        <TechStackSection />

        {/* 9. Bottom Call To Action Banner */}
        <CtaBanner />
      </main>

      {/* 10. Footer */}
      <LandingFooter />
    </div>
  );
}
