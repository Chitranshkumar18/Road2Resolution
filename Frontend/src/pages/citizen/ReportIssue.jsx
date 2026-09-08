import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';
import IssueForm from '../../components/issue/IssueForm';
import Button from '../../components/common/Button';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import useAuth from '../../hooks/useAuth';

export const ReportIssue = () => {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [submitting, setSubmitting] = useState(false);
  const [createdIssue, setCreatedIssue] = useState(null);

  const { addIssue } = useContext(IssueContext);
  const { addToast } = useContext(NotificationContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    await saveIssue(formData);
  };

  const saveIssue = async (issueData) => {
    setSubmitting(true);
    try {
      const currentUserId = user?._id || user?.id || 'usr_citizen_001';
      const payload = {
        ...issueData,
        userId: currentUserId,
        reporter: {
          id: currentUserId,
          _id: currentUserId,
          name: user?.name || 'Citizen Reporter',
          email: user?.email || 'citizen@civicvision.ai',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          reputation: user?.reputationScore || 340,
        },
        location: {
          address: issueData.address,
          lat: issueData.lat,
          lng: issueData.lng,
          zone: user?.zone || 'North Zone',
        },
      };

      const created = await addIssue(payload);
      setCreatedIssue(created);
      setStep('success');
      addToast('🎉 Civic hazard reported and dispatched to Worker & Admin portals!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to submit report. Please check details and try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Progress Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-display">
              {step === 'form' && 'Report Civic Hazard (Photo & Telemetry)'}
              {step === 'success' && 'Report Verified & Dispatched to Worker/Admin Portals'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {step === 'form' && 'Step 1 of 2: Provide incident details and execute AI scan'}
              {step === 'success' && 'Step 2 of 2: Synced to municipal queue and worker dashboard'}
            </p>
          </div>
        </div>

        {step === 'success' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Real-time Synced</span>
          </div>
        )}
      </div>

      {/* Main View based on step */}
      {step === 'form' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <IssueForm onSubmit={handleFormSubmit} isSubmitting={submitting} />
        </div>
      )}

      {step === 'success' && createdIssue && (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white font-display">Civic Report Successfully Logged!</h3>
            <p className="text-xs text-slate-300">
              Incident <strong className="text-indigo-400 font-mono">{createdIssue.id}</strong> has been created with a Priority Score of <strong className="text-amber-400 font-mono">{createdIssue.priorityScore}/100</strong> and immediately dispatched to both the <strong>Worker Portal</strong> and <strong>Admin Control Desk</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Worker Portal</p>
                <p className="text-[11px] text-slate-400">Available in Assigned Complaints for resolution</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Admin Portal</p>
                <p className="text-[11px] text-slate-400">Tracked in Live Radar & Repair QA Queue</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/citizen/my-reports')}
            >
              Go to My Submissions ({createdIssue.id})
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/citizen/issue/${createdIssue.id}`)}
            >
              View Issue Timeline
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                setStep('form');
                setCreatedIssue(null);
              }}
            >
              Submit Another Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;
