import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1">
        <p className="font-bold text-slate-200">{label}</p>
        <div className="text-indigo-400">Reported: <span className="font-mono font-bold">{payload[0]?.value}</span></div>
        <div className="text-emerald-400">Resolved: <span className="font-mono font-bold">{payload[1]?.value}</span></div>
      </div>
    );
  }
  return null;
};

export const AnalyticsChart = ({
  data = [],
  title = 'Civic Issue Inflow vs Resolution Speed',
  subtitle = 'Monthly comparison of incoming citizen reports vs municipal work completions',
}) => {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-100 font-display">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="h-72 w-full pt-2">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reportedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="period" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                formatter={(value) => <span className="text-slate-300 capitalize">{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="reported"
                stroke="#6366F1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#reportedGrad)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#resolvedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
            No historical inflow data recorded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
