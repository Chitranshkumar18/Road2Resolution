import React from 'react';
import { Calculator, Shield, Activity, Users } from 'lucide-react';

export const PriorityExplanation = ({ priorityScore = 88, severity = 'CRITICAL' }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-100">AI Priority Calculation Formula</h4>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-bold">{priorityScore} / 100</span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        The CivicVision neural engine prioritizes issues using a weighted composite formula to prevent accidents and optimize municipal field response times.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold">Safety Risk (40%)</span>
          </div>
          <p className="text-[11px] text-slate-400">Pedestrian hazard & structural vulnerability</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold">Traffic Density (30%)</span>
          </div>
          <p className="text-[11px] text-slate-400">Hourly vehicle corridor throughput</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold">Severity Scale (30%)</span>
          </div>
          <p className="text-[11px] text-slate-400">Physical damage depth & footprint</p>
        </div>
      </div>
    </div>
  );
};

export default PriorityExplanation;
