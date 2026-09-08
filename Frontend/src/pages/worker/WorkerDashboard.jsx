import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Sparkles,
  Wrench,
  Truck,
  ShieldCheck,
  Eye,
  FileCheck2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import useAuth from '../../hooks/useAuth';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

export const WorkerDashboard = () => {
  const { issues = [], startWorkerTask } = useContext(IssueContext) || {};
  const { user } = useAuth();
  const navigate = useNavigate();

  const issueList = Array.isArray(issues) ? issues : [];

  const openComplaints = issueList.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'REJECTED'
  );
  const inProgressTasks = issueList.filter((i) => i.status === 'IN_PROGRESS');
  const pendingVerifications = issueList.filter((i) => i.status === 'PENDING_VERIFICATION' || Boolean(i.workerSubmission && i.status !== 'RESOLVED'));
  const certifiedRepairs = issueList.filter((i) => i.status === 'RESOLVED' || Boolean(i.repairVerificationUrl));

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in_progress' | 'pending_qa'

  const displayedComplaints = openComplaints.filter((item) => {
    if (activeTab === 'in_progress') return item.status === 'IN_PROGRESS';
    if (activeTab === 'pending_qa') return item.status === 'PENDING_VERIFICATION';
    return true;
  });

  const handleStartWork = async (issueId) => {
    if (startWorkerTask) {
      await startWorkerTask(issueId, user);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
              <Wrench className="w-3.5 h-3.5" />
              <span>FIELD OPERATIONS SQUAD #4</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-display">
              Welcome Back, {user?.name || 'Field Engineer'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Inspect live citizen hazard reports across your assigned sector, commence repair works, and submit verified completion photos directly to the Municipal Admin QA Console.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={Camera}
              onClick={() => navigate('/worker/upload-proof')}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-900/40"
            >
              Upload Repair Photo
            </Button>
            <Button
              variant="outline"
              size="md"
              leftIcon={ClipboardList}
              onClick={() => navigate('/worker/complaints')}
              className="border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              View All Complaints
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Citizen Complaints */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Citizen Reports</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{issueList.length}</span>
            <span className="text-[11px] text-indigo-400 font-medium">{openComplaints.length} Open</span>
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">In-Progress Repairs</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 font-mono">{inProgressTasks.length}</span>
            <span className="text-[11px] text-amber-300 font-medium">Under Repair</span>
          </div>
        </div>

        {/* Card 3: Pending Admin QA */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Sent for Admin QA</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-cyan-400 font-mono">{pendingVerifications.length}</span>
            <span className="text-[11px] text-cyan-300 font-medium">Awaiting Audit</span>
          </div>
        </div>

        {/* Card 4: Certified Repairs */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Certified & Closed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">{certifiedRepairs.length}</span>
            <span className="text-[11px] text-emerald-300 font-medium">100% Passed</span>
          </div>
        </div>
      </div>

      {/* Main Section: Citizen Complaints & Direct Action Feed */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg md:text-xl font-black text-white font-display">
                Active Citizen Complaints Requiring Field Action
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select any citizen complaint to start on-site repair work or upload post-repair verification photos.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Open ({openComplaints.length})
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'in_progress'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In Progress ({inProgressTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('pending_qa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'pending_qa'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending QA ({pendingVerifications.length})
            </button>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedComplaints.length > 0 ? (
            displayedComplaints.map((issue) => (
              <div
                key={issue.id}
                className="rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all p-4 flex flex-col justify-between space-y-4 group"
              >
                {/* Header & Thumbnail */}
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <SeverityBadge severity={issue.severity} size="xs" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <IssueStatus status={issue.status} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">{issue.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{formatDate(issue.createdAt)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{issue.description}</p>
                  </div>
                </div>

                {/* Location & Metadata */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{issue.location?.address}</span>
                  </div>

                  {issue.workerSubmission && (
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center justify-between">
                      <span>Proof Uploaded</span>
                      <span className="font-mono font-bold">Awaiting Admin QA</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {issue.status !== 'IN_PROGRESS' && issue.status !== 'PENDING_VERIFICATION' ? (
                      <button
                        onClick={() => handleStartWork(issue.id)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-slate-700"
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        <span>Start Work</span>
                      </button>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-bold flex items-center justify-center gap-1 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span>In Progress</span>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/worker/upload-proof?issueId=${issue.id}`)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-md shadow-amber-900/30"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Proof</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400 text-xs">
              No active citizen complaints found matching the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
