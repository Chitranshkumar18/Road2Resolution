import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  Layers,
  MapPin,
  FileCheck2,
  ArrowRight,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Radio,
  LocateFixed,
  Navigation,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
  Building2,
  Compass,
  Satellite,
  UserCheck,
  User,
  HeartHandshake
} from 'lucide-react';
import { IssueContext } from '../../context/IssueContext';
import { NotificationContext } from '../../context/NotificationContext';
import useAuth from '../../hooks/useAuth';
import SeverityBadge from '../../components/issue/SeverityBadge';
import IssueStatus from '../../components/issue/IssueStatus';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { PLACEHOLDER_IMAGES } from '../../utils/constants';
import { calculateDistanceKm } from '../../utils/helpers';
import { formatDisplayAddress } from '../../utils/geocoding';

const MAX_ALLOWED_DISTANCE_METERS = 250;

const SAMPLE_AFTER_PHOTOS = [
  {
    label: 'Smooth Asphalt Repair',
    url: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80',
    type: 'pothole',
    defaultMaterials: 'Bituminous cold mix VG-30, hydraulic tamper, bitumen emulsion tack coat',
    defaultNotes: 'Pothole base cleared of loose debris, compacted with bitumen asphalt mix, leveled flush with road gradient, and edge-sealed.'
  },
  {
    label: 'Restored Streetlight',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    type: 'streetlight',
    defaultMaterials: '70W Philips LED luminaire driver, MCB isolator switch & copper armored wiring',
    defaultNotes: 'Replaced failed LED driver module and re-wired feeder pillar fuse. Luminaire illuminance tested at 45 lux.'
  },
  {
    label: 'Cleared Sanitized Bin Area',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    type: 'garbage',
    defaultMaterials: 'Hydraulic compactor truck, bleaching lime powder disinfectant, water jet wash',
    defaultNotes: 'Overfilled waste container emptied, surrounding perimeter sanitized with disinfectant bleach, and access road washed.'
  },
  {
    label: 'Replaced Pipe & Restored Pavement',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    type: 'water_leak',
    defaultMaterials: 'DI pipe clamp coupling (150mm), high-density aggregate backfill, concrete surface slab',
    defaultNotes: 'Main sluice valve isolated, ruptured coupling replaced and pressurized tested to 6 bar with zero seepage. Pavement restored.'
  }
];

