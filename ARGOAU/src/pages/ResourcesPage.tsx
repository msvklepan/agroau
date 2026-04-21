import { useLang } from '../contexts/LanguageContext'
import { Battery, Droplets, Cpu, Zap, Radio, AlertCircle } from 'lucide-react'

const MACHINERY = [
  { id: 'JA', name: 'Jetson A',  type: 'Laser Unit', typeRu: 'Лазерный модуль', field: 'Miwe-01',    battery: 88, status: 'active',   shots: 512 },
  { id: 'JB', name: 'Jetson B',  type: 'Laser Unit', typeRu: 'Лазерный модуль', field: 'Pagta-01',   battery: 72, status: 'active',   shots: 488 },
  { id: 'JC', name: 'Jetson C',  type: 'Laser Unit', typeRu: 'Лазерный модуль', field: 'Daşoguz-S1', battery: 95, status: 'standby',  shots: 247 },
  { id: 'D1', name: 'Drone-01',  type: 'UAV Scout',  typeRu: 'БПЛА-разведчик',  field: 'Miwe-02',    battery: 62, status: 'active',   shots: 0   },
  { id: 'D2', name: 'Drone-02',  type: 'UAV Scout',  typeRu: 'БПЛА-разведчик',  field: 'Pagta-02',   battery: 41, status: 'charging', shots: 0   },
  { id: 'S1', name: 'Sensor-01', type: 'IoT Node',   typeRu: 'IoT-датчик',      field: 'Kaka-A1',    battery: 77, status: 'active',   shots: 0   },
]

const WATER = [
  { label: 'Miwe Holding',  ru: 'Мивэ Холдинг',    used: 4800,  capacity: 8000,  color: '#6EC6FF', alert: false },
  { label: 'Türkmenpagta', ru: 'Türkmenpagta',     used: 9200,  capacity: 15000, color: '#FF8C42', alert: false },
  { label: 'Daşoguz Zone', ru: 'Дашогузская зона', used: 6800,  capacity: 7500,  color: '#EF4444', alert: true  },
]

const IRRIGATION_SCHEDULE = [
  { field: 'Miwe-01',    next: '06:00',  amount: '240 m³', type: 'Drip',    typeRu: 'Капельный' },
  { field: 'Pagta-01',   next: '14:30',  amount: '480 m³', type: 'Flood',   typeRu: 'Паводковый' },
  { field: 'Daşoguz-S1', next: '08:00',  amount: '680 m³', type: 'Leach',   typeRu: 'Промывной'  },
  { field: 'Kaka-A1',    next: '22:00',  amount: '120 m³', type: 'Night',   typeRu: 'Ночной'     },
]

const sep = { borderBottom: '0.5px solid rgba(60,60,67,0.08)' }

function batteryColor(b: number) {
  return b > 70 ? '#34C759' : b > 40 ? '#fbbf24' : '#FF3B30'
}

function statusProps(s: string) {
  if (s === 'active')   return { color: '#34C759', bg: 'rgba(52,199,89,0.10)',   label: 'Active',   labelRu: 'Активен'    }
  if (s === 'charging') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', label: 'Charging', labelRu: 'Зарядка'    }
  return                       { color: 'rgba(60,60,67,0.40)', bg: 'rgba(60,60,67,0.06)', label: 'Standby', labelRu: 'Резерв' }
}

export function ResourcesPage() {
  const { lang } = useLang()
  const isRu = lang === 'ru'

  const activeCount   = MACHINERY.filter(m => m.status === 'active').length
  const chargingCount = MACHINERY.filter(m => m.status === 'charging').length
  const standbyCount  = MACHINERY.filter(m => m.status === 'standby').length

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 6, flexShrink: 0,
          background: 'rgba(90,200,250,0.12)', border: '1px solid rgba(90,200,250,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Radio size={14} style={{ color: '#5AC8FA' }} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {isRu ? 'Ресурсы' : 'Resources'}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
            {isRu ? 'Техника · Вода · Полив' : 'Machinery · Water · Irrigation'}
          </div>
        </div>
      </div>

      {/* Fleet summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { label: isRu ? 'Активных' : 'Active',    value: activeCount,   color: '#34C759', Icon: Cpu     },
          { label: isRu ? 'Заряжается' : 'Charging', value: chargingCount, color: '#fbbf24', Icon: Battery },
          { label: isRu ? 'Резервов' : 'Standby',   value: standbyCount,  color: 'rgba(60,60,67,0.35)', Icon: Cpu },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 5, flexShrink: 0,
              background: typeof color === 'string' && color.startsWith('#') ? `${color}12` : 'rgba(60,60,67,0.06)',
              border: `1px solid ${typeof color === 'string' && color.startsWith('#') ? `${color}25` : 'rgba(60,60,67,0.10)'}`,
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

      {/* Machinery fleet */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
          {isRu ? 'Парк техники' : 'Machinery Fleet'}
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          {MACHINERY.map((m, i) => {
            const sp = statusProps(m.status)
            const bc = batteryColor(m.battery)
            const TypeIcon = m.type === 'Laser Unit' ? Zap : m.type === 'UAV Scout' ? Radio : Cpu
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', ...(i < MACHINERY.length - 1 ? sep : {}) }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 5, flexShrink: 0,
                  background: sp.bg, border: `1px solid ${sp.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TypeIcon size={13} style={{ color: sp.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</span>
                    <span style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace" }}>·{m.field}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-hint)' }}>{isRu ? m.typeRu : m.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Battery size={9} style={{ color: bc, flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 3, background: 'rgba(60,60,67,0.10)', borderRadius: 1, overflow: 'hidden' }}>
                      <div style={{ width: `${m.battery}%`, height: '100%', background: bc, borderRadius: 1, transition: 'width 0.4s' }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: bc, fontFamily: "'SF Mono',monospace", width: 28, textAlign: 'right' }}>{m.battery}%</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: sp.bg, color: sp.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {isRu ? sp.labelRu : sp.label}
                  </span>
                  {m.shots > 0 && (
                    <span style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace" }}>{m.shots} shots</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Two-column: Water + Irrigation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Water inventory */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
            {isRu ? 'Водные ресурсы (м³)' : 'Water Inventory (m³)'}
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {WATER.map((w, i) => {
              const pct = Math.round((w.used / w.capacity) * 100)
              return (
                <div key={w.label} style={{ padding: '12px 14px', ...(i < WATER.length - 1 ? sep : {}) }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Droplets size={11} style={{ color: w.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{isRu ? w.ru : w.label}</span>
                      {w.alert && <AlertCircle size={10} style={{ color: '#FF3B30' }} />}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: pct > 85 ? '#FF3B30' : 'var(--text-secondary)', fontFamily: "'SF Mono',monospace" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(60,60,67,0.10)', borderRadius: 1, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: w.color, borderRadius: 1 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace" }}>{w.used.toLocaleString()}</span>
                    <span style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace" }}>{w.capacity.toLocaleString()} m³</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Irrigation schedule */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
            {isRu ? 'График полива' : 'Irrigation Schedule'}
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {IRRIGATION_SCHEDULE.map((row, i) => (
              <div key={row.field} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', ...(i < IRRIGATION_SCHEDULE.length - 1 ? sep : {}) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 1, background: '#5AC8FA', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{row.field}</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#5AC8FA', fontFamily: "'SF Mono',monospace" }}>{row.next}</span>
                <span style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace" }}>{row.amount}</span>
                <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'rgba(90,200,250,0.10)', color: '#5AC8FA', letterSpacing: '0.04em' }}>
                  {isRu ? row.typeRu : row.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
