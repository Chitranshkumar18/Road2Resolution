import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, User, Shield, HardHat } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

export const Login = () => {
  const [role, setRole] = useState('citizen'); // 'citizen' | 'worker' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password, role);
      if (res?.user?.role === 'admin' || role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res?.user?.role === 'worker' || role === 'worker') {
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

  const getButtonLabel = () => {
    if (role === 'admin') return 'Sign In to Admin Console';
    if (role === 'worker') return 'Sign In to Worker Hub';
    return 'Sign In to Citizen Hub';
  };

  const getEmailPlaceholder = () => {
    if (role === 'admin') return 'chitranshkumar730@gmail.com';
    if (role === 'worker') return 'worker@example.com';
    return 'citizen@example.com';
  };

  const getEmailLabel = () => {
    if (role === 'admin') return 'Official Municipal Admin Email';
    if (role === 'worker') return 'Field Worker / Contractor Email';
    return 'Citizen Email Address';
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
            Welcome to CivicVision AI
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Select your account type below to sign in directly to your Citizen Hub, Field Worker Portal, or Admin Console
          </p>
        </div>

        {/* 3 Role Options Toggle: Citizen vs Worker vs Admin */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {/* Citizen Option */}
          <button
            type="button"
            onClick={() => handleRoleChange('citizen')}
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

          {/* Worker Option */}
          <button
            type="button"
            onClick={() => handleRoleChange('worker')}
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

          {/* Admin Option */}
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
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

        {/* Login Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5 backdrop-blur-md">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {getEmailLabel()}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={getEmailPlaceholder()}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-colors ${
                    role === 'admin'
                      ? 'focus:border-rose-500'
                      : role === 'worker'
                      ? 'focus:border-amber-500'
                      : 'focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-500 font-medium">
                  {role === 'admin' ? 'Clearance Required' : 'Encrypted'}
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  data-lpignore="true"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none transition-colors ${
                    role === 'admin'
                      ? 'focus:border-rose-500'
                      : role === 'worker'
                      ? 'focus:border-amber-500'
                      : 'focus:border-indigo-500'
                  }`}
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

            <Button
              type="submit"
              variant={role === 'admin' ? 'danger' : 'primary'}
              size="md"
              isLoading={loading}
              rightIcon={ArrowRight}
              className={`w-full mt-2 py-3 font-bold ${
                role === 'admin'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/40 text-white'
                  : role === 'worker'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-950/40 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-950/40 text-white'
              }`}
            >
              {getButtonLabel()}
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:text-cyan-300 underline underline-offset-4">
            Register as Citizen or Worker
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
