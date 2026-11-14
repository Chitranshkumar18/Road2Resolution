import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, LayoutDashboard, LogIn, UserPlus, LogOut, Star, Menu, X, Camera, Navigation } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from './Button';
import ThemeChanger from './ThemeChanger';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isWorker, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <nav className="sticky top-0 z-40 w-full bg-[#0B1120]/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-white font-display tracking-tight truncate">
                  Civic<span className="text-indigo-400">Vision</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex-shrink-0">
                  AI
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block -mt-1 tracking-wider uppercase truncate">
                Urban Radar
              </span>
            </div>
          </Link>

          {/* Center Links (Platform Overview + Public Review) - Desktop */}
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

          {/* Right Action Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
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

            {/* Theme Changer */}
            <ThemeChanger />
          </div>

          {/* Mobile Right Controls: Theme + Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            <ThemeChanger />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Collapsible Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B1120]/95 backdrop-blur-2xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          {/* Navigation Links */}
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span>Platform Overview</span>
              <span className="text-[10px] text-slate-500">Home</span>
            </Link>

            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                location.pathname === '/reviews'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-emerald-300 hover:text-emerald-200 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Public Reviews</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Fixes
              </span>
            </Link>

            <Link
              to="/citizen/report"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Report Civic Hazard</span>
              </div>
              <span className="text-[10px] text-slate-500">GPS Camera</span>
            </Link>

            <Link
              to="/citizen/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Civic Explorer Map</span>
              </div>
              <span className="text-[10px] text-slate-500">Live Radar</span>
            </Link>
          </div>

          {/* Auth Action Buttons */}
          <div className="pt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(getDashboardPath());
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isWorker
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to {getDashboardLabel()}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/30"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
