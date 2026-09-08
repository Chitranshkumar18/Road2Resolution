import React, { useState, useContext } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Lock,
  Clock,
  Eye,
  Info,
  MapPin,
  Calendar
} from 'lucide-react';
import RepairVerificationComponent from '../../components/ai/RepairVerification';
import { IssueContext } from '../../context/IssueContext';
import { formatDate } from '../../utils/formatDate';
import { PLACEHOLDER_IMAGES } from '../../utils/constants';

export const RepairVerification = () => {
  const { issues = [] } = useContext(IssueContext) || {};
  const issueList = Array.isArray(issues) ? issues : [];

  const [selectedIssueId, setSelectedIssueId] = useState(
    issueList.find((i) => i.status === 'RESOLVED')?.id || issueList[0]?.id || 'CIV-2026-8941'
  );

  const selectedIssue = issueList.find((i) => i.id === selectedIssueId) || issueList[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white font-display">
                Public Repair Verification & Transparency Hub
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect before-and-after audit imagery and computer vision quality scores for resolved civic work.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5" />
            <span>Citizen Read-Only</span>
          </span>
        </div>

        {/* Informative Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong className="text-cyan-300">Municipal Integrity Policy: </strong>
            To prevent fraudulent proof submissions, only verified field contractors and municipal engineers have permission to upload post-repair photos and trigger official audit validations. Citizens can review validated proofs below.
          </p>
        </div>
      </div>

      {/* Select Active Issue to Audit */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex-shrink-0 flex items-center gap-2">
          <span>Select Community Issue:</span>
        </label>
        <select
          value={selectedIssueId}
          onChange={(e) => setSelectedIssueId(e.target.value)}
          className="w-full sm:w-auto flex-1 max-w-md px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
        >
          {issueList.map((i) => (
            <option key={i.id} value={i.id}>
              [{i.status}] {i.id} — {i.title.slice(0, 40)}...
            </option>
          ))}
        </select>
      </div>

      {/* Selected Issue Meta Strip */}
      {selectedIssue && (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-indigo-400">{selectedIssue.id}</span>
            <span className="text-slate-300 font-medium">| {selectedIssue.title}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {selectedIssue.location?.address}
            </span>
            <span className="font-mono text-slate-500">{formatDate(selectedIssue.createdAt)}</span>
          </div>
        </div>
      )}

      {/* Verification Component in Pure Read-Only Citizen Mode */}
      {selectedIssue && (
        <RepairVerificationComponent
          key={selectedIssue.id + (selectedIssue.repairVerificationUrl || '') + (selectedIssue.workerSubmission ? 'w' : '') + selectedIssue.status}
          beforeImageUrl={selectedIssue.imageUrl || PLACEHOLDER_IMAGES.pothole}
          afterImageUrl={selectedIssue.repairVerificationUrl}
          workerSubmission={selectedIssue.workerSubmission}
          status={selectedIssue.status}
          isAdmin={false}
          readOnly={true}
          issueId={selectedIssue.id}
          issueTitle={selectedIssue.title}
        />
      )}
    </div>
  );
};

export default RepairVerification;
