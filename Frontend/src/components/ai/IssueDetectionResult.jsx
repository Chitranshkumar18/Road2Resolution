import React from 'react';
import { Layers, CheckCircle2, Cpu } from 'lucide-react';

export const IssueDetectionResult = ({
  imageUrl,
  category,
  confidence,
  probabilities = {},
  suggestedAction,
}) => {
  const probEntries = Object.entries(probabilities || {});

  return (
    <div className="space-y-4">
      {/* Evidence Image View */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video max-h-72">
        <img
          src={imageUrl}
          alt="AI Classification Evidence"
          className="w-full h-full object-cover"
        />

        {/* Top telemetry tag */}
        <div className="absolute top-3 left-3 text-cyan-300 font-mono text-[10px] flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md border border-cyan-500/30 backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>ResNet-18 Classifier Active</span>
        </div>

        {/* Bottom classification tag */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-950/85 px-3 py-1 rounded-xl border border-indigo-500/40 backdrop-blur-md text-xs font-mono font-bold text-indigo-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{(category || 'civic_defect').toUpperCase()} ({confidence || 0}%)</span>
        </div>
      </div>

      {/* Model Class Probabilities Distribution */}
      {probEntries.length > 0 && (
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Model Class Probability Distribution (Stage 2)</span>
          </h5>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {probEntries.map(([cls, prob]) => (
              <div
                key={cls}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs flex justify-between items-center"
              >
                <span className="text-slate-300 capitalize">{cls.replace('_', ' ')}</span>
                <span className="font-mono font-bold text-indigo-300">{prob}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
