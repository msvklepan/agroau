import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { MapToolbar } from './MapToolbar'
import type { MapLayerState } from './MapToolbar'
import { FieldOverlay } from './FieldOverlay'
import { FieldDetailDrawer } from './FieldDetailDrawer'
import { CROP_REGIONS } from '../../data/fields'
import type { Field } from '../../data/fields'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

type DataLayer = 'ndvi' | 'brix' | 'salinity'

interface Props {
  fields: Field[]
  selectedId: string | null
  activeLayer: DataLayer
  onSelect: (id: string) => void
  onLayerChange: (l: DataLayer) => void
  selectedRegion: string | null
  onRegionSelect: (id: string) => void
}

const MAP_CENTER: [number, number] = [39.6, 59.8]
const MAP_ZOOM = 6

/* ── No-label tile URLs ── */
const TILE_URLS: Record<MapLayerState['base'], string> = {
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  dark:      'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  terrain:   'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
}

/* ── Jetson device positions (near field centers) ── */
const DEVICE_MARKERS = [
  { id: 'A', name: 'Jetson A', pos: [37.356, 59.610] as [number,number], status: 'active',  field: 'TM-01' },
  { id: 'B', name: 'Jetson B', pos: [37.284, 62.345] as [number,number], status: 'active',  field: 'TM-02' },
  { id: 'C', name: 'Jetson C', pos: [42.308, 59.985] as [number,number], status: 'standby', field: 'TM-03' },
]

/* ── ADS "Bricks" — grid overlay drawn as horizontal Polylines ── */
function AdsGrid() {
  const segments: [number,number][][] = []
  const regions = [
    { lat0: 37.31, lat1: 37.40, lng0: 59.57, lng1: 59.66, step: 0.012 },
    { lat0: 37.26, lat1: 37.31, lng0: 62.32, lng1: 62.42, step: 0.012 },
    { lat0: 42.28, lat1: 42.33, lng0: 59.94, lng1: 60.04, step: 0.010 },
  ]
  for (const r of regions) {
    for (let lat = r.lat0; lat <= r.lat1; lat += r.step) {
      segments.push([[lat, r.lng0], [lat, r.lng1]])
    }
    for (let lng = r.lng0; lng <= r.lng1; lng += r.step) {
      segments.push([[r.lat0, lng], [r.lat1, lng]])
    }
  }
  return (
    <>
      {segments.map((seg, i) => (
        <Polyline key={i} positions={seg} pathOptions={{ color: '#FF8C42', weight: 0.5, opacity: 0.35 }} />
      ))}
    </>
  )
}

