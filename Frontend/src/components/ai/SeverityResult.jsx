import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { SEVERITY_LEVELS } from '../../utils/constants';

export const SeverityResult = ({ severity = 'CRITICAL', safetyHazardIndex = 9.2 }) => {
  const sev = SEVERITY_LEVELS[severity?.toUpperCase()] || SEVERITY_LEVELS.HIGH;

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {severity === 'CRITICAL' ? (
            <AlertOctagon className="w-5 h-5 text-rose-500 animate-pulse" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          )}
          <h4 className="text-sm font-bold text-slate-100">Estimated Severity Level</h4>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sev.color}`}>
          {sev.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block">Safety Hazard Index</span>
          <span className="text-base font-black font-mono text-rose-400">{safetyHazardIndex} / 10</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <span className="text-[11px] text-slate-400 block">Dispatch Protocol</span>
          <span className="text-xs font-bold text-slate-200">
            {severity === 'CRITICAL' ? 'Immediate (< 4h)' : 'Standard (< 24h)'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeverityResult;
