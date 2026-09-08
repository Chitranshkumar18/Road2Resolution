import React, { useState, useContext } from 'react';
import { CopyCheck, Search, MapPin, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import DuplicateDetection from '../../components/ai/DuplicateDetection';
import { ISSUE_CATEGORIES } from '../../utils/constants';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import aiApi from '../../api/aiApi';

export const DuplicateCheck = () => {
  const [category, setCategory] = useState('pothole');
  const [radiusKm, setRadiusKm] = useState(2);
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const { upvoteIssue } = useContext(IssueContext);
  const { addToast } = useContext(NotificationContext);

  const handleRunCheck = async () => {
    setChecking(true);
    try {
      const res = await aiApi.checkDuplicates(lat, lng, category, radiusKm);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const handleUpvote = async (id) => {
    await upvoteIssue(id);
    addToast('Upvoted issue and linked duplicate incident!', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <CopyCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white font-display">AI Duplicate Report Screener</h2>
        </div>
        <p className="text-xs text-slate-400">
          Our spatial-visual AI screens GPS coordinates and image features to detect whether a civic hazard has already been reported nearby, consolidating citizen upvotes.
        </p>
      </div>

      {/* Query Form */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Target Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            >
              {ISSUE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Screening Radius (km)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="10"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Simulated Center GPS
            </label>
            <input
              type="text"
              value={`${lat}, ${lng}`}
              onChange={(e) => {
                const parts = e.target.value.split(',');
                if (parts.length === 2) {
                  setLat(parseFloat(parts[0]) || 28.6139);
                  setLng(parseFloat(parts[1]) || 77.2090);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={checking}
          leftIcon={Search}
          onClick={handleRunCheck}
          className="w-full"
        >
          Screen Radius for Existing Incidents
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-white font-display">
            Screening Results ({result.duplicates.length} Matches Found)
          </h3>
          <DuplicateDetection
            duplicates={result.duplicates}
            onUpvote={handleUpvote}
          />
        </div>
      )}
    </div>
  );
};

export default DuplicateCheck;
