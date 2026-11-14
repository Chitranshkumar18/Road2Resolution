import React from 'react';
import { ThumbsUp, MapPin, Eye, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import SeverityBadge from './SeverityBadge';
import PriorityScore from './PriorityScore';
import { formatDisplayAddress } from '../../utils/geocoding';

export const DuplicateIssueCard = ({ issue, onUpvote, onView }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/60 transition-all shadow-lg flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex gap-3.5 items-start">
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="w-20 h-20 rounded-xl object-cover border border-slate-700 flex-shrink-0"
        />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {issue.similarityScore}% Match
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              {issue.distanceMeters ? `${issue.distanceMeters}m away` : 'Nearby'}
            </span>
            <SeverityBadge severity={issue.severity} size="xs" />
          </div>

          <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{issue.title}</h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>{formatDisplayAddress(issue.location?.address, issue.location)}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {onView && (
          <Button variant="ghost" size="sm" onClick={() => onView(issue)}>
            View Details
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          leftIcon={ThumbsUp}
          onClick={() => onUpvote(issue.id)}
        >
          Upvote ({issue.upvotes || 0})
        </Button>
      </div>
    </div>
  );
};

export default DuplicateIssueCard;
