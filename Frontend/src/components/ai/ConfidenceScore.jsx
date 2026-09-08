import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ConfidenceScore = ({ confidence = 96.5, label = 'AI Model Confidence' }) => {
  const isHigh = confidence >= 90;
  const isMed = confidence >= 75 && confidence < 90;

  const colorClass = isHigh
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : isMed
    ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className={`p-4 rounded-2xl border ${colorClass} backdrop-blur-sm flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-current" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">{label}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-lg font-black font-mono text-slate-100">{confidence}%</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> High Certainty
            </span>
          </div>
        </div>
      </div>

      <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
        <div
          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceScore;