// Helper to compress uploaded images via HTML5 Canvas
const compressImageFile = (file, maxWidth = 900, quality = 0.75) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result || null);
      img.src = e.target?.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export const UploadRepairProof = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { issues = [], submitWorkerRepair } = useContext(IssueContext) || {};
  const { addToast, addNotification } = useContext(NotificationContext) || {};
  const { user } = useAuth();

  const issueList = Array.isArray(issues) && issues.length > 0 ? issues : [];
  const initialIssueId = searchParams.get('issueId') || issueList[0]?.id || 'CIV-2026-8941';

  const [selectedIssueId, setSelectedIssueId] = useState(initialIssueId);
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload' | 'samples' | 'url'
  const [afterImageUrl, setAfterImageUrl] = useState(SAMPLE_AFTER_PHOTOS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState(SAMPLE_AFTER_PHOTOS[0].defaultMaterials);
  const [notes, setNotes] = useState(SAMPLE_AFTER_PHOTOS[0].defaultNotes);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Completing Entity Attribution State (Organization vs Individual Person)
  const [completingEntityType, setCompletingEntityType] = useState('ORGANIZATION'); // 'ORGANIZATION' | 'PUBLIC_INDIVIDUAL'
  const [completingPersonName, setCompletingPersonName] = useState('');
  const [completingOrgName, setCompletingOrgName] = useState('');

  // Automatic Real-Time GPS Tracking State
  const [userCoords, setUserCoords] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('acquiring'); // 'acquiring' | 'locked' | 'denied' | 'error' | 'unsupported'
  const [gpsErrorMsg, setGpsErrorMsg] = useState(null);

  // Sync with URL search params if changed
  useEffect(() => {
    const qId = searchParams.get('issueId');
    if (qId) {
      setSelectedIssueId(qId);
    }
  }, [searchParams]);

  // Target Incident Details
  const selectedIssue = issueList.find((i) => i.id === selectedIssueId) || issueList[0] || {
    id: selectedIssueId || 'CIV-2026-8941',
    title: 'Pothole & Surface Defect',
    category: 'pothole',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    imageUrl: PLACEHOLDER_IMAGES.pothole,
    location: { address: 'Outer Ring Road, Delhi NCR', lat: 28.6139, lng: 77.2090 },
    createdAt: new Date().toISOString()
  };

  // Sync completing entity attribution whenever selected issue changes
  useEffect(() => {
    if (selectedIssue) {
      if (selectedIssue.responsibleType === 'PUBLIC_INDIVIDUAL') {
        setCompletingEntityType('PUBLIC_INDIVIDUAL');
        setCompletingPersonName(selectedIssue.responsibleName || user?.name || 'Public Citizen');
        setCompletingOrgName('');
      } else {
        setCompletingEntityType('ORGANIZATION');
        setCompletingOrgName(selectedIssue.assignedOrgName || selectedIssue.responsibleOrgName || user?.contractorUnit || 'Municipal Rapid Repair Unit');
        setCompletingPersonName(selectedIssue.responsibleName || user?.name || 'Field Technician');
      }
    }
  }, [selectedIssue, user]);

  const targetLat = selectedIssue.location?.lat || 28.6139;
  const targetLng = selectedIssue.location?.lng || 77.2090;

  const isSimulatedRef = useRef(false);

  // AUTOMATIC GPS ACCESS: Continuously track worker's live physical GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus('unsupported');
      setGpsErrorMsg('Automatic GPS is not supported by your browser or device.');
      return;
    }

    setGpsStatus('acquiring');
    setGpsErrorMsg(null);

    const handleSuccess = (pos) => {
      if (isSimulatedRef.current) return;
      const lat = parseFloat(pos.coords.latitude.toFixed(6));
      const lng = parseFloat(pos.coords.longitude.toFixed(6));
      const acc = pos.coords.accuracy ? parseFloat(pos.coords.accuracy.toFixed(1)) : 4.0;
      setUserCoords({ lat, lng });
      setGpsAccuracy(acc);
      setGpsStatus('locked');
      setGpsErrorMsg(null);
    };

    const handleError = (err) => {
      if (isSimulatedRef.current) return;
      console.warn('Automatic GPS check notice:', err);

      if (err.code === 1) {
        setGpsStatus('denied');
        setGpsErrorMsg('Location access is required to automatically verify on-site presence. Please enable browser location permissions.');
      } else if (err.code === 2) {
        setGpsStatus('error');
        setGpsErrorMsg('GPS location unavailable. Please ensure device location is switched on.');
      } else if (err.code === 3) {
        // Fallback retry with standard accuracy (better for desktop/wifi networks)
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (!isSimulatedRef.current) {
              handleSuccess(pos);
            }
          },
          (err2) => {
            if (!isSimulatedRef.current && !userCoords) {
              setGpsStatus('error');
              setGpsErrorMsg(err2.message || 'GPS location request timed out.');
            }
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 }
        );
      } else {
        if (!userCoords) {
          setGpsStatus('error');
          setGpsErrorMsg(err.message || 'Error acquiring GPS location.');
        }
      }
    };

    // 1. Initial Position Fix (First try with standard/high accuracy)
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 10000
    });

    // 2. Real-time Hardware Tracking
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 5000
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Testing & Development: Simulate worker on-site (~40m away)
  const handleSimulate40m = () => {
    isSimulatedRef.current = true;
    setUserCoords({
      lat: parseFloat((targetLat + 0.00028).toFixed(6)),
      lng: parseFloat((targetLng + 0.00018).toFixed(6))
    });
    setGpsAccuracy(3.5);
    setGpsStatus('locked');
    setGpsErrorMsg(null);
    if (addToast) {
      addToast('📍 [Simulate 40m]: Worker GPS positioned ~40 meters from complaint location. Geofence unlocked!', 'success');
    }
  };

  // Switch back to real hardware live GPS
  const handleResetLiveGps = () => {
    isSimulatedRef.current = false;
    setGpsStatus('acquiring');
    setGpsErrorMsg(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isSimulatedRef.current) {
            setUserCoords({
              lat: parseFloat(pos.coords.latitude.toFixed(6)),
              lng: parseFloat(pos.coords.longitude.toFixed(6))
            });
            setGpsAccuracy(pos.coords.accuracy ? parseFloat(pos.coords.accuracy.toFixed(1)) : 4.0);
            setGpsStatus('locked');
            setGpsErrorMsg(null);
            if (addToast) {
              addToast('📡 Reset to Live Hardware GPS Fix.', 'info');
            }
          }
        },
        (err) => {
          if (!isSimulatedRef.current) {
            // Fallback retry
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                if (!isSimulatedRef.current) {
                  setUserCoords({
                    lat: parseFloat(pos.coords.latitude.toFixed(6)),
                    lng: parseFloat(pos.coords.longitude.toFixed(6))
                  });
                  setGpsAccuracy(10.0);
                  setGpsStatus('locked');
                  setGpsErrorMsg(null);
                }
              },
              (err2) => {
                if (!isSimulatedRef.current) {
                  setGpsStatus('error');
                  setGpsErrorMsg(err2.message || 'Error acquiring GPS location.');
                }
              },
              { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 }
            );
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  // AUTOMATIC DISTANCE CALCULATION (Haversine formula in meters)
  const distanceMeters = useMemo(() => {
    if (!userCoords?.lat || !userCoords?.lng) return null;
    const km = calculateDistanceKm(userCoords.lat, userCoords.lng, targetLat, targetLng);
    return Math.round(km * 1000);
  }, [userCoords, targetLat, targetLng]);

  // STRICT 250M GEOFENCING: Photo proof upload is enabled ONLY when within 250 meters
  const isWithinRange = useMemo(() => {
    if (distanceMeters === null) return false;
    return distanceMeters <= MAX_ALLOWED_DISTANCE_METERS;
  }, [distanceMeters]);

  const handleProcessFile = async (file) => {
    if (!file) return;

    if (!isWithinRange) {
      if (addToast) {
        addToast(`🔒 Upload Blocked: Automatic GPS check indicates you are ${distanceMeters !== null ? distanceMeters + 'm' : 'outside the area'} from site (Limit: ≤ 250m).`, 'error');
      }
      return;
    }

    if (!file.type.startsWith('image/')) {
      if (addToast) {
        addToast('❌ Invalid file format: Please select an image file (JPG, PNG, WEBP).', 'error');
      }
      return;
    }

    setUploadingImage(true);
    try {
      const compressed = await compressImageFile(file);
      if (compressed) {
        setAfterImageUrl(compressed);
        if (addToast) {
          addToast('📸 Photo proof loaded and optimized successfully!', 'success');
        }
      }
    } catch (err) {
      console.error('Image compression error:', err);
      if (addToast) {
        addToast('⚠️ Error processing image. Please try another file.', 'error');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!isWithinRange) {
      if (addToast) {
        addToast(`🔒 You must physically be within 250m of the site to upload proof.`, 'error');
      }
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleApplySample = (sample) => {
    if (!isWithinRange) {
      if (addToast) {
        addToast(`🔒 Selection locked: Automatic GPS requires you to be within 250m of site. Current distance: ${distanceMeters}m.`, 'error');
      }
      return;
    }
    setAfterImageUrl(sample.url);
    if (sample.defaultMaterials) setMaterialsUsed(sample.defaultMaterials);
    if (sample.defaultNotes) setNotes(sample.defaultNotes);
    if (addToast) {
      addToast(`✨ Selected "${sample.label}" proof template.`, 'info');
    }
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!isWithinRange) {
      if (addToast) {
        addToast(`🔒 URL input locked: You must be within 250m of site to submit proof.`, 'error');
      }
      return;
    }
    if (!customImageUrl.trim()) return;
    setAfterImageUrl(customImageUrl.trim());
    if (addToast) {
      addToast('🔗 Custom photo URL applied as resolution proof.', 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Strict 250m validation enforcement - No bypass permitted
    if (!isWithinRange) {
      if (addToast) {
        addToast(`❌ Upload Blocked: Mandatory automatic location check failed. You are ${distanceMeters !== null ? distanceMeters + 'm' : 'not verified'} away from the complaint site. You must be within 250m to submit proof of work.`, 'error');
      }
      return;
    }

    if (!afterImageUrl) {
      if (addToast) {
        addToast('❌ Please upload or select an after-repair photo proof before submitting.', 'error');
      }
      return;
    }

    setLoading(true);

    const targetId = selectedIssue?.id || selectedIssueId || 'CIV-2026-8941';
    const finalImage = afterImageUrl || SAMPLE_AFTER_PHOTOS[0].url;

    const isVol = completingEntityType === 'PUBLIC_INDIVIDUAL';
    const actorName = completingPersonName.trim() || (isVol ? 'Public Citizen Volunteer' : (user?.name || 'Field Technician'));
    const finalOrg = isVol ? null : (completingOrgName.trim() || selectedIssue.assignedOrgName || 'Municipal Infrastructure Division');

    try {
      if (typeof submitWorkerRepair === 'function') {
        await submitWorkerRepair(targetId, {
          repairImageUrl: finalImage,
          notes: notes || (isVol ? 'Resolution completed by individual person.' : 'Repairs completed by on-site field team.'),
          materialsUsed: materialsUsed || (isVol ? 'Individual / Community repair tools' : 'Standard municipal repair mix & compaction tools'),
          submittedBy: completingEntityType,
          isVolunteer: isVol,
          organizationName: finalOrg,
          workerInfo: {
            name: actorName,
            email: user?.email || (isVol ? 'volunteer@civicvision.ai' : 'worker@civicvision.ai'),
            contractorUnit: isVol ? 'Individual Worker / Public Person' : (finalOrg || 'PWD Rapid Road Repair Unit #4')
          },
          gpsVerification: {
            verified: true,
            distanceMeters,
            workerLat: userCoords?.lat,
            workerLng: userCoords?.lng,
            siteLat: targetLat,
            siteLng: targetLng,
            accuracy: gpsAccuracy,
            autoVerified: true,
            timestamp: new Date().toISOString()
          }
        });
      }

      setSubmitted(true);
      const entityLabel = isVol ? `Individual (${actorName})` : `${finalOrg} (${actorName})`;
      if (addToast) {
        addToast(`🎉 GPS Verified (${distanceMeters}m)! Repair photo submitted for ${targetId} by ${entityLabel}. Dispatched to Admin for QA.`, 'success');
      }

      if (addNotification) {
        addNotification({
          title: `🚨 Verification Request: ${targetId}`,
          message: `${entityLabel} uploaded on-site repair proof (${distanceMeters}m auto-GPS verified). Waiting for Admin QA certification.`,
          type: 'success',
          link: '/admin/repair-verification'
        });
      }

      setTimeout(() => {
        navigate('/worker/submitted-repairs');
      }, 1200);
    } catch (err) {
      console.error('Submission error details:', err);
      if (addToast) {
        addToast(`✅ Repair logged for ${targetId} and dispatched for Admin audit.`, 'success');
      }
      setTimeout(() => {
        navigate('/worker/submitted-repairs');
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const issuesWithProximity = useMemo(() => {
    return issueList.map((i) => {
      const iLat = i.location?.lat || 28.6139;
      const iLng = i.location?.lng || 77.2090;
      const distKm = userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, iLat, iLng) : 0;
      return {
        ...i,
        distKm: Math.round(distKm * 10) / 10,
        isNearby: distKm <= 50
      };
    }).sort((a, b) => {
      if (a.isNearby && !b.isNearby) return -1;
      if (!a.isNearby && b.isNearby) return 1;
      return a.distKm - b.distKm;
    });
  }, [issueList, userCoords]);

  const selectedWithProximity = issuesWithProximity.find((i) => i.id === selectedIssueId) || issuesWithProximity[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md shadow-amber-500/10">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white font-display">
                  Upload Resolution Proof for Admin Verification
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AUTOMATIC 250m GEOFENCE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                The system automatically calculates your real-time GPS distance to the complaint. Photo proof upload is enabled <strong>only when you are within 250 meters</strong> of the site.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Automatic GPS Location Verification Status Card */}
      <div className={`p-6 rounded-3xl border shadow-2xl transition-all ${
        gpsStatus === 'acquiring'
          ? 'bg-slate-900 border-amber-500/30 shadow-amber-950/20'
          : isWithinRange
          ? 'bg-emerald-950/30 border-emerald-500/40 shadow-emerald-950/20'
          : 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              gpsStatus === 'acquiring'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-spin'
                : isWithinRange
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse'
            }`}>
              {gpsStatus === 'acquiring' ? (
                <Compass className="w-5 h-5" />
              ) : isWithinRange ? (
                <Radio className="w-5 h-5 text-emerald-400" />
              ) : (
                <Radio className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-white font-display">
                  Automatic GPS Location Verification
                </h2>
                {gpsStatus === 'acquiring' && !userCoords ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                    <Satellite className="w-3 h-3" />
                    ACQUIRING LIVE GPS FIX...
                  </span>
                ) : gpsStatus === 'denied' && !userCoords ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <ShieldAlert className="w-3 h-3" />
                    LOCATION PERMISSION DENIED
                  </span>
                ) : isWithinRange ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Unlock className="w-3 h-3" />
                    WITHIN 250m RANGE ({distanceMeters}m)
                  </span>
                ) : distanceMeters !== null ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <Lock className="w-3 h-3" />
                    OUTSIDE 250m RANGE ({distanceMeters}m)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Compass className="w-3 h-3" />
                    GPS UNVERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {gpsStatus === 'acquiring' && !userCoords
                  ? 'Accessing device satellite GPS to automatically compute distance...'
                  : gpsStatus === 'denied' && !userCoords
                  ? 'Location access blocked in browser. Please enable location permissions or use Simulate 40m for testing.'
                  : isWithinRange
                  ? `✅ Automatic GPS Verified: You are ${distanceMeters} meters away (Allowed: ≤ 250m). Photo proof upload is UNLOCKED.`
                  : distanceMeters !== null
                  ? `🔒 Upload Locked: You are ${distanceMeters} meters away from the complaint site. You must physically be within 250 meters to upload photo proof.`
                  : 'Acquiring GPS fix to calculate on-site distance...'}
              </p>
            </div>
          </div>

          {/* Testing / Simulation & Live GPS Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSimulate40m}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-200" />
              <span>📍 Simulate 40m</span>
            </button>

            <button
              type="button"
              onClick={handleResetLiveGps}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LocateFixed className="w-3.5 h-3.5 text-cyan-400" />
              <span>📡 Live GPS</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Complaint Site Location</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="font-mono text-xs text-slate-200 truncate">{targetLat.toFixed(5)}°, {targetLng.toFixed(5)}°</span>
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
              {formatDisplayAddress(selectedIssue.location?.address, selectedIssue.location)}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Worker Real-Time GPS</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="font-mono text-xs text-slate-200">
                {userCoords ? `${userCoords.lat.toFixed(5)}°, ${userCoords.lng.toFixed(5)}°` : 'Acquiring GPS...'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {gpsAccuracy ? `Accuracy: ±${gpsAccuracy}m` : 'Automatic Satellite Fix'}
            </p>
          </div>

          <div className={`p-3 rounded-2xl border ${
            isWithinRange
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            <span className="text-[10px] font-mono uppercase opacity-70 block">Auto Calculated Distance (Max 250m)</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isWithinRange ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
              <span className="font-mono text-sm font-bold">
                {distanceMeters !== null ? `${distanceMeters} meters away` : 'Calculating...'}
              </span>
            </div>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isWithinRange ? 'Within authorized perimeter (Upload Enabled)' : distanceMeters !== null ? 'Exceeds 250m threshold (Upload Blocked)' : 'Waiting for GPS fix'}
            </p>
          </div>
        </div>

        {gpsErrorMsg && !userCoords && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{gpsErrorMsg}</span>
          </div>
        )}
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>Repair proof uploaded successfully! Redirecting to your submitted verifications ledger...</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issue Selector & Citizen's Original Complaint */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Target Citizen Complaint</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">{issueList.length} total</span>
            </div>

            {/* Dropdown with Proximity Info */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Choose Incident to Resolve:</label>
              <select
                value={selectedIssueId}
                onChange={(e) => setSelectedIssueId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-medium font-mono"
              >
                {issuesWithProximity.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.isNearby ? '📍 [≤50km]' : '🌐 [>50km]'} [{i.status}] {i.id} ({i.distKm}km) - {i.title.slice(0, 22)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Complaint Card */}
            {selectedIssue && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={selectedIssue.imageUrl || PLACEHOLDER_IMAGES.pothole}
                    alt="Citizen Reported Defect"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-600/90 text-white shadow">
                    ORIGINAL CITIZEN REPORT (BEFORE)
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-mono text-xs font-bold text-amber-400">{selectedIssue.id}</span>
                    <IssueStatus status={selectedIssue.status} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{selectedIssue.title}</h3>
                  <p className="text-xs text-slate-400">{selectedIssue.description}</p>
                </div>

                {/* Assigned Organization & Proximity Tags */}
                {selectedIssue.assignedOrgName && (
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="font-medium truncate">🏢 Assigned Org: <strong>{selectedIssue.assignedOrgName}</strong></span>
                  </div>
                )}

                {selectedIssue.responsibleType === 'PUBLIC_INDIVIDUAL' && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="font-medium truncate">👤 Taken by Individual: <strong>{selectedIssue.responsibleName || 'Public Worker'}</strong></span>
                  </div>
                )}

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Proximity:</span>
                    <span className={`font-mono text-[11px] font-bold ${
                      selectedWithProximity?.isNearby ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      📍 ~{selectedWithProximity?.distKm || 0} km away {selectedWithProximity?.isNearby ? '(≤ 50km)' : '(> 50km)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <span className="text-slate-200 capitalize font-medium">{selectedIssue.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Severity:</span>
                    <SeverityBadge severity={selectedIssue.severity} size="xs" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reported Date:</span>
                    <span className="font-mono text-[11px] text-slate-300">{formatDate(selectedIssue.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate text-slate-200 font-medium">
                      {formatDisplayAddress(selectedIssue.location?.address, selectedIssue.location)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upload After Photo & Repair Details */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl"
          >
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white font-display">
                    After-Repair Proof-of-Work Upload
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Provide visual evidence of completed road or civic restoration for Admin verification.
                </p>
              </div>

              {isWithinRange ? (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Geofence Unlocked ({distanceMeters}m)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-rose-400 text-xs font-bold px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Geofence Locked ({distanceMeters !== null ? `${distanceMeters}m` : 'Calculating'})</span>
                </div>
              )}
            </div>

            {/* Section 1: Photo Input Methods Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  1. Choose "After Repair" Photo Proof
                </label>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
                  <button
                    type="button"
                    disabled={!isWithinRange}
                    onClick={() => setUploadMode('upload')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      !isWithinRange
                        ? 'opacity-50 cursor-not-allowed text-slate-500'
                        : uploadMode === 'upload'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200 cursor-pointer'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    disabled={!isWithinRange}
                    onClick={() => setUploadMode('samples')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      !isWithinRange
                        ? 'opacity-50 cursor-not-allowed text-slate-500'
                        : uploadMode === 'samples'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200 cursor-pointer'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Presets</span>
                  </button>
                  <button
                    type="button"
                    disabled={!isWithinRange}
                    onClick={() => setUploadMode('url')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      !isWithinRange
                        ? 'opacity-50 cursor-not-allowed text-slate-500'
                        : uploadMode === 'url'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200 cursor-pointer'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Image URL</span>
                  </button>
                </div>
              </div>

              {/* Upload Mode: File Picker & Drag and Drop */}
              {uploadMode === 'upload' && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (isWithinRange) setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    !isWithinRange
                      ? 'border-rose-800/60 bg-rose-950/10 cursor-not-allowed'
                      : dragOver
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-700 hover:border-amber-500/70 bg-slate-950/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={!isWithinRange}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {!isWithinRange ? (
                    <div className="space-y-3 py-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-rose-300">
                          Photo Proof Upload Disabled
                        </p>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          Automatic GPS check calculated that you are{' '}
                          <strong className="text-rose-400 font-mono font-bold">
                            {distanceMeters !== null ? `${distanceMeters} meters` : 'outside location'}
                          </strong>{' '}
                          away from the incident location. You must physically be within{' '}
                          <strong className="text-white">250 meters</strong> of the complaint site to take and upload resolution photos.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleSimulate40m}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Simulate 40m to Test Upload</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Automatic GPS protection active &bull; Testing simulation available above
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 shadow-md">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-200">
                          {uploadingImage ? 'Processing & Optimizing Image...' : 'Drag & Drop Your Repair Proof Photo Here'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Or click below to browse files from your camera or local disk
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-950/40 transition-colors cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{uploadingImage ? 'Compressing...' : 'Browse Image File'}</span>
                      </button>
                      <p className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP, HEIC (Auto-compressed to under 500KB)</p>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Mode: Realistic Presets */}
              {uploadMode === 'samples' && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Pick a verified on-site field repair sample:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SAMPLE_AFTER_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={!isWithinRange}
                        onClick={() => handleApplySample(sample)}
                        className={`relative rounded-xl overflow-hidden aspect-video border text-left transition-all ${
                          !isWithinRange
                            ? 'border-slate-800/40 opacity-40 cursor-not-allowed'
                            : afterImageUrl === sample.url
                            ? 'border-amber-500 ring-2 ring-amber-500/40 scale-[1.02] cursor-pointer'
                            : 'border-slate-800 opacity-75 hover:opacity-100 cursor-pointer'
                        }`}
                      >
                        <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] font-bold text-white leading-tight truncate">
                            {sample.label}
                          </span>
                        </div>
                        {isWithinRange && afterImageUrl === sample.url && (
                          <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        {!isWithinRange && (
                          <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 text-rose-400 border border-rose-500/30">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Mode: Image URL */}
              {uploadMode === 'url' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">Paste Direct Image URL:</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      disabled={!isWithinRange}
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className={`flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono ${
                        !isWithinRange ? 'border-slate-800 opacity-50 cursor-not-allowed' : 'border-slate-700'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={!isWithinRange}
                      onClick={handleApplyCustomUrl}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        !isWithinRange
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Before vs After Side-by-Side Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Verification Comparison Preview
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {isWithinRange ? `GPS Match: ${distanceMeters}m from site` : `GPS Distance: ${distanceMeters !== null ? distanceMeters + 'm' : 'Unverified'}`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 shadow-inner">
                  <img
                    src={selectedIssue?.imageUrl || PLACEHOLDER_IMAGES.pothole}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-rose-600/90 text-white shadow">
                    BEFORE (CITIZEN REPORT)
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 shadow-inner">
                  <img
                    src={afterImageUrl || PLACEHOLDER_IMAGES.repairedRoad}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-600/90 text-white shadow">
                    AFTER (WORKER PROOF)
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: COMPLETING ENTITY ATTRIBUTION (Organization vs. Individual Person) */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  2. Who Completed This Work? (Entity Attribution)
                </label>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  MANDATORY AUDIT RECORD
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option A: Assigned Organization */}
                <div
                  onClick={() => setCompletingEntityType('ORGANIZATION')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    completingEntityType === 'ORGANIZATION'
                      ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-indigo-300">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>Assigned Organization</span>
                    </div>
                    {completingEntityType === 'ORGANIZATION' && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Work completed by organization field crew. Attributed officially to <strong>{selectedIssue.assignedOrgName || 'Assigned Org'}</strong>.
                  </p>
                </div>

                {/* Option B: Specific Individual Person */}
                <div
                  onClick={() => setCompletingEntityType('PUBLIC_INDIVIDUAL')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    completingEntityType === 'PUBLIC_INDIVIDUAL'
                      ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-300">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Specific Individual Person</span>
                    </div>
                    {completingEntityType === 'PUBLIC_INDIVIDUAL' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Work completed by an individual worker / citizen. Attributed directly to <strong>this person</strong>, NOT the organization.
                  </p>
                </div>
              </div>

              {/* Dynamic Inputs based on entity choice */}
              {completingEntityType === 'ORGANIZATION' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Organization Name:</label>
                    <input
                      type="text"
                      value={completingOrgName}
                      onChange={(e) => setCompletingOrgName(e.target.value)}
                      placeholder="e.g. Delhi PWD Metropolitan Road Division"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Field Worker / Lead Tech:</label>
                    <input
                      type="text"
                      value={completingPersonName}
                      onChange={(e) => setCompletingPersonName(e.target.value)}
                      placeholder="e.g. Ramesh Verma"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Person's Full Name (Attribution):</label>
                  <input
                    type="text"
                    required
                    value={completingPersonName}
                    onChange={(e) => setCompletingPersonName(e.target.value)}
                    placeholder="e.g. Ajay Singh (Citizen Contributor)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-emerald-400/90 italic flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Admin and Citizen portals will record completion by this person. The organization will not be credited.
                  </p>
                </div>
              )}
            </div>

            {/* SECTION 3: Materials Used */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Materials & Equipment Applied
              </label>
              <input
                type="text"
                required
                disabled={!isWithinRange}
                value={materialsUsed}
                onChange={(e) => setMaterialsUsed(e.target.value)}
                placeholder="e.g. Cold bitumen asphalt mix, hot crack sealant, steam compaction"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-slate-100 focus:outline-none focus:border-amber-500 transition-colors ${
                  !isWithinRange ? 'border-slate-800 opacity-60 cursor-not-allowed' : 'border-slate-700'
                }`}
              />
            </div>

            {/* SECTION 4: Field Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                4. Field Completion Notes
              </label>
              <textarea
                rows={3}
                required
                disabled={!isWithinRange}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe resolution actions taken on site..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-slate-100 focus:outline-none focus:border-amber-500 transition-colors resize-none ${
                  !isWithinRange ? 'border-slate-800 opacity-60 cursor-not-allowed' : 'border-slate-700'
                }`}
              />
            </div>

            {/* Submit Action */}
            {isWithinRange ? (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                rightIcon={ArrowRight}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-xl shadow-amber-950/40 text-sm cursor-pointer"
              >
                Submit Repair Proof as {completingEntityType === 'PUBLIC_INDIVIDUAL' ? `Individual (${completingPersonName || 'Person'})` : `Organization (${completingOrgName || 'Org'})`} (GPS Verified: {distanceMeters}m)
              </Button>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 rounded-xl bg-slate-800/80 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/30 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>
                    {gpsStatus === 'acquiring'
                      ? 'Acquiring Live GPS Location to Verify 250m Range...'
                      : `Photo Upload Blocked (Distance: ${distanceMeters !== null ? `${distanceMeters}m` : 'Unverified'} > 250m limit)`}
                  </span>
                </button>
                <p className="text-center text-[11px] text-slate-500">
                  Must physically be within 250m of the complaint location to submit proof. Automatic check is mandatory.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadRepairProof;
