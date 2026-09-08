import React from 'react';

export const Loader = ({ message = 'Processing with AI Vision Engine...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-slate-900 border border-indigo-500/40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
      <div>
        <h4 className="text-base font-semibold text-slate-200">{message}</h4>
        <p className="text-xs text-slate-400 mt-1">Analyzing spatial telemetry & imagery...</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B1120]/80 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
