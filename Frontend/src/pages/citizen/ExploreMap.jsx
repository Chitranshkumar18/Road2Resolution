import React, { useState, useContext, useEffect } from 'react';
import { Search, Filter, Layers, Navigation, Radio, LocateFixed, Sparkles, AlertCircle } from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import useAuth from '../../hooks/useAuth';
import IssueMap from '../../components/map/IssueMap';
import Button from '../../components/common/Button';
import useLocation from '../../hooks/useLocation';
import { ISSUE_CATEGORIES, SEVERITY_LEVELS } from '../../utils/constants';
import { getUserComplaints } from '../../utils/helpers';

export const ExploreMap = () => {
  const { issues } = useContext(IssueContext);
  const { user } = useAuth();
  const { coords, accuracy, loading: gpsLoading, getCurrentPosition } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([28.6180, 77.2120]);

  // Strictly filter complaints belonging exclusively to the currently logged-in citizen by User ID
  const citizenIssues = getUserComplaints(issues, user);

  const filteredIssues = citizenIssues.filter((issue) => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title?.toLowerCase().includes(q) ||
        issue.description?.toLowerCase().includes(q) ||
        issue.location?.address?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleLockGPS = () => {
    getCurrentPosition();
  };

  useEffect(() => {
    if (coords?.lat && coords?.lng) {
      setMapCenter([coords.lat, coords.lng]);
    }
  }, [coords]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h2 className="text-xl font-bold text-white font-display">
                My Reported Hazards Live GPS Radar
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Real-time satellite GPS tracking of complaints submitted by your account ({user?.email || 'Logged-in Citizen'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              isLoading={gpsLoading}
              leftIcon={LocateFixed}
              onClick={handleLockGPS}
            >
              Lock to My GPS
            </Button>
            <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {filteredIssues.length} My Pin{filteredIssues.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Severity Level
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical / Hazard</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Severity</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search GPS Location or Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Ring Road, Outer, Sector 5..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive GPS Map */}
      <IssueMap
        issues={filteredIssues}
        center={mapCenter}
        className="h-[620px] shadow-2xl"
        linkPrefix="/citizen/issue"
      />
    </div>
  );
};

export default ExploreMap;
