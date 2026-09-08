import React, { useContext, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ThumbsUp,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import useAuth from '../../hooks/useAuth';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import PriorityScore from '../../components/issue/PriorityScore';
import IssueTimeline from '../../components/issue/IssueTimeline';
import AIAnalysisResult from '../../components/ai/AIAnalysisResult';
import RepairVerification from '../../components/ai/RepairVerification';
import LocationPicker from '../../components/map/LocationPicker';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

export const IssueDetails = () => {
  const { id } = useParams();
  const { issues, upvoteIssue, updateIssueStatus, submitRepairVerification } = useContext(IssueContext);
  const { addToast } = useContext(NotificationContext);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: 'Er. Rajesh Sharma (PWD)',
      text: 'Field team dispatched with cold asphalt emulsion mix. Expected completion within 4 hours.',
      time: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'c2',
      author: 'Priya Nair (Traffic Marshal)',
      text: 'Reflective warning barricades positioned around the hazard perimeter.',
      time: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ]);

  const issue = issues.find((i) => i.id === id) || issues[0];

  if (!issue) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Issue not found.</p>
        <Link to="/citizen/dashboard" className="text-indigo-400 font-bold mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleUpvote = async () => {
    await upvoteIssue(issue.id);
    addToast('Upvoted! Priority weight updated.', 'success');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: 'Citizen Contributor',
        text: commentText,
        time: new Date().toISOString(),
      },
    ]);
    setCommentText('');
    addToast('Comment posted to issue audit trail', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={ThumbsUp}
            onClick={handleUpvote}
          >
            Upvote Incident ({issue.upvotes || 0})
          </Button>

          {isAdmin && (
            <Link to="/admin/issues">
              <Button variant="primary" size="sm">
                Admin Triage
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl space-y-6">
        {/* Banner with info */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-400">{issue.id}</span>
              <SeverityBadge severity={issue.severity} size="sm" />
              <IssueStatus status={issue.status} />
            </div>

            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(issue.createdAt)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight">
            {issue.title}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            {issue.description}
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-400 flex-wrap pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{issue.location?.address}</span>
            </div>
            {issue.department && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Assigned Dept: {issue.department}</span>
              </div>
            )}
          </div>
        </div>

        {/* Priority Gauge */}
        <div className="px-6 md:px-8 pb-6">
          <PriorityScore score={issue.priorityScore} size="lg" />
        </div>
      </div>

      {/* AI Telemetry & Detection Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Autonomous AI Telemetry & Diagnosis
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Confidence: {issue.aiConfidence}%
          </span>
        </div>

        <AIAnalysisResult issue={issue} />
      </div>

      {/* Repair Verification (Citizen Read-Only Status & Audit / Admin QA Mode) */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <RepairVerification
          key={issue.id + (issue.repairVerificationUrl || '') + (issue.workerSubmission ? 'w' : '') + issue.status}
          beforeImageUrl={issue.imageUrl}
          afterImageUrl={issue.repairVerificationUrl}
          workerSubmission={issue.workerSubmission}
          status={issue.status}
          isAdmin={isAdmin}
          readOnly={!isAdmin}
          issueId={issue.id}
          issueTitle={issue.title}
          onSaveAndPublish={async (afterUrl, result) => {
            await submitRepairVerification(
              issue.id,
              afterUrl,
              `AI Differential QA Confirmed (${result?.confidenceScore || 97.4}% confidence) by Municipal Field Engineering. ${result?.verificationNotes || 'Surface restoration verified.'}`,
              result
            );
            addToast('🎉 Repair certified & published live on Citizen Portal!', 'success');
          }}
        />
      </div>

      {/* Two Columns: Timeline + Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <IssueTimeline timeline={issue.timeline || []} />
        </div>

        {/* Comments / Field Dispatch Notes */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Field Dispatch & Citizen Notes</span>
            </h4>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{c.author}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(c.time)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-800 space-y-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add observation or update on this issue..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <Button type="submit" variant="primary" size="sm" className="w-full">
              Post Update Note
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
