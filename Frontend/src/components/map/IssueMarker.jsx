import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import SeverityBadge from '../issue/SeverityBadge';
import PriorityScore from '../issue/PriorityScore';
import IssueStatus from '../issue/IssueStatus';

// Helper to create custom HTML markers for Leaflet
export function createCustomMarkerIcon(severity = 'MEDIUM', category = 'pothole') {
  let color = '#EAB308'; // medium yellow
  let ping = '';

  if (severity === 'CRITICAL') {
    color = '#F43F5E'; // red
    ping = '<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping"></span>';
  } else if (severity === 'HIGH') {
    color = '#F59E0B'; // amber
  } else if (severity === 'LOW') {
    color = '#64748B'; // slate
  }

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer">
      ${ping}
      <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center border-2 border-white" style="background-color: ${color}; box-shadow: 0 0 14px ${color}80;">
        <div class="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
      </div>
      <div class="absolute -bottom-1 w-2 h-2 rotate-45" style="background-color: ${color};"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export const IssueMarker = ({ issue, linkPrefix = '/citizen/issue' }) => {
  if (!issue.location?.lat || !issue.location?.lng) return null;

  const customIcon = createCustomMarkerIcon(issue.severity, issue.category);

  return (
    <Marker position={[issue.location.lat, issue.location.lng]} icon={customIcon}>
      <Popup className="civic-custom-popup">
        <div className="p-1 max-w-[260px] text-slate-900">
          <div className="relative rounded-lg overflow-hidden h-28 mb-2 bg-slate-800">
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1.5 left-1.5">
              <SeverityBadge severity={issue.severity} size="xs" />
            </div>
            <div className="absolute top-1.5 right-1.5">
              <PriorityScore score={issue.priorityScore} showLabel={false} />
            </div>
          </div>

          <h4 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{issue.title}</h4>
          <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">{issue.description}</p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <span className="text-[10px] font-mono text-indigo-600 font-bold">{issue.id}</span>
            <Link
              to={`${linkPrefix}/${issue.id}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default IssueMarker;
