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
  const [name, setName] = useState(user?.name || 'Ramesh Verma');
  const [phone, setPhone] = useState(user?.phone || '+91 98123 45678');
  const [contractorUnit, setContractorUnit] = useState(user?.contractorUnit || 'PWD Rapid Road Repair Unit #4');
  const [zone, setZone] = useState(user?.zone || 'North Zone, Delhi NCR');
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
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-amber-500/30 shadow-xl"
          />
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
              <HardHat className="w-3.5 h-3.5" />
              <span>{user?.badge || 'Certified Field Technician'}</span>
            </div>
            <h1 className="text-2xl font-black text-white font-display">{user?.name || 'Ramesh Verma'}</h1>
            <p className="text-xs text-slate-300 font-medium">{user?.contractorUnit || 'PWD Rapid Road Repair Unit #4'}</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Total Repaired</span>
          <p className="text-2xl font-black font-mono text-amber-400">{user?.completedTasksCount || 28}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Active Tasks</span>
          <p className="text-2xl font-black font-mono text-cyan-400">{user?.activeTasksCount || 3}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Admin QA Pass Rate</span>
          <p className="text-2xl font-black font-mono text-emerald-400">98.4%</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">SLA Turnaround</span>
          <p className="text-2xl font-black font-mono text-indigo-400">4.2 hrs</p>
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
