import React, { useState, useContext } from 'react';
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
  UserCheck,
  User,
  HardHat,
  Wrench,
  Building2,
  Languages,
  Check,
  MapPin,
  ClipboardList
} from 'lucide-react';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { IssueContext } from '../../context/IssueContext';
import IssueCard from '../../components/issue/IssueCard';

export const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { issues = [] } = useContext(IssueContext) || {};
  const [lang, setLang] = useState('both'); // 'both' | 'en' | 'hi'
  const featuredIssues = (issues || []).slice(0, 3);

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
            <Link to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/citizen/report') : '/register?role=citizen'}>
              <Button size="lg" variant="primary" leftIcon={Camera} className="shadow-xl shadow-indigo-600/30 px-8 py-4 text-base font-bold cursor-pointer">
                Report A Civic Hazard
              </Button>
            </Link>
            <Link to="/register?role=worker">
              <Button size="lg" variant="secondary" leftIcon={HardHat} className="px-7 py-4 text-base font-bold border-amber-500/40 text-amber-300 hover:bg-amber-950/40 cursor-pointer">
                Join as Worker / Org
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Role Selection & Contribution Guide Section (English & हिंदी) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Language Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Languages className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                  Contribution & Role Guide • भूमिका एवं योगदान निर्देश
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                Choose Your Role to Contribute • अपनी भूमिका चुनें
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                This website is designed for both <strong>Citizens</strong> and <strong>Organizations / Workers</strong>.
                <span className="text-slate-400 ml-1.5">
                  (यह वेबसाइट नागरिकों और संगठनों/वर्कर्स दोनों के लिए बनाई गई है।)
                </span>
              </p>
            </div>

            {/* Language Selector Controls */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-center">
              <button
                type="button"
                onClick={() => setLang('both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'both'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🌐 Both / दोनों
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇮🇳 हिंदी
              </button>
            </div>
          </div>

          {/* 2 Core Contribution Role Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {/* Card 1: Citizen Role */}
            <div className="rounded-3xl bg-slate-950/80 border border-indigo-500/30 hover:border-indigo-500/60 transition-all p-6 md:p-8 flex flex-col justify-between space-y-6 group shadow-xl">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                    <User className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    CITIZEN • नागरिक
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                    Citizen: Report & Track Problems
                  </h3>
                  <p className="text-xs font-medium text-indigo-300">
                    सड़क से जुड़ी समस्याओं की शिकायत करें और उनकी प्रगति देखें
                  </p>
                </div>

                {/* Content based on selected language */}
                {(lang === 'en' || lang === 'both') && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <span className="text-indigo-400 font-mono">🇬🇧 English:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      If you want to <strong>report a road-related problem</strong>, you can register as a <strong>Citizen</strong> and submit your complaint with the necessary details and location.
                    </p>
                    <div className="pt-1 flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Citizen:</strong> Report road-related problems and track their progress.</span>
                    </div>
                  </div>
                )}

                {(lang === 'hi' || lang === 'both') && (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-200">
                      <span className="text-indigo-400 font-mono">🇮🇳 हिंदी:</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      अगर आप <strong>सड़क से जुड़ी किसी समस्या की शिकायत करना चाहते हैं</strong>, तो आप <strong>Citizen</strong> के रूप में रजिस्टर करके अपनी शिकायत आवश्यक जानकारी और लोकेशन के साथ दर्ज कर सकते हैं।
                    </p>
                    <div className="pt-1 flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Citizen:</strong> सड़क से जुड़ी समस्याओं की शिकायत करें और उनकी प्रगति देखें।</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions for Citizen */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link to="/register?role=citizen" className="w-full">
                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Register as Citizen</span>
                  </button>
                </Link>

                <Link to="/citizen/report" className="w-full">
                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Report Problem</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 2: Worker & Organization Role */}
            <div className="rounded-3xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-500/60 transition-all p-6 md:p-8 flex flex-col justify-between space-y-6 group shadow-xl">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <HardHat className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    WORKER & ORG • वर्कर एवं संगठन
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                    Worker: Improve & Maintain Roads
                  </h3>
                  <p className="text-xs font-medium text-amber-300">
                    सड़क से जुड़ी समस्याओं को हल करने में सरकार की मदद करें
                  </p>
                </div>

                {/* Content based on selected language */}
                {(lang === 'en' || lang === 'both') && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <span className="text-amber-400 font-mono">🇬🇧 English:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      If you want to help the <strong>government improve and maintain roads</strong>, you can register as a <strong>Worker</strong> and contribute by taking responsibility for road-related work.
                    </p>
                    <div className="pt-1 flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Worker:</strong> Help the government by working on road-related issues.</span>
                    </div>
                  </div>
                )}

                {(lang === 'hi' || lang === 'both') && (
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
                      <span className="text-amber-400 font-mono">🇮🇳 हिंदी:</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      अगर आप <strong>सरकार की मदद करके सड़कों को बेहतर और सुरक्षित बनाने</strong> में योगदान देना चाहते हैं, तो आप <strong>Worker</strong> के रूप में रजिस्टर कर सकते हैं और सड़क से जुड़े कार्यों की जिम्मेदारी लेकर मदद कर सकते हैं।
                    </p>
                    <div className="pt-1 flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Worker:</strong> सड़क से जुड़ी समस्याओं को हल करने में सरकार की मदद करें।</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions for Worker */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link to="/register?role=worker" className="w-full">
                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Register as Worker</span>
                  </button>
                </Link>

                <Link to="/worker/dashboard" className="w-full">
                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Worker Portal</span>
                  </button>
                </Link>
              </div>
            </div>
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

        {featuredIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">No Civic Complaints Logged Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The municipal radar is completely fresh with zero reported hazards. Be the first citizen to report a civic issue in your area.
            </p>
            <div className="pt-2">
              <Link to="/citizen/report">
                <Button variant="outline" size="sm" leftIcon={Camera}>
                  Report New Hazard
                </Button>
              </Link>
            </div>
          </div>
        )}
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
