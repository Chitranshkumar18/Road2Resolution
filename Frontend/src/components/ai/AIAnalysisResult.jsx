import React from 'react';
import { ShieldAlert } from 'lucide-react';
import IssueDetectionResult from './IssueDetectionResult';
import SeverityResult from './SeverityResult';
import ConfidenceScore from './ConfidenceScore';
import PriorityExplanation from './PriorityExplanation';

export const AIAnalysisResult = ({ issue }) => {
  if (!issue) return null;

  if (issue.isCivic === false) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-slate-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-rose-300">Stage 1 Filter: Non-Civic Image Detected</h4>
            <p className="text-xs text-slate-400">
              The automated vision classifier identified this image as non-civic (Confidence: {issue.aiConfidence}%).
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
          <div className="flex justify-between">
            <span>Stage 1 Civic Probability:</span>
            <span className="text-rose-400 font-bold">
              {issue.stage1 ? `${(issue.stage1.civic_probability * 100).toFixed(1)}%` : 'Below Threshold'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Required Civic Threshold:</span>
            <span className="text-slate-400 font-bold">62.5%</span>
          </div>
          <div className="flex justify-between">
            <span>Filter Status:</span>
            <span className="text-rose-400 font-bold">REJECTED (Non-Civic Clutter)</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {issue.message || 'Please capture a clear photograph focused on road damage, drainage overflow, or sanitation hazards.'}
        </p>
      </div>
    );
  }

  const probabilities = issue.stage2?.probabilities || issue.aiDetection?.probabilities || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfidenceScore confidence={issue.aiConfidence || 95.0} />
        <SeverityResult
          severity={issue.severity}
          safetyHazardIndex={issue.aiDetection?.safetyHazardIndex || 7.5}
        />
      </div>

      <IssueDetectionResult
        imageUrl={issue.imageUrl}
        category={issue.category}
        confidence={issue.aiConfidence}
        probabilities={probabilities}
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
