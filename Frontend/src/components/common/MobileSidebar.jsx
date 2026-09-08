import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
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
  Star
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';
import ThemeChanger from './ThemeChanger';

export const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isWorker, logout } = useAuth();

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative flex flex-col w-72 max-w-[80vw] bg-slate-900 border-r border-slate-800 h-full z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white font-display">CivicVision AI</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeChanger />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? isWorker
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : item.highlight
                      ? isWorker
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                        : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-current" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isWorker ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-500/40"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.role?.toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
