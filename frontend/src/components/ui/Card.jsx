import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'card-component bg-[#120a14]/85 backdrop-blur-md border border-[#2c1622] rounded-xl p-3.5 sm:p-5 shadow-lg shadow-black/30 hover:border-[#6a1a24]/50 transition-all duration-200 max-w-full min-w-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
