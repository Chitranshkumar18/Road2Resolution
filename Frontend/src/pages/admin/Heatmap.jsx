import React from 'react';
import { Flame, AlertTriangle, Layers, ShieldCheck } from 'lucide-react';
import CivicHeatmap from '../../components/map/CivicHeatmap';

export const Heatmap = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              GPS Incident Density & Hotspot Heatmap
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Spatial kernel density estimation highlighting recurrent road deterioration and utility failure corridors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
            5 Critical Hotspots Identified
          </span>
        </div>
      </div>

      {/* Heatmap Container */}
      <CivicHeatmap />

      {/* Corridor Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Outer Ring Road Flyover
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            18 potholes logged in 30 days due to heavy freight overloading. Re-asphalting recommended before monsoon.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Central Commercial Hub
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            High pedestrian traffic corridor with 12 recurring drain blockages and pipe leaks.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Green Park Institutional Sector
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Streetlight failure cluster successfully audited. Dark zone eliminated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
