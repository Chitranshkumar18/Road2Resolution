import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ScanEye,
  CopyCheck,
  FileText,
  Navigation,
  CheckCircle2,
  User,
  ListOrdered,
  Layers,
  Radio,
  Flame,
  TrendingUp,
  Building2,
  BarChart3,
  Eye,
  LogOut,
  Camera,
  ClipboardList,
  Clock,
  Wrench,
  Star
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';

export const Sidebar = () => {
  const { user, isAdmin, isWorker, logout } = useAuth();

  const citizenNav = [
    { label: 'Citizen Hub', to: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'Report Issue (GPS)', to: '/citizen/report', icon: PlusCircle, highlight: true },
    { label: 'Public Reviews', to: '/reviews', icon: Star, badge: 'Public' },
    { label: 'AI Vision Scan', to: '/citizen/ai-analysis', icon: ScanEye },
    { label: 'Duplicate Check', to: '/citizen/duplicate-check', icon: CopyCheck },
    { label: 'My Submissions', to: '/citizen/my-reports', icon: FileText },
    { label: 'Live GPS Radar', to: '/citizen/explore', icon: Navigation },
    { label: 'Repair Tracker', to: '/citizen/repair-verification', icon: CheckCircle2 },
    { label: 'Citizen Profile', to: '/citizen/profile', icon: User },
  ];

  const workerNav = [
    { label: 'Worker Dashboard', to: '/worker/dashboard', icon: LayoutDashboard },
    { label: 'Citizen Complaints', to: '/worker/complaints', icon: ClipboardList, badge: 'Live Feed' },
    { label: 'Upload Repair Proof', to: '/worker/upload-proof', icon: Camera, highlight: true },
    { label: 'Submitted to Admin', to: '/worker/submitted-repairs', icon: CheckCircle2, badge: 'QA' },
    { label: 'Public Reviews', to: '/reviews', icon: Star, badge: 'Public' },
    { label: 'Worker Profile', to: '/worker/profile', icon: User },
  ];

  const adminNav = [
    { label: 'Command Center', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Priority Queue (AI)', to: '/admin/priority-queue', icon: ListOrdered, badge: 'High AI' },
    { label: 'Issue Management', to: '/admin/issues', icon: Layers },
    { label: 'Repair QA & Audit', to: '/admin/repair-verification', icon: CheckCircle2, badge: 'QA' },
    { label: 'Public Reviews', to: '/reviews', icon: Star, badge: 'Public' },
    { label: 'Live GPS Radar', to: '/admin/live-map', icon: Radio },
    { label: 'GPS Hotspot Heatmap', to: '/admin/heatmap', icon: Flame },
    { label: 'Risk Prediction', to: '/admin/risk-prediction', icon: TrendingUp },
    { label: 'Departments', to: '/admin/departments', icon: Building2 },
    { label: 'Analytics & Recharts', to: '/admin/analytics', icon: BarChart3 },
  ];

  const navItems = isAdmin ? adminNav : (isWorker ? workerNav : citizenNav);

  const getRoleBadge = () => {
    if (isAdmin) return <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">ADMIN</span>;
    if (isWorker) return <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">WORKER</span>;
    return <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">CITIZEN</span>;
  };

  const getSectionTitle = () => {
    if (isAdmin) return 'MUNICIPAL OPERATIONS';
    if (isWorker) return 'FIELD REPAIR SQUAD';
    return 'COMMUNITY NAVIGATION';
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-white font-display tracking-tight">Civic<span className="text-indigo-400">Vision</span></span>
            {getRoleBadge()}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block -mt-1 tracking-wider uppercase">Urban Radar</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {getSectionTitle()}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? isWorker
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                      : isAdmin
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : item.highlight
                    ? isWorker
                      ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                      : 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-current transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isWorker
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Profile Snippet */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className={`w-9 h-9 rounded-lg object-cover ring-2 flex-shrink-0 ${
                isAdmin ? 'ring-rose-500/30' : isWorker ? 'ring-amber-500/40' : 'ring-indigo-500/30'
              }`}
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">
                {isAdmin ? 'Municipal Director' : isWorker ? (user?.contractorUnit || 'Field Tech') : `Rep: ${user?.reputationScore || 340} pts`}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
