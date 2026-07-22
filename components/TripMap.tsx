'use client';

import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import type { TripDay } from '@/lib/trip';

const icon = L.divIcon({ className:'', html:'<div class="marker">•</div>', iconSize:[32,32], iconAnchor:[16,16] });

export default function TripMap({ days }:{ days:TripDay[] }) {
  const visibleDays = days.filter(day => day.type !== 'flight');
  const styles = {
    drive:{ color:'#173f2b', weight:4, opacity:.8 },
    ferry:{ color:'#2474a6', weight:4, opacity:.9, dashArray:'8 10' },
    coach:{ color:'#8a6239', weight:4, opacity:.8 },
    'day-trip':{ color:'#6d4c87', weight:3, opacity:.75, dashArray:'4 8' },
    train:{ color:'#b44b3e', weight:4, opacity:.85 }
  } as const;
  const segments = visibleDays.slice(1).map((day,index)=>({
    id:`${visibleDays[index].id}-${day.id}`,
    points:[[visibleDays[index].lat,visibleDays[index].lng],[day.lat,day.lng]] as [number,number][],
    mode:(day.type==='ferry'?'ferry':day.type==='train'?'train':day.type==='activity'?'day-trip':day.type==='car'?'coach':'drive') as keyof typeof styles
  }));
  return <MapContainer className="map-canvas" center={[54.5,-7]} zoom={6} scrollWheelZoom>
    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {segments.map(segment => <Polyline key={segment.id} positions={segment.points} pathOptions={styles[segment.mode]} />)}
    {visibleDays.map(day => <Marker key={day.id} position={[day.lat,day.lng]} icon={icon}><Popup><b>{day.title}</b><br/>{day.place}<br/><small>{day.label}</small></Popup></Marker>)}
  </MapContainer>;
}
