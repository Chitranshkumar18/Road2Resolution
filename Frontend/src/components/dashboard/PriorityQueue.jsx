import React from 'react';
import { Link } from 'react-router-dom';
import { ListOrdered, ArrowRight, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import SeverityBadge from '../issue/SeverityBadge';
import PriorityScore from '../issue/PriorityScore';
import IssueStatus from '../issue/IssueStatus';
import { DEPARTMENTS } from '../../utils/constants';

export const PriorityQueue = ({
  issues = [],
  onAssign,
  onStatusChange,
  showActions = true,
  limit = 5,
}) => {
  // Exclude complaints that have been verified and saved by the Admin
  const activeUnverifiedIssues = issues.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && !i.repairAudit?.verified
  );

  // Sort descending by priority score
  const sortedIssues = [...activeUnverifiedIssues].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
  const displayIssues = limit ? sortedIssues.slice(0, limit) : sortedIssues;

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display">AI Dynamic Priority Queue</h3>
            <p className="text-xs text-slate-400">Ranked by Composite Risk, Citizen Impact & Hazard Index</p>
          </div>
        </div>

        <Link
          to="/admin/priority-queue"
          className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <span>Full Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/60">
        {displayIssues.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No pending priority tasks</div>
        ) : (
          displayIssues.map((issue, idx) => (
            <div
              key={issue.id}
              className="p-4 hover:bg-slate-850/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left detail */}
              <div className="flex items-start gap-3.5 min-w-0">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>

                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                />

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-indigo-400">{issue.id}</span>
                    <SeverityBadge severity={issue.severity} size="xs" />
                    <IssueStatus status={issue.status} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 truncate">{issue.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{issue.location?.address}</p>
                </div>
              </div>

              {/* Right: Score & Quick Assignment */}
              <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                <PriorityScore score={issue.priorityScore} />

                {showActions && (
                  <div className="flex items-center gap-2">
                    <select
                      value={issue.department || ''}
                      onChange={(e) => onAssign && onAssign(issue.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="" disabled>Assign Dept</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name.split(' ')[0]}
                        </option>
                      ))}
                    </select>

                    <Link
                      to={`/admin/issues`}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Manage Issue"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PriorityQueue;
