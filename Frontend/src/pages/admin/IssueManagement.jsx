import React, { useContext, useState } from 'react';
import { Layers, Search, Filter, CheckCircle2, AlertOctagon, UserPlus, Building2 } from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import SeverityBadge from '../../components/issue/SeverityBadge';
import PriorityScore from '../../components/issue/PriorityScore';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { DEPARTMENTS, ISSUE_CATEGORIES, ISSUE_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export const IssueManagement = () => {
  const { issues, updateIssueStatus } = useContext(IssueContext);
  const { addToast } = useContext(NotificationContext);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = issues.filter((issue) => {
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.location?.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (id, status) => {
    await updateIssueStatus(id, status, `Status changed by Municipal Control Desk to ${status}`);
    addToast(`Issue ${id} status updated to ${status}`, 'success');
  };

  const handleDepartmentChange = async (id, dept) => {
    await updateIssueStatus(id, 'ASSIGNED', `Assigned to ${dept}`, 'Duty Engineer', dept);
    addToast(`Issue ${id} routed to ${dept}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Civic Issue Lifecycle & Triage Management
              </h2>
              <p className="text-xs text-slate-400">
                Complete database of citizen reports, municipal routing, and resolution audit status.
              </p>
            </div>
          </div>

          <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {filtered.length} Total Records
          </span>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {ISSUE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending AI Scan</option>
              <option value="VERIFIED">AI Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search Database
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, keyword..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-4">Incident & Photo</th>
              <th className="px-4 py-4">Severity & Priority</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Assigned Dept</th>
              <th className="px-4 py-4">Reported</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-850/60 transition-colors">
                {/* Photo & title */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="max-w-xs space-y-0.5">
                      <span className="font-mono text-[10px] text-indigo-400 font-bold block">{issue.id}</span>
                      <p className="font-bold text-slate-100 truncate">{issue.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{issue.location?.address}</p>
                    </div>
                  </div>
                </td>

                {/* Severity & Score */}
                <td className="px-4 py-4 space-y-1">
                  <SeverityBadge severity={issue.severity} size="xs" />
                  <div>
                    <PriorityScore score={issue.priorityScore} showLabel={false} />
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">AI Verified</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </td>

                {/* Dept */}
                <td className="px-4 py-4">
                  <select
                    value={issue.department || ''}
                    onChange={(e) => handleDepartmentChange(issue.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 max-w-[150px]"
                  >
                    <option value="" disabled>Select Department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name.split(' ')[0]}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Reported time */}
                <td className="px-4 py-4 text-[11px] font-mono text-slate-400 whitespace-nowrap">
                  {formatDate(issue.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(issue.id, 'RESOLVED')}
                  >
                    Quick Resolve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueManagement;
