'use client';

import React from 'react';
import { ShieldCheck, Zap, FileText, Box } from 'lucide-react';

export function FeaturesGrid() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Hybrid Detection',
      description:
        'Combines ML (DistilBERT) and rule-based detection for high accuracy.',
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description:
        'Instantly analyze and classify prompts with risk scores.',
    },
    {
      icon: FileText,
      title: 'Multiple Attack Types',
      description:
        'Detect direct, indirect, jailbreak, obfuscation and more.',
    },
    {
      icon: Box,
      title: 'Easy Integration',
      description:
        'Simple APIs to secure your existing LLM applications.',
    },
  ];

  return (
    <section id="features" className="py-16 bg-[#060a12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-[#0c1222]/80 border border-slate-800/80 hover:border-blue-500/50 hover:bg-[#0f172a] transition-all duration-200 flex flex-col items-start shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                {/* Icon Container with subtle glow */}
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
