import React from 'react';
import IssueCard from '../issue/IssueCard';
import EmptyState from '../common/EmptyState';

export const RecentIssues = ({
  issues = [],
  onUpvote,
  title = 'Recent Civic Reports',
  subtitle = 'Live feed of citizen submissions across all metropolitan zones',
  linkPrefix = '/citizen/issue',
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 font-display">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>

      {issues.length === 0 ? (
        <EmptyState title="No recent issues" description="No civic issues match the selected parameters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onUpvote={onUpvote}
              linkPrefix={linkPrefix}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentIssues;
