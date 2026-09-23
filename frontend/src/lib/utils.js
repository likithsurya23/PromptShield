export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getActionColor(action) {
  switch (action) {
    case 'ALLOW':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        pill: 'bg-emerald-500',
      };
    case 'WARN':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        pill: 'bg-amber-500',
      };
    case 'BLOCK':
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        pill: 'bg-rose-500',
      };
    default:
      return {
        bg: 'bg-slate-500/15',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        pill: 'bg-slate-500',
      };
  }
}

export function getRiskColor(risk) {
  if (risk >= 80) return 'text-rose-500 font-semibold';
  if (risk >= 40) return 'text-amber-400 font-semibold';
  return 'text-emerald-400 font-semibold';
}
