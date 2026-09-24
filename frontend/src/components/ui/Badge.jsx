import React from 'react';
import { cn } from '@/lib/utils';

export function ActionBadge({ action, className = '' }) {
  const styles = {
    BLOCK: 'bg-[#ef4444] text-white font-bold text-[11px] px-2.5 py-0.5 rounded shadow-sm shadow-rose-900/40 tracking-wider',
    WARN: 'bg-[#f59e0b] text-slate-950 font-bold text-[11px] px-2.5 py-0.5 rounded shadow-sm shadow-amber-900/40 tracking-wider',
    ALLOW: 'bg-[#10b981] text-slate-950 font-bold text-[11px] px-2.5 py-0.5 rounded shadow-sm shadow-emerald-900/40 tracking-wider',
  };

  return (
    <span className={cn('inline-flex items-center justify-center uppercase', styles[action], className)}>
      {action}
    </span>
  );
}

export function CategoryPill({ category, className = '' }) {
  if (!category || category === '—') {
    return <span className="text-slate-500 font-mono">—</span>;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#240e1e]/90 text-[#fecdd3] border border-rose-500/25 shadow-xs',
        className
      )}
    >
      {category}
    </span>
  );
}
