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
  HardHat,
  Phone,
  Building2,
  UserCheck,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

export const Register = () => {
  const [accountType, setAccountType] = useState('citizen'); // 'citizen' | 'worker'
  const [workerType, setWorkerType] = useState('individual'); // 'individual' | 'organization'
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    zone: 'North Zone, Delhi NCR',
    organizationName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setError('');
  };

  const handleWorkerTypeChange = (type) => {
    setWorkerType(type);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (accountType === 'worker' && workerType === 'organization' && !formData.organizationName.trim()) {
        throw new Error('Please provide the Organization / Contractor company name.');
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: accountType,
        zone: formData.zone,
        ...(accountType === 'worker' && {
          workerType: workerType,
          organizationName: workerType === 'organization' ? formData.organizationName.trim() : '',
        }),
      };

      await register(payload);

      if (accountType === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
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
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto mb-3 shadow-lg transition-colors ${
              accountType === 'worker'
                ? 'bg-amber-600/20 border-amber-500/40 text-amber-400 shadow-amber-500/10'
                : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 shadow-indigo-500/10'
            }`}
          >
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Join CivicVision AI
          </h2>
          <p className="text-xs text-slate-400">
            {accountType === 'worker'
              ? 'Register as an individual field worker or contractor organization to resolve civic issues'
              : 'Register as an active citizen to report road hazards, track repairs, and earn civic points'}
          </p>
        </div>

        {/* 2 Registration Choices: Citizen vs Worker */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {/* Citizen Option */}
          <button
            type="button"
            onClick={() => handleAccountTypeChange('citizen')}
            className={`p-3 rounded-xl text-left transition-all flex flex-col items-start gap-1.5 border cursor-pointer ${
              accountType === 'citizen'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg ${
                accountType === 'citizen' ? 'bg-white/20' : 'bg-slate-800 text-indigo-400'
              }`}
            >
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">Citizen</span>
              <span
                className={`text-[9px] block leading-tight ${
                  accountType === 'citizen' ? 'text-indigo-100' : 'text-slate-400'
                }`}
              >
                Report & Track
              </span>
            </div>
          </button>

          {/* Worker Option */}
          <button
            type="button"
            onClick={() => handleAccountTypeChange('worker')}
            className={`p-3 rounded-xl text-left transition-all flex flex-col items-start gap-1.5 border cursor-pointer ${
              accountType === 'worker'
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg ${
                accountType === 'worker' ? 'bg-white/20' : 'bg-slate-800 text-amber-400'
              }`}
            >
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">Worker</span>
              <span
                className={`text-[9px] block leading-tight ${
                  accountType === 'worker' ? 'text-amber-100' : 'text-slate-400'
                }`}
              >
                Repair & Verify
              </span>
            </div>
          </button>
        </div>

        {/* Informational Banner */}
        {accountType === 'citizen' ? (
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
        ) : (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2 text-xs text-slate-300">
            <p className="font-semibold text-amber-300">
              👷 Register as an authorized <strong>Field Worker</strong> or <strong>Contractor Organization</strong> to receive work orders, upload GPS-verified repair proofs, and maintain roads.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-md">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Worker Type Selector (Only when Worker is selected) */}
            {accountType === 'worker' && (
              <div className="space-y-1.5 pb-2 border-b border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Worker Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleWorkerTypeChange('individual')}
                    className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2 border cursor-pointer ${
                      workerType === 'individual'
                        ? 'bg-amber-600/20 border-amber-500/60 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 shrink-0 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold block">Individual</span>
                      <span className="text-[9px] block text-slate-400">Independent Worker</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWorkerTypeChange('organization')}
                    className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2 border cursor-pointer ${
                      workerType === 'organization'
                        ? 'bg-amber-600/20 border-amber-500/60 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold block">Organization</span>
                      <span className="text-[9px] block text-slate-400">Contractor / Agency</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Organization / Contractor Name (if Organization Worker) */}
            {accountType === 'worker' && workerType === 'organization' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Organization / Company Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData((p) => ({ ...p, organizationName: e.target.value }))}
                    placeholder="Apex Road Infrastructure Ltd."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Full Name / Contact Person */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {accountType === 'worker' && workerType === 'organization'
                  ? 'Contact Person / Representative'
                  : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder={
                    accountType === 'worker'
                      ? workerType === 'organization'
                        ? 'Er. Rajesh Kumar'
                        : 'Aarav Mehta'
                      : 'Aarav Mehta'
                  }
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-colors ${
                    accountType === 'worker' ? 'focus:border-amber-500' : 'focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {accountType === 'worker' && workerType === 'organization'
                  ? 'Organization Email'
                  : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder={
                    accountType === 'worker'
                      ? workerType === 'organization'
                        ? 'contractor@apexroad.in'
                        : 'worker@example.com'
                      : 'aarav@example.com'
                  }
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-colors ${
                    accountType === 'worker' ? 'focus:border-amber-500' : 'focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Contact Phone {accountType === 'citizen' ? '(Optional)' : ''}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required={accountType === 'worker'}
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98123 45678"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-colors ${
                    accountType === 'worker' ? 'focus:border-amber-500' : 'focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {accountType === 'worker' ? 'Operating Zone / Location' : 'Neighborhood / Operational Zone'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData((p) => ({ ...p, zone: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-colors ${
                    accountType === 'worker' ? 'focus:border-amber-500' : 'focus:border-indigo-500'
                  }`}
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
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-colors ${
                    accountType === 'worker' ? 'focus:border-amber-500' : 'focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
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
              className={`w-full mt-3 py-3 font-bold text-white shadow-lg cursor-pointer ${
                accountType === 'worker'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950/40'
              }`}
            >
              {accountType === 'worker' ? 'Register & Enter Worker Hub' : 'Register & Enter Citizen Hub'}
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
