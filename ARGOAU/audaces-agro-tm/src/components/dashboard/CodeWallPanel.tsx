import { useState } from 'react'
import { SENSOR_DATA } from '../../data/sensors'
import { FIELDS } from '../../data/fields'
import { useLang } from '../../contexts/LanguageContext'

const INDICES = ['ndvi', 'savi', 'ndwi', 'si2', 'bsi'] as const
type IndexKey = typeof INDICES[number]

const INDEX_META: Record<IndexKey, { label: string; invert: boolean; desc: string }> = {
  ndvi: { label: 'NDVI', invert: false, desc: 'Vegetation'    },
  savi: { label: 'SAVI', invert: false, desc: 'Soil-adj.'     },
  ndwi: { label: 'NDWI', invert: false, desc: 'Water'         },
  si2:  { label: 'SI-2', invert: true,  desc: 'Salinity'      },
  bsi:  { label: 'BSI',  invert: true,  desc: 'Bare soil'     },
}

function heatColor(val: number, invert: boolean) {
  const r = invert ? 1 - val : val
  if (r > 0.65) return { bar: '#34C759', text: '#34C759', bg: 'rgba(52,199,89,0.12)' }
  if (r > 0.40) return { bar: '#fbbf24', text: '#fbbf24', bg: 'rgba(251,191,36,0.10)' }
  return           { bar: '#FF3B30',  text: '#FF3B30',  bg: 'rgba(255,59,48,0.10)' }
}

const sep = { borderBottom: '0.5px solid rgba(60,60,67,0.07)' }

export function CodeWallPanel() {
  const { t } = useLang()
  const cw = t.codeWall
  const [activeIdx, setActiveIdx] = useState<IndexKey>('ndvi')

  const npkAvg = (['nitrogen','phosphorus','potassium'] as const).map(k => ({
    k, l: k[0].toUpperCase(),
    color: k === 'nitrogen' ? '#34C759' : k === 'phosphorus' ? '#6EC6FF' : '#5856D6',
    avg: Math.round(SENSOR_DATA.reduce((s,d) => s + (d as unknown as Record<string,number>)[k], 0) / SENSOR_DATA.length),
  }))

  return (
    <div className="card flex flex-col gap-0 overflow-hidden">

      {/* Header */}
      <div style={{ padding: '12px 14px', ...sep }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 5, background: 'rgba(88,86,214,0.10)',
            border: '1px solid rgba(88,86,214,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: 'linear-gradient(135deg,#5856D6,#5AC8FA)' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{cw.title}</div>
            <div style={{ fontSize: 9, color: 'var(--text-hint)', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'SF Mono',monospace" }}>{cw.sub}</div>
          </div>
        </div>
      </div>

      {/* Index selector */}
      <div style={{ padding: '8px 10px', ...sep }}>
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-surface)', borderRadius: 5, padding: '2px' }}>
          {INDICES.map(idx => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              style={{
                flex: 1, padding: '4px 2px', borderRadius: 3,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                background: activeIdx === idx ? 'rgba(255,255,255,0.88)' : 'transparent',
                color: activeIdx === idx ? 'var(--text-primary)' : 'var(--text-hint)',
                border: 'none', cursor: 'pointer',
                boxShadow: activeIdx === idx ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {INDEX_META[idx].label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap bars */}
      <div style={{ padding: '10px 14px', ...sep }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 7 }}>
          {INDEX_META[activeIdx].desc} · {cw.byField}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {SENSOR_DATA.map(sensor => {
            const field = FIELDS.find(f => f.id === sensor.fieldId)
            if (!field) return null
            const val = sensor[activeIdx]
            const { bar, text } = heatColor(val, INDEX_META[activeIdx].invert)
            const pct = Math.round(val * 100)
            return (
              <div key={sensor.fieldId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, width: 64, flexShrink: 0 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 1, background: field.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {field.name.split('·')[0].trim()}
                  </span>
                </div>
                <div style={{ flex: 1, height: 5, background: 'var(--bg-surface)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: bar, borderRadius: 1, transition: 'width 0.5s var(--expo)' }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, width: 30, textAlign: 'right', color: text, fontFamily: "'SF Mono',monospace" }}>
                  {val.toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
        {/* Gradient legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{ fontSize: 8, color: 'var(--text-hint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low</span>
          <div style={{
            flex: 1, height: 3, borderRadius: 1,
            background: INDEX_META[activeIdx].invert
              ? 'linear-gradient(90deg,#34C759,#fbbf24,#FF3B30)'
              : 'linear-gradient(90deg,#FF3B30,#fbbf24,#34C759)',
          }} />
          <span style={{ fontSize: 8, color: 'var(--text-hint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>High</span>
        </div>
      </div>

      {/* NPK */}
      <div style={{ padding: '10px 14px', ...sep }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 7 }}>{cw.npk}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5 }}>
          {npkAvg.map(n => (
            <div key={n.k} style={{
              background: 'var(--bg-surface)', borderRadius: 5,
              padding: '7px 6px', textAlign: 'center',
              border: `0.5px solid ${n.color}20`,
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: n.color, marginBottom: 3, letterSpacing: '0.06em' }}>{n.l}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: n.color, fontFamily: "'SF Mono',monospace", lineHeight: 1 }}>{n.avg}</div>
              <div style={{ fontSize: 8, color: 'var(--text-hint)', marginTop: 2, fontFamily: "'SF Mono',monospace" }}>mg/kg</div>
            </div>
          ))}
        </div>
      </div>

      {/* EC Salinity */}
      <div style={{ padding: '10px 14px' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 7 }}>{cw.salinity}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SENSOR_DATA.map(s => {
            const field = FIELDS.find(f => f.id === s.fieldId)
            if (!field) return null
            const pct = Math.min((s.ec / 4.5) * 100, 100)
            const danger = s.ec > 2.5
            return (
              <div key={s.fieldId} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 4, height: 4, borderRadius: 1, background: field.color, flexShrink: 0 }} />
                <div style={{ flex: 1, height: 4, background: 'var(--bg-surface)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: danger ? '#FF3B30' : '#5AC8FA', borderRadius: 1 }} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, width: 50, textAlign: 'right', color: danger ? '#FF3B30' : 'var(--text-secondary)', fontFamily: "'SF Mono',monospace" }}>
                  {s.ec} mS
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
