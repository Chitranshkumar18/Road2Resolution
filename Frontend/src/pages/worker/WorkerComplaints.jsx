import React, { useContext, useState, useMemo, useEffect } from 'react';
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
  Sparkles,
  Building2,
  Radio,
  LocateFixed,
  Navigation,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  User,
  HeartHandshake,
  Check,
  X
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import useAuth from '../../hooks/useAuth';
import useLocation from '../../hooks/useLocation';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { ISSUE_CATEGORIES } from '../../utils/constants';
import { calculateDistanceKm } from '../../utils/helpers';
import { formatDisplayAddress } from '../../utils/geocoding';

const MAX_RADIUS_KM = 50;

const LOCATION_PRESETS = [
  { label: 'Delhi NCR (Central)', lat: 28.6139, lng: 77.2090, city: 'New Delhi', state: 'Delhi' },
  { label: 'Punjab (Ludhiana)', lat: 30.9010, lng: 75.8573, city: 'Ludhiana', state: 'Punjab' },
  { label: 'Maharashtra (Mumbai)', lat: 19.0760, lng: 72.8777, city: 'Mumbai', state: 'Maharashtra' },
  { label: 'Karnataka (Bengaluru)', lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  { label: 'Uttar Pradesh (Lucknow)', lat: 26.8467, lng: 80.9462, city: 'Lucknow', state: 'Uttar Pradesh' }
];

export const WorkerComplaints = () => {
  const { issues = [], startWorkerTask, acceptWorkAsOrganization, acceptWorkAsVolunteer } = useContext(IssueContext) || {};
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

  // Modal State for Individual Person Acceptance
  const [individualModalOpen, setIndividualModalOpen] = useState(false);
  const [selectedIssueForIndividual, setSelectedIssueForIndividual] = useState(null);
  const [individualName, setIndividualName] = useState('');
  const [individualPhone, setIndividualPhone] = useState('');
  const [individualNotes, setIndividualNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const [selectedRadius, setSelectedRadius] = useState('all'); // 'all' | '50' | '100'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const issueList = Array.isArray(issues) ? issues : [];

  // 1. Calculate distance for every complaint dynamically from worker's GPS location
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
        isWithin50Km: distanceKm <= 50
      };
    });
  }, [issueList, workerLocation]);

  // 2. Synchronized Citizen Complaints list (All citizen submissions visible with real-time GPS distances)
  const visibleIssues = useMemo(() => {
    if (selectedRadius === '50') {
      return complaintsWithDistance.filter((item) => item.isWithin50Km);
    }
    if (selectedRadius === '100') {
      return complaintsWithDistance.filter((item) => item.distanceKm <= 100);
    }
    return complaintsWithDistance;
  }, [complaintsWithDistance, selectedRadius]);

  // 3. Apply secondary UI filters (search, category, status, severity) on visible issues
  const filteredIssues = useMemo(() => {
    return visibleIssues.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchLoc = item.location?.address?.toLowerCase().includes(q);
        const matchCity = item.location?.city?.toLowerCase().includes(q);
        const matchOrg = item.assignedOrgName?.toLowerCase().includes(q);
        const matchResp = item.responsibleName?.toLowerCase().includes(q);
        const matchId = item.id?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchCity && !matchOrg && !matchResp && !matchId) return false;
      }
      return true;
    });
  }, [visibleIssues, selectedCategory, selectedStatus, selectedSeverity, search]);

  // Case 1: Accept work on behalf of Assigned Organization
  const handleAcceptAsOrg = async (issue) => {
    const orgName = issue.assignedOrgName || user?.contractorUnit || 'Municipal Rapid Repair Division';
    const workerName = user?.name || 'Field Technician';
    try {
      if (acceptWorkAsOrganization) {
        await acceptWorkAsOrganization(issue.id, {
          name: workerName,
          organizationName: orgName,
          email: user?.email || 'worker@civicvision.ai'
        });
      } else if (startWorkerTask) {
        await startWorkerTask(issue.id, {
          name: workerName,
          contractorUnit: orgName
        });
      }
      if (addToast) {
        addToast(`🏢 Accepted task as ${orgName} field crew (${workerName})!`, 'success');
      }
    } catch (err) {
      console.error(err);
      if (addToast) addToast('Error accepting task for organization', 'error');
    }
  };

  // Case 2: Open Modal to take work as Normal Person / Individual Worker
  const handleOpenIndividualModal = (issue) => {
    setSelectedIssueForIndividual(issue);
    setIndividualName(user?.name || 'Public Worker / Resident');
    setIndividualPhone(user?.phone || '+91 98000 00000');
    setIndividualNotes('Taking personal responsibility as an individual worker to resolve this road hazard.');
    setIndividualModalOpen(true);
  };

  const handleConfirmIndividualAccept = async (e) => {
    e.preventDefault();
    if (!selectedIssueForIndividual) return;

    setActionLoading(true);
    try {
      const volName = individualName.trim() || user?.name || 'Individual Worker';
      if (acceptWorkAsVolunteer) {
        await acceptWorkAsVolunteer(selectedIssueForIndividual.id, {
          name: volName,
          phone: individualPhone.trim(),
          email: user?.email || 'volunteer@civicvision.ai',
          notes: individualNotes.trim()
        });
      }
      if (addToast) {
        addToast(`👤 Assigned task to ${volName}! No longer an active task for assigned organization.`, 'success');
      }
      setIndividualModalOpen(false);
      setSelectedIssueForIndividual(null);
    } catch (err) {
      console.error(err);
      if (addToast) addToast('Failed to take task as individual', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLocationPresetChange = (preset) => {
    setWorkerLocation({
      lat: preset.lat,
      lng: preset.lng,
      label: preset.label
    });
    if (addToast) {
      addToast(`📍 Worker location updated to ${preset.label}. Visible complaints refreshed for 50km radius.`, 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Live Synced Location Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md shadow-amber-500/10">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white font-display">
                  Citizen Complaints (Live Synced Queue)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  REAL-TIME SYNCED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every complaint submitted by citizens automatically appears in this portal and the Admin Desk. Work can be taken by <strong>Assigned Organizations</strong> or <strong>Individual Workers</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Live Complaints</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{filteredIssues.length} Complaints</span>
            </div>
          </div>
        </div>

        {/* Dynamic Worker GPS Telemetry Strip */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-200">Worker Live GPS Location:</span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {workerLocation.lat.toFixed(4)}° N, {workerLocation.lng.toFixed(4)}° E ({workerLocation.label})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                GPS Radar active • Distances dynamically calibrated from your position.
              </p>
            </div>
          </div>

          {/* Location Calibration / Radius Filter Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Radius Filter:</span>
            <select
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Locations (Live Synced)</option>
              <option value="50">Within 50 km Radius</option>
              <option value="100">Within 100 km Radius</option>
            </select>
            <select
              value={LOCATION_PRESETS.find(p => p.lat === workerLocation.lat && p.lng === workerLocation.lng)?.label || 'custom'}
              onChange={(e) => {
                const preset = LOCATION_PRESETS.find(p => p.label === e.target.value);
                if (preset) handleLocationPresetChange(preset);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
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
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <LocateFixed className={`w-3.5 h-3.5 text-cyan-400 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>Live GPS Fix</span>
            </button>
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
              placeholder="Search ID, keyword, address, entity..."
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
            <option value="ASSIGNED">Assigned to Dept / Org</option>
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
          filteredIssues.map((issue) => {
            const hasAssignedOrg = Boolean(issue.assignedOrgName || issue.assignedOrgId);
            const isTakenByIndividual = issue.responsibleType === 'PUBLIC_INDIVIDUAL';
            const isTakenByOrg = issue.responsibleType === 'ORGANIZATION' && (issue.status === 'IN_PROGRESS' || Boolean(issue.workAcceptedAt));
            const isResolvedOrPendingQA = issue.status === 'RESOLVED' || issue.status === 'PENDING_VERIFICATION' || Boolean(issue.repairVerificationUrl) || Boolean(issue.workerSubmission);
            const isUnclaimed = !isTakenByIndividual && !isTakenByOrg && !isResolvedOrPendingQA;

            return (
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

                    {/* Proximity Distance Badge */}
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/80 text-emerald-300 border border-emerald-500/40 shadow backdrop-blur-sm flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-emerald-400" />
                      <span>~{issue.distanceKm} km away{issue.isWithin50Km ? ' (≤ 50km)' : ''}</span>
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

                  {/* RESPONSIBILITY STATUS BANNER */}
                  {isTakenByIndividual ? (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 font-bold truncate">
                          <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">👤 Assigned to Individual:</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                          LOCKED TO PERSON
                        </span>
                      </div>
                      <p className="font-bold text-white pl-5 text-[11px] truncate">
                        {issue.responsibleName || 'Public Worker'}
                      </p>
                    </div>
                  ) : isTakenByOrg ? (
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 font-bold truncate">
                          <Building2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          <span className="truncate">🏢 Accepted by Organization:</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                          LOCKED TO ORG
                        </span>
                      </div>
                      <p className="font-bold text-white pl-5 text-[11px] truncate">
                        {issue.responsibleOrgName || issue.assignedOrgName} ({issue.responsibleName || 'Field Crew'})
                      </p>
                    </div>
                  ) : hasAssignedOrg ? (
                    <div className="p-2.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 font-bold truncate">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                          <span className="truncate">Assigned to: <strong className="text-white font-bold">{issue.assignedOrgName}</strong></span>
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                          ORG ASSIGNED
                        </span>
                      </div>
                      <p className="text-[10px] text-indigo-200/90 pl-5">
                        ⚡ Organization assigned by Admin. Choose "Accept as Org" or "Take as Person".
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 font-bold truncate">
                          <ClipboardList className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate font-semibold">Open Civic Complaint</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                          OPEN TASK
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 pl-5">
                        ⚡ Available for Organization Crew or Individual Worker.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Meta & Action Buttons */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate font-medium text-slate-300">
                        {formatDisplayAddress(issue.location?.address, issue.location)}
                      </span>
                    </div>
                  </div>

                  {issue.workerSubmission && (
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center justify-between">
                      <span>Proof Submitted to Admin</span>
                      <span className="font-mono font-bold">In QA Queue</span>
                    </div>
                  )}

                  {/* Dual Action Controls (Both Accept as Org & Take as Person visible) */}
                  <div className="space-y-2 pt-1">
                    {isUnclaimed ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAcceptAsOrg(issue)}
                          className="w-full py-2.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-indigo-400/40 cursor-pointer shadow-md shadow-indigo-950/40 active:scale-[0.98]"
                          title={hasAssignedOrg ? `Accept work as assigned organization: ${issue.assignedOrgName}` : "Accept work as Organization"}
                        >
                          <Building2 className="w-3.5 h-3.5 text-indigo-200 flex-shrink-0" />
                          <span className="truncate">Accept as Org</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenIndividualModal(issue)}
                          className="w-full py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-emerald-400/40 cursor-pointer shadow-md shadow-emerald-950/40 active:scale-[0.98]"
                          title="Take personal responsibility as an individual person"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-200 flex-shrink-0" />
                          <span className="truncate">Take as Person</span>
                        </button>
                      </div>
                    ) : isTakenByOrg ? (
                      /* Org accepted */
                      <div className="w-full py-2 px-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between gap-2">
                        <span className="text-indigo-400 flex items-center gap-1.5 font-bold truncate">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">Org: {issue.responsibleOrgName || issue.assignedOrgName} ({issue.responsibleName || 'Crew'})</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 flex-shrink-0">
                          ORG WORKING
                        </span>
                      </div>
                    ) : isTakenByIndividual ? (
                      /* Person accepted */
                      <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2">
                        <span className="text-emerald-400 flex items-center gap-1.5 font-bold truncate">
                          <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">Person: {issue.responsibleName || 'Individual Worker'}</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 flex-shrink-0">
                          PERSON WORKING
                        </span>
                      </div>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{issue.status === 'RESOLVED' ? 'Certified & Resolved' : 'Proof Submitted • In QA'}</span>
                      </div>
                    )}

                    {/* Upload Proof Button */}
                    <button
                      type="button"
                      onClick={() => navigate(`/worker/upload-proof?issueId=${issue.id}`)}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-900/30 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>
                        {isResolvedOrPendingQA
                          ? 'View / Update Proof'
                          : isTakenByIndividual
                          ? 'Upload Proof (as Person)'
                          : isTakenByOrg
                          ? 'Upload Proof (as Org)'
                          : hasAssignedOrg
                          ? 'Upload Proof (as Org)'
                          : 'Upload Proof (as Person)'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Complaints Found Within 50 km of Your Location</h3>
            <p className="max-w-md mx-auto leading-relaxed">
              You are currently positioned at <strong>{workerLocation.label}</strong> ({workerLocation.lat.toFixed(3)}°, {workerLocation.lng.toFixed(3)}°).
              Complaints located more than 50 km away are automatically hidden by the proximity restriction.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-2">Switch your worker location to inspect other sectors:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {LOCATION_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleLocationPresetChange(p)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
                  >
                    📍 {p.city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INDIVIDUAL WORKER RESPONSIBILITY CONFIRMATION MODAL */}
      {individualModalOpen && selectedIssueForIndividual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setIndividualModalOpen(false);
                setSelectedIssueForIndividual(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white font-display">
                  Take Task as Individual Worker
                </h2>
                <p className="text-xs text-slate-400">
                  Take direct personal responsibility for complaint <strong>{selectedIssueForIndividual.id}</strong>.
                </p>
              </div>
            </div>

            {selectedIssueForIndividual.assignedOrgName && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <span className="font-bold block">⚠️ Notice: Reassignment from Organization</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  This complaint was assigned by Admin to <strong className="text-white">{selectedIssueForIndividual.assignedOrgName}</strong>. 
                  By taking responsibility, the task will be assigned directly to your individual Worker Portal, will no longer appear as an active task for the organization, and completion will be recorded as completed by you.
                </p>
              </div>
            )}

            <form onSubmit={handleConfirmIndividualAccept} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Full Name / Worker Name:</label>
                <input
                  type="text"
                  required
                  value={individualName}
                  onChange={(e) => setIndividualName(e.target.value)}
                  placeholder="e.g. Ramesh Verma or Ajay Singh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contact Number:</label>
                <input
                  type="text"
                  required
                  value={individualPhone}
                  onChange={(e) => setIndividualPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-medium font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Action Plan / Notes:</label>
                <textarea
                  rows={2}
                  value={individualNotes}
                  onChange={(e) => setIndividualNotes(e.target.value)}
                  placeholder="Briefly state how you will complete the work..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none font-medium"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIndividualModalOpen(false);
                    setSelectedIssueForIndividual(null);
                  }}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={actionLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40 text-xs cursor-pointer"
                >
                  Confirm & Take Task as Individual
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerComplaints;

