import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  HardHat,
  Phone,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    zone: 'North Zone, Delhi NCR',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'citizen',
        zone: formData.zone,
      };

      const res = await register(payload);
      navigate('/citizen/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 mb-3 shadow-lg shadow-indigo-500/10">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Join CivicVision AI
          </h2>
          <p className="text-xs text-slate-400">
            Register as an active citizen to report road hazards, track repairs, and earn civic points
          </p>
        </div>

        {/* Citizen Role Banner */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5 text-xs text-slate-300">
          <div className="space-y-1">
            <p className="font-semibold text-indigo-300">
              🇬🇧 Register as a <strong>Citizen</strong> to report road problems with live camera proof and monitor resolution progress in real time.
            </p>
          </div>
          <div className="pt-2 border-t border-indigo-500/20 space-y-1">
            <p className="font-semibold text-slate-200">
              🇮🇳 सड़क से जुड़ी समस्याओं की शिकायत करने और उनकी प्रगति देखने के लिए <strong>Citizen</strong> के रूप में रजिस्टर करें।
            </p>
          </div>
        </div>

        {/* Field Worker Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <HardHat className="w-4 h-4 shrink-0" />
            <span className="text-[11px] text-slate-300">
              Field Worker / Contractor accounts are provisioned by Municipal Admin.
            </span>
          </div>
          <Link
            to="/login"
            className="text-amber-400 hover:text-amber-300 font-bold text-xs shrink-0 underline underline-offset-2"
          >
            Worker Sign In &rarr;
          </Link>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-md">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Aarav Mehta"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="aarav@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Contact Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98123 45678"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Neighborhood / Operational Zone
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData((p) => ({ ...p, zone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="North Zone, Delhi NCR">North Zone (Sector 1-15)</option>
                  <option value="Central Zone, Delhi NCR">Central Commercial Zone</option>
                  <option value="South Zone, Delhi NCR">South Residential Zone</option>
                  <option value="East Zone, Delhi NCR">East Industrial Sector</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  data-lpignore="true"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              rightIcon={ArrowRight}
              className="w-full mt-3 py-3 font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-950/40 text-white"
            >
              Register & Enter Citizen Hub
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:text-cyan-300 underline underline-offset-4">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

