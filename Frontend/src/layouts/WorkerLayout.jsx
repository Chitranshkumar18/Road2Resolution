import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import MobileSidebar from '../components/common/MobileSidebar';
import Header from '../components/common/Header';

export const WorkerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = () => {
    const p = location.pathname;
    if (p.includes('/worker/complaints')) {
      return {
        title: 'Citizen Complaints & Field Tasks',
        subtitle: 'Review all citizen reports across sectors, claim tickets, and start on-site repair work'
      };
    }
    if (p.includes('/worker/upload-proof')) {
      return {
        title: 'Upload After-Repair Resolution Proof',
        subtitle: 'Submit verified after-repair photo, contractor notes, and repair materials for Admin QA audit'
      };
    }
    if (p.includes('/worker/submitted-repairs')) {
      return {
        title: 'Submitted Repairs Awaiting Admin QA',
        subtitle: 'Track your submitted resolution photos and monitor Municipal Admin certification status'
      };
    }
    if (p.includes('/worker/profile')) {
      return {
        title: 'Field Tech & Contractor Profile',
        subtitle: 'Assigned rapid repair unit, equipment clearance, and resolution stats'
      };
    }
    return {
      title: 'Field Worker Operations Hub',
      subtitle: 'Rapid road & municipal infrastructure repair command portal'
    };
  };

  const meta = getPageMeta();

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
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

export default WorkerLayout;
