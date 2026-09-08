import React from 'react';
import { Scan, ShieldAlert, Cpu } from 'lucide-react';

export const IssueDetectionResult = ({ imageUrl, detectedObjects = [], suggestedAction }) => {
  return (
    <div className="space-y-4">
      {/* Visual Bounding Box View */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video max-h-72">
        <img
          src={imageUrl}
          alt="AI Scan Overlay"
          className="w-full h-full object-cover opacity-85"
        />

        {/* AI Synthetic Bounding Box Reticles */}
        <div className="absolute top-[25%] left-[20%] w-[55%] h-[50%] border-2 border-dashed border-rose-500 rounded-lg bg-rose-500/10 pointer-events-none animate-pulse">
          <span className="absolute -top-3 left-2 px-1.5 py-0.5 rounded bg-rose-600 text-[10px] font-mono font-bold text-white shadow">
            TARGET DEFECT [CONF 97.8%]
          </span>
          <div className="absolute -bottom-2 right-2 text-[9px] font-mono bg-slate-900/90 text-cyan-300 px-1 rounded border border-slate-700">
            x: 142, y: 88, w: 420px
          </div>
        </div>

        {/* Reticle grid corners */}
        <div className="absolute top-3 left-3 text-cyan-400 font-mono text-[10px] flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-md border border-cyan-500/30">
          <Scan className="w-3.5 h-3.5" />
          <span>NEURAL VISION ACTIVE</span>
        </div>
      </div>

      {/* Detected tags */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Extracted Visual Classifications</span>
        </h5>
        <div className="flex flex-wrap gap-2">
          {detectedObjects.map((obj, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200"
            >
              {obj}
            </span>
          ))}
        </div>
      </div>

      {/* Suggested Action */}
      {suggestedAction && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
          <strong className="text-indigo-300 block mb-0.5">Automated Municipal Recommendation:</strong>
          {suggestedAction}
        </div>
      )}
    </div>
  );
};

export default IssueDetectionResult;
