import React from 'react';
import {
  MessageSquare,
  Brain,
  FileText,
  Gauge,
  ShieldCheck,
  ChevronsRight,
  ChevronsDown,
} from 'lucide-react';

export function SecurityPipelineSection() {
  const steps = [
    {
      icon: MessageSquare,
      title: 'User Prompt',
      description: 'Input from your application',
    },
    {
      icon: Brain,
      title: 'ML Detector',
      description: 'DistilBERT V2 classifies intent',
    },
    {
      icon: FileText,
      title: 'Rule Engine',
      description: 'Pattern & heuristic rule matching',
    },
    {
      icon: Gauge,
      title: 'Risk Engine',
      description: 'Combine ML + rules to calculate risk',
    },
    {
      icon: ShieldCheck,
      title: 'Security Action',
      description: 'ALLOW / WARN / BLOCK',
    },
  ];

  return (
    <section id="how-it-works" className="py-8 sm:py-20 bg-[#070308] relative overflow-hidden">
      {/* Subtle Ambient Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-16">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#f43f5e] mb-1.5 sm:mb-2.5">
            HOW IT WORKS
          </p>
          <h2 className="text-xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-tight">
            A Simple, Effective Security Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 sm:mt-2.5 max-w-md mx-auto">
            Every prompt passes through our multi-layered defense mesh in sub-milliseconds.
          </p>
        </div>

        {/* Desktop View: Exact Horizontal 5-Step Pipeline with Circular Radar Nodes & >> Chevrons */}
        <div className="hidden lg:flex items-start justify-between gap-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center text-center w-48 flex-1 group">
                  {/* Concentric Circular Radar Node */}
                  <div className="relative mb-5 flex items-center justify-center">
                    {/* Outer Ambient Glow Ring */}
                    <div className="w-18 h-18 rounded-full border border-rose-500/35 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)] group-hover:border-rose-400/60 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all">
                      {/* Inner Dark Core */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#240819] to-[#0e030b] border border-rose-500/50 flex items-center justify-center text-[#f43f5e] shadow-[inset_0_0_12px_rgba(244,63,94,0.35)] group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 stroke-[1.8]" />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white mb-1.5 tracking-tight group-hover:text-rose-100">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[150px]">
                    {step.description}
                  </p>
                </div>

                {/* Double Chevron Connector >> */}
                {!isLast && (
                  <div className="flex items-center justify-center text-[#f43f5e] shrink-0 mt-6 px-1">
                    <ChevronsRight className="w-6 h-6 stroke-[2.5] drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile View: Compact, Sleek Pipeline with Scaled Circular Radar Nodes */}
        <div className="lg:hidden flex flex-col items-center space-y-1.5 max-w-xs xs:max-w-sm mx-auto w-full">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.title}>
                <div className="flex items-center gap-3 w-full py-2 px-3 rounded-xl bg-[#0e040c]/90 border border-rose-950/60 shadow-sm">
                  {/* Compact Circular Radar Node */}
                  <div className="w-9 h-9 shrink-0 rounded-full border border-rose-500/40 p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(244,63,94,0.25)]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#240819] to-[#0e030b] border border-rose-500/50 flex items-center justify-center text-[#f43f5e]">
                      <Icon className="w-3.5 h-3.5 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Compact Down Double Chevron */}
                {!isLast && (
                  <div className="text-[#f43f5e] -my-0.5">
                    <ChevronsDown className="w-3.5 h-3.5 stroke-[2] drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
}
