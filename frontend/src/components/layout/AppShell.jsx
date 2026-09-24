'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchModal } from '@/components/ui/SearchModal';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export function AppShell({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useKeyboardShortcut('k', () => setIsSearchOpen((prev) => !prev), true);

  return (
    <div className="min-h-screen bg-[#0b080e] text-slate-100 flex font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Quick Search Palette */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
