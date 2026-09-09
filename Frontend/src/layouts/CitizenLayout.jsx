import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import MobileSidebar from '../components/common/MobileSidebar';
import Header from '../components/common/Header';

export const CitizenLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation(); //--->>>Ye current URL/path ki information deta hai.

  const getPageMeta = () => {
    const p = location.pathname; //--->>>Ye current URL/path ko store karta hai.(location)
    if (p.includes('/citizen/report')) return { title: 'Report Civic Hazard', subtitle: 'Submit photo with AI visual diagnosis & live GPS' };
    if (p.includes('/citizen/ai-analysis')) return { title: 'AI Neural Vision Scanner', subtitle: 'Automated defect classifier & severity predictor' };
    if (p.includes('/citizen/duplicate-check')) return { title: 'Duplicate Report Detector', subtitle: 'Prevent redundant submissions and merge upvotes' };
    if (p.includes('/citizen/my-reports')) return { title: 'My Submitted Issues', subtitle: 'Track resolution timeline, upvotes, and status' };
    if (p.includes('/citizen/explore')) return { title: 'Live GPS Incident Radar', subtitle: 'Real-time satellite GPS tracking across municipal sectors' };
    if (p.includes('/citizen/repair-verification')) return { title: 'Repair Verification Audit', subtitle: 'AI before-and-after photo verification' };
    if (p.includes('/citizen/profile')) return { title: 'Citizen Reputation Profile', subtitle: 'Your impact points, badges, and activity' };
    return { title: 'Citizen Command Hub', subtitle: 'Overview of neighborhood civic safety & reports' };
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

export default CitizenLayout;




// ┌──────────────────────────────────────────────┐
// │                                              │
// │ Sidebar │         Main Content               │
// │         │                                    │
// │         │ Header                             │
// │         │                                    │
// │         │ Page Content                       │
// │         │                                    │
// └──────────────────────────────────────────────┘




// The purpose of `CitizenLayout.jsx` is to provide a **common UI structure for all citizen pages** — including the **Sidebar, Header, and responsive main content area** — and to render the actual page for the current route using `<Outlet />`.
