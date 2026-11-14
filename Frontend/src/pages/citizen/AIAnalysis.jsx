import React, { useState } from 'react';
import { Sparkles, Upload, Scan, Camera, Cpu, Layers } from 'lucide-react';
import Button from '../../components/common/Button';
import AIAnalysisResult from '../../components/ai/AIAnalysisResult';
import { PLACEHOLDER_IMAGES } from '../../utils/constants';
import aiApi from '../../api/aiApi';

export const AIAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(PLACEHOLDER_IMAGES.pothole);
  const [categoryHint, setCategoryHint] = useState('pothole');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const [analysisError, setAnalysisError] = useState(null);

  const samplePresets = [
    { label: 'Deep Crater Pothole', img: PLACEHOLDER_IMAGES.pothole, cat: 'pothole' },
    { label: 'Water Main Leak', img: PLACEHOLDER_IMAGES.waterLeak, cat: 'water_leak' },
    { label: 'Streetlight Blackout', img: PLACEHOLDER_IMAGES.streetlight, cat: 'streetlight' },
    { label: 'Overflowing Garbage Dump', img: PLACEHOLDER_IMAGES.garbage, cat: 'garbage' },
  ];

  const handleRunScan = async (imgUrl = selectedImage, cat = categoryHint) => {
    setLoading(true);
    setAnalysisError(null);
    try {
      const res = await aiApi.analyzeImage(imgUrl, cat);
      setAnalysisData({
        imageUrl: imgUrl,
        ...res,
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'AI Vision service unreachable. Please ensure the model service is running.';
      setAnalysisError(msg);
      setAnalysisData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setAnalysisData(null);
        setAnalysisError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              ResNet18 Two-Stage Engine
            </span>
            <span className="text-xs text-slate-400">Autonomous Vision Diagnostics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Interactive AI Vision & Severity Engine
          </h2>
          <p className="text-xs text-slate-400">
            Simulate or upload real-world municipal imagery to inspect two-stage non-civic filtering, category predictions, and severity scores.
          </p>
        </div>

        <label className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center gap-2 shadow-lg transition-all flex-shrink-0">
          <Upload className="w-4 h-4" />
          <span>Upload Custom Photo</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {/* Preset Pickers */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select Standard Civic Anomaly Presets:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedImage(preset.img);
                setCategoryHint(preset.cat);
                handleRunScan(preset.img, preset.cat);
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                selectedImage === preset.img
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <img
                src={preset.img}
                alt={preset.label}
                className="w-full h-20 rounded-xl object-cover"
              />
              <span className="text-xs font-bold truncate">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scan CTA */}
      <div className="text-center">
        <Button
          size="lg"
          variant="primary"
          isLoading={loading}
          leftIcon={Sparkles}
          onClick={() => handleRunScan(selectedImage, categoryHint)}
          className="w-full sm:w-auto min-w-[280px]"
        >
          {analysisData ? 'Re-Analyze Current Imagery' : 'Run Full Neural Vision Scan'}
        </Button>
      </div>

      {/* Error Render */}
      {analysisError && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <span>⚠️ {analysisError}</span>
          <button
            type="button"
            onClick={() => handleRunScan(selectedImage, categoryHint)}
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results Render */}
      {analysisData && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Scan className="w-5 h-5 text-cyan-400" />
              <span>Telemetry & Neural Diagnostics Report</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Scan Execution: 42ms
            </span>
          </div>

          <AIAnalysisResult issue={analysisData} />
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
