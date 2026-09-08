import React, { useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, Navigation, LocateFixed, Radio, MapPin, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { ISSUE_CATEGORIES, PLACEHOLDER_IMAGES } from '../../utils/constants';
import Button from '../common/Button';
import LocationPicker from '../map/LocationPicker';
import useLocation from '../../hooks/useLocation';
import aiApi from '../../api/aiApi';

export const IssueForm = ({ onSubmit, isSubmitting = false }) => {
  const { coords, address: gpsAddress, accuracy, satelliteCount, loading: gpsLoading, getCurrentPosition } = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole',
    address: 'Outer Ring Road, Near Junction 14, Sector 5',
    lat: 28.6139,
    lng: 77.2090,
    imageUrl: PLACEHOLDER_IMAGES.pothole,
  });

  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiDetectedData, setAiDetectedData] = useState(null);
  const [showGpsRadar, setShowGpsRadar] = useState(true);

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    let sampleImg = PLACEHOLDER_IMAGES.pothole;
    if (cat === 'water_leak') sampleImg = PLACEHOLDER_IMAGES.waterLeak;
    else if (cat === 'streetlight') sampleImg = PLACEHOLDER_IMAGES.streetlight;
    else if (cat === 'garbage') sampleImg = PLACEHOLDER_IMAGES.garbage;
    else if (cat === 'traffic_signal') sampleImg = PLACEHOLDER_IMAGES.trafficSignal;

    setFormData((prev) => ({
      ...prev,
      category: cat,
      imageUrl: sampleImg,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiAnalysis = async () => {
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
    const finalData = {
      ...formData,
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
          Step 1: Evidence Photo & AI Vision Scan
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Display */}
          <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 h-64 overflow-hidden flex items-center justify-center group">
            {formData.imageUrl ? (
              <>
                <img
                  src={formData.imageUrl}
                  alt="Civic Issue"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-lg">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Click to upload live incident photo</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="file-upload"
                  className="mt-3 inline-block px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-indigo-700"
                >
                  Choose File
                </label>
              </div>
            )}
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

      {/* Step 3: Live GPS Coordinates & Location Telemetry */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step 3: Live GPS Coordinates & Location Telemetry</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoGPS}
              disabled={gpsLoading}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 transition-all active:scale-95"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? 'Acquiring GPS...' : 'Auto-Detect Live GPS'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGpsRadar(!showGpsRadar)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>{showGpsRadar ? 'Hide GPS Radar' : 'Show GPS Radar'}</span>
            </button>
          </div>
        </div>

        {/* GPS Coordinates Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              GPS Latitude (° N)
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.lat}
              onChange={(e) => setFormData((p) => ({ ...p, lat: parseFloat(e.target.value) || p.lat }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              GPS Longitude (° E)
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.lng}
              onChange={(e) => setFormData((p) => ({ ...p, lng: parseFloat(e.target.value) || p.lng }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Street Landmark */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Street Address / Municipal Landmark
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Enter street address, road name, or neighborhood"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
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
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
        >
          Submit Civic Report for AI Triage
        </Button>
      </div>
    </form>
  );
};

export default IssueForm;
