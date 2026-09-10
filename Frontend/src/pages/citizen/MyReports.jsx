import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, FileText } from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import useAuth from '../../hooks/useAuth';
import IssueCard from '../../components/issue/IssueCard';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { getUserComplaints } from '../../utils/helpers';

export const MyReports = () => {
  const { issues, upvoteIssue } = useContext(IssueContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // all, active, resolved
  const [searchQuery, setSearchQuery] = useState('');

  // Strictly filter complaints belonging exclusively to the currently logged-in citizen by User ID
  const userIssues = getUserComplaints(issues, user);

  const activeCount = userIssues.filter((i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
  const resolvedCount = userIssues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

  const filteredIssues = userIssues.filter((issue) => {
    if (activeTab === 'active' && (issue.status === 'RESOLVED' || issue.status === 'CLOSED')) return false;
    if (activeTab === 'resolved' && issue.status !== 'RESOLVED' && issue.status !== 'CLOSED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title?.toLowerCase().includes(q) ||
        issue.description?.toLowerCase().includes(q) ||
        issue.id?.toLowerCase().includes(q) ||
        issue.location?.address?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header + CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">My Submitted Reports</h2>
          <p className="text-xs text-slate-400">Track real-time progress, upvotes, and municipal dispatches</p>
        </div>

        <Link to="/citizen/report">
          <Button variant="primary" size="md" leftIcon={PlusCircle}>
            Report New Hazard
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: `All Reports (${userIssues.length})` },
            { id: 'active', label: `Active Work (${activeCount})` },
            { id: 'resolved', label: `Resolved & Audited (${resolvedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or description..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Issues Grid */}
      {filteredIssues.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports match your account filter"
          description={
            userIssues.length === 0
              ? "You have not submitted any complaints yet. Submit a report with photo & GPS to track municipal response."
              : "No complaints matching this tab or search filter were found in your account."
          }
          actionLabel="Submit New Hazard"
          onAction={() => navigate('/citizen/report')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onUpvote={upvoteIssue}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
