'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, LogOut, User, LogIn, ChevronDown } from 'lucide-react';
import { getCurrentUser, removeStoredToken } from '@/lib/auth';

export function Header({ onOpenSearch }) {
  const [user, setUser] = useState(() => (typeof window !== 'undefined' ? getCurrentUser() : null));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    removeStoredToken();
    setUser(null);
    setDropdownOpen(false);
  };

  const displayName = user?.name || 'Likith D';
  const displayPlan = user?.plan || 'Free Plan';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'LD';

  return (
    <header className="h-16 px-8 border-b border-slate-800/80 bg-[#080d19]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar matching wireframe */}
      <div className="w-full max-w-md">
        <div
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#0e1626] border border-slate-800 hover:border-slate-700 text-slate-400 cursor-pointer transition-all shadow-inner group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
          <span className="text-xs text-slate-400 group-hover:text-slate-300 flex-1 select-none">
            Search scans, prompts, reports...
          </span>
          <kbd className="text-[10px] font-medium tracking-wide bg-[#172238] border border-slate-700/60 px-2 py-0.5 rounded text-slate-400">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#080d19]" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-2 border-l border-slate-800/80 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-900/30 group-hover:ring-2 group-hover:ring-indigo-500/50 transition-all">
              {initials}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                {displayPlan}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform" />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0f172a] border border-slate-700/80 shadow-2xl shadow-black py-1.5 z-40">
              <div className="px-3.5 py-2 border-b border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Signed in as</span>
                <span className="text-white font-semibold truncate block">
                  {user?.email || 'developer@promptshield.io'}
                </span>
              </div>

              <Link
                href="/login"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800/60 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Switch / Login</span>
              </Link>

              <Link
                href="/register"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800/60 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Create New Account</span>
              </Link>

              <div className="border-t border-slate-800 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
