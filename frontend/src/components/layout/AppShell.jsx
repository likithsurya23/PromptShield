'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchModal } from '@/components/ui/SearchModal';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export function AppShell({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useKeyboardShortcut('k', () => setIsSearchOpen((prev) => !prev), true);

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-[#0b080e] text-slate-100 flex font-sans antialiased">
      {/* Left Sidebar (Desktop fixed/sticky full height + Mobile slide-over drawer) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area: Only this area scrolls vertically */}
      <div className="flex-1 flex flex-col h-screen max-h-screen min-w-0 w-full overflow-hidden">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Quick Search Palette */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
