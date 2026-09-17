import React, { useContext, useState, useMemo } from 'react';
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
  AlertCircle,
  Building2,
  UserCheck,
  HeartHandshake,
  Filter
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import useAuth from '../../hooks/useAuth';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { formatDisplayAddress } from '../../utils/geocoding';

const isSubmittedByCurrentWorker = (issue, currentUser) => {
  if (!currentUser || !issue) return false;
  const currentUserId = String(currentUser.id || currentUser._id || '').trim();
  const currentUserEmail = (currentUser.email || '').toLowerCase().trim();
  const currentUserName = (currentUser.name || '').toLowerCase().trim();

  // 1. Match on issue.workerSubmission.worker or workerId
  const submissionWorkerId = String(
    issue.workerSubmission?.worker?._id ||
    issue.workerSubmission?.worker ||
    issue.workerSubmission?.workerId ||
    ''
  ).trim();
  if (currentUserId && submissionWorkerId && currentUserId === submissionWorkerId) {
    return true;
  }

  // 2. Match on issue.workerSubmission.workerEmail
  const submissionWorkerEmail = (issue.workerSubmission?.workerEmail || '').toLowerCase().trim();
  if (currentUserEmail && submissionWorkerEmail && currentUserEmail === submissionWorkerEmail) {
    return true;
  }

  // 3. Match on repairs array (Repair.worker, Repair.workerEmail)
  if (Array.isArray(issue.repairs) && issue.repairs.length > 0) {
    for (const rep of issue.repairs) {
      if (typeof rep === 'object' && rep !== null) {
        const repWorkerId = String(rep.worker?._id || rep.worker || '').trim();
        if (currentUserId && repWorkerId && currentUserId === repWorkerId) {
          return true;
        }
        const repWorkerEmail = (rep.workerEmail || '').toLowerCase().trim();
        if (currentUserEmail && repWorkerEmail && currentUserEmail === repWorkerEmail) {
          return true;
        }
      }
    }
  }

  // 4. Fallback for mock/local data without IDs or emails
  const submissionWorkerName = (issue.workerSubmission?.workerName || '').toLowerCase().trim();
  if (currentUserName && submissionWorkerName && currentUserName === submissionWorkerName) {
    return true;
  }

  return false;
};

export const WorkerSubmittedRepairs = () => {
  const { issues = [] } = useContext(IssueContext) || {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filterEntity, setFilterEntity] = useState('all'); // 'all' | 'org' | 'individual'

  const issueList = Array.isArray(issues) ? issues : [];

  // Filter issues where THIS logged-in worker submitted proof
  const submittedIssues = useMemo(() => {
    return issueList.filter((i) => {
      const isSubmitted =
        i.status === 'PENDING_VERIFICATION' ||
        i.status === 'RESOLVED' ||
        Boolean(i.workerSubmission) ||
        Boolean(i.repairVerificationUrl);
      if (!isSubmitted) return false;
      return isSubmittedByCurrentWorker(i, user);
    });
  }, [issueList, user]);

  const filteredSubmissions = useMemo(() => {
    return submittedIssues.filter((issue) => {
      const isVol = issue.responsibleType === 'PUBLIC_INDIVIDUAL' || issue.workerSubmission?.submittedBy === 'PUBLIC_INDIVIDUAL' || issue.workerSubmission?.isVolunteer;
      if (filterEntity === 'org' && isVol) return false;
      if (filterEntity === 'individual' && !isVol) return false;
      return true;
    });
  }, [submittedIssues, filterEntity]);

  const pendingVerification = submittedIssues.filter(
    (i) => i.status === 'PENDING_VERIFICATION' || (i.status !== 'RESOLVED' && Boolean(i.workerSubmission))
  );

  const certifiedByAdmin = submittedIssues.filter(
    (i) => i.status === 'RESOLVED' || Boolean(i.repairAudit?.verified)
  );

  const orgSubmissionsCount = submittedIssues.filter(
    (i) => !(i.responsibleType === 'PUBLIC_INDIVIDUAL' || i.workerSubmission?.submittedBy === 'PUBLIC_INDIVIDUAL' || i.workerSubmission?.isVolunteer)
  ).length;

  const individualSubmissionsCount = submittedIssues.length - orgSubmissionsCount;

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
                Monitor the verification status of your uploaded post-repair photos. Supports tracking for both <strong>Organization Crews</strong> and <strong>Individual Workers</strong>.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={Camera}
            onClick={() => navigate('/worker/upload-proof')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-900/30 cursor-pointer"
          >
            Upload New Repair Proof
          </Button>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Proofs Uploaded</span>
          <p className="text-2xl font-black font-mono text-white">{submittedIssues.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-1">
          <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" /> By Organization
          </span>
          <p className="text-2xl font-black font-mono text-indigo-400">{orgSubmissionsCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
          <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> By Individual Person
          </span>
          <p className="text-2xl font-black font-mono text-emerald-400">{individualSubmissionsCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Admin Certified</span>
          <p className="text-2xl font-black font-mono text-emerald-400">{certifiedByAdmin.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Filter By Attribution:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setFilterEntity('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              filterEntity === 'all'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Proofs ({submittedIssues.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterEntity('org')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterEntity === 'org'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Organization ({orgSubmissionsCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterEntity('individual')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterEntity === 'individual'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Individual Person ({individualSubmissionsCount})</span>
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((issue) => {
              const isCertified = issue.status === 'RESOLVED' || Boolean(issue.repairAudit?.verified);
              const isVol = issue.responsibleType === 'PUBLIC_INDIVIDUAL' || issue.workerSubmission?.submittedBy === 'PUBLIC_INDIVIDUAL' || issue.workerSubmission?.isVolunteer;
              const workerName = issue.workerSubmission?.workerName || issue.responsibleName || (isVol ? 'Public Citizen' : 'Field Technician');
              const orgName = isVol ? null : (issue.workerSubmission?.organizationName || issue.assignedOrgName || 'Municipal Infrastructure Division');

              return (
                <div
                  key={issue.id}
                  className={`p-5 rounded-3xl bg-slate-900 border space-y-4 shadow-xl transition-all ${
                    isCertified ? 'border-emerald-500/40' : isVol ? 'border-emerald-500/30' : 'border-indigo-500/30'
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
                      {isCertified ? 'ADMIN CERTIFIED & PUBLISHED' : 'PENDING ADMIN QA'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">{issue.title}</h3>

                  {/* Completing Entity Badge */}
                  <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    isVol
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  }`}>
                    <div className="flex items-center gap-1.5 truncate">
                      {isVol ? <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Building2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                      <span className="truncate">
                        Completed By: <strong className="text-white font-bold">{isVol ? `Individual (${workerName})` : `${orgName} (${workerName})`}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 flex-shrink-0">
                      {isVol ? 'INDIVIDUAL PERSON' : 'ORGANIZATION'}
                    </span>
                  </div>

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
                        AFTER ({isVol ? 'INDIVIDUAL' : 'WORKER'})
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
                        <span className="font-semibold text-slate-300 block mb-0.5">Field Notes:</span>
                        <p className="text-slate-300 italic">"{issue.workerSubmission.repairNotes}"</p>
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
                    <span className="truncate font-medium text-slate-300">
                      {formatDisplayAddress(issue.location?.address, issue.location)}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{formatDate(issue.updatedAt || issue.createdAt)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              No worker repair proofs found matching the selected attribution filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerSubmittedRepairs;

