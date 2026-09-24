'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Sun, Moon, Monitor, LayoutGrid, Maximize2 } from 'lucide-react';

export function AppearanceCard({
  appearance,
  onAppearanceChange,
}) {
  return (
    <Card className="p-5 border-[#2c1622] bg-[#120a14]/85 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">
          Appearance
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">
          Customize the look and feel of PromptShield.
        </p>

        {/* Theme */}
        <div className="space-y-2 mb-4">
          <label className="text-[11px] font-medium text-slate-300 block">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Light', icon: Sun, label: 'Light' },
              { id: 'Dark', icon: Moon, label: 'Dark' },
              { id: 'System', icon: Monitor, label: 'System' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = appearance.theme === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onAppearanceChange('theme', t.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500/15 border-[#f43f5e] text-[#f57b83] shadow-sm'
                      : 'bg-[#140c17] border-[#2c1622] text-slate-400 hover:text-white hover:border-rose-500/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-slate-300 block">
            Layout
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: 'Comfortable',
                icon: Maximize2,
                label: 'Comfortable',
                desc: 'More spacing',
              },
              {
                id: 'Compact',
                icon: LayoutGrid,
                label: 'Compact',
                desc: 'Dense layout',
              },
            ].map((l) => {
              const Icon = l.icon;
              const isSelected = appearance.layout === l.id;

              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onAppearanceChange('layout', l.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500/15 border-[#f43f5e] text-[#f57b83] shadow-sm'
                      : 'bg-[#140c17] border-[#2c1622] text-slate-400 hover:text-white hover:border-rose-500/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="text-[11px] font-semibold block leading-none">
                      {l.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {l.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
