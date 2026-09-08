import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Award,
  ThumbsUp,
  PlusCircle,
  Navigation,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import IssueCard from '../../components/issue/IssueCard';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { getUserComplaints } from '../../utils/helpers';

export const CitizenDashboard = () => {
  const { issues, upvoteIssue } = useContext(IssueContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Strictly filter complaints belonging exclusively to the currently logged-in citizen by User ID
  const myComplaints = getUserComplaints(issues, user);

  const resolvedCount = myComplaints.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const inProgressCount = myComplaints.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED' || i.status === 'VERIFIED').length;
  const totalUpvotes = myComplaints.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-900/40 border border-indigo-500/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Active Citizen Account
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {user?._id || user?.id || 'usr_citizen_001'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Welcome back, {user?.name || 'Citizen'}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You have <strong className="text-indigo-300">{myComplaints.length} complaint{myComplaints.length === 1 ? '' : 's'}</strong> logged under your account. Track real-time repair progress, field technician assignments, and verification audits.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/citizen/report">
            <Button variant="primary" size="md" leftIcon={PlusCircle}>
              Report An Issue (GPS)
            </Button>
          </Link>
          <Link to="/citizen/my-reports">
            <Button variant="secondary" size="md" leftIcon={FileText}>
              My Submissions ({myComplaints.length})
            </Button>
          </Link>
          <Link to="/citizen/explore">
            <Button variant="ghost" size="md" leftIcon={Navigation}>
              My GPS Radar
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row (Strictly Scoped to Logged-in Citizen) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/citizen/my-reports')}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <StatCard
            title="My Submissions"
            value={myComplaints.length}
            subtitle="Uploaded by your account"
            icon={FileText}
            trend="Exclusively your reports"
            trendPositive={true}
            colorScheme="indigo"
          />
        </div>
        <StatCard
          title="My Resolved"
          value={resolvedCount}
          subtitle="Fixed by municipal teams"
          icon={CheckCircle2}
          trend={myComplaints.length > 0 ? `${Math.round((resolvedCount / myComplaints.length) * 100)}% resolved` : '0 resolved'}
          trendPositive={true}
          colorScheme="emerald"
        />
        <StatCard
          title="Reputation Score"
          value={`${user?.reputationScore || 100} pts`}
          subtitle="Tier: Civic Guardian"
          icon={Award}
          trend="+45 pts"
          trendPositive={true}
          colorScheme="amber"
        />
        <StatCard
          title="Upvotes on My Reports"
          value={totalUpvotes}
          subtitle="Community endorsements"
          icon={ThumbsUp}
          trend={totalUpvotes > 0 ? `+${totalUpvotes} endorsements` : '0 upvotes'}
          trendPositive={true}
          colorScheme="cyan"
        />
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/citizen/report')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group shadow-lg flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
              Submit New Hazard
            </h4>
            <p className="text-xs text-slate-400">Live photo & AI defect classification</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/citizen/my-reports')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-lg flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
              My Submissions ({myComplaints.length})
            </h4>
            <p className="text-xs text-slate-400">Track your uploaded complaints & live status</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/citizen/repair-verification')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
              My Repair Audits
            </h4>
            <p className="text-xs text-slate-400">AI before-and-after photo verification</p>
          </div>
        </div>
      </div>

      {/* Citizen's Own Submitted Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-display">My Uploaded Complaints</h3>
            <p className="text-xs text-slate-400">Complaints filed by your account ({user?.email || 'Logged-in Citizen'})</p>
          </div>
          <Link
            to="/citizen/my-reports"
            className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All in My Submissions ({myComplaints.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {myComplaints.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No complaints submitted yet"
            description="You haven't reported any civic hazards yet. Submit a report with photo & GPS to track municipal response."
            actionLabel="Submit First Hazard"
            onAction={() => navigate('/citizen/report')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myComplaints.slice(0, 6).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onUpvote={upvoteIssue}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
