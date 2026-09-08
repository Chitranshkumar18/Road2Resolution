import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { Eye, Shield, Heart, Sparkles } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-cyan-300" />
                </div>
                <span className="text-lg font-bold text-white font-display">CivicVision AI</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Autonomous Computer Vision, Real-Time Geo-Triage, and Priority Routing for Smart City Infrastructure and Citizen Safety.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform Navigation</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home Overview</Link></li>
                <li><Link to="/reviews" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Public Reviews (Verified Fixes)</Link></li>
                <li><Link to="/citizen/report" className="hover:text-white transition-colors">Report Hazard</Link></li>
                <li><Link to="/citizen/explore" className="hover:text-white transition-colors">Civic Explorer Map</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Municipal Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">AI Systems</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> YOLO Infrastructure Vision</li>
                <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Before/After Repair QA</li>
                <li className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-400" /> Citizen Priority Rating</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 CivicVision AI Platform. All rights reserved.</p>
            <p className="flex items-center gap-1">Built with React, Vite & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
