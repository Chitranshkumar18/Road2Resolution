import React from 'react';
import { Building2, CheckCircle2, Clock, Award } from 'lucide-react';
import { DEPARTMENTS } from '../../utils/constants';

export const DepartmentPerformance = ({ departments = DEPARTMENTS }) => {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display">Municipal Department Workloads & SLA</h3>
            <p className="text-xs text-slate-400">Active tasks, resolved counts, and adherence metrics</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-4 hover:bg-slate-850/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-100">{dept.name}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                  <Award className="w-3 h-3" /> SLA {dept.slaRating}
                </span>
              </div>
              <p className="text-xs text-slate-400">Lead: {dept.head}</p>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Active Work</span>
                <span className="font-bold font-mono text-amber-400">{dept.activeIssues} Open</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Completed</span>
                <span className="font-bold font-mono text-emerald-400">{dept.resolvedIssues} Fixed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentPerformance;
