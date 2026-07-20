'use client';

import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import type { TripDay } from '@/lib/trip';

const icon = L.divIcon({ className:'', html:'<div class="marker">•</div>', iconSize:[32,32], iconAnchor:[16,16] });

export default function TripMap({ days }:{ days:TripDay[] }) {
  const points = days.map(day => [day.lat, day.lng] as [number, number]);
  return <MapContainer className="map-canvas" center={[54.5,-7]} zoom={6} scrollWheelZoom>
    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Polyline positions={points} pathOptions={{ color:'#173f2b', weight:4, opacity:.75 }} />
    {days.map(day => <Marker key={day.id} position={[day.lat,day.lng]} icon={icon}><Popup><b>{day.title}</b><br/>{day.place}<br/><small>{day.label}</small></Popup></Marker>)}
  </MapContainer>;
}
