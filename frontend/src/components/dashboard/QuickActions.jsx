'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, MessageSquare, Crosshair, FileUp, ChevronRight, X } from 'lucide-react';

export function QuickActions({ actions = [] }) {
  const [activeModal, setActiveModal] = useState(null);

  const getIcon = (type) => {
    switch (type) {
      case 'scan':
        return {
          icon: ShieldCheck,
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        };
      case 'llm':
        return {
          icon: MessageSquare,
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
        };
      case 'simulator':
        return {
          icon: Crosshair,
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
      case 'upload':
        return {
          icon: FileUp,
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        };
      default:
        return {
          icon: ShieldCheck,
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        };
    }
  };

  return (
    <Card className="flex flex-col justify-between p-5 h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
      </div>

      <div className="space-y-2.5 my-auto">
        {actions.map((action) => {
          const { icon: Icon, bg } = getIcon(action.icon);

          return (
            <button
              key={action.id}
              onClick={() => setActiveModal(action.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${bg} transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {action.description}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>

      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-semibold text-white">
                {actions.find((a) => a.id === activeModal)?.title}
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {actions.find((a) => a.id === activeModal)?.description}. This interface connects to the PromptShield AI defense engine.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Launch
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
