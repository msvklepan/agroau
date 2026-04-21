import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { FIELDS } from '../data/fields'
import { SENSOR_DATA } from '../data/sensors'
import { Satellite, AlertTriangle, CheckCircle, Activity } from 'lucide-react'

const INDICES = [
  { key: 'ndvi',  label: 'NDVI',  desc: 'Vegetation', descRu: 'Растительность', good: [0.6, 1],   warn: [0.4, 0.6],  invertGood: false },
  { key: 'ndwi',  label: 'NDWI',  desc: 'Water',      descRu: 'Влажность',      good: [0.4, 1],   warn: [0.2, 0.4],  invertGood: false },
  { key: 'ec',    label: 'EC',    desc: 'Salinity',   descRu: 'Засоление',      good: [0, 2],     warn: [2, 3.5],    invertGood: true  },
  { key: 'ph',    label: 'pH',    desc: 'Acidity',    descRu: 'Кислотность',    good: [6.5, 7.5], warn: [7.5, 8.2],  invertGood: false },
]

const ADD_INDICES = ['savi', 'si2', 'bsi'] as const

function statusColor(val: number, idx: typeof INDICES[0]) {
  if (idx.invertGood) {
    if (val <= idx.good[1]) return '#34C759'
    if (val <= idx.warn[1]) return '#fbbf24'
    return '#FF3B30'
  }
  if (val >= idx.good[0]) return '#34C759'
  if (val >= idx.warn[0]) return '#fbbf24'
  return '#FF3B30'
}

const sep = { borderBottom: '0.5px solid rgba(60,60,67,0.08)' }

export function FieldAnalysisPage() {
  const { lang } = useLang()
  const isRu = lang === 'ru'
  const [activeIdx, setActiveIdx] = useState<string>('ndvi')

  const healthCount = SENSOR_DATA.filter(s => s.ndvi >= 0.6).length
  const warnCount   = SENSOR_DATA.filter(s => s.ndvi >= 0.4 && s.ndvi < 0.6).length
  const critCount   = SENSOR_DATA.filter(s => s.ndvi < 0.4 || s.ec > 3.5).length

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 6, flexShrink: 0,
          background: 'rgba(88,86,214,0.12)', border: '1px solid rgba(88,86,214,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Satellite size={14} style={{ color: '#5856D6' }} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {isRu ? 'Анализ полей' : 'Field Analysis'}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
            {isRu ? 'Цифровой двойник почвы · Sentinel-2' : 'Digital Soil Twin · Sentinel-2'}
          </div>
        </div>
      </div>

      {/* Summary KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { label: isRu ? 'Здоровые' : 'Healthy',  value: healthCount, color: '#34C759', Icon: CheckCircle  },
          { label: isRu ? 'Внимание' : 'Warning',  value: warnCount,   color: '#fbbf24', Icon: Activity     },
          { label: isRu ? 'Критично' : 'Critical', value: critCount,   color: '#FF3B30', Icon: AlertTriangle },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 5, flexShrink: 0,
              background: `${color}12`, border: `1px solid ${color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={14} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'SF Mono',monospace", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Index selector */}
      <div className="card" style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8 }}>
          {isRu ? 'Спектральный индекс' : 'Spectral Index'}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[...INDICES.map(i => ({ key: i.key, label: i.label })), ...ADD_INDICES.map(k => ({ key: k, label: k.toUpperCase() }))].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveIdx(key)} style={{
              padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700,
              background: activeIdx === key ? 'var(--text-primary)' : 'rgba(60,60,67,0.06)',
              color: activeIdx === key ? '#fff' : 'var(--text-hint)',
              border: 'none', cursor: 'pointer', letterSpacing: '0.04em',
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Per-field soil reports */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FIELDS.map(field => {
          const sensor = SENSOR_DATA.find(s => s.fieldId === field.id)
          if (!sensor) return null
          const statusCol = field.status === 'healthy' ? '#34C759' : field.status === 'warning' ? '#fbbf24' : '#FF3B30'
          return (
            <div key={field.id} className="card" style={{ overflow: 'hidden' }}>

              {/* Field header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', ...sep, background: `${field.color}08` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: field.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{field.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace", marginTop: 1 }}>{field.province}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
                  background: `${statusCol}12`, color: statusCol,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>{field.status}</span>
              </div>

              {/* Index grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                {INDICES.map((idx, i) => {
                  const raw = (sensor as unknown as Record<string, number>)[idx.key]
                  const color = statusColor(raw, idx)
                  const display = idx.key === 'ec' ? `${raw} mS` : `${raw}`
                  return (
                    <div key={idx.key} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 8px',
                      borderRight: i < 3 ? '0.5px solid rgba(60,60,67,0.08)' : 'none',
                    }}>
                      <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 4 }}>
                        {idx.label}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'SF Mono',monospace", lineHeight: 1 }}>{display}</div>
                      <div style={{ fontSize: 8, color: 'var(--text-hint)', marginTop: 3 }}>
                        {isRu ? idx.descRu : idx.desc}
                      </div>
                      <div style={{ width: '100%', height: 2, borderRadius: 1, background: `${color}18`, marginTop: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: color, borderRadius: 1, width: `${Math.min(raw * 100, 100)}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Extra index bar */}
              {ADD_INDICES.includes(activeIdx as typeof ADD_INDICES[number]) && (
                <div style={{ padding: '8px 14px', borderTop: '0.5px solid rgba(60,60,67,0.08)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(88,86,214,0.04)' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#5856D6', textTransform: 'uppercase', letterSpacing: '0.08em', width: 32 }}>{activeIdx.toUpperCase()}</span>
                  <div style={{ flex: 1, height: 4, background: 'rgba(60,60,67,0.08)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 1, background: '#5856D6',
                      width: `${Math.min(((sensor as unknown as Record<string,number>)[activeIdx] ?? 0) * 100, 100)}%`,
                      transition: 'width 0.4s',
                    }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#5856D6', fontFamily: "'SF Mono',monospace", width: 36, textAlign: 'right' }}>
                    {((sensor as unknown as Record<string,number>)[activeIdx] ?? 0).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Alert */}
              {(sensor.ec > 3.5 || sensor.ndvi < 0.4) && (
                <div style={{ padding: '8px 14px', background: 'rgba(255,59,48,0.06)', borderTop: '0.5px solid rgba(255,59,48,0.14)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={11} style={{ color: '#FF3B30', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#FF3B30', fontWeight: 600 }}>
                    {sensor.ec > 3.5
                      ? (isRu ? 'Требуется промывной полив. ЕС критический.' : 'Leaching irrigation required. EC critical.')
                      : (isRu ? 'Низкий NDVI — проверьте состояние культуры немедленно.' : 'Low NDVI — check crop health immediately.')}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
