import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Crosshair, Radio, Sparkles, CheckCircle2, LocateFixed } from 'lucide-react';
import Button from '../common/Button';
import useLocation from '../../hooks/useLocation';

import { getOfflineReadableLocation, reverseGeocode } from '../../utils/geocoding';

const pickerIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div class="relative flex items-center justify-center w-10 h-10 -translate-x-1/2 -translate-y-full">
      <div class="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
      <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 border-2 border-white shadow-2xl flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
      </div>
      <div class="absolute -bottom-1 w-2.5 h-2.5 bg-indigo-600 rotate-45"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.2 });
  }, [center, map]);
  return null;
}

function MapEventsHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect(parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5)));
    },
  });
  return null;
}

export const LocationPicker = ({
  initialLat = 28.6139,
  initialLng = 77.2090,
  onLocationSelect,
}) => {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });
  const [currentAddress, setCurrentAddress] = useState(() => getOfflineReadableLocation(initialLat, initialLng).address);
  const { coords, accuracy, altitude, satelliteCount, gpsStatus, loading, getCurrentPosition } = useLocation();

  const handleSelect = async (lat, lng) => {
    setPosition({ lat, lng });
    const instant = getOfflineReadableLocation(lat, lng);
    setCurrentAddress(instant.address);

    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        address: instant.address,
        city: instant.city,
        state: instant.state
      });
    }

    try {
      const refined = await reverseGeocode(lat, lng);
      if (refined && refined.address) {
        setCurrentAddress(refined.address);
        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address: refined.address,
            city: refined.city,
            state: refined.state
          });
        }
      }
    } catch {
      // Keep instant address
    }
  };

  const handleAutoGPS = () => {
    getCurrentPosition();
  };

  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      setPosition(coords);
      const instant = getOfflineReadableLocation(coords.lat, coords.lng);
      setCurrentAddress(instant.address);

      if (onLocationSelect) {
        onLocationSelect({
          lat: coords.lat,
          lng: coords.lng,
          address: instant.address,
          city: instant.city,
          state: instant.state
        });
      }

      (async () => {
        try {
          const refined = await reverseGeocode(coords.lat, coords.lng);
          if (refined && refined.address) {
            setCurrentAddress(refined.address);
            if (onLocationSelect) {
              onLocationSelect({
                lat: coords.lat,
                lng: coords.lng,
                address: refined.address,
                city: refined.city,
                state: refined.state
              });
            }
          }
        } catch {
          // Keep instant address
        }
      })();
    }
  }, [coords]);

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col">
      {/* Top GPS Telemetry Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 z-10 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-display truncate">
              <span className="truncate">📍 {currentAddress}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                {satelliteCount} SATS
              </span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 block truncate">
              GPS: {position.lat.toFixed(5)}°, {position.lng.toFixed(5)}° (±{accuracy}m)
            </span>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="primary"
          isLoading={loading}
          leftIcon={LocateFixed}
          onClick={handleAutoGPS}
        >
          Acquire My GPS
        </Button>
      </div>

      {/* Map View */}
      <div className="relative flex-1 min-h-[240px]">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[position.lat, position.lng]} icon={pickerIcon} />
          <MapRecenter center={[position.lat, position.lng]} />
          <MapEventsHandler onSelect={handleSelect} />
        </MapContainer>

        {/* Floating helper pill */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-200 flex items-center gap-1.5 shadow-lg">
          <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tap anywhere on GPS radar to recalibrate target coordinates</span>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
