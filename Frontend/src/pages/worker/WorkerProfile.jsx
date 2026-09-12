import React, { useState } from 'react';
import {
  User,
  Wrench,
  Shield,
  Phone,
  Mail,
  MapPin,
  Award,
  CheckCircle2,
  Clock,
  HardHat,
  Truck,
  Sparkles,
  Layers
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

export const WorkerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [contractorUnit, setContractorUnit] = useState(user?.contractorUnit || user?.organizationName || '');
  const [zone, setZone] = useState(user?.zone || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      if (updateProfile) {
        await updateProfile({ name, phone, contractorUnit, zone });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-2xl shadow-xl">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <HardHat className="w-10 h-10 text-amber-400" />}
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
              <HardHat className="w-3.5 h-3.5" />
              <span>{user?.badge || 'Registered Field Worker'}</span>
            </div>
            <h1 className="text-2xl font-black text-white font-display">{user?.name || 'Field Worker'}</h1>
            <p className="text-xs text-slate-300 font-medium">{user?.contractorUnit || user?.organizationName || 'Assigned Field Operations'}</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Total Repaired</span>
          <p className="text-2xl font-black font-mono text-amber-400">{user?.completedTasksCount || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Active Tasks</span>
          <p className="text-2xl font-black font-mono text-cyan-400">{user?.activeTasksCount || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Admin QA Pass Rate</span>
          <p className="text-2xl font-black font-mono text-emerald-400">{user?.qaPassRate ? `${user.qaPassRate}%` : 'N/A'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">SLA Turnaround</span>
          <p className="text-2xl font-black font-mono text-indigo-400">{user?.avgTurnaroundHours ? `${user.avgTurnaroundHours} hrs` : 'N/A'}</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>Field Contractor Credentials & Assignment</span>
        </h2>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Contractor Rapid Repair Unit
            </label>
            <div className="relative">
              <Truck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={contractorUnit}
                onChange={(e) => setContractorUnit(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Assigned Operational Zone
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={saving}
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold"
        >
          Save Profile Updates
        </Button>
      </form>
    </div>
  );
};

export default WorkerProfile;
