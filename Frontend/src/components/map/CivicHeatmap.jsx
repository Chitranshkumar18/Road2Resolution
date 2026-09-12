import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';

export const CivicHeatmap = ({ center = [28.618, 77.212], zoom = 13, issues = [] }) => {
  const hotspots = React.useMemo(() => {
    if (!Array.isArray(issues) || issues.length === 0) return [];
    return issues.map((issue) => {
      const lat = issue.location?.lat || 28.6139;
      const lng = issue.location?.lng || 77.2090;
      const isCritical = issue.severity === 'CRITICAL';
      const isHigh = issue.severity === 'HIGH';
      return {
        lat,
        lng,
        radius: isCritical ? 600 : isHigh ? 450 : 300,
        intensity: isCritical ? 'Critical' : isHigh ? 'High' : 'Moderate',
        color: isCritical ? '#F43F5E' : isHigh ? '#F59E0B' : '#EAB308',
        name: issue.title,
        count: 1
      };
    });
  }, [issues]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {hotspots.map((spot, idx) => (
          <Circle
            key={idx}
            center={[spot.lat, spot.lng]}
            radius={spot.radius}
            pathOptions={{
              color: spot.color,
              fillColor: spot.color,
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup className="civic-custom-popup">
              <div className="p-1 text-slate-900">
                <h4 className="font-bold text-xs">{spot.name}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  <strong>{spot.count} Incident</strong> ({spot.intensity} Risk)
                </p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs shadow-xl space-y-1.5">
        <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">Incident Density Legend</span>
        <div className="flex items-center gap-2 text-rose-400">
          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
          <span>Critical Density (&gt; 15 issues/km²)</span>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span>High Density (8-14 issues/km²)</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span>Moderate Density (4-7 issues/km²)</span>
        </div>
      </div>
    </div>
  );
};

export default CivicHeatmap;
