import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, LayoutDashboard, LogIn, UserPlus, LogOut, Star } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from './Button';
import ThemeChanger from './ThemeChanger';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isWorker, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isWorker) return '/worker/dashboard';
    return '/citizen/dashboard';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Console';
    if (isWorker) return 'Worker Portal';
    return 'Citizen Dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Eye className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-white font-display tracking-tight">Civic<span className="text-indigo-400">Vision</span></span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block -mt-1 tracking-wider uppercase">Urban Radar</span>
            </div>
          </Link>

          {/* Center Links (Platform Overview + Public Review) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
              Platform Overview
            </Link>
            <Link
              to="/reviews"
              className="text-sm font-semibold text-emerald-300 hover:text-emerald-100 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-sm hover:scale-105"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Review</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-300">Public</span>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={LayoutDashboard}
                  onClick={() => navigate(getDashboardPath())}
                  className={isWorker ? 'bg-amber-600 hover:bg-amber-500 text-white' : ''}
                >
                  {getDashboardLabel()}
                </Button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" leftIcon={LogIn}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" leftIcon={UserPlus}>
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Theme Changer in top right corner */}
            <ThemeChanger />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
