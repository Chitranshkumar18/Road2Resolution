import React, { useContext, useState } from 'react';
import {
  ListOrdered,
  Search,
  Filter,
  ShieldAlert,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import SeverityBadge from '../../components/issue/SeverityBadge';
import PriorityScore from '../../components/issue/PriorityScore';
import IssueStatus from '../../components/issue/IssueStatus';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { DEPARTMENTS } from '../../utils/constants';

export const PriorityQueue = () => {
  const { issues, updateIssueStatus } = useContext(IssueContext);
  const { addToast } = useContext(NotificationContext);

  const [selectedDept, setSelectedDept] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const issueList = Array.isArray(issues) ? issues : [];

  // Exclude complaints that have been verified and saved by the Admin
  const activeUnverifiedIssues = issueList.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && !i.repairAudit?.verified
  );

  // Sort descending by priority score
  const sorted = [...activeUnverifiedIssues].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  const filtered = sorted.filter((issue) => {
    if (selectedDept !== 'all' && issue.department !== selectedDept) return false;
    if ((issue.priorityScore || 0) < minScore) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.id.toLowerCase().includes(q) ||
        issue.location?.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAssign = async (issueId, deptName) => {
    await updateIssueStatus(issueId, 'ASSIGNED', `Assigned to ${deptName}`, 'Duty Field Unit', deptName);
    addToast(`Issue ${issueId} assigned to ${deptName}`, 'success');
  };

  const handleStatusUpdate = async (issueId, status) => {
    await updateIssueStatus(issueId, status, `Status changed by Municipal Administrator to ${status}`);
    addToast(`Updated status to ${status}`, 'info');
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ListOrdered className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Automated AI Priority Dispatch Queue
              </h2>
              <p className="text-xs text-slate-400">
                Calculated dynamically via P = 0.4(Safety Risk) + 0.3(Traffic Density) + 0.3(Damage Severity)
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {filtered.length} Prioritized Incidents
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Department Routing
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Min Priority Score ({minScore}+)
            </label>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search Incidents
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, road or description..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl divide-y divide-slate-800/70">
        {filtered.map((issue, idx) => (
          <div
            key={issue.id}
            className="p-4 hover:bg-slate-850/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 font-mono text-xs font-black flex items-center justify-center border border-slate-700">
                #{idx + 1}
              </span>

              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
              />

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-indigo-400">{issue.id}</span>
                  <SeverityBadge severity={issue.severity} size="xs" />
                  <IssueStatus status={issue.status} />
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {issue.aiConfidence}% Vision Conf.
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 truncate">{issue.title}</h3>
                <p className="text-xs text-slate-400 truncate">{issue.location?.address}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 self-end lg:self-center flex-shrink-0">
              <PriorityScore score={issue.priorityScore} />

              <select
                value={issue.department || ''}
                onChange={(e) => handleAssign(issue.id, e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="" disabled>Assign Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name.split(' ')[0]}
                  </option>
                ))}
              </select>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedIssue(issue)}
              >
                Triage Modal
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Triage Detail Modal */}
      {selectedIssue && (
        <Modal
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssue(null)}
          title={`Incident Triage: ${selectedIssue.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            <div className="relative rounded-xl overflow-hidden h-48 bg-slate-950 border border-slate-700">
              <img
                src={selectedIssue.imageUrl}
                alt={selectedIssue.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <SeverityBadge severity={selectedIssue.severity} size="xs" />
                <IssueStatus status={selectedIssue.status} />
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{selectedIssue.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{selectedIssue.description}</p>
              <p className="text-xs text-indigo-400 mt-2 font-mono">
                Location: {selectedIssue.location?.address}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">AI Recommended Response:</span>
              <p className="text-xs text-slate-300">
                {selectedIssue.aiDetection?.suggestedAction || 'Field repair team dispatch recommended within 8 hours.'}
              </p>
            </div>

            {/* Change Status Fast Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Update Dispatch Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedIssue.id, 'IN_PROGRESS')}
                >
                  Set In Progress
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleStatusUpdate(selectedIssue.id, 'RESOLVED')}
                >
                  Mark Resolved
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStatusUpdate(selectedIssue.id, 'CLOSED')}
                >
                  Verify & Close
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleStatusUpdate(selectedIssue.id, 'REJECTED')}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PriorityQueue;
