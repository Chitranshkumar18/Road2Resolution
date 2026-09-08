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
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import IssueCard from '../../components/issue/IssueCard';
import Button from '../../components/common/Button';

export const CitizenDashboard = () => {
  const { issues, upvoteIssue } = useContext(IssueContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentCitizenEmail = user?.email || 'citizen@civicvision.ai';

  // Filter citizen's own submitted issues (shown in My Submissions)
  const myIssues = issues.filter(
    (i) => i.reporter?.email === currentCitizenEmail || (user?.email && i.reporter?.email === user.email)
  );

  // Filter other community/neighborhood issues (shown in Citizen Hub)
  const communityIssues = issues.filter(
    (i) => i.reporter?.email !== currentCitizenEmail && (!user?.email || i.reporter?.email !== user.email)
  );

  const resolvedCount = issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const totalUpvotes = myIssues.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-900/40 border border-indigo-500/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Active Civic Guardian
            </span>
            <span className="text-xs font-mono text-slate-400">Zone: {user?.zone || 'North Zone'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Welcome back, {user?.name || 'Citizen'}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your neighborhood AI radar is active. You have <strong className="text-indigo-300">{myIssues.length} report{myIssues.length === 1 ? '' : 's'}</strong> in My Submissions, dispatched to municipal workers and admins.
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
              My Submissions ({myIssues.length})
            </Button>
          </Link>
          <Link to="/citizen/explore">
            <Button variant="ghost" size="md" leftIcon={Navigation}>
              Live GPS Radar
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/citizen/my-reports')}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <StatCard
            title="My Submissions"
            value={myIssues.length}
            subtitle="View your reported complaints"
            icon={FileText}
            trend="Exclusively in My Submissions"
            trendPositive={true}
            colorScheme="indigo"
          />
        </div>
        <StatCard
          title="Community Resolved"
          value={resolvedCount}
          subtitle="Fixed by city teams"
          icon={CheckCircle2}
          trend="94% resolution rate"
          trendPositive={true}
          colorScheme="emerald"
        />
        <StatCard
          title="Reputation Score"
          value={`${user?.reputationScore || 340} pts`}
          subtitle="Tier: Civic Guardian"
          icon={Award}
          trend="+45 pts"
          trendPositive={true}
          colorScheme="amber"
        />
        <StatCard
          title="Upvotes Received"
          value={totalUpvotes || 47}
          subtitle="Community endorsements"
          icon={ThumbsUp}
          trend="+12 this week"
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
              My Submissions ({myIssues.length})
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
              Repair Work Audit
            </h4>
            <p className="text-xs text-slate-400">AI before-and-after photo verification</p>
          </div>
        </div>
      </div>

      {/* Recent Community Issues (Excluding citizen's own submissions) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-display">Active Neighborhood Incidents</h3>
            <p className="text-xs text-slate-400">Community reports within 5km of your municipal sector (Your reports are in My Submissions)</p>
          </div>
          <Link
            to="/citizen/explore"
            className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Explore All On GPS Radar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {communityIssues.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <p className="text-sm text-slate-300 font-medium">No other community incidents in this sector.</p>
            <p className="text-xs text-slate-500">Your submitted complaints are tracked under <Link to="/citizen/my-reports" className="text-indigo-400 font-bold underline">My Submissions</Link>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {communityIssues.slice(0, 6).map((issue) => (
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
