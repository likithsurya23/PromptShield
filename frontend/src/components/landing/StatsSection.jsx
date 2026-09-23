'use client';

import React from 'react';
import { Infinity } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      value: '99%',
      label: 'Detection Accuracy',
      sublabel: '(on benchmark set)',
    },
    {
      value: '8+',
      label: 'Attack Categories',
      sublabel: 'Supported',
    },
    {
      value: '10K+',
      label: 'Prompts Analyzed',
      sublabel: '(Research & Testing)',
    },
    {
      value: '< 200ms',
      label: 'Average Response Time',
      sublabel: '',
    },
    {
      value: 'infinity',
      label: 'Built for Real-world',
      sublabel: 'AI Applications',
    },
  ];

  return (
    <section className="py-14 border-y border-slate-800/80 bg-[#060a12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-400 mb-1 tracking-tight flex items-center justify-center">
                {stat.value === 'infinity' ? (
                  <Infinity className="w-9 h-9 stroke-[2.5]" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-xs font-semibold text-white tracking-tight">
                {stat.label}
              </div>
              {stat.sublabel && (
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {stat.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
