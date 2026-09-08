/**
 * Calculates and returns styling classes based on priority score (0-100) and severity
 */
export function getPriorityColor(score) {
  if (score >= 85) {
    return {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      gradient: 'from-rose-500 to-red-600',
      barColor: '#F43F5E',
      label: 'Critical Priority'
    };
  }
  if (score >= 70) {
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      gradient: 'from-amber-500 to-orange-600',
      barColor: '#F59E0B',
      label: 'High Priority'
    };
  }
  if (score >= 45) {
    return {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
      gradient: 'from-yellow-500 to-amber-500',
      barColor: '#EAB308',
      label: 'Medium Priority'
    };
  }
  return {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    glow: 'none',
    gradient: 'from-slate-500 to-slate-600',
    barColor: '#94A3B8',
    label: 'Low Priority'
  };
}

export function getSeverityStyle(severity) {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500'
      };
    case 'HIGH':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500'
      };
    case 'MEDIUM':
      return {
        bg: 'bg-yellow-500/15',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        dot: 'bg-yellow-500'
      };
    default:
      return {
        bg: 'bg-slate-500/15',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-500'
      };
  }
}
