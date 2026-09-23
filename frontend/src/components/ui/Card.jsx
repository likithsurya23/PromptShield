import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'bg-[#0f172a]/70 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 shadow-lg shadow-black/20 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
