'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '@/app/globals.css';

const Loader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Check if current route is an auth page (login, register, signup)
  const isAuthPage =
    Boolean(pathname) &&
    (pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/signup' ||
      pathname.startsWith('/login/') ||
      pathname.startsWith('/register/') ||
      pathname.startsWith('/signup/'));

  useEffect(() => {
    // Skip timer on auth pages
    if (isAuthPage) return;

    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500); // 4.5 seconds

    return () => clearTimeout(timer);
  }, [isAuthPage]);

  // Do not render loader for login or register, or once completed
  if (isAuthPage || !loading) return null;

  return (
    <div
      className="shield-loader-root"
      role="status"
      aria-live="polite"
      aria-label="Loading PromptShield"
    >
      <div className="shield-loader-wrap">
        {/* Concentric core containing rings and shield */}
        <div className="shield-loader-core">
          {/* Orbital rings */}
          <div className="ring-base ring-1-el" aria-hidden="true" />
          <div className="ring-base ring-2-el" aria-hidden="true" />
          <div className="ring-base ring-3-el" aria-hidden="true" />

          {/* Pulsing outer ring */}
          <div className="pulse-ring-el" aria-hidden="true" />

          {/* Central shield */}
          <div className="shield-shape" aria-hidden="true" />
        </div>

        {/* Loading text */}
        <div className="loading-text-el" aria-hidden="true">
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
