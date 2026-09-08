import React from 'react';
import { CopyCheck, AlertCircle, ThumbsUp } from 'lucide-react';
import DuplicateIssueCard from '../issue/DuplicateIssueCard';

export const DuplicateDetection = ({ duplicates = [], onUpvote, onProceedAnyway }) => {
  if (!duplicates.length) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
        <CopyCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-bold">Zero Duplicates Detected</p>
          <p className="text-slate-400">No overlapping reports found within a 1.5km radius.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-sm">Similar Civic Reports Found Nearby ({duplicates.length})</p>
          <p className="text-slate-300 leading-relaxed">
            Citizens have already submitted similar reports nearby. Upvoting an existing report boosts its municipal priority rather than fragmenting repair work!
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {duplicates.map((issue) => (
          <DuplicateIssueCard
            key={issue.id}
            issue={issue}
            onUpvote={onUpvote}
          />
        ))}
      </div>
    </div>
  );
};

export default DuplicateDetection;
