import React from 'react';
import { Sparkles, ShieldAlert } from 'lucide-react';
import { getPriorityColor } from '../../utils/priorityColor';

export const PriorityScore = ({ score = 75, showLabel = true, size = 'md' }) => {
  const styling = getPriorityColor(score);

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-2xl border ${styling.border} ${styling.bg} backdrop-blur-md flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center relative">
            <span className={`text-xl font-black font-display ${styling.text}`}>{score}</span>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r ${styling.gradient} animate-pulse`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Priority Score</p>
            </div>
            <p className={`text-sm font-semibold ${styling.text}`}>{styling.label}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-slate-400 block font-mono">Formula: 0.4(S) + 0.3(T) + 0.3(H)</span>
          <span className="text-[10px] text-slate-500">Autonomous Municipal Routing</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${styling.border} ${styling.bg} ${styling.text} font-mono font-bold text-xs`}
    >
      <ShieldAlert className="w-3.5 h-3.5" />
      <span>{score}</span>
      {showLabel && <span className="text-[10px] font-sans font-medium text-slate-400">/100</span>}
    </div>
  );
};

export default PriorityScore;
