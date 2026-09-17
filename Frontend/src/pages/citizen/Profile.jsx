import React, { useState, useRef, useEffect } from 'react';
import { User, Award, CheckCircle2, Save, Phone, Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { NotificationContext } from '../../context/NotificationContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = React.useContext(NotificationContext);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      addToast('Photo preview loaded! Click "Save Profile Changes" to update.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('Profile photo removed. Save changes to confirm.', 'info');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        avatar: avatar,
      });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const reputation = user?.reputationScore ?? 0;
  const civicPoints = user?.civicPoints ?? 0;
  const badges = [
    { title: 'Civic Guardian', desc: 'Reported verified infrastructure hazards', unlocked: civicPoints >= 100 || reputation >= 100, color: (civicPoints >= 100 || reputation >= 100) ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : 'text-slate-500 bg-slate-800/40 border-slate-700' },
    { title: 'Rapid Responder', desc: 'Provided first photo for critical safety hazards', unlocked: civicPoints >= 250 || reputation >= 250, color: (civicPoints >= 250 || reputation >= 250) ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' : 'text-slate-500 bg-slate-800/40 border-slate-700' },
    { title: 'Quality Auditor', desc: 'Submitted verified repair reviews', unlocked: civicPoints >= 400 || reputation >= 400, color: (civicPoints >= 400 || reputation >= 400) ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-500 bg-slate-800/40 border-slate-700' },
    { title: 'City Vanguard', desc: 'Achieved 500+ community reputation points', unlocked: civicPoints >= 500 || reputation >= 500, color: (civicPoints >= 500 || reputation >= 500) ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-slate-500 bg-slate-800/40 border-slate-700' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6">
        {/* Profile Avatar with Photo Change Action */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 overflow-hidden flex items-center justify-center text-indigo-300 font-bold text-2xl shadow-xl">
            {avatar ? (
              <img
                src={avatar}
                alt={user?.name || 'Citizen'}
                className="w-full h-full object-cover"
              />
            ) : user?.name ? (
              user.name.slice(0, 2).toUpperCase()
            ) : (
              <User className="w-10 h-10 text-indigo-400" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload/Change Profile Photo"
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border border-slate-800 transition-transform active:scale-95 group-hover:scale-105"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl font-black text-white font-display">{user?.name || 'Citizen'}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user?.badge || 'Citizen Member'}
            </span>
          </div>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Civic Points</span>
            <span className="text-2xl font-black font-display text-cyan-400">{civicPoints}</span>
            <span className="text-[11px] text-slate-400 block">Civic Points</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reputation</span>
            <span className="text-2xl font-black font-display text-indigo-400">{reputation}</span>
            <span className="text-[11px] text-slate-400 block">Reputation</span>
          </div>
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

        <form onSubmit={handleSave} className="space-y-5">
          {/* Profile Photo Upload Field (Separate from complaint photo) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {avatar ? (
                  <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-slate-500" />
                )}
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <p className="text-xs font-semibold text-slate-200">Personal Citizen Avatar</p>
                <p className="text-[11px] text-slate-400">
                  Upload a clean JPG, PNG or WebP image for your citizen profile.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{avatar ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
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
