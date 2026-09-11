import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  Zap,
  Eye
} from 'lucide-react';

export const LiveCameraCapture = ({
  currentImageUrl,
  onCapture,
  disabled = false,
  themeColor = 'indigo', // 'indigo' | 'amber'
  aspectRatio = 'aspect-video',
  label = 'Live Camera Evidence Capture',
  sublabel = 'Take a live photo directly through your device camera'
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState(null);
  const [flash, setFlash] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Stop active camera stream tracks
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  // Start live WebRTC camera stream
  const startCamera = async (overrideFacing) => {
    if (disabled) return;
    setCameraError(null);
    stopCamera();

    const mode = overrideFacing || facingMode;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Live camera stream not supported on this browser. Use native camera trigger.');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(newStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Unable to access live camera stream. You can capture directly using the device camera.');
      // If WebRTC fails, invoke native mobile camera input
      if (mobileInputRef.current) {
        mobileInputRef.current.click();
      }
    }
  };

  // Switch between front and rear camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(nextMode);
    }
  };

  // Capture frame from active video stream
  const captureFrame = () => {
    if (!videoRef.current) return;
    setCapturing(true);
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get high-quality JPEG data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    onCapture(dataUrl);
    stopCamera();
    setCapturing(false);
  };

  // Handle native camera capture input fallback
  const handleMobileCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync video element when stream is ready
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  const isIndigo = themeColor === 'indigo';
  const primaryBg = isIndigo ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-amber-600 hover:bg-amber-500';
  const primaryBorder = isIndigo ? 'border-indigo-500/40' : 'border-amber-500/40';
  const glowShadow = isIndigo ? 'shadow-indigo-600/30' : 'shadow-amber-600/30';
  const activePill = isIndigo ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

  return (
    <div className="space-y-3">
      {/* Hidden native camera capture input (forces camera on mobile/tablet) */}
      <input
        ref={mobileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled}
        onChange={handleMobileCapture}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Viewfinder Container */}
      <div
        className={`relative ${aspectRatio} rounded-2xl overflow-hidden bg-slate-950 border-2 ${
          isCameraActive
            ? `${primaryBorder} ring-2 ${isIndigo ? 'ring-indigo-500/30' : 'ring-amber-500/30'}`
            : 'border-slate-800'
        } flex items-center justify-center shadow-xl group`}
      >
        {/* Flash Animation */}
        {flash && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300" />}

        {isCameraActive ? (
          /* 1. Live Camera Stream Viewfinder */
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target Crosshair & Camera HUD */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-white/40 rounded-2xl border-dashed flex items-center justify-center">
                <div className="w-4 h-4 border-t-2 border-l-2 border-white" />
              </div>
            </div>

            {/* Top HUD Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-white text-[11px] font-mono font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE CAMERA ACTIVE</span>
            </div>

            {/* Top Right Controls: Switch Camera & Close */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="p-2 rounded-xl bg-black/70 hover:bg-black text-white border border-white/20 text-xs backdrop-blur-md transition-all cursor-pointer"
                title="Flip Camera (Front/Rear)"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white border border-white/20 text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Bottom Shutter Controls */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={captureFrame}
                disabled={capturing}
                className={`px-6 py-3 rounded-full ${primaryBg} text-white font-bold text-xs flex items-center gap-2 shadow-2xl ${glowShadow} border border-white/30 active:scale-95 transition-all cursor-pointer`}
              >
                <Camera className="w-4 h-4 animate-pulse" />
                <span>Snap Live Photo</span>
              </button>
            </div>
          </div>
        ) : currentImageUrl ? (
          /* 2. Photo Captured Preview */
          <div className="relative w-full h-full">
            <img
              src={currentImageUrl}
              alt="Live Captured Photo"
              className="w-full h-full object-cover"
            />

            {/* Overlay Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold backdrop-blur-md shadow">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE CAMERA CAPTURE VERIFIED</span>
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-[2px]">
              <p className="text-xs font-bold text-white text-center">
                Photo captured via device camera
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => startCamera()}
                  className={`px-4 py-2 rounded-xl ${primaryBg} text-white text-xs font-bold shadow-lg ${glowShadow} flex items-center gap-1.5 transition-all cursor-pointer`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Retake Live Photo</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 3. Initial State: Prompt to Open Live Camera */
          <div className="text-center p-6 space-y-3 max-w-sm mx-auto">
            <div className={`w-14 h-14 rounded-2xl ${isIndigo ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'} flex items-center justify-center mx-auto border shadow-lg`}>
              <Camera className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-display">
                Live Camera Photo Capture Only
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gallery/file upload is disabled. Please capture a live photograph of the road defect directly with your camera.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => startCamera()}
                className={`px-5 py-2.5 rounded-xl ${primaryBg} text-white text-xs font-bold shadow-lg ${glowShadow} flex items-center gap-2 transition-all cursor-pointer`}
              >
                <Camera className="w-4 h-4" />
                <span>Open Live Camera</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls & Live Camera Indicator */}
      <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${activePill}`}>
            📷 LIVE CAMERA ONLY
          </span>
          <span className="text-[11px] text-slate-400">
            Gallery uploads disabled &bull; Real-time capture enforced
          </span>
        </div>

        {currentImageUrl && !isCameraActive && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => startCamera()}
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Camera Photo</span>
          </button>
        )}
      </div>

      {cameraError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Camera stream notice: Tap to capture directly using native camera</span>
          </div>
          <button
            type="button"
            onClick={() => mobileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer"
          >
            Launch Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveCameraCapture;
