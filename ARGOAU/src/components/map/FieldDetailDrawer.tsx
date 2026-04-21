import { X, TrendingUp, Droplets, Thermometer, Zap } from 'lucide-react'
import type { Field } from '../../data/fields'
import { SENSOR_DATA } from '../../data/sensors'
import { Badge } from '../ui/Badge'

interface Props {
  field: Field
  onClose: () => void
}

const INDICES = [
  { key: 'ndvi',  label: 'NDVI',  good: (v: number) => v > 0.6 },
  { key: 'savi',  label: 'SAVI',  good: (v: number) => v > 0.5 },
  { key: 'ndwi',  label: 'NDWI',  good: (v: number) => v > 0.4 },
  { key: 'si2',   label: 'SI-2',  good: (v: number) => v < 0.4 },
  { key: 'bsi',   label: 'BSI',   good: (v: number) => v < 0.35 },
] as const

export function FieldDetailDrawer({ field, onClose }: Props) {
  const sensor = SENSOR_DATA.find(s => s.fieldId === field.id)

  return (
    <div
      className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-3 rounded-[20px] overflow-hidden"
      style={{
        width: 260,
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
        border: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: field.status === 'critical'
            ? 'linear-gradient(135deg, #FFF0E8, #FFE0CC)'
            : field.status === 'warning'
            ? 'linear-gradient(135deg, #EEF9FF, #D8F0FF)'
            : 'linear-gradient(135deg, #EDFFF0, #D4FFD9)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[28px]">{field.cropEmoji}</span>
          <div>
            <div className="text-[14px] font-700 text-[var(--text-primary)]">{field.name}</div>
            <div className="text-[12px] text-[var(--text-secondary)]">{field.crop} · {field.area} ha</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {field.status === 'critical' && (
            <Badge variant="orange" className="pest-pulse">⚠️ Alert</Badge>
          )}
          {field.status === 'healthy' && <Badge variant="lime">Healthy</Badge>}
          {field.status === 'warning' && <Badge variant="blue">Monitor</Badge>}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {/* Quick metrics */}
        {sensor && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: TrendingUp,   label: 'NDVI',    value: sensor.ndvi.toFixed(2),     color: sensor.ndvi > 0.6 ? '#16a34a' : '#ea580c' },
              { icon: Droplets,     label: 'Moisture', value: `${field.moisture}%`,       color: '#0284c7' },
              { icon: Thermometer,  label: 'Temp',     value: `${sensor.temperature}°C`, color: '#dc2626' },
              { icon: Zap,          label: 'EC (salt)',value: `${sensor.ec} mS`,          color: sensor.ec > 2 ? '#ea580c' : '#16a34a' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="rounded-[12px] p-2.5"
                style={{ background: 'var(--bg-surface)' }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Icon size={10} style={{ color }} />
                  <span className="meta-label" style={{ fontSize: 10 }}>{label}</span>
                </div>
                <span className="text-[14px] font-700" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Spectral bars */}
        {sensor && (
          <div className="flex flex-col gap-1.5">
            <div className="meta-label mb-0.5">Spectral Indices</div>
            {INDICES.map(({ key, label, good }) => {
              const val = sensor[key as keyof typeof sensor] as number
              const ok = good(val)
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[11px] font-600 text-[var(--text-hint)] w-8">{label}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${val * 100}%`,
                        background: ok ? '#4ade80' : val < 0.5 ? '#fbbf24' : '#ef4444',
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-600 w-8 text-right" style={{ color: ok ? '#16a34a' : '#ea580c' }}>
                    {val.toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* NPK pill row */}
        {sensor && (
          <div className="flex gap-1.5">
            {[
              { l: 'N', v: sensor.nitrogen,   color: '#16a34a' },
              { l: 'P', v: sensor.phosphorus, color: '#0284c7' },
              { l: 'K', v: sensor.potassium,  color: '#7c3aed' },
            ].map(({ l, v, color }) => (
              <div
                key={l}
                className="flex-1 rounded-[10px] p-2 text-center"
                style={{ background: color + '14' }}
              >
                <div className="text-[10px] font-600" style={{ color }}>{l}</div>
                <div className="text-[13px] font-800" style={{ color }}>{v}</div>
                <div className="text-[9px]" style={{ color: 'var(--text-hint)' }}>mg/kg</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
