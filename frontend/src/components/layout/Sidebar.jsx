'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
  Wrench,
  Layers,
  ListOrdered,
  BarChart2,
  FileText,
  Key,
  Settings,
  Shield,
  X,
} from 'lucide-react';

export function Sidebar({ mobileOpen = false, onCloseMobile = () => { } }) {
  const pathname = usePathname();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'prompt-scanner', label: 'Prompt Scanner', icon: ShieldCheck, href: '/prompt-scanner' },
    { id: 'llm-playground', label: 'LLM Playground', icon: MessageSquare, href: '/llm-playground' },
    { id: 'attack-simulator', label: 'Attack Simulator', icon: Wrench, href: '/attack-simulator' },
    { id: 'rag-security', label: 'RAG Security', icon: Layers, href: '/rag-security' },
    { id: 'security-logs', label: 'Security Logs', icon: ListOrdered, href: '/security-logs' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, href: '/analytics' },
    { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
    { id: 'api-keys', label: 'API Keys', icon: Key, href: '/api-keys' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  const renderNavContent = (isMobileView = false) => (
    <>
      <div className="p-4 flex flex-col">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            onClick={() => isMobileView && onCloseMobile()}
            className="flex items-center gap-3 px-2 py-1.5 group"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#1a0e1c] border border-rose-500/30 text-[#f57b83] shadow-lg shadow-rose-950/20 transition-transform group-hover:scale-105 shrink-0">
              <Shield className="w-5 h-5 fill-[#f57b83]/20 stroke-[#f57b83]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight leading-none">
                Prompt<span className="text-[#f57b83]">Shield</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-tight mt-1">
                Secure AI. Safer Tomorrow.
              </span>
            </div>
          </Link>

          {isMobileView && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => isMobileView && onCloseMobile()}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 text-left min-h-[42px] sm:min-h-[38px] ${isActive
                    ? 'bg-gradient-to-r from-[#e11d48] to-[#9f1239] text-white shadow-md shadow-rose-950/40 font-semibold'
                    : 'text-slate-400 hover:text-rose-100 hover:bg-[#1a0e1c]/70'
                  }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#f57b83]'
                    }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Persistent Fixed Full-Height Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0b080e] border-r border-[#26131c] flex-col justify-between shrink-0 h-screen max-h-screen sticky top-0 left-0 overflow-y-auto select-none z-30 transition-colors">
        {renderNavContent(false)}
      </aside>

      {/* 2. Mobile Responsive Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide Drawer */}
          <aside className="relative z-50 w-72 max-w-[82vw] bg-[#0b080e] border-r border-[#26131c] flex flex-col justify-between h-full overflow-y-auto select-none shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
