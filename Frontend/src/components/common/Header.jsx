import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import NotificationPanel from './NotificationPanel';
import ThemeChanger from './ThemeChanger';
import { NotificationContext } from '../../context/NotificationContext';

export const Header = ({ onToggleSidebar, title, subtitle }) => {
  const { user, isAdmin, isWorker, logout } = useAuth();
  const { unreadCount } = React.useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'ADMIN';
    if (isWorker) return 'WORKER';
    return 'CITIZEN';
  };

  const getRoleBadgeClasses = () => {
    if (isAdmin) return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    if (isWorker) return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
  };

  const getUserSubtitle = () => {
    if (isAdmin) return 'Admin Clearance';
    if (isWorker) return user?.contractorUnit || 'Field Contractor';
    return 'Civic Reporter';
  };

  const getProfilePath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isWorker) return '/worker/profile';
    return '/citizen/profile';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {title && <h1 className="text-base md:text-lg font-bold text-slate-100 font-display">{title}</h1>}
          {subtitle && <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Role Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-950/70 border border-slate-800 text-slate-300 shadow-sm">
          <span className="hidden sm:inline text-[11px] text-slate-400">Role:</span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${getRoleBadgeClasses()}`}>
            {getRoleLabel()}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* Theme Changer */}
        <ThemeChanger />

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className={`w-8 h-8 rounded-lg object-cover ring-2 ${
                isAdmin ? 'ring-rose-500/30' : isWorker ? 'ring-amber-500/40' : 'ring-indigo-500/30'
              }`}
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{getUserSubtitle()}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-800 bg-slate-850">
                <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${getRoleBadgeClasses()}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate(getProfilePath());
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
