import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  MapPin,
  Eye,
  ArrowRight,
  Shield,
  Building2,
  KeyRound,
  HardHat,
  Truck,
  Phone
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { DEPARTMENTS } from '../../utils/constants';

export const Register = () => {
  const [role, setRole] = useState('citizen'); // 'citizen' | 'worker' | 'admin'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '+91 98123 45678',
    zone: 'North Zone, Delhi NCR',
    department: 'Public Works Department (PWD)',
    contractorUnit: 'PWD Rapid Road Repair Unit #4',
    adminKey: 'ADMIN-2026-HQ'
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
      if (role === 'admin' && formData.adminKey.trim() !== 'ADMIN-2026-HQ' && !formData.adminKey.trim().toUpperCase().includes('ADMIN')) {
        setError('Invalid Admin Security Key. Use standard municipal authorization code: ADMIN-2026-HQ');
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role,
        zone: formData.zone,
        department: role === 'admin' || role === 'worker' ? formData.department : undefined,
        contractorUnit: role === 'worker' ? formData.contractorUnit : undefined
      };

      const res = await register(payload);

      if (res?.user?.role === 'admin' || role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res?.user?.role === 'worker' || role === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please check your inputs and try again.');
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
            Select your account type to register as an active citizen, field contractor, or municipal administrator
          </p>
        </div>

        {/* 3 Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {/* Citizen Tab */}
          <button
            type="button"
            onClick={() => {
              setRole('citizen');
              setError('');
            }}
            className={`p-3 rounded-xl text-left transition-all flex flex-col items-start gap-1.5 border ${
              role === 'citizen'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${role === 'citizen' ? 'bg-white/20' : 'bg-slate-800 text-indigo-400'}`}>
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">Citizen</span>
              <span className={`text-[9px] block leading-tight ${role === 'citizen' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Report & Track
              </span>
            </div>
          </button>

          {/* Worker Tab */}
          <button
            type="button"
            onClick={() => {
              setRole('worker');
              setError('');
            }}
            className={`p-3 rounded-xl text-left transition-all flex flex-col items-start gap-1.5 border ${
              role === 'worker'
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${role === 'worker' ? 'bg-white/20' : 'bg-slate-800 text-amber-400'}`}>
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">Worker</span>
              <span className={`text-[9px] block leading-tight ${role === 'worker' ? 'text-amber-100' : 'text-slate-400'}`}>
                Fix & Proof
              </span>
            </div>
          </button>

          {/* Admin Tab */}
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setError('');
            }}
            className={`p-3 rounded-xl text-left transition-all flex flex-col items-start gap-1.5 border ${
              role === 'admin'
                ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${role === 'admin' ? 'bg-white/20' : 'bg-slate-800 text-rose-400'}`}>
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">Admin</span>
              <span className={`text-[9px] block leading-tight ${role === 'admin' ? 'text-rose-100' : 'text-slate-400'}`}>
                Triage & QA
              </span>
            </div>
          </button>
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
                {role === 'admin' ? 'Officer / Administrator Name' : role === 'worker' ? 'Field Technician / Contractor Name' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder={role === 'admin' ? 'Director Rajesh Sharma' : role === 'worker' ? 'Ramesh Verma (Field Lead)' : 'Aarav Mehta'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {role === 'admin' ? 'Official Gov / Municipal Email' : role === 'worker' ? 'Contractor / Unit Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder={role === 'admin' ? 'admin@civicvision.ai' : role === 'worker' ? 'worker@civicvision.ai' : 'aarav@example.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Worker Specific Fields */}
            {role === 'worker' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Assigned Contractor / Rapid Repair Unit
                  </label>
                  <div className="relative">
                    <Truck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.contractorUnit}
                      onChange={(e) => setFormData((p) => ({ ...p, contractorUnit: e.target.value }))}
                      placeholder="PWD Rapid Road Repair Unit #4"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Field Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Department (If Admin) */}
            {role === 'admin' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Municipal Department
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-rose-500 focus:outline-none transition-colors"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                      <option value="Smart City Urban Command Centre">Smart City Urban Command Centre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Admin Clearance Key
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">DEFAULT: ADMIN-2026-HQ</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.adminKey}
                      onChange={(e) => setFormData((p) => ({ ...p, adminKey: e.target.value }))}
                      placeholder="ADMIN-2026-HQ"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-rose-500 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Zone (If Citizen or Worker) */}
            {role !== 'admin' && (
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
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant={role === 'admin' ? 'danger' : 'primary'}
              size="md"
              isLoading={loading}
              rightIcon={ArrowRight}
              className={`w-full mt-3 py-3 font-bold ${
                role === 'admin'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/40 text-white'
                  : role === 'worker'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-950/40 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-950/40 text-white'
              }`}
            >
              {role === 'admin'
                ? 'Register & Enter Admin Console'
                : role === 'worker'
                ? 'Register & Enter Worker Hub'
                : 'Register & Enter Citizen Hub'}
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
