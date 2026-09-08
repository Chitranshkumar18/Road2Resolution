import React from 'react';
import IssueDetectionResult from './IssueDetectionResult';
import SeverityResult from './SeverityResult';
import ConfidenceScore from './ConfidenceScore';
import PriorityExplanation from './PriorityExplanation';

export const AIAnalysisResult = ({ issue }) => {
  if (!issue) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfidenceScore confidence={issue.aiConfidence || 96.5} />
        <SeverityResult
          severity={issue.severity}
          safetyHazardIndex={issue.aiDetection?.safetyHazardIndex || 8.8}
        />
      </div>

      <IssueDetectionResult
        imageUrl={issue.imageUrl}
        detectedObjects={issue.aiDetection?.detectedObjects || ['Civic Defect']}
        suggestedAction={issue.aiDetection?.suggestedAction}
      />

      <PriorityExplanation
        priorityScore={issue.priorityScore}
        severity={issue.severity}
      />
    </div>
  );
};

export default AIAnalysisResult;
