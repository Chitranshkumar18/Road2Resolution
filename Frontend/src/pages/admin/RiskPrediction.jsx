import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertOctagon, CloudRain, Cpu, Shield, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import adminApi from '../../api/adminApi';

export const RiskPrediction = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await adminApi.getRiskPredictionData();
      setData(res);
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Predictive Infrastructure Risk & Seasonality AI
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Neural regression models forecasting road degradation, sub-base erosion, and electrical burnout risks before citizen complaints emerge.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Predictive Accuracy: 92.4%
        </span>
      </div>

      {/* High-Risk Zones Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>High-Risk Municipal Zones (Next 30 Days Forecast)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.highRiskZones.map((zone, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100">{zone.zone}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  {zone.riskLevel}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <p><strong className="text-slate-400">Primary Stress Factor:</strong> {zone.primaryFactor}</p>
                <p><strong className="text-slate-400">Predicted Incoming Incidents:</strong> <span className="font-mono text-cyan-400 font-bold">{zone.predictedIncidents} issues</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Risk Forecast Chart (Recharts) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              <span>Seasonal Multi-Risk Projection Model (Monsoon vs Dry Seasons)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Risk score (0-100) projected across road decay, water logging, and electrical failure vectors.
            </p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.seasonalForecast || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="roadDecayRisk" name="Road Decay Risk" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              <Bar dataKey="waterLoggingRisk" name="Water Logging Risk" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="electricalFaultRisk" name="Electrical Fault Risk" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RiskPrediction;
