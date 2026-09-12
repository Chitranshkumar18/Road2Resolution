import React, { useState } from 'react';
import { User, Award, CheckCircle2, Save, Phone, MapPin } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { NotificationContext } from '../../context/NotificationContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = React.useContext(NotificationContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    zone: user?.zone || '',
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

  const reputation = user?.reputationScore || 0;
  const badges = [
    { title: 'Civic Guardian', desc: 'Reported verified infrastructure hazards', unlocked: reputation >= 100, color: reputation >= 100 ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : 'text-slate-500 bg-slate-800/40 border-slate-700' },
    { title: 'Rapid Responder', desc: 'Provided first photo for critical safety hazards', unlocked: reputation >= 250, color: reputation >= 250 ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' : 'text-slate-500 bg-slate-800/40 border-slate-700' },
    { title: 'Quality Auditor', desc: 'Submitted verified repair reviews', unlocked: reputation >= 400, color: reputation >= 400 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-500 bg-slate-800/40 border-slate-700' },
    { title: 'City Vanguard', desc: 'Achieved 500+ community reputation points', unlocked: reputation >= 500, color: reputation >= 500 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-slate-500 bg-slate-800/40 border-slate-700' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-2xl shadow-xl">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-10 h-10 text-indigo-400" />}
        </div>

        <div className="space-y-1 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl font-black text-white font-display">{user?.name || 'Citizen'}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user?.badge || 'Citizen Member'}
            </span>
          </div>
          <p className="text-xs text-slate-400">{user?.email}</p>
          {user?.zone && <p className="text-xs text-slate-400">{user.zone}</p>}
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[140px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reputation</span>
          <span className="text-2xl font-black font-display text-cyan-400">{reputation}</span>
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
