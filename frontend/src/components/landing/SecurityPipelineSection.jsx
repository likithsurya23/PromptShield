import React from 'react';
import {
  MessageSquare,
  Brain,
  FileText,
  Gauge,
  Shield,
  ArrowRight,
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
      icon: Shield,
      title: 'Security Action',
      description: 'ALLOW / WARN / BLOCK',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-[#0b080e] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#f57b83] mb-2.5">
            HOW IT WORKS
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight">
            A Simple, Effective Security Pipeline
          </h2>
        </div>

        {/* 5-Step Pipeline Horizontal Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center text-center w-full lg:w-44 flex-1">
                  {/* Icon in rose/crimson rounded square */}
                  <div className="w-12 h-12 rounded-xl bg-[#1a0e1c] border border-rose-500/25 text-[#f57b83] flex items-center justify-center mb-4 transition-transform hover:scale-105 shadow-inner">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white mb-1.5 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[140px]">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Connector (visible between steps on desktop) */}
                {!isLast && (
                  <div className="hidden lg:flex items-center justify-center text-[#e11d48] shrink-0 -mt-8">
                    <ArrowRight className="w-5 h-5 stroke-[2.2]" />
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
