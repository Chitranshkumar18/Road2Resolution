import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Eye,
  CheckCircle2,
  Activity,
  Cpu,
  Camera,
  UserCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { INITIAL_MOCK_ISSUES } from '../../utils/constants';
import IssueCard from '../../components/issue/IssueCard';

export const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const featuredIssues = INITIAL_MOCK_ISSUES.slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/20 to-purple-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm animate-bounce-short">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Next-Gen Autonomous Civic Infrastructure Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display max-w-4xl mx-auto leading-[1.1]">
            Empowering Citizens. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Resolving Cities with AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Report road craters, water bursts, and civic hazards in seconds. Our neural vision pipeline classifies defects, calculates safety priority, and coordinates rapid municipal dispatch.
          </p>

          {/* Clean Action CTA */}
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <Link to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/citizen/report') : '/register'}>
              <Button size="lg" variant="primary" leftIcon={Camera} className="shadow-xl shadow-indigo-600/30 px-8 py-4 text-base font-bold">
                Report A Civic Hazard
              </Button>
            </Link>
            <Link to="/reviews">
              <Button size="lg" variant="secondary" leftIcon={ShieldCheck} className="px-7 py-4 text-base font-bold border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40">
                Public Reviews & Fixes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-3xl sm:text-4xl font-black text-indigo-400 font-display">12,480+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Hazards Reported</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-display">94.8%</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Resolution Rate</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-3xl sm:text-4xl font-black text-cyan-400 font-display">&lt; 14 hrs</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Avg Triage Speed</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-3xl sm:text-4xl font-black text-amber-400 font-display">98.2%</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">AI Vision Accuracy</p>
          </div>
        </div>
      </section>

      {/* AI Feature Architecture Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            The Neural Pipeline Powering Civic Resolution
          </h2>
          <p className="text-sm text-slate-400">
            From mobile photo capture to contractor verification, every step is optimized with machine intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-display">YOLO Vision Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant edge inference computes exact crater dimensions, crack severities, unlit streetlight clusters, and sewage overflows with high certainty.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-display">Priority Scoring Algorithm</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-variable mathematical weighting merges traffic density, pedestrian accident risk, and structural depth to rank urgent hazards at the top of municipal queues.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-display">Before & After Repair Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Municipal field contractors submit completion photos, verified by differential AI vision matching to ensure quality repair before funds release.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Live Issues Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Live Metropolitan Feed</h2>
            <p className="text-xs text-slate-400">Current high-priority issues undergoing municipal remediation</p>
          </div>
          <Link
            to="/register"
            className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Register to view all issues</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-900/60 border border-indigo-500/30 p-8 sm:p-12 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mx-auto text-indigo-300 shadow-lg">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Ready to transform your city’s infrastructure?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of active citizens reporting potholes, water bursts, and electrical faults to create safer communities.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" variant="primary" rightIcon={ArrowRight}>
                Create Citizen Account Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
