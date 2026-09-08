import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ThumbsUp, Calendar, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import IssueStatus from './IssueStatus';
import PriorityScore from './PriorityScore';
import { formatTimeAgo } from '../../utils/formatDate';

export const IssueCard = ({ issue, onUpvote, linkPrefix = '/citizen/issue' }) => {
  return (
    <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/40 flex flex-col overflow-hidden">
      {/* Top Image & Floating Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <SeverityBadge severity={issue.severity} size="xs" />
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{issue.aiConfidence}% AI</span>
          </div>
        </div>

        {/* Floating Priority Score Pill */}
        <div className="absolute top-3 right-3">
          <PriorityScore score={issue.priorityScore} showLabel={false} />
        </div>

        {/* Floating Bottom Status on Image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <IssueStatus status={issue.status} />
          {(issue.repairVerificationUrl || issue.status === 'RESOLVED') && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1">
              <span>✓ Repaired</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] text-indigo-400">{issue.id}</span>
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3" />
              {formatTimeAgo(issue.createdAt)}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-100 font-display group-hover:text-indigo-300 transition-colors line-clamp-1">
            {issue.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
        </div>

        {/* Location & Dept */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{issue.location?.address}</span>
          </div>
          {issue.department && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
              <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="truncate">{issue.department}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onUpvote) onUpvote(issue.id);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 transition-all border border-slate-700/60 active:scale-95"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>{issue.upvotes || 0}</span>
          </button>

          <Link
            to={`${linkPrefix}/${issue.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-cyan-300 transition-colors"
          >
            <span>Track Issue</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
