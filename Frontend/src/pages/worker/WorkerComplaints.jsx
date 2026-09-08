import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Filter,
  MapPin,
  Camera,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import useAuth from '../../hooks/useAuth';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { ISSUE_CATEGORIES } from '../../utils/constants';

export const WorkerComplaints = () => {
  const { issues = [], startWorkerTask } = useContext(IssueContext) || {};
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const issueList = Array.isArray(issues) ? issues : [];

  const filteredIssues = issueList.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchLoc = item.location?.address?.toLowerCase().includes(q);
      const matchId = item.id?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchId) return false;
    }
    return true;
  });

  const handleStartWork = async (id) => {
    if (startWorkerTask) {
      await startWorkerTask(id, user);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md shadow-amber-500/10">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white font-display">
                  Citizen Complaints Live Radar
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  FIELD WORKBENCH
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full directory of citizen-reported infrastructure issues. Select tickets to commence field operations and upload proof-of-work.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Matching Tickets</span>
              <span className="text-sm font-bold font-mono text-amber-400">{filteredIssues.length} Complaints</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword, ID, location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="all">All Categories</option>
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending AI Scan</option>
            <option value="VERIFIED">AI Verified / Open</option>
            <option value="ASSIGNED">Assigned to Dept</option>
            <option value="IN_PROGRESS">Work In Progress</option>
            <option value="PENDING_VERIFICATION">Sent to Admin for QA</option>
            <option value="RESOLVED">Resolved & Certified</option>
          </select>

          {/* Severity */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all p-5 flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-3.5">
                {/* Visual Header */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <SeverityBadge severity={issue.severity} size="xs" />
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <IssueStatus status={issue.status} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{issue.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{formatDate(issue.createdAt)}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {issue.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">{issue.description}</p>
                </div>
              </div>

              {/* Footer Meta & Actions */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{issue.location?.address}</span>
                  </div>
                </div>

                {issue.workerSubmission && (
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center justify-between">
                    <span>Proof Submitted to Admin</span>
                    <span className="font-mono font-bold">In QA Queue</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {issue.status !== 'IN_PROGRESS' && issue.status !== 'PENDING_VERIFICATION' && issue.status !== 'RESOLVED' ? (
                    <button
                      onClick={() => handleStartWork(issue.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      <span>Start Work</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{issue.status === 'RESOLVED' ? 'Certified' : 'In Progress'}</span>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/worker/upload-proof?issueId=${issue.id}`)}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-900/30"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Proof</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No complaints found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerComplaints;
