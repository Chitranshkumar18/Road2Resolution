import React from 'react';
import { Building2, Award, Users, CheckCircle2, Clock, ShieldCheck, Mail, Phone } from 'lucide-react';
import { DEPARTMENTS } from '../../utils/constants';

export const DepartmentManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Municipal Department Directory & Agency SLAs
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Supervise departmental throughput, fast-response field crews, duty engineers, and service level agreements.
        </p>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-display">{dept.name}</h3>
                  <p className="text-xs text-indigo-400 font-medium">Head of Department: {dept.head}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> SLA {dept.slaRating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase">Active Workload</span>
                  <span className="text-lg font-black font-mono text-amber-400">{dept.activeIssues} Tasks</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase">Resolved Cumulative</span>
                  <span className="text-lg font-black font-mono text-emerald-400">{dept.resolvedIssues} Fixed</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Primary Agency Authorized</span>
              </span>
              <span className="font-mono text-slate-500">ID: {dept.id.toUpperCase()}-GOV</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;
