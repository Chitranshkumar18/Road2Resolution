import React, { useState } from 'react';
import { User, Award, CheckCircle2, Save, Phone, MapPin } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { NotificationContext } from '../../context/NotificationContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = React.useContext(NotificationContext);

  const [formData, setFormData] = useState({
    name: user?.name || 'Aarav Mehta',
    phone: user?.phone || '+91 98765 43210',
    zone: user?.zone || 'North Zone, Delhi NCR',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const badges = [
    { title: 'Civic Guardian', desc: 'Reported 10+ verified infrastructure hazards', unlocked: true, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { title: 'Rapid Responder', desc: 'Provided first photo for 5 critical safety hazards', unlocked: true, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { title: 'Quality Auditor', desc: 'Submitted 3 before/after repair verifications', unlocked: true, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { title: 'City Vanguard', desc: 'Achieved 500+ community reputation points', unlocked: false, color: 'text-slate-500 bg-slate-800/40 border-slate-700' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
          alt={user?.name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
        />

        <div className="space-y-1 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl font-black text-white font-display">{user?.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user?.badge || 'Civic Guardian'}
            </span>
          </div>
          <p className="text-xs text-slate-400">{user?.email}</p>
          <p className="text-xs text-slate-400">{user?.zone}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[140px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reputation</span>
          <span className="text-2xl font-black font-display text-cyan-400">{user?.reputationScore || 340}</span>
          <span className="text-[11px] text-slate-400 block">Civic Points</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Civic Badges & Community Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((b, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${b.color} backdrop-blur-sm space-y-1.5`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100">{b.title}</h4>
                {b.unlocked && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white font-display">Citizen Account Details</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Assigned Municipal Zone
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData((p) => ({ ...p, zone: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
