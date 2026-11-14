import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import MobileSidebar from '../components/common/MobileSidebar';
import Header from '../components/common/Header';

export const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = () => {
    const p = location.pathname;
    if (p.includes('/admin/organization-assignment')) return { title: 'Location-Based Organization Assignment', subtitle: 'State & city jurisdiction matching, contractor routing, and volunteer tracking' };
    if (p.includes('/admin/priority-queue')) return { title: 'AI Priority Dispatch Queue', subtitle: 'Automated ranking based on safety risk, road density & severity' };
    if (p.includes('/admin/issues')) return { title: 'Civic Issue Lifecycle Management', subtitle: 'Triage, assign municipal departments, and audit repairs' };
    if (p.includes('/admin/repair-verification')) return { title: 'Contractor Repair QA & Verification Console', subtitle: 'Upload field proof-of-work, run differential AI scans & publish resolutions' };
    if (p.includes('/admin/live-map')) return { title: 'Metropolitan Live GPS Operations Radar', subtitle: 'Real-time satellite GPS tracking with active field units' };
    if (p.includes('/admin/risk-prediction')) return { title: 'Predictive Infrastructure Risk AI', subtitle: 'Monsoon vulnerability and structural decay forecasting' };
    if (p.includes('/admin/departments')) return { title: 'Municipal Department Operations', subtitle: 'SLA benchmarks, active personnel & task completion' };
    if (p.includes('/admin/analytics')) return { title: 'Visual Analytics & Performance', subtitle: 'Recharts visual trends, inflow rates & resolution timelines' };
    return { title: 'Urban Command Operations Center', subtitle: 'Metropolitan civic intelligence and triage dashboard' };
  };

  const meta = getPageMeta();

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex">
      <Sidebar />

      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          title={meta.title}
          subtitle={meta.subtitle}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
