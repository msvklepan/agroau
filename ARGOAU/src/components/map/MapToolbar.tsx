import { useState } from 'react'
import { Search, AlertTriangle, Layers, X } from 'lucide-react'
import { useLang } from '../../contexts/LanguageContext'

type DataLayer = 'ndvi' | 'brix' | 'salinity'
type BaseMap   = 'satellite' | 'dark' | 'terrain'

export interface MapLayerState {
  base:     BaseMap
  fields:   boolean
  devices:  boolean
  bricks:   boolean
}

const LAYER_COLORS: Record<DataLayer, string> = {
  ndvi:     '#34C759',
  brix:     '#6EC6FF',
  salinity: '#FF8C42',
}

interface Props {
  activeLayer:   DataLayer
  onLayerChange: (l: DataLayer) => void
  mapLayers:     MapLayerState
  onMapLayers:   (l: MapLayerState) => void
  alertCount?:   number
}

const glass = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'saturate(200%) blur(32px)',
  WebkitBackdropFilter: 'saturate(200%) blur(32px)',
  border: '1px solid rgba(255,255,255,0.55)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)',
}

const glassDark = {
  background: 'rgba(14,14,18,0.62)',
  backdropFilter: 'blur(32px) saturate(160%)',
  WebkitBackdropFilter: 'blur(32px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.14)',
  boxShadow: '0 8px 36px rgba(0,0,0,0.45)',
}

function ToggleRow({ label, on, onToggle, color }: { label: string; on: boolean; onToggle: () => void; color: string }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-3 py-2 transition-colors"
      style={{
        background: on ? `${color}12` : 'transparent',
        borderRadius: 4,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: on ? '#fff' : 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div style={{
        width: 28, height: 16, borderRadius: 8,
        background: on ? color : 'rgba(255,255,255,0.15)',
        position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 12 : 2, width: 12, height: 12,
          borderRadius: 6, background: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
    </button>
  )
}

export function MapToolbar({ activeLayer, onLayerChange, mapLayers, onMapLayers, alertCount = 0 }: Props) {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const dataLayers: { id: DataLayer; label: string }[] = [
    { id: 'ndvi',     label: t.layers.ndvi     },
    { id: 'brix',     label: t.layers.brix     },
    { id: 'salinity', label: t.layers.salinity },
  ]

  const baseMaps: { id: BaseMap; label: string }[] = [
    { id: 'satellite', label: 'SATELLITE' },
    { id: 'dark',      label: 'DARK'      },
    { id: 'terrain',   label: 'TERRAIN'   },
  ]

  return (
    <>
      {/* ── Top toolbar bar ── */}
      <div className="absolute top-3 left-3 right-3 z-[999] flex items-center gap-2 pointer-events-none">

        {/* Layers toggle button */}
        <button
          className="pointer-events-auto flex items-center gap-1.5 px-2.5 h-[30px] transition-all"
          style={{
            ...(open ? glassDark : glass),
            borderRadius: 5,
          }}
          onClick={() => setOpen(o => !o)}
        >
          <Layers size={11} style={{ color: open ? '#C5FF4A' : 'var(--text-secondary)' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: open ? '#C5FF4A' : 'var(--text-secondary)' }}>
            Layers
          </span>
        </button>

        {/* Data layer pills */}
        <div className="flex items-center gap-0.5 pointer-events-auto"
          style={{ ...glass, borderRadius: 5, padding: '3px' }}>
          {dataLayers.map(l => {
            const active = activeLayer === l.id
            return (
              <button
                key={l.id}
                onClick={() => onLayerChange(l.id)}
                className="transition-all duration-150"
                style={{
                  padding: '3px 10px',
                  borderRadius: 3,
                  fontSize: 10, fontWeight: active ? 700 : 500,
                  cursor: 'pointer', border: 'none',
                  background: active ? LAYER_COLORS[l.id] : 'transparent',
                  color: active
                    ? (l.id === 'ndvi' ? '#0a3d00' : l.id === 'brix' ? '#003A6B' : '#fff')
                    : 'var(--text-hint)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}
              >
                {l.label}
              </button>
            )
          })}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-2 px-2.5 pointer-events-auto"
          style={{ ...glass, borderRadius: 5, height: 30 }}>
          <Search size={10} style={{ color: 'var(--text-hint)', flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.map.search}
            className="text-[11px] outline-none bg-transparent w-20 text-[var(--text-primary)] placeholder:text-[var(--text-hint)] mono"
          />
        </div>

        {/* Alert badge */}
        {alertCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 pointer-events-auto pest-pulse"
            style={{
              ...glass,
              background: 'rgba(255,59,48,0.10)',
              border: '1px solid rgba(255,59,48,0.28)',
              borderRadius: 5, height: 30,
            }}>
            <AlertTriangle size={10} style={{ color: '#FF3B30' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#FF3B30', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {alertCount} {t.map.alerts}
            </span>
          </div>
        )}
      </div>

      {/* ── Layer control panel ── */}
      {open && (
        <div
          className="absolute top-[52px] left-3 z-[998] w-[220px] pointer-events-auto"
          style={{ ...glassDark, borderRadius: 6, overflow: 'hidden' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Map Layers
            </span>
            <button onClick={() => setOpen(false)}>
              <X size={11} style={{ color: 'rgba(255,255,255,0.35)' }} />
            </button>
          </div>

          {/* Base map */}
          <div className="px-3 pt-3 pb-2">
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Base Map
            </div>
            <div className="flex gap-1">
              {baseMaps.map(bm => (
                <button
                  key={bm.id}
                  onClick={() => onMapLayers({ ...mapLayers, base: bm.id })}
                  className="flex-1 py-1.5 transition-all"
                  style={{
                    borderRadius: 4,
                    fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.04em',
                    background: mapLayers.base === bm.id ? '#C5FF4A' : 'rgba(255,255,255,0.06)',
                    color: mapLayers.base === bm.id ? '#1a3a00' : 'rgba(255,255,255,0.45)',
                    border: mapLayers.base === bm.id ? '1px solid #C5FF4A' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {bm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overlay toggles */}
          <div className="px-2 pt-1 pb-3">
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, paddingLeft: 4 }}>
              Overlays
            </div>
            <ToggleRow label="Fields / NDVI"   on={mapLayers.fields}  onToggle={() => onMapLayers({ ...mapLayers, fields: !mapLayers.fields })}   color="#34C759" />
            <ToggleRow label="Devices"          on={mapLayers.devices} onToggle={() => onMapLayers({ ...mapLayers, devices: !mapLayers.devices })} color="#6EC6FF" />
            <ToggleRow label="ADS Bricks"       on={mapLayers.bricks}  onToggle={() => onMapLayers({ ...mapLayers, bricks: !mapLayers.bricks })}   color="#FF8C42" />
          </div>
        </div>
      )}
    </>
  )
}
