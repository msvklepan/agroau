import { Polygon, Tooltip } from 'react-leaflet'
import type { Field } from '../../data/fields'

type Layer = 'ndvi' | 'brix' | 'salinity'

interface Props {
  fields:     Field[]
  selectedId: string | null
  activeLayer: Layer
  onSelect:   (id: string) => void
}

function layerColor(field: Field, layer: Layer): string {
  if (layer === 'ndvi') {
    if (field.ndvi > 0.65) return '#34C759'
    if (field.ndvi > 0.45) return '#fbbf24'
    return '#FF3B30'
  }
  if (layer === 'brix') {
    return field.status === 'critical' ? '#a855f7' : field.status === 'warning' ? '#7c3aed' : '#6EC6FF'
  }
  return field.status === 'critical' ? '#f97316' : '#22d3ee'
}

function statusConfig(status: string) {
  if (status === 'critical') return { color: '#FF3B30', label: 'ALERT', glow: 'rgba(255,59,48,0.55)' }
  if (status === 'warning')  return { color: '#fbbf24', label: 'WATCH', glow: 'rgba(251,191,36,0.55)' }
  return                            { color: '#34C759', label: 'OK',    glow: 'rgba(52,199,89,0.50)' }
}

/* Convert polygon bounding box → strict parallelogram (skewed right) */
function toParallelogram(pts: [number, number][]): [number, number][] {
  let minA = Infinity, maxA = -Infinity, minB = Infinity, maxB = -Infinity
  for (const [a, b] of pts) {
    if (a < minA) minA = a
    if (a > maxA) maxA = a
    if (b < minB) minB = b
    if (b > maxB) maxB = b
  }
  const skew = (maxA - minA) * 0.18
  return [
    [minA,         maxB + skew],  // top-left
    [maxA + skew,  maxB        ],  // top-right
    [maxA,         minB        ],  // bottom-right
    [minA - skew,  minB        ],  // bottom-left
  ]
}

export function FieldOverlay({ fields, selectedId, activeLayer, onSelect }: Props) {
  return (
    <>
      {fields.map(field => {
        const color      = layerColor(field, activeLayer)
        const isSelected = field.id === selectedId
        const st         = statusConfig(field.status)
        const parallelogram = toParallelogram(field.polygon as [number, number][])

        return (
          <Polygon
            key={field.id}
            positions={parallelogram}
            pathOptions={{
              color:       color,
              fillColor:   color,
              fillOpacity: isSelected ? 0.45 : 0.22,
              weight:      isSelected ? 2.5 : 1.5,
              opacity:     isSelected ? 1.0 : 0.7,
              dashArray:   isSelected ? undefined : '6 4',
            }}
            eventHandlers={{ click: () => onSelect(field.id) }}
          >
            {/* Corner tick marks for parallelogram corners */}
            <Tooltip permanent direction="center" className="field-tooltip" offset={[0, 0]}>
              {/* Parallelogram label — CSS clip-path */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'rgba(14,14,18,0.72)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: `1px solid ${color}55`,
                  padding: '4px 12px',
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: `0 4px 16px rgba(0,0,0,0.35), 0 0 0 1px ${st.glow}`,
                }}
              >
                <span style={{
                  width: 5, height: 5, borderRadius: 1,
                  background: st.color,
                  boxShadow: `0 0 6px ${st.glow}`,
                  flexShrink: 0,
                  display: 'inline-block',
                }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#FFFFFF',
                  letterSpacing: '-0.01em', fontFamily: '-apple-system, sans-serif',
                }}>
                  {field.name}
                </span>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.45)', fontFamily: "'SF Mono','Consolas',monospace" }}>
                  {field.ndvi.toFixed(2)}
                </span>
                {field.status !== 'healthy' && (
                  <span style={{
                    fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 2,
                    background: `${st.color}22`, color: st.color,
                    letterSpacing: '0.06em', textTransform: 'uppercase', border: `0.5px solid ${st.color}40`,
                  }}>
                    {st.label}
                  </span>
                )}
              </div>
            </Tooltip>
          </Polygon>
        )
      })}
    </>
  )
}
