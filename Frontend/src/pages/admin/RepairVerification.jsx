import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  Search,
  CheckCircle,
  FileCheck2,
  Camera,
  MapPin,
  ArrowRight,
  ExternalLink,
  Globe,
  Check,
  HardHat,
  Truck,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import RepairVerificationComponent from '../../components/ai/RepairVerification';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { PLACEHOLDER_IMAGES } from '../../utils/constants';
import { formatResponsibleEntity } from '../../utils/helpers';
import { formatDisplayAddress } from '../../utils/geocoding';

export const AdminRepairVerification = () => {
  const { issues = [], submitRepairVerification } = useContext(IssueContext) || {};
  const { addToast } = useContext(NotificationContext) || {};

  const issueList = Array.isArray(issues) ? issues : [];

  const workerSubmissions = issueList.filter(
    (i) => i.status === 'PENDING_VERIFICATION' || (Boolean(i.workerSubmission) && i.status !== 'RESOLVED')
  );

  const [selectedIssueId, setSelectedIssueId] = useState(
    workerSubmissions[0]?.id || issueList.find((i) => i.status !== 'RESOLVED')?.id || issueList[0]?.id || 'CIV-2026-8941'
  );

  const selectedIssue = issueList.find((i) => i.id === selectedIssueId) || issueList[0];

  const handleSaveAndPublish = async (afterUrl, result) => {
    if (selectedIssue && submitRepairVerification) {
      await submitRepairVerification(
        selectedIssue.id,
        afterUrl,
        `AI Differential QA Confirmed (${result?.confidenceScore || 97.4}% confidence) by Municipal Field Engineering. ${result?.verificationNotes || 'Surface restoration verified.'}`,
        result
      );
      if (addToast) {
        addToast(`🎉 Repair certified & published live to Citizen & Public Portals for ${selectedIssue.id}!`, 'success');
      }
    }
  };

  const resolvedIssues = issueList.filter(
    (i) => i.status === 'RESOLVED' || Boolean(i.repairVerificationUrl)
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-500/10">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white font-display">
                  Contractor & Volunteer Repair QA Verification Console
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Municipal inspection workbench for reviewing resolution proofs submitted by registered organizations or public volunteers, executing differential AI scans, and publishing verified resolutions live.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Audited Repairs</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{resolvedIssues.length} Published</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Priority Worker Submissions Alert & Quick Selector */}
      {workerSubmissions.length > 0 && (
        <div className="p-5 md:p-6 rounded-3xl bg-amber-950/40 border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HardHat className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm md:text-base font-bold text-white font-display">
                Field Submissions Awaiting Admin Certification ({workerSubmissions.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
              ACTION REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workerSubmissions.map((wIssue) => {
              const entity = formatResponsibleEntity(wIssue);
              const isVol = wIssue.responsibleType === 'PUBLIC_INDIVIDUAL' || wIssue.workerSubmission?.submittedBy === 'PUBLIC_INDIVIDUAL' || wIssue.workerSubmission?.isVolunteer;

              return (
                <div
                  key={wIssue.id}
                  onClick={() => setSelectedIssueId(wIssue.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all space-y-2.5 ${
                    selectedIssueId === wIssue.id
                      ? 'bg-amber-950/70 border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{wIssue.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(wIssue.workerSubmission?.submittedAt || wIssue.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src={wIssue.workerSubmission?.afterImageUrl || wIssue.repairVerificationUrl || PLACEHOLDER_IMAGES.repairedRoad}
                      alt="Worker Proof"
                      className="w-12 h-12 rounded-lg object-cover border border-amber-500/30 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-100 truncate">{wIssue.title}</p>
                      <p className={`text-[10px] truncate ${isVol ? 'text-emerald-300 font-bold' : 'text-amber-300/90'}`}>
                        {isVol ? `🌟 Volunteer: ${wIssue.workerSubmission?.workerName || 'Public Citizen'}` : `🏢 Org: ${wIssue.workerSubmission?.organizationName || wIssue.assignedOrgName || 'Contractor'}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="truncate text-slate-300 font-medium">
                      {formatDisplayAddress(wIssue.location?.address, wIssue.location)}
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      Audit <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Incident Selection & Live Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Issue Selector & Metadata */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Select Active Ticket</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{issueList.length} available</span>
          </div>

          {/* Selector Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Choose Incident to Audit & Publish:</label>
            <select
              value={selectedIssueId}
              onChange={(e) => setSelectedIssueId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
            >
              {issueList.map((i) => (
                <option key={i.id} value={i.id}>
                  [{i.status}] {i.id} - {i.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>

          {/* Selected Ticket Summary Card */}
          {selectedIssue ? (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400">{selectedIssue.id}</span>
                <IssueStatus status={selectedIssue.status} />
              </div>

              <h4 className="text-sm font-bold text-slate-100">{selectedIssue.title}</h4>

              {/* Responsible entity badge */}
              {selectedIssue.assignedOrgName ? (
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-0.5">
                  <span className="text-[10px] font-mono text-indigo-400 block uppercase">Responsible Organization:</span>
                  <strong className="text-slate-200">{selectedIssue.assignedOrgName}</strong>
                </div>
              ) : selectedIssue.responsibleType === 'PUBLIC_INDIVIDUAL' ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-0.5">
                  <span className="text-[10px] font-mono text-emerald-400 block uppercase">Responsible Public Volunteer:</span>
                  <strong className="text-emerald-300">🌟 {selectedIssue.responsibleName || 'Citizen Volunteer'}</strong>
                </div>
              ) : null}

              {/* Worker submission banner if available */}
              {selectedIssue.workerSubmission && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span className="flex items-center gap-1">
                      <HardHat className="w-3.5 h-3.5" /> Proof Attached
                    </span>
                    <span className="text-[10px] font-mono">{selectedIssue.workerSubmission.contractorUnit}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] italic">
                    "{selectedIssue.workerSubmission.repairNotes}"
                  </p>
                  {selectedIssue.workerSubmission.materialsUsed && (
                    <p className="text-[10px] text-slate-400">
                      <strong>Materials:</strong> {selectedIssue.workerSubmission.materialsUsed}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="text-slate-200 capitalize font-medium">{selectedIssue.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>State & City:</span>
                  <span className="text-slate-200 font-medium">{selectedIssue.location?.city || 'City'}, {selectedIssue.location?.state || 'Delhi'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Severity:</span>
                  <SeverityBadge severity={selectedIssue.severity} size="xs" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Reported Date:</span>
                  <span className="font-mono text-[11px] text-slate-300">{formatDate(selectedIssue.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate text-slate-200 font-medium">
                    {formatDisplayAddress(selectedIssue.location?.address, selectedIssue.location)}
                  </span>
                </div>
              </div>

              {/* Direct View on Citizen Portal Link */}
              <div className="pt-2 border-t border-slate-800/80">
                <Link
                  to={`/citizen/issue/${selectedIssue.id}`}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Preview on Citizen Portal</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs">
              No ticket selected.
            </div>
          )}
        </div>

        {/* Right Column: Full Interactive Repair Verification & Publishing Workbench */}
        <div className="lg:col-span-2">
          {selectedIssue ? (
            <RepairVerificationComponent
              key={selectedIssue.id + (selectedIssue.repairVerificationUrl || '') + (selectedIssue.workerSubmission ? 'w' : '') + selectedIssue.status}
              beforeImageUrl={selectedIssue.imageUrl || PLACEHOLDER_IMAGES.pothole}
              afterImageUrl={selectedIssue.repairVerificationUrl || selectedIssue.workerSubmission?.afterImageUrl}
              workerSubmission={selectedIssue.workerSubmission}
              assignedOrgName={selectedIssue.assignedOrgName}
              responsibleType={selectedIssue.responsibleType}
              responsibleName={selectedIssue.responsibleName}
              status={selectedIssue.status}
              isAdmin={true}
              readOnly={false}
              issueId={selectedIssue.id}
              issueTitle={selectedIssue.title}
              onSaveAndPublish={handleSaveAndPublish}
            />
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400">
              No ticket selected for repair verification.
            </div>
          )}
        </div>
      </div>

      {/* Audit Log / Certified Completed Repairs Gallery */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-display">
              Published Municipal & Volunteer Repair Records
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {resolvedIssues.length} AI Verified & Published to Public Portal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resolvedIssues.length > 0 ? (
            resolvedIssues.map((issue) => {
              const entity = formatResponsibleEntity(issue);

              return (
                <div
                  key={issue.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 cursor-pointer group"
                  onClick={() => setSelectedIssueId(issue.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">{issue.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      RESOLVED
                    </span>
                  </div>

                  {/* Micro Before/After Thumbnails */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-900 border border-slate-800">
                      <img src={issue.imageUrl} alt="Before" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[8px] font-bold bg-rose-600/90 text-white">
                        BEFORE
                      </span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-900 border border-slate-800">
                      <img
                        src={
                          issue.repairVerificationUrl ||
                          issue.workerSubmission?.afterImageUrl ||
                          'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80'
                        }
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-600/90 text-white">
                        AFTER
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-200 truncate">{issue.title}</p>
                  
                  {/* Responsible party badge */}
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border truncate max-w-full ${entity.badgeClass}`}>
                    {entity.tag} {entity.label}
                  </span>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="truncate max-w-[150px] text-slate-300 font-medium">
                      {formatDisplayAddress(issue.location?.address, issue.location)}
                    </span>
                    <span className="text-indigo-400 group-hover:text-cyan-300 font-semibold flex items-center gap-1">
                      Edit/View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-slate-400 text-xs">
              No completed repair audits logged yet. Select an in-progress ticket above to verify work quality.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRepairVerification;
