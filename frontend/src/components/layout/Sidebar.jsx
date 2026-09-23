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
  Crown,
  Shield,
} from 'lucide-react';

export function Sidebar() {
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

  return (
    <aside className="w-64 bg-[#080d19] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto select-none">
      <div className="p-4 flex flex-col">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-4 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-500 shadow-lg shadow-blue-500/10 transition-transform group-hover:scale-105">
            <Shield className="w-6 h-6 fill-blue-600/20 stroke-blue-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight leading-none">
              PromptShield
            </span>
            <span className="text-[11px] text-slate-400 tracking-tight mt-1">
              Secure AI. Safer Tomorrow.
            </span>
          </div>
        </Link>

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
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-[#1d4ed8] text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Card & Footer */}
      <div className="p-4 space-y-4">
        <div className="p-4 rounded-xl bg-gradient-to-b from-[#0f172a] to-[#090e1a] border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 mb-1.5">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="text-xs font-semibold text-white">Upgrade to Pro</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            Get advanced features, higher limits and more.
          </p>
          <button className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/40 transition-colors">
            Upgrade
          </button>
        </div>

        <div className="px-2 pt-1 border-t border-slate-800/60 text-[11px] text-slate-500 flex flex-col gap-0.5">
          <span>v1.0.0</span>
          <span>© 2026 PromptShield</span>
        </div>
      </div>
    </aside>
  );
}
