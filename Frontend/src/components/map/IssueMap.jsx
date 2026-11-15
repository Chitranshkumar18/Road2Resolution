import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import IssueMarker from './IssueMarker';

export const IssueMap = ({
  issues = [],
  center = [28.6180, 77.2120],
  zoom = 13,
  linkPrefix = '/citizen/issue',
  className = 'h-[550px]',
}) => {
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {issues.map((issue) => (
          <IssueMarker key={issue.id} issue={issue} linkPrefix={linkPrefix} />
        ))}
      </MapContainer>
    </div>
  );
};

export default IssueMap;
