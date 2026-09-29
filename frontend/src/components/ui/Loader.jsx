'use client';

import React, { useState, useEffect } from 'react';
import '@/app/globals.css';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500); // 4.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="shield-loader-root">
      <div className="shield-loader-wrap">
        {/* Orbital rings */}
        <div className="ring-base ring-1-el"></div>
        <div className="ring-base ring-2-el"></div>
        <div className="ring-base ring-3-el"></div>

        {/* Pulsing outer ring */}
        <div className="pulse-ring-el"></div>

        {/* Central shield */}
        <div className="shield-shape"></div>

        {/* Loading text */}
        <div className="loading-text-el">
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