function makeDeviceIcon(id: string, status: string) {
  const active = status === 'active'
  const col = active ? '#34C759' : '#fbbf24'
  return L.divIcon({
    className: '',
    html: `<div style="
      display:inline-flex;align-items:center;gap:3px;
      background:rgba(14,14,18,0.52);
      backdrop-filter:blur(20px);
      border:1px solid ${active ? 'rgba(52,199,89,0.35)' : 'rgba(251,191,36,0.30)'};
      border-radius:3px;padding:2px 5px;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      white-space:nowrap;
    ">
      <span style="width:4px;height:4px;border-radius:1px;background:${col};display:inline-block;flex-shrink:0;box-shadow:0 0 4px ${col};"></span>
      <span style="font-family:'SF Mono',monospace;font-size:9px;font-weight:700;color:${col};letter-spacing:0.05em;">JT-${id}</span>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [-4, 10],
  })
}

function makeRegionLabel(name: string, _sub: string, color: string, selected: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="
      display:inline-flex;align-items:center;gap:4px;
      background:${selected ? `${color}22` : 'rgba(14,14,18,0.50)'};
      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);
      border:1px solid ${selected ? `${color}60` : 'rgba(255,255,255,0.16)'};
      border-radius:3px;
      padding:2px 7px 2px 5px;
      box-shadow:${selected ? `0 0 10px ${color}30` : '0 2px 8px rgba(0,0,0,0.30)'};
      white-space:nowrap;cursor:pointer;
    ">
      <span style="
        width:4px;height:4px;border-radius:1px;flex-shrink:0;display:inline-block;
        background:${color};
        box-shadow:0 0 4px ${color};
      "></span>
      <span style="
        font-family:-apple-system,'SF Pro Text',sans-serif;
        font-size:10px;font-weight:700;
        color:${selected ? color : '#FFFFFF'};
        letter-spacing:0.02em;
      ">${name}</span>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [-4, 10],
  })
}

function RegionFlyTo({ selectedRegion }: { selectedRegion: string | null }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedRegion) {
      map.flyTo(MAP_CENTER, MAP_ZOOM, { duration: 1.2, easeLinearity: 0.25 })
      return
    }
    const region = CROP_REGIONS.find(r => r.id === selectedRegion)
    if (region) map.flyTo(region.center, 9, { duration: 1.4, easeLinearity: 0.25 })
  }, [selectedRegion, map])
  return null
}

export function FieldMap({ fields, selectedId, activeLayer, onSelect, onLayerChange, selectedRegion, onRegionSelect }: Props) {
  const alertCount = fields.filter(f => f.status === 'critical').length
  const selectedField = fields.find(f => f.id === selectedId) ?? null

  const [mapLayers, setMapLayers] = useState<MapLayerState>({
    base: 'satellite', fields: true, devices: true, bricks: false,
  })

  return (
    <div className="relative flex-1 overflow-hidden" style={{ minHeight: 0, borderRadius: 6 }}>
      <MapToolbar
        activeLayer={activeLayer}
        onLayerChange={onLayerChange}
        mapLayers={mapLayers}
        onMapLayers={setMapLayers}
        alertCount={alertCount}
      />

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        zoomControl={false}
        style={{ height: '100%', width: '100%', borderRadius: 6 }}
        scrollWheelZoom
      >
        <TileLayer
          key={mapLayers.base}
          url={TILE_URLS[mapLayers.base]}
          attribution=""
          maxZoom={19}
        />

        <RegionFlyTo selectedRegion={selectedRegion} />

        {/* Region circles — NO tooltip (eliminates white dot artifacts) */}
        {CROP_REGIONS.map(region => {
          const isSelected = selectedRegion === region.id
          return (
            <Circle
              key={region.id}
              center={region.center}
              radius={region.radius}
              pathOptions={{
                color:       region.color,
                fillColor:   region.color,
                fillOpacity: isSelected ? 0.12 : 0.04,
                opacity:     isSelected ? 0.85 : 0.40,
                weight:      isSelected ? 2.0 : 1.0,
                dashArray:   isSelected ? undefined : '4 6',
              }}
              eventHandlers={{ click: () => onRegionSelect(region.id) }}
            />
          )
        })}

        {/* Region label markers — clean, no city names */}
        {CROP_REGIONS.map(region => (
          <Marker
            key={`lbl-${region.id}`}
            position={region.center}
            icon={makeRegionLabel(region.name, region.subname, region.color, selectedRegion === region.id)}
            eventHandlers={{ click: () => onRegionSelect(region.id) }}
          />
        ))}

        {/* Field overlays (conditional) */}
        {mapLayers.fields && (
          <FieldOverlay
            fields={fields}
            selectedId={selectedId}
            activeLayer={activeLayer}
            onSelect={onSelect}
          />
        )}

        {/* Device markers (conditional) */}
        {mapLayers.devices && DEVICE_MARKERS.map(d => (
          <Marker
            key={d.id}
            position={d.pos}
            icon={makeDeviceIcon(d.id, d.status)}
          />
        ))}

        {/* ADS Bricks grid (conditional) */}
        {mapLayers.bricks && <AdsGrid />}
      </MapContainer>

      {/* Region selector strip — bottom */}
      <div className="absolute bottom-3 left-3 z-[999] flex gap-1.5">
        {CROP_REGIONS.map(r => {
          const isSelected = selectedRegion === r.id
          return (
            <button
              key={r.id}
              onClick={() => onRegionSelect(r.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all duration-200"
              style={{
                background: isSelected ? `${r.color}18` : 'rgba(14,14,18,0.60)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${isSelected ? `${r.color}55` : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 4,
                color: isSelected ? r.color : 'rgba(255,255,255,0.6)',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                boxShadow: isSelected ? `0 0 14px ${r.color}20, 0 4px 12px rgba(0,0,0,0.35)` : '0 2px 8px rgba(0,0,0,0.30)',
              }}
            >
              <span style={{
                width: 5, height: 5, borderRadius: 1,
                background: isSelected ? r.color : 'rgba(255,255,255,0.35)',
                display: 'inline-block', flexShrink: 0,
              }} />
              {r.name}
            </button>
          )
        })}
        {selectedRegion && (
          <button
            onClick={() => onRegionSelect('')}
            className="flex items-center gap-1 px-2 py-1.5 transition-all"
            style={{
              background: 'rgba(14,14,18,0.55)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 4, color: 'rgba(255,255,255,0.35)',
              fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
            }}
          >
            ✕ ALL
          </button>
        )}
      </div>

      {selectedField && (
        <FieldDetailDrawer
          field={selectedField}
          onClose={() => onSelect(selectedField.id)}
        />
      )}
    </div>
  )
}
