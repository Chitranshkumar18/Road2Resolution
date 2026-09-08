import React from 'react';
import { ISSUE_STATUSES } from '../../utils/constants';

export const IssueStatus = ({ status = 'PENDING' }) => {
  const statusInfo = ISSUE_STATUSES[status?.toUpperCase()] || ISSUE_STATUSES.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}
    >
      <span className="w-2 h-2 rounded-full bg-current" />
      <span>{statusInfo.label}</span>
    </span>
  );
};

export default IssueStatus;
