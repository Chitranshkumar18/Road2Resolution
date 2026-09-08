import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';

const HEATMAP_HOTSPOTS = [
  { lat: 28.6139, lng: 77.2090, radius: 900, intensity: 'Critical', color: '#F43F5E', name: 'North Ring Road Corridor', count: 18 },
  { lat: 28.6250, lng: 77.2180, radius: 750, intensity: 'High', color: '#F59E0B', name: 'Central Commercial Hub', count: 12 },
  { lat: 28.6010, lng: 77.2020, radius: 600, intensity: 'High', color: '#F59E0B', name: 'Green Park Institutional Sector', count: 9 },
  { lat: 28.6090, lng: 77.2270, radius: 500, intensity: 'Medium', color: '#EAB308', name: 'Mayur Vihar Sub-City', count: 7 },
  { lat: 28.6320, lng: 77.2150, radius: 850, intensity: 'Critical', color: '#F43F5E', name: 'Kalyan Marg Intersection', count: 15 },
];

export const CivicHeatmap = ({ center = [28.618, 77.212], zoom = 13 }) => {
  return (
    <div className="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {HEATMAP_HOTSPOTS.map((spot, idx) => (
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
                  <strong>{spot.count} Active Incidents</strong> ({spot.intensity} Risk)
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
