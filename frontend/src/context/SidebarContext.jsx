'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SidebarContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => {},
  setIsCollapsed: () => {},
  openMobile: false,
  setOpenMobile: () => {},
});

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsedState] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('promptshield_sidebar_collapsed');
        if (stored !== null) {
          setIsCollapsedState(stored === 'true');
        }
      } catch {}
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('promptshield_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  }, []);

  const setIsCollapsed = useCallback((value) => {
    setIsCollapsedState(value);
    try {
      localStorage.setItem('promptshield_sidebar_collapsed', String(value));
    } catch {}
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        setIsCollapsed,
        openMobile,
        setOpenMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
