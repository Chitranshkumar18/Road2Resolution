import React, { useContext, useState, useMemo, useEffect } from 'react';
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
  ChevronRight,
  Building2,
  Radio,
  Navigation,
  LocateFixed,
  UserCheck
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import useAuth from '../../hooks/useAuth';
import useLocation from '../../hooks/useLocation';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { calculateDistanceKm } from '../../utils/helpers';
import { formatDisplayAddress } from '../../utils/geocoding';

const MAX_RADIUS_KM = 50;

const LOCATION_PRESETS = [
  { label: 'Delhi NCR (Central)', lat: 28.6139, lng: 77.2090, city: 'New Delhi' },
  { label: 'Punjab (Ludhiana)', lat: 30.9010, lng: 75.8573, city: 'Ludhiana' },
  { label: 'Maharashtra (Mumbai)', lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
  { label: 'Karnataka (Bengaluru)', lat: 12.9716, lng: 77.5946, city: 'Bengaluru' },
  { label: 'Uttar Pradesh (Lucknow)', lat: 26.8467, lng: 80.9462, city: 'Lucknow' }
];

export const WorkerDashboard = () => {
  const { issues = [], startWorkerTask } = useContext(IssueContext) || {};
  const { addToast } = useContext(NotificationContext) || {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const { coords: deviceCoords, accuracy, loading: gpsLoading, getCurrentPosition } = useLocation();

  // Dynamic Worker GPS Coordinates (Default: Delhi NCR)
  const [workerLocation, setWorkerLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
    label: 'Delhi NCR (Central)'
  });

  // Sync with device GPS when acquired
  useEffect(() => {
    if (deviceCoords?.lat && deviceCoords?.lng) {
      setWorkerLocation({
        lat: deviceCoords.lat,
        lng: deviceCoords.lng,
        label: `Live GPS Fix (±${accuracy || 4}m)`
      });
    }
  }, [deviceCoords, accuracy]);

  const issueList = Array.isArray(issues) ? issues : [];

  const [selectedRadius, setSelectedRadius] = useState('all'); // 'all' | '50' | '100'

  // 1. Calculate distance for each complaint dynamically from worker's GPS location
  const complaintsWithDistance = useMemo(() => {
    return issueList.map((issue) => {
      const issueLat = issue.location?.lat || 28.6139;
      const issueLng = issue.location?.lng || 77.2090;
      const distanceKm = calculateDistanceKm(
        workerLocation.lat,
        workerLocation.lng,
        issueLat,
        issueLng
      );
      return {
        ...issue,
        distanceKm: Math.round(distanceKm * 10) / 10,
        isWithin50Km: distanceKm <= MAX_RADIUS_KM
      };
    });
  }, [issueList, workerLocation]);

  // 2. Synchronized Citizen Complaints list (All citizen submissions visible by default with real-time GPS distances)
  const visibleIssues = useMemo(() => {
    if (selectedRadius === '50') {
      return complaintsWithDistance.filter((i) => i.isWithin50Km);
    }
    if (selectedRadius === '100') {
      return complaintsWithDistance.filter((i) => i.distanceKm <= 100);
    }
    return complaintsWithDistance;
  }, [complaintsWithDistance, selectedRadius]);

  const openComplaints = visibleIssues.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'REJECTED'
  );
  const inProgressTasks = visibleIssues.filter((i) => i.status === 'IN_PROGRESS');
  const pendingVerifications = visibleIssues.filter(
    (i) => i.status === 'PENDING_VERIFICATION' || Boolean(i.workerSubmission && i.status !== 'RESOLVED')
  );
  const certifiedRepairs = visibleIssues.filter(
    (i) => i.status === 'RESOLVED' || Boolean(i.repairVerificationUrl)
  );

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in_progress' | 'pending_qa'

  const displayedComplaints = openComplaints.filter((item) => {
    if (activeTab === 'in_progress') return item.status === 'IN_PROGRESS';
    if (activeTab === 'pending_qa') return item.status === 'PENDING_VERIFICATION';
    return true;
  });

  const handleStartWork = async (issueId) => {
    if (startWorkerTask) {
      await startWorkerTask(issueId, user);
      if (addToast) {
        addToast(`🛠️ Started work on complaint ${issueId}!`, 'success');
      }
    }
  };

  const handleLocationPresetChange = (preset) => {
    setWorkerLocation({
      lat: preset.lat,
      lng: preset.lng,
      label: preset.label
    });
    if (addToast) {
      addToast(`📍 Worker location set to ${preset.label}. Distances calibrated from your position.`, 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 p-6 md:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
              <Wrench className="w-3.5 h-3.5" />
              <span>FIELD OPERATIONS SQUAD #4</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-display">
              Welcome Back, {user?.name || 'Field Engineer'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Live synchronized monitoring of citizen complaints. Inspect assigned organizations, commence repairs, and submit 250m GPS verified completion photos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={Camera}
              onClick={() => navigate('/worker/upload-proof')}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-900/40 cursor-pointer"
            >
              Upload Repair Photo
            </Button>
            <Button
              variant="outline"
              size="md"
              leftIcon={ClipboardList}
              onClick={() => navigate('/worker/complaints')}
              className="border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              View All Complaints ({visibleIssues.length})
            </Button>
          </div>
        </div>

        {/* Dynamic Location Bar in Dashboard */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Active Worker GPS Fix:</span>
            </span>
            <span className="font-mono text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-lg border border-amber-500/30 font-bold">
              {workerLocation.lat.toFixed(4)}° N, {workerLocation.lng.toFixed(4)}° E ({workerLocation.label})
            </span>
            <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Synced
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium">Radius:</span>
            <select
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Complaints (Live Synced)</option>
              <option value="50">&le; 50 km Radius</option>
              <option value="100">&le; 100 km Radius</option>
            </select>

            <select
              value={LOCATION_PRESETS.find(p => p.lat === workerLocation.lat && p.lng === workerLocation.lng)?.label || 'custom'}
              onChange={(e) => {
                const preset = LOCATION_PRESETS.find(p => p.label === e.target.value);
                if (preset) handleLocationPresetChange(preset);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-medium focus:outline-none focus:border-amber-500"
            >
              {LOCATION_PRESETS.map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => getCurrentPosition()}
              disabled={gpsLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs flex items-center gap-1 cursor-pointer"
            >
              <LocateFixed className={`w-3.5 h-3.5 text-cyan-400 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>GPS Fix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Citizen Complaints */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Citizen Reports</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{visibleIssues.length}</span>
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
            <span className="text-xs font-semibold text-slate-400">Certified Repairs</span>
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

      {/* Main Section: Citizen Complaints */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg md:text-xl font-black text-white font-display">
                Active Citizen Complaints (Live Synced Queue)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select any synchronized citizen complaint to start on-site repair work or upload post-repair verification photos.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Open ({openComplaints.length})
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'in_progress'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In Progress ({inProgressTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('pending_qa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
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

                    {/* Proximity Distance Badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-emerald-300 border border-emerald-500/30 shadow flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 text-emerald-400" />
                      <span>~{issue.distanceKm} km away{issue.isWithin50Km ? ' (≤ 50km)' : ''}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">{issue.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{formatDate(issue.createdAt)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{issue.description}</p>
                  </div>

                  {/* Responsibility status badge */}
                  {issue.responsibleType === 'PUBLIC_INDIVIDUAL' ? (
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">
                          Individual: <strong className="text-white font-bold">{issue.responsibleName || 'Public Worker'}</strong>
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 flex-shrink-0">
                        PERSON
                      </span>
                    </div>
                  ) : (issue.responsibleType === 'ORGANIZATION' || issue.assignedOrgName) ? (
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span className="truncate">
                          Org: <strong className="text-white font-bold">{issue.responsibleOrgName || issue.assignedOrgName}</strong>
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30 flex-shrink-0">
                        ORG
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Location & Metadata */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate font-medium text-slate-300">
                      {formatDisplayAddress(issue.location?.address, issue.location)}
                    </span>
                  </div>

                  {issue.workerSubmission && (
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center justify-between">
                      <span>Proof Uploaded</span>
                      <span className="font-mono font-bold">Awaiting Admin QA</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => navigate('/worker/complaints')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      <span>{issue.status === 'IN_PROGRESS' ? 'View Task' : 'Take Task'}</span>
                    </button>

                    <button
                      onClick={() => navigate(`/worker/upload-proof?issueId=${issue.id}`)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-md shadow-amber-900/30 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Proof</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400 text-xs space-y-2">
              <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
              <p>No active citizen complaints found matching current filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
