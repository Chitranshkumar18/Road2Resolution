import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const SEVERITY_COLORS = {
  Critical: '#EF4444',
  High: '#F97316',
  Medium: '#FACC15',
  Low: '#38BDF8',
};

export const SeverityDistribution = ({
  data = [],
  title = 'Incident Severity Distribution',
  subtitle = 'Active issues categorized by impact level',
}) => {
  const hasData = Array.isArray(data) && data.length > 0 && data.some((d) => d.value > 0);
  const formattedData = (data || []).map((d) => ({
    ...d,
    color: SEVERITY_COLORS[d.name] || d.color || '#38BDF8',
  }));

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-100 font-display">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="h-64 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B1120" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: '#E2E8F0', fontWeight: 600, marginLeft: '4px', marginRight: '6px' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
            No active complaints recorded
          </div>
        )}
      </div>
    </div>
  );
};

export default SeverityDistribution;
