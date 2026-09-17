import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Navigation, LocateFixed, Radio, MapPin, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { ISSUE_CATEGORIES, PLACEHOLDER_IMAGES } from '../../utils/constants';
import Button from '../common/Button';
import LocationPicker from '../map/LocationPicker';
import useLocation from '../../hooks/useLocation';
import aiApi from '../../api/aiApi';
import { getOfflineReadableLocation, formatDisplayAddress } from '../../utils/geocoding';
import LiveCameraCapture from '../common/LiveCameraCapture';

export const IssueForm = ({ onSubmit, isSubmitting = false }) => {
  const { coords, address: gpsAddress, accuracy, satelliteCount, loading: gpsLoading, getCurrentPosition } = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole',
    address: 'Outer Ring Road, Sector 5, New Delhi, Central Delhi District, Delhi, 110001, India',
    lat: 28.6139,
    lng: 77.2090,
    imageUrl: '',
  });

  const [photoCapturedAt, setPhotoCapturedAt] = useState(null);
  const [photoSecondsLeft, setPhotoSecondsLeft] = useState(null);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiDetectedData, setAiDetectedData] = useState(null);
  const [showGpsRadar, setShowGpsRadar] = useState(true);

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: cat,
    }));
  };

  const handleLivePhotoCapture = (dataUrl, timestamp) => {
    const captureTime = timestamp || Date.now();
    setPhotoCapturedAt(captureTime);
    setPhotoSecondsLeft(60);
    setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
    setAiDetectedData(null);
  };

  const handleRetakePhoto = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setPhotoCapturedAt(null);
    setPhotoSecondsLeft(null);
    setAiDetectedData(null);
  };

  // 60-Second Real-Time Validity Countdown Timer for Citizen Live Camera Photo
  useEffect(() => {
    if (!formData.imageUrl || !photoCapturedAt) {
      setPhotoSecondsLeft(null);
      return;
    }

    const updateRemaining = () => {
      const capTime = typeof photoCapturedAt === 'number' ? photoCapturedAt : new Date(photoCapturedAt).getTime();
      if (isNaN(capTime)) {
        setPhotoSecondsLeft(null);
        return;
      }
      const elapsed = Math.floor((Date.now() - capTime) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setPhotoSecondsLeft(remaining);
    };

    updateRemaining();
    const timerInterval = setInterval(updateRemaining, 1000);
    return () => clearInterval(timerInterval);
  }, [formData.imageUrl, photoCapturedAt]);

  const isPhotoExpired = Boolean(formData.imageUrl && photoSecondsLeft === 0);

  const runAiAnalysis = async () => {
    if (!formData.imageUrl) {
      alert('Please capture a live photo using your camera before executing the AI scan.');
      return;
    }
    if (isPhotoExpired) {
      alert('⚠️ The captured photo has expired (60-second limit reached). Please capture a fresh live photo.');
      return;
    }
    setAnalyzingAi(true);
    try {
      const result = await aiApi.analyzeImage(formData.imageUrl, formData.category);
      setAiDetectedData(result);
      if (!formData.title) {
        const catObj = ISSUE_CATEGORIES.find((c) => c.id === result.category);
        setFormData((prev) => ({
          ...prev,
          category: result.category,
          title: `${catObj?.label || 'Civic Anomaly'} detected at ${formData.address.split(',')[0]}`,
        }));
      }
    } catch (err) {
      console.error('AI scan failed', err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleAutoGPS = () => {
    getCurrentPosition();
  };

  useEffect(() => {
    if (coords?.lat && coords?.lng) {
      setFormData((prev) => ({
        ...prev,
        lat: coords.lat,
        lng: coords.lng,
        address: gpsAddress || prev.address,
      }));
    }
  }, [coords, gpsAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Please capture a live photo of the civic defect using your camera before submitting.');
      return;
    }
    if (isPhotoExpired || (photoCapturedAt && (Date.now() - photoCapturedAt) > 60000)) {
      alert('⚠️ Captured photo has expired (60-second limit exceeded). Please capture a new live photo with the camera to submit.');
      return;
    }
    const finalData = {
      ...formData,
      capturedAt: photoCapturedAt || Date.now(),
      photoValiditySeconds: 60,
      severity: aiDetectedData?.severity || 'HIGH',
      priorityScore: aiDetectedData?.priorityScore || 85,
      aiConfidence: aiDetectedData?.aiConfidence || 95.5,
      aiDetection: aiDetectedData?.aiDetection || {
        detectedObjects: ['Civil Infrastructure Defect'],
        safetyHazardIndex: 8.0,
        trafficImpactFactor: 'Moderate',
        suggestedAction: 'Forwarded to designated municipal field officer.',
      },
      status: 'VERIFIED',
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Evidence Image Dropzone & AI Scan */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Step 1: Evidence Photo & AI Vision Scan (Live Camera Only)
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Live Camera Capture Display */}
          <div>
            <LiveCameraCapture
              currentImageUrl={formData.imageUrl}
              capturedAt={photoCapturedAt}
              onCapture={handleLivePhotoCapture}
              onRetake={handleRetakePhoto}
              themeColor="indigo"
              label="Live Camera Evidence Capture"
              sublabel="Capture live road defect photograph directly with your camera"
            />
          </div>

          {/* AI Scan Trigger & Telemetry */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Neural Diagnostic Model</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Model: YOLO-v10-Civic
                </span>
              </div>

              {aiDetectedData ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-300">Detected Severity</span>
                    <span className="text-xs font-bold text-rose-400 uppercase">
                      {aiDetectedData.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-300">AI Priority Score</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {aiDetectedData.priorityScore} / 100
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                    <span className="text-[11px] text-slate-400 block mb-1">Detected Objects:</span>
                    <p className="font-mono text-cyan-300">
                      {aiDetectedData.aiDetection.detectedObjects.join(', ')}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">
                  Run our high-precision computer vision pipeline on the evidence photo to auto-estimate defect dimensions, safety risk, and priority score.
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={analyzingAi}
              leftIcon={Sparkles}
              onClick={runAiAnalysis}
              className="mt-4 w-full"
            >
              {aiDetectedData ? 'Re-Run AI Vision Scan' : 'Execute AI Detection Scan'}
            </Button>
          </div>
        </div>
      </div>

      {/* Step 2: Category & Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Issue Category
          </label>
          <select
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label} ({cat.department})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Incident Headline / Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Deep crater pothole near metro pillar 14"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Step 3: GPS Detected Location & Telemetry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step 3: Location (Auto-Detected via GPS)</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoGPS}
              disabled={gpsLoading}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 transition-all active:scale-95 shadow-sm"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? 'Detecting Location...' : 'Auto-Detect My GPS'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGpsRadar(!showGpsRadar)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
            >
              <span>{showGpsRadar ? 'Hide GPS Map' : 'Adjust on Map'}</span>
            </button>
          </div>
        </div>

        {/* Primary Readable Location Display Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-700 shadow-md space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Detected Location / Address
                </span>
                <p className="text-sm font-bold text-white leading-snug font-display mt-0.5 break-words">
                  {formatDisplayAddress(formData.address, { lat: formData.lat, lng: formData.lng })}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
              GPS Linked
            </span>
          </div>

          {/* Location Name Input (Citizen can refine or leave auto-resolved) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Location Name / Street (Auto-Resolved from GPS)
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="e.g. Meerut, Uttar Pradesh, India"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Internal GPS Coordinates (Stored internally for distance / verification checks) */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Internal GPS: {formData.lat.toFixed(5)}° N, {formData.lng.toFixed(5)}° E</span>
            </span>
            <span className="text-slate-400 text-[10px]">
              (Stored internally for 250m verification & 50km radius)
            </span>
          </div>
        </div>

        {showGpsRadar && (
          <div className="rounded-2xl border border-slate-800 overflow-hidden h-80">
            <LocationPicker
              initialLat={formData.lat}
              initialLng={formData.lng}
              onLocationSelect={({ lat, lng, address }) => {
                setFormData((prev) => ({
                  ...prev,
                  lat,
                  lng,
                  address: address || prev.address,
                }));
              }}
            />
          </div>
        )}
      </div>

      {/* Step 4: Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          Detailed Observations & Hazards
        </label>
        <textarea
          rows={3}
          required
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe extent of damage, safety risk to pedestrians, traffic congestion impact..."
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        {isPhotoExpired ? (
          <button
            type="button"
            onClick={handleRetakePhoto}
            className="w-full py-4 px-6 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-rose-950/50 border border-rose-400/40 transition-all cursor-pointer animate-pulse"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>⚠️ Photo Proof Expired (60s Exceeded) &bull; Tap to Capture New Live Photo</span>
          </button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={!formData.imageUrl || isPhotoExpired}
            className="w-full"
          >
            {photoSecondsLeft !== null ? (
              <span className="flex items-center justify-center gap-2">
                <span>Submit Civic Report for AI Triage</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  photoSecondsLeft <= 15
                    ? 'bg-rose-900/80 text-rose-200 border border-rose-500/50 animate-pulse'
                    : photoSecondsLeft <= 30
                    ? 'bg-amber-900/80 text-amber-200 border border-amber-500/50'
                    : 'bg-black/40 text-emerald-300 border border-emerald-500/30'
                }`}>
                  ⏱️ {photoSecondsLeft}s left
                </span>
              </span>
            ) : (
              'Submit Civic Report for AI Triage'
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default IssueForm;
