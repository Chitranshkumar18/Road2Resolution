import React from 'react';
import { SEVERITY_LEVELS } from '../../utils/constants';

export const SeverityBadge = ({ severity = 'LOW', size = 'sm' }) => {
  const sevConfig = SEVERITY_LEVELS[severity?.toUpperCase()] || SEVERITY_LEVELS.LOW;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 font-bold',
    sm: 'text-xs px-2.5 py-1 font-semibold',
    md: 'text-sm px-3.5 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${sevConfig.color} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${severity?.toUpperCase() === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 'bg-current'}`} />
      <span>{sevConfig.label}</span>
    </span>
  );
};

export default SeverityBadge;
