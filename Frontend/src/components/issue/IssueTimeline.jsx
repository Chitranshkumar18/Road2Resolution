import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, Wrench, CheckCheck, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export const IssueTimeline = ({ timeline = [] }) => {
  const getIcon = (status) => {
    const s = status.toLowerCase();
    if (s.includes('reported')) return AlertCircle;
    if (s.includes('ai') || s.includes('verified')) return ShieldCheck;
    if (s.includes('assigned') || s.includes('progress')) return Wrench;
    if (s.includes('resolved') || s.includes('audit')) return CheckCheck;
    return Clock;
  };

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
        <Clock className="w-4 h-4 text-indigo-400" />
        <span>Incident Life Cycle & Audit Trail</span>
      </h4>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((event, idx) => {
          const Icon = getIcon(event.status);
          const isLatest = idx === timeline.length - 1;

          return (
            <div key={idx} className="relative group">
              {/* Bullet */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  isLatest
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/50 scale-110'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Body */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-100">{event.status}</span>
                  <span className="text-[11px] font-mono text-slate-400">{formatDate(event.time)}</span>
                </div>
                {event.note && <p className="text-xs text-slate-300 leading-relaxed">{event.note}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IssueTimeline;
