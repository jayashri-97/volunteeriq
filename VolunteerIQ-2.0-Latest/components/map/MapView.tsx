'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Need } from '@/lib/mock-data';

interface MapViewProps {
  needs: Need[];
  selectedNeedId: string | null;
  newNeedId: string | null;
  onPinClick: (needId: string) => void;
}

const INDIA_CENTER: L.LatLngExpression = [22.5, 82.0];
const URGENCY_COLORS: Record<string, string> = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#10B981',
  resolved: '#9CA3AF',
};

export default function MapView({ needs, selectedNeedId, newNeedId, onPinClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const pulseRef = useRef<Map<string, L.Marker>>(new Map());
  const prevSelectedRef = useRef<string | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: INDIA_CENTER,
      zoom: 4,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true,
    });

    // Plain OpenStreetMap tiles — no theme
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Fix tile rendering after layout settles
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 500);

    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync pins whenever needs change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentIds = new Set(needs.map(n => n.id));

    // Remove old markers
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });
    pulseRef.current.forEach((pulse, id) => {
      if (!currentIds.has(id)) {
        map.removeLayer(pulse);
        pulseRef.current.delete(id);
      }
    });

    // Add/update markers
    needs.forEach(need => {
      const color = URGENCY_COLORS[need.urgency] || '#9CA3AF';
      const pos: L.LatLngExpression = [need.lat, need.lng];
      const isSelected = need.id === selectedNeedId;
      const size = need.urgency === 'critical' ? 16 : need.urgency === 'high' ? 12 : 10;
      const finalSize = isSelected ? size + 6 : size;

      const createIcon = (s: number, c: string, selected: boolean) => L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="width:${s}px;height:${s}px;background-color:${c};border-radius:50%;border:${selected ? '3px' : '1px'} solid ${selected ? '#4F46E5' : '#fff'};box-shadow:0 2px 4px rgba(0,0,0,0.3);opacity:0.9;"></div>`,
        iconSize: [s, s],
        iconAnchor: [s / 2, s / 2],
      });

      if (markersRef.current.has(need.id)) {
        // Update existing
        const marker = markersRef.current.get(need.id)!;
        marker.setIcon(createIcon(finalSize, color, isSelected));
      } else {
        // Create new marker
        const marker = L.marker(pos, {
          icon: createIcon(finalSize, color, isSelected)
        }).addTo(map);

        // Tooltip
        marker.bindTooltip(
          `<div style="font-family:system-ui;font-size:11px;min-width:160px">
            <div style="display:flex;gap:6px;margin-bottom:4px;align-items:center">
              <span style="background:${color};color:#fff;padding:2px 6px;border-radius:4px;font-size:8px;font-weight:700">${need.urgency.toUpperCase()}</span>
              <span style="font-size:9px;color:#888;font-family:monospace">Score ${need.score}</span>
            </div>
            <div style="font-weight:600;margin-bottom:3px">${need.title.length > 45 ? need.title.slice(0, 45) + '…' : need.title}</div>
            <div style="font-size:9px;color:#888">📍 ${need.location}</div>
            ${need.families > 0 ? `<div style="font-size:9px;color:${color};font-weight:600;margin-top:2px">${need.families} families</div>` : ''}
          </div>`,
          { direction: 'top', offset: [0, -finalSize/2 - 4], className: 'map-pin-tooltip' }
        );

        marker.on('click', () => onPinClick(need.id));
        markersRef.current.set(need.id, marker);

        // Pulse ring for critical needs
        if (need.urgency === 'critical') {
          const pulseIcon = L.divIcon({
            className: 'animate-pin-pulse',
            html: `<div style="width:36px;height:36px;background-color:${color};border-radius:50%;opacity:0.3;"></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
          const pulse = L.marker(pos, {
            icon: pulseIcon,
            interactive: false
          }).addTo(map);
          pulseRef.current.set(need.id, pulse);
        }
      }
    });
  }, [needs, selectedNeedId, onPinClick]);

  // Fly to selected need
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedNeedId) return;
    if (selectedNeedId === prevSelectedRef.current) return;
    prevSelectedRef.current = selectedNeedId;

    const need = needs.find(n => n.id === selectedNeedId);
    if (!need) return;

    const pos = L.latLng(need.lat, need.lng);
    if (!map.getBounds().contains(pos)) {
      map.flyTo(pos, Math.max(map.getZoom(), 7), { duration: 0.6 });
    }
  }, [selectedNeedId, needs]);

  // Fly to new parsed need
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !newNeedId) return;

    const need = needs.find(n => n.id === newNeedId);
    if (!need) return;

    map.flyTo([need.lat, need.lng], Math.max(map.getZoom(), 8), { duration: 1.0 });

    // Add temporary extra pulse for new pin
    const tempPulseIcon = L.divIcon({
      className: 'animate-pin-pulse',
      html: `<div style="width:50px;height:50px;background-color:#4F46E5;border-radius:50%;opacity:0.3;border:2px solid #4F46E5;"></div>`,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
    const pulse = L.marker([need.lat, need.lng], {
      icon: tempPulseIcon,
      interactive: false
    }).addTo(map);

    setTimeout(() => map.removeLayer(pulse), 5000);
  }, [newNeedId, needs]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
        borderRadius: 8, padding: '8px 12px', fontSize: 9,
        border: '1px solid #e4e7ee', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        {[
          { color: '#EF4444', label: 'Critical' },
          { color: '#F59E0B', label: 'High' },
          { color: '#10B981', label: 'Medium' },
          { color: '#9CA3AF', label: 'Resolved' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
            <span style={{ color: '#4B5563', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Counter */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 1000,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
        borderRadius: 6, padding: '4px 10px', fontSize: 9,
        fontFamily: 'monospace', color: '#4B5563', fontWeight: 500,
        border: '1px solid #e4e7ee', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        {needs.filter(n => n.status !== 'resolved').length} active pins
      </div>
    </div>
  );
}
