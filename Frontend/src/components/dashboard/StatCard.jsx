import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorScheme = 'indigo', // indigo, rose, emerald, cyan, amber
}) => {
  const schemes = {
    indigo: {
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-400',
      glow: 'shadow-indigo-500/5',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400',
      glow: 'shadow-rose-500/5',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      glow: 'shadow-emerald-500/5',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
      glow: 'shadow-cyan-500/5',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400',
      glow: 'shadow-amber-500/5',
    },
  };

  const scheme = schemes[colorScheme] || schemes.indigo;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-slate-900/80 border ${scheme.border} transition-all duration-300 hover:shadow-xl ${scheme.glow} flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-100 font-display mt-1 tracking-tight truncate">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2 sm:p-2.5 rounded-xl ${scheme.iconBg} flex-shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs">
        {subtitle && <span className="text-slate-400 truncate max-w-[70%] sm:max-w-none">{subtitle}</span>}
        {trend && (
          <span
            className={`inline-flex items-center font-bold font-mono text-[10px] sm:text-xs ${
              trendPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trendPositive ? (
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" />
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
