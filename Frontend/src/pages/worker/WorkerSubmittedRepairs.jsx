import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Camera,
  Layers,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

export const WorkerSubmittedRepairs = () => {
  const { issues = [] } = useContext(IssueContext) || {};
  const navigate = useNavigate();

  const issueList = Array.isArray(issues) ? issues : [];

  // Filter issues where worker submitted proof or has repairVerificationUrl
  const submittedIssues = issueList.filter(
    (i) => i.status === 'PENDING_VERIFICATION' || Boolean(i.workerSubmission) || Boolean(i.repairVerificationUrl)
  );

  const pendingVerification = submittedIssues.filter(
    (i) => i.status === 'PENDING_VERIFICATION' || (i.status !== 'RESOLVED' && Boolean(i.workerSubmission))
  );

  const certifiedByAdmin = submittedIssues.filter(
    (i) => i.status === 'RESOLVED' || Boolean(i.repairAudit?.verified)
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md shadow-cyan-500/10">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white font-display">
                  Worker Submitted Resolution Proofs
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  QA DISPATCH
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor the verification status of your uploaded post-repair photos. Certified submissions are automatically published to the citizen portal.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={Camera}
            onClick={() => navigate('/worker/upload-proof')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-900/30"
          >
            Upload New Repair Proof
          </Button>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Proofs Uploaded</span>
          <p className="text-2xl font-black font-mono text-white">{submittedIssues.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Awaiting Admin QA</span>
          <p className="text-2xl font-black font-mono text-cyan-400">{pendingVerification.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Admin Certified & Published</span>
          <p className="text-2xl font-black font-mono text-emerald-400">{certifiedByAdmin.length}</p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Detailed Submission Audit Records</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {submittedIssues.length > 0 ? (
            submittedIssues.map((issue) => {
              const isCertified = issue.status === 'RESOLVED' || Boolean(issue.repairAudit?.verified);
              return (
                <div
                  key={issue.id}
                  className={`p-5 rounded-3xl bg-slate-900 border space-y-4 shadow-xl transition-all ${
                    isCertified ? 'border-emerald-500/30' : 'border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{issue.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                        isCertified
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      {isCertified ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isCertified ? 'ADMIN CERTIFIED' : 'PENDING ADMIN QA'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">{issue.title}</h3>

                  {/* Before vs After Side-by-Side */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                      <img src={issue.imageUrl} alt="Before" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[8px] font-bold bg-rose-600/90 text-white">
                        BEFORE (CITIZEN)
                      </span>
                    </div>
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                      <img
                        src={issue.repairVerificationUrl || issue.workerSubmission?.afterImageUrl}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-600/90 text-white">
                        AFTER (WORKER)
                      </span>
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-slate-300">GPS On-Site Verification:</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        {issue.workerSubmission?.gpsVerification?.distanceMeters 
                          ? `${issue.workerSubmission.gpsVerification.distanceMeters}m (≤ 250m Verified)` 
                          : 'Within 250m Perimeter'}
                      </span>
                    </div>
                    {issue.workerSubmission?.materialsUsed && (
                      <div className="flex items-start justify-between gap-2 text-slate-400">
                        <span className="font-semibold text-slate-300">Materials Applied:</span>
                        <span className="text-right text-slate-200">{issue.workerSubmission.materialsUsed}</span>
                      </div>
                    )}
                    {issue.workerSubmission?.repairNotes && (
                      <div className="text-slate-400 pt-1 border-t border-slate-800/60">
                        <span className="font-semibold text-slate-300 block mb-0.5">Worker Field Notes:</span>
                        <p className="text-slate-300 italic">{issue.workerSubmission.repairNotes}</p>
                      </div>
                    )}
                    {issue.repairAudit && (
                      <div className="pt-2 border-t border-slate-800/60 text-emerald-300">
                        <span className="font-semibold block mb-0.5">Admin QA Result ({issue.repairAudit.confidenceScore}% AI Confidence):</span>
                        <p className="text-[11px] text-slate-300">{issue.repairAudit.verificationNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="truncate">{issue.location?.address}</span>
                    <span className="font-mono text-[11px] text-slate-400">{formatDate(issue.updatedAt || issue.createdAt)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              No worker repair proofs uploaded yet. Click "Upload New Repair Proof" to submit your first resolution photo!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerSubmittedRepairs;
