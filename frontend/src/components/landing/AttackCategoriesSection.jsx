'use client';

import React from 'react';
import Link from 'next/link';
import {
  Terminal,
  Link2,
  FileText,
  Drama,
  Code2,
  User,
  ShieldAlert,
  Database,
  ArrowRight,
} from 'lucide-react';

export function AttackCategoriesSection() {
  const categories = [
    {
      name: 'Direct Injection',
      icon: Terminal,
      description: 'System override keywords & prompts',
    },
    {
      name: 'Indirect Injection',
      icon: Link2,
      description: 'Poisoned web & document contexts',
    },
    {
      name: 'Instruction Override',
      icon: FileText,
      description: 'Context and rule nullification',
    },
    {
      name: 'Jailbreak',
      icon: Drama,
      description: 'DAN, hypothetical & persona shifts',
    },
    {
      name: 'Obfuscation',
      icon: Code2,
      description: 'Base64, hex & Unicode evasions',
    },
    {
      name: 'Role Manipulation',
      icon: User,
      description: 'Unauthorized admin/developer roles',
    },
    {
      name: 'Safety Bypass',
      icon: ShieldAlert,
      description: 'Moderation guard evasion tricks',
    },
    {
      name: 'System Prompt Extraction',
      icon: Database,
      description: 'Exfiltration of system secrets',
    },
  ];

  return (
    <section className="py-16 bg-[#070c17] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Attack Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Detect a wide range of prompt injection techniques.
            </p>
          </div>

          <Link
            href="/attack-simulator"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0c1222]/90 border border-slate-800/80 hover:border-blue-500/50 hover:bg-[#0f172a] transition-all flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
                  {cat.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
