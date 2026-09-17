import React, { useContext, useState, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Send,
  Navigation,
  Sparkles,
  ShieldCheck,
  Check,
  Layers,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatDate';
import {
  ISSUE_CATEGORIES,
  INDIAN_STATES_AND_CITIES
} from '../../utils/constants';
import {
  getEligibleOrganizations,
  formatResponsibleEntity,
  calculateDistanceKm,
  MAX_ASSIGNMENT_RADIUS_KM
} from '../../utils/helpers';
import { formatDisplayAddress } from '../../utils/geocoding';

export const OrganizationAssignment = () => {
  const {
    issues = [],
    organizations = [],
    assignIssueToOrganization
  } = useContext(IssueContext) || {};
  const { addToast } = useContext(NotificationContext) || {};

  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal State for assigning an organization to a complaint
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const issueList = Array.isArray(issues) ? issues : [];
  const orgList = Array.isArray(organizations) ? organizations : [];

  // Helper to identify verified/resolved issues
  const isVerifiedIssue = (issue) =>
    issue.status === 'RESOLVED' ||
    Boolean(issue.repairAudit?.verified);

  // Active unverified complaints that require organization assignment / workflow management.
  // Verified complaints are automatically removed and routed to Repair QA & Audit.
  const activeUnverifiedIssues = useMemo(() => {
    return issueList.filter((item) => !isVerifiedIssue(item));
  }, [issueList]);

  // Filtered complaints
  const filteredIssues = useMemo(() => {
    return activeUnverifiedIssues.filter((item) => {
      if (selectedState !== 'all') {
        const itemState = (item.location?.state || 'Delhi').toLowerCase();
        if (itemState !== selectedState.toLowerCase()) return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus === 'unassigned') {
        if (item.assignedOrgId) return false;
      } else if (selectedStatus === 'assigned') {
        if (!item.assignedOrgId) return false;
      } else if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchId = item.id?.toLowerCase().includes(q);
        const matchAddress = item.location?.address?.toLowerCase().includes(q);
        const matchCity = item.location?.city?.toLowerCase().includes(q);
        const matchState = item.location?.state?.toLowerCase().includes(q);
        const matchOrg = item.assignedOrgName?.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchAddress && !matchCity && !matchState && !matchOrg) {
          return false;
        }
      }
      return true;
    });
  }, [activeUnverifiedIssues, selectedState, selectedCategory, selectedStatus, search]);

  // Statistics
  const unassignedCount = activeUnverifiedIssues.filter((i) => !i.assignedOrgId).length;
  const assignedCount = activeUnverifiedIssues.filter((i) => !!i.assignedOrgId).length;

  // Eligible organizations for the currently active complaint in modal (75 km radius)
  const eligibleOrgsForActive = useMemo(() => {
    if (!activeComplaint) return [];
    return getEligibleOrganizations(activeComplaint, orgList, MAX_ASSIGNMENT_RADIUS_KM);
  }, [activeComplaint, orgList]);

  const eligibleWithin75Km = eligibleOrgsForActive.filter((o) => o.isEligible);
  const otherOrgs = eligibleOrgsForActive.filter((o) => !o.isEligible);

  // Open the Assignment Modal for a specific complaint
  const handleOpenAssignModal = (complaint) => {
    if (complaint.status === 'RESOLVED' || complaint.repairAudit?.verified) {
      if (addToast) addToast('Cannot reassign organization: this complaint is already verified & resolved.', 'warning');
      return;
    }
    setActiveComplaint(complaint);
    // Find eligible orgs for this complaint
    const orgs = getEligibleOrganizations(complaint, orgList, MAX_ASSIGNMENT_RADIUS_KM);
    const firstEligible = orgs.find((o) => o.isEligible);

    // Pre-select current assigned org or first eligible org
    setSelectedOrgId(complaint.assignedOrgId || firstEligible?.id || (orgs[0]?.id || ''));
    setAssignmentNotes(
      `Assigned to handle defect repair at ${complaint.location?.address || 'Site Location'} (${complaint.location?.city || 'City'}, ${complaint.location?.state || 'State'}) under standard SLA protocol.`
    );
  };

  // Confirm assignment and update existing complaint in-place
  const handleConfirmAssignment = async () => {
    if (!activeComplaint || !selectedOrgId) return;
    const targetOrg = orgList.find((o) => o.id === selectedOrgId);
    if (!targetOrg) return;

    setAssignLoading(true);
    try {
      if (assignIssueToOrganization) {
        // Updates the existing complaint in place without creating duplicates
        await assignIssueToOrganization(
          activeComplaint.id,
          targetOrg.id,
          assignmentNotes,
          targetOrg.headOfOrg || 'Assigned Field Unit'
        );
      }
      if (addToast) {
        addToast(
          `✅ Complaint ${activeComplaint.id} successfully assigned to ${targetOrg.name}!`,
          'success'
        );
      }
      setActiveComplaint(null);
      setSelectedOrgId('');
    } catch (err) {
      console.error(err);
      if (addToast) addToast('Failed to assign organization.', 'error');
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md shadow-indigo-500/10">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white font-display">
                  Complaint Assignment & Organization Routing
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  75 KM RADIUS MATCHING
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review citizen complaints with uploaded photos and assign to eligible road-repair organizations within a <strong>75 km radius</strong>.
              </p>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Active Complaints</span>
              <span className="text-sm font-bold font-mono text-white">{activeUnverifiedIssues.length}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider block">Awaiting Org</span>
              <span className="text-sm font-bold font-mono text-amber-400">{unassignedCount}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider block">Assigned Orgs</span>
              <span className="text-sm font-bold font-mono text-indigo-400">{assignedCount}</span>
            </div>
          </div>
        </div>

        {/* 75km Proximity Principle Notice */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong className="text-cyan-300">75 km Location-Based Eligibility: </strong>
            When you click <strong>“Assign Complaint”</strong>, the system automatically finds all eligible road-repair and maintenance companies located within a <strong>75 km radius</strong> of the complaint's coordinates. Assignments preserve the existing complaint without creating duplicates.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword, ID, city, or address..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All States / Regions</option>
            {INDIAN_STATES_AND_CITIES.map((s) => (
              <option key={s.state} value={s.state}>
                {s.state}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Issue Categories</option>
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Active Statuses ({filteredIssues.length})</option>
            <option value="unassigned">⚡ Unassigned (Awaiting Org)</option>
            <option value="assigned">🏢 Assigned to Organization</option>
            <option value="IN_PROGRESS">🛠️ Work In Progress</option>
            <option value="PENDING_VERIFICATION">📸 Proof Awaiting Admin QA</option>
          </select>
        </div>
      </div>

      {/* Simplified Complaint Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => {
            const isVerified = issue.status === 'RESOLVED' || Boolean(issue.repairAudit?.verified);
            const isAssigned = !!issue.assignedOrgId;
            const issueCity = issue.location?.city || 'City';
            const issueState = issue.location?.state || 'Delhi';

            return (
              <div
                key={issue.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl group"
              >
                <div className="space-y-4">
                  {/* 1. Prominent Citizen Uploaded Photo */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5">
                      <SeverityBadge severity={issue.severity} size="xs" />
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <IssueStatus status={issue.status} />
                    </div>

                    {/* Bottom Floating Info Pill */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/85 text-amber-300 border border-amber-500/30 shadow backdrop-blur-sm">
                        {issue.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-950/85 text-slate-200 border border-slate-700 shadow backdrop-blur-sm truncate max-w-[140px]">
                        📍 {issueCity}, {issueState}
                      </span>
                    </div>
                  </div>

                  {/* 2. Directly Below Photo: “Assign Complaint” Button */}
                  <div>
                    {isVerified ? (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Repair Verified (Assignment Locked)</span>
                      </div>
                    ) : isAssigned ? (
                      <button
                        onClick={() => handleOpenAssignModal(issue)}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <span>Reassign Organization</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenAssignModal(issue)}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Assign Complaint</span>
                      </button>
                    )}
                  </div>

                  {/* 3. Relevant Complaint Information */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-indigo-400">{issue.id}</span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(issue.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {issue.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>

                    {/* Location & GPS Info */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span className="truncate text-slate-200 font-medium">
                          {formatDisplayAddress(issue.location?.address, issue.location)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
                        <span>GPS: {issue.location?.lat?.toFixed(4) || 28.6139}°, {issue.location?.lng?.toFixed(4) || 77.2090}°</span>
                        <span className="text-amber-400 font-semibold">Priority: {issue.priorityScore || 85}/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Organization Status Strip */}
                <div className="pt-3 border-t border-slate-800">
                  {issue.assignedOrgName ? (
                    <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span className="text-slate-300 truncate text-[11px]">
                          Org: <strong className="text-indigo-300 font-bold">{issue.assignedOrgName}</strong>
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${isVerified ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'}`}>
                        {isVerified ? 'VERIFIED' : 'ASSIGNED'}
                      </span>
                    </div>
                  ) : isVerified ? (
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs flex items-center justify-between gap-2">
                      <span className="text-[11px] text-emerald-300 font-medium">✅ Verified by Municipal QA</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs flex items-center justify-between gap-2">
                      <span className="text-[11px] text-amber-300 font-medium">⚡ Awaiting Organization Assignment</span>
                      <button
                        onClick={() => handleOpenAssignModal(issue)}
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline"
                      >
                        Assign Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Complaints Found</h3>
            <p className="max-w-md mx-auto leading-relaxed">
              No complaints matched the selected filters. Try changing search keywords, state, category, or assignment status.
            </p>
          </div>
        )}
      </div>

      {/* Assign Complaint Modal (75 km Radius Location Matching) */}
      {activeComplaint && (
        <Modal
          isOpen={!!activeComplaint}
          onClose={() => setActiveComplaint(null)}
          title={`Assign Complaint: ${activeComplaint.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            {/* Complaint Summary Header */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center">
              <img
                src={activeComplaint.imageUrl}
                alt={activeComplaint.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-indigo-400">{activeComplaint.id}</span>
                  <SeverityBadge severity={activeComplaint.severity} size="xs" />
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-900 text-amber-300 border border-slate-700">
                    {activeComplaint.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{activeComplaint.title}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                  <span className="truncate text-slate-200 font-medium">
                    {formatDisplayAddress(activeComplaint.location?.address, activeComplaint.location)}
                  </span>
                </div>
              </div>
            </div>

            {/* Radius Policy Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">
                  Eligible Road-Repair Organizations (Within 75 km Radius)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                &le; 75 KM RADIUS
              </span>
            </div>

            {/* List of Eligible Organizations */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {eligibleWithin75Km.length > 0 ? (
                eligibleWithin75Km.map((org) => {
                  const isSelected = selectedOrgId === org.id;

                  return (
                    <div
                      key={org.id}
                      onClick={() => setSelectedOrgId(org.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                          : 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <input
                            type="radio"
                            name="selectedOrg"
                            checked={isSelected}
                            onChange={() => setSelectedOrgId(org.id)}
                            className="mt-1 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-xs font-bold text-white truncate">{org.name}</h5>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                {org.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">{org.serviceArea}</p>
                          </div>
                        </div>

                        {/* Distance Badge */}
                        <div className="text-right flex-shrink-0">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 block">
                            ~{org.distanceKm} km away
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                            {org.city}, {org.state}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] pt-2 border-t border-slate-800/80 text-slate-400">
                        <div>
                          <span className="text-slate-500">Active Units: </span>
                          <strong className="text-slate-300 font-mono">{org.activeWorkers} squads</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">SLA Rating: </span>
                          <strong className="text-emerald-400 font-mono">{org.slaRating}</strong>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-indigo-300 font-medium">Head: {org.headOfOrg || 'Chief Engineer'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs space-y-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto" />
                  <p>No road-repair organizations found within 75 km of this complaint's coordinates.</p>
                  <p className="text-[11px] text-slate-500">You may select an alternative state municipal contractor below:</p>
                </div>
              )}

              {/* Show other organizations if none within 75km */}
              {eligibleWithin75Km.length === 0 && otherOrgs.length > 0 && (
                <div className="space-y-2 pt-2">
                  {otherOrgs.slice(0, 3).map((org) => {
                    const isSelected = selectedOrgId === org.id;
                    return (
                      <div
                        key={org.id}
                        onClick={() => setSelectedOrgId(org.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-xs flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/40'
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="selectedOrg"
                            checked={isSelected}
                            onChange={() => setSelectedOrgId(org.id)}
                          />
                          <span className="font-semibold text-slate-200">{org.name}</span>
                          <span className="text-[10px] text-slate-400">({org.city}, {org.state})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">~{org.distanceKm} km</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Assignment Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Assignment Notes (Will appear on Worker Portal):
              </label>
              <textarea
                rows={2}
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveComplaint(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={assignLoading}
                disabled={!selectedOrgId}
                leftIcon={Send}
                onClick={handleConfirmAssignment}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-900/40"
              >
                Confirm Organization Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrganizationAssignment;
