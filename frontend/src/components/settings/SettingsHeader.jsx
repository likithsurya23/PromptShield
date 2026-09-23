'use client';

import React from 'react';
import { Settings } from 'lucide-react';

export function SettingsHeader() {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
        <Settings className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
          Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure your PromptShield preferences and security rules.
        </p>
      </div>
    </div>
  );
}
