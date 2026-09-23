'use client';

import React from 'react';
import {
  Zap,
  Flame,
  Leaf,
  Wind,
  Container,
  Cloud,
  Code2,
} from 'lucide-react';

export function TechStackSection() {
  const technologies = [
    {
      name: 'Next.js',
      icon: (
        <span className="w-7 h-7 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center border border-slate-700">
          N
        </span>
      ),
    },
    {
      name: 'FastAPI',
      icon: (
        <span className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
          <Zap className="w-4 h-4 fill-teal-400" />
        </span>
      ),
    },
    {
      name: 'Python',
      icon: (
        <span className="w-7 h-7 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-mono font-bold text-xs">
          Py
        </span>
      ),
    },
    {
      name: 'PyTorch',
      icon: (
        <span className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
          <Flame className="w-4 h-4" />
        </span>
      ),
    },
    {
      name: 'MongoDB',
      icon: (
        <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Leaf className="w-4 h-4" />
        </span>
      ),
    },
    {
      name: 'Tailwind CSS',
      icon: (
        <span className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
          <Wind className="w-4 h-4" />
        </span>
      ),
    },
    {
      name: 'Docker',
      icon: (
        <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
          <Container className="w-4 h-4" />
        </span>
      ),
    },
    {
      name: 'Deploy Anywhere',
      icon: (
        <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Cloud className="w-4 h-4" />
        </span>
      ),
    },
  ];

  return (
    <section className="py-14 bg-[#060a12] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-1">
          Built with Modern Technology
        </h3>
        <p className="text-xs text-slate-400 mb-8">
          A robust and scalable stack for real-world deployment.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0c1222]/60 border border-slate-800/60 hover:border-slate-700 transition-colors"
            >
              {tech.icon}
              <span className="text-xs font-semibold text-slate-300">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
