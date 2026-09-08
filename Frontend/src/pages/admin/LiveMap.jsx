import React, { useContext, useState } from 'react';
import { Map, Radio, Filter, Building2, ShieldAlert, Sparkles } from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import IssueMap from '../../components/map/IssueMap';
import { DEPARTMENTS, ISSUE_CATEGORIES } from '../../utils/constants';

export const LiveMap = () => {
  const { issues } = useContext(IssueContext);
  const [activeDept, setActiveDept] = useState('all');

  const filteredIssues = activeDept === 'all'
    ? issues
    : issues.filter((i) => i.department === activeDept);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-xl font-bold text-white font-display">
              Live Metropolitan GPS Operations Radar
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time satellite GPS tracking of active municipal incidents and deployed field response units.
          </p>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveDept('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeDept === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Agencies
          </button>
          {DEPARTMENTS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDept(d.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeDept === d.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {d.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Map View */}
      <IssueMap
        issues={filteredIssues}
        className="h-[650px] shadow-2xl"
        linkPrefix="/citizen/issue"
      />
    </div>
  );
};

export default LiveMap;
