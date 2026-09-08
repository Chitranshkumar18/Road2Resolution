import React, { useContext, useEffect, useState } from 'react';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  Clock,
  Building2,
  ListOrdered,
  Flame,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import StatCard from '../../components/dashboard/StatCard';
import PriorityQueue from '../../components/dashboard/PriorityQueue';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import SeverityDistribution from '../../components/dashboard/SeverityDistribution';
import DepartmentPerformance from '../../components/dashboard/DepartmentPerformance';
import adminApi from '../../api/adminApi';
import analyticsApi from '../../api/analyticsApi';

export const AdminDashboard = () => {
  const { issues, updateIssueStatus } = useContext(IssueContext);
  const { addToast } = useContext(NotificationContext);

  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [severityData, setSeverityData] = useState([]);

  const issueList = Array.isArray(issues) ? issues : [];

  // Exclude complaints that have been verified and saved by the Admin
  const activeUnverifiedIssues = issueList.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && !i.repairAudit?.verified
  );

  const pendingWorkerSubmissions = issueList.filter(
    (i) => i.status === 'PENDING_VERIFICATION' || (i.workerSubmission && i.status !== 'RESOLVED')
  );

  const criticalCount = activeUnverifiedIssues.filter((i) => i.severity === 'CRITICAL').length;
  const inTriageCount = activeUnverifiedIssues.length;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, trendsRes, sevRes] = await Promise.all([
          adminApi.getDashboardStats(),
          analyticsApi.getIssueTrends(),
          analyticsApi.getSeverityBreakdown(),
        ]);
        setStats(statsRes);
        setTrends(trendsRes);
        setSeverityData(sevRes);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [issues]);

  const handleAssignDepartment = async (issueId, departmentName) => {
    await updateIssueStatus(
      issueId,
      'ASSIGNED',
      `Assigned to ${departmentName}`,
      'Duty Engineer',
      departmentName
    );
    addToast(`Issue ${issueId} assigned to ${departmentName}`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              URBAN COMMAND CENTER
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY ACTIVE
            </span>
          </div>
          <h2 className="text-2xl font-black text-white font-display mt-1">
            Metropolitan Infrastructure Command Radar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-agency coordination, automated AI hazard queue, and municipal SLA management. (Verified complaints automatically routed to Repair QA & Audit).
          </p>
        </div>
      </div>

      {/* Worker Submissions Alert Banner */}
      {pendingWorkerSubmissions.length > 0 && (
        <div className="p-4 md:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Worker Field Submissions Pending Verification
              </h3>
              <p className="text-xs text-slate-300">
                {pendingWorkerSubmissions.length} repair proofs uploaded by field contractors require your differential AI audit.
              </p>
            </div>
          </div>
          <a
            href="/admin/repair-verification"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors shadow-md shadow-amber-950/40 whitespace-nowrap"
          >
            Review & Certify Repairs →
          </a>
        </div>
      )}

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Critical Hazards"
          value={criticalCount}
          subtitle="Immediate dispatch required"
          icon={ShieldAlert}
          trend="+2 urgent today"
          trendPositive={false}
          colorScheme="rose"
        />
        <StatCard
          title="Active In Triage"
          value={inTriageCount}
          subtitle="Unresolved / In Progress"
          icon={Activity}
          trend="Excludes verified fixes"
          trendPositive={true}
          colorScheme="amber"
        />
        <StatCard
          title="Municipal SLA Rate"
          value={`${stats?.resolutionRate || 94}%`}
          subtitle="Within target resolution hours"
          icon={CheckCircle2}
          trend="+1.4% vs last month"
          trendPositive={true}
          colorScheme="emerald"
        />
        <StatCard
          title="Avg Triage Speed"
          value={`${stats?.avgResolutionHours || 14}h`}
          subtitle="Time to field verification"
          icon={Clock}
          trend="-2.1h faster"
          trendPositive={true}
          colorScheme="cyan"
        />
      </div>

      {/* Priority Queue (AI) - Excludes Verified Complaints */}
      <PriorityQueue
        issues={activeUnverifiedIssues}
        onAssign={handleAssignDepartment}
        limit={5}
      />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart data={trends} />
        </div>
        <div>
          <SeverityDistribution data={severityData} />
        </div>
      </div>

      {/* Department SLA & Workloads */}
      <DepartmentPerformance />
    </div>
  );
};

export default AdminDashboard;
