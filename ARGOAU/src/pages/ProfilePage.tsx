import { useLang } from '../contexts/LanguageContext'
import { Shield, Cpu, Zap, Radio, CheckCircle } from 'lucide-react'

const METRICS = [
  { label: 'FIELDS MANAGED',  labelRu: 'ПОЛЯ',          value: '7',         mono: false },
  { label: 'TOTAL AREA',      labelRu: 'ПЛОЩАДЬ',       value: '3,100 ha',  mono: true  },
  { label: 'ACTIVE SEASON',   labelRu: 'СЕЗОН',         value: '2025',      mono: false },
  { label: 'AI COVERAGE',     labelRu: 'ПОКРЫТИЕ ИИ',   value: '94%',       mono: true  },
  { label: 'PLATFORM UPTIME', labelRu: 'АПТАЙМ',        value: '99.7%',     mono: true  },
  { label: 'ALERTS RESOLVED', labelRu: 'ТРЕВОГ РЕШЕНО', value: '28 / 31',   mono: true  },
]

const OPS_LOG = [
  { label: 'Laser sessions',    labelRu: 'Сессий лазера',    value: 142, delta: '+12', max: 200, icon: Zap,         color: '#FF8C42' },
  { label: 'AI analyses',       labelRu: 'Анализов ИИ',      value: 891, delta: '+104', max: 1000, icon: Cpu,       color: '#5856D6' },
  { label: 'Sentinel scans',    labelRu: 'Сканирований',     value: 64,  delta: '+8',  max: 100, icon: Radio,       color: '#5AC8FA' },
  { label: 'Alerts resolved',   labelRu: 'Тревог решено',    value: 28,  delta: '+5',  max: 40,  icon: CheckCircle, color: '#34C759' },
]

const CROPS = [
  { label: 'Cotton',  labelRu: 'Хлопок',   color: '#FF8C42', status: 'ACTIVE',  area: '1,610 ha' },
  { label: 'Almond',  labelRu: 'Миндаль',  color: '#C5FF4A', status: 'ACTIVE',  area: '405 ha'   },
  { label: 'Melon',   labelRu: 'Дыня',     color: '#6EC6FF', status: 'MONITOR', area: '185 ha'   },
  { label: 'Wheat',   labelRu: 'Пшеница',  color: '#FBBF24', status: 'ACTIVE',  area: '900 ha'   },
]

const sep = { borderBottom: '1px solid rgba(60,60,67,0.07)' }
const sepDark = { borderBottom: '1px solid rgba(255,255,255,0.07)' }

export function ProfilePage() {
  const { lang } = useLang()
  const isRu = lang === 'ru'

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowY: 'auto', scrollbarWidth: 'none', flex: 1, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Operator identity card (dark) ── */}
        <div style={{
          background: 'linear-gradient(140deg,#1C1C1E 0%,#252528 60%,#1C1C1E 100%)',
          borderRadius: 6, overflow: 'hidden', position: 'relative',
          boxShadow: '0 12px 48px rgba(0,0,0,0.28), 0 0 0 0.5px rgba(255,255,255,0.06)',
        }}>
          {/* Accent glow */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: '#C5FF4A', opacity: 0.04, filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 40, width: 100, height: 100, borderRadius: '50%', background: '#5856D6', opacity: 0.06, filter: 'blur(40px)' }} />

          {/* Top strip: identity */}
          <div style={{ padding: '18px 20px 16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {/* Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: 6, flexShrink: 0,
              background: 'linear-gradient(145deg,#C5FF4A 0%,#6EC6FF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: '#1a3a00',
              boxShadow: '0 4px 16px rgba(197,255,74,0.25)',
            }}>
              MS
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  Maxim Svklepan
                </div>
                <div style={{
                  fontSize: 8, fontWeight: 800, padding: '2px 7px',
                  background: 'rgba(197,255,74,0.12)', border: '1px solid rgba(197,255,74,0.30)',
                  borderRadius: 3, color: '#C5FF4A', letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  CLEARANCE L4
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)', marginTop: 3, letterSpacing: '0.01em' }}>
                {isRu ? 'Главный агроном · ARGOAU TM · Юг' : 'Lead Agronomist · ARGOAU TM · South Region'}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="status-blink" style={{ display: 'inline-block', width: 5, height: 5, borderRadius: 1, background: '#34C759', flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#34C759', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {isRu ? 'ОНЛАЙН' : 'ONLINE'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Shield size={9} style={{ color: 'rgba(255,255,255,0.30)' }} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.04em' }}>
                    PRO PLAN · m.svklepan2020@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System metrics grid */}
          <div style={{ ...sepDark, borderTop: '1px solid rgba(255,255,255,0.06)' }} />
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            padding: '2px 0 4px',
          }}>
            {METRICS.map((m, i) => (
              <div key={m.label} style={{
                padding: '12px 16px',
                borderRight: i % 3 < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>
                  {isRu ? m.labelRu : m.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', letterSpacing: m.mono ? '-0.02em' : '-0.01em', fontFamily: m.mono ? "'SF Mono','Consolas',monospace" : '-apple-system,sans-serif', fontFeatureSettings: "'tnum'" }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Operational log ── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px 10px', ...sep }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              {isRu ? 'Операционная статистика' : 'Operational Statistics'} · Season 2025
            </div>
          </div>
          {OPS_LOG.map((op, i) => {
            const pct = Math.round((op.value / op.max) * 100)
            return (
              <div key={op.label} style={{ padding: '12px 16px', ...(i < OPS_LOG.length - 1 ? sep : {}) }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <op.icon size={11} style={{ color: op.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {isRu ? op.labelRu : op.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#34C759', fontFamily: "'SF Mono','Consolas',monospace", marginRight: 8 }}>
                      {op.delta}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: op.color, fontFeatureSettings: "'tnum'", fontFamily: "'SF Mono','Consolas',monospace" }}>
                      {op.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 3, background: 'var(--bg-surface)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: 1,
                      background: op.color,
                      transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
                    }} />
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono','Consolas',monospace", fontWeight: 600, flexShrink: 0 }}>
                    {pct}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Managed domains ── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px 10px', ...sep }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              {isRu ? 'Управляемые культуры' : 'Managed Crop Domains'}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {CROPS.map((c, i) => (
              <div key={c.label} style={{
                padding: '11px 16px',
                borderRight:  i % 2 === 0 ? '0.5px solid var(--border)' : 'none',
                borderBottom: i < 2 ? '0.5px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: 1, flexShrink: 0,
                    background: c.color, boxShadow: `0 0 8px ${c.color}55`,
                  }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {isRu ? c.labelRu : c.label}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono','Consolas',monospace", marginTop: 1 }}>
                      {c.area}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 3,
                  background: `${c.color}14`, color: c.color,
                  border: `0.5px solid ${c.color}30`,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── System access info ── */}
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>
            {isRu ? 'Системный доступ' : 'System Access'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              { key: isRu ? 'ВЕРСИЯ ПЛАТФОРМЫ'  : 'PLATFORM VERSION',  value: 'ARGOAU v2.4.1',       color: '#C5FF4A'  },
              { key: isRu ? 'МОДЕЛЬ ИИ'         : 'AI MODEL',          value: 'YOLOv8-AGRO-TM',      color: '#5856D6'  },
              { key: isRu ? 'СТАТУС ЛИЦЕНЗИИ'   : 'LICENSE STATUS',    value: 'Pro · Valid to 2026', color: '#34C759'  },
              { key: isRu ? 'ПОСЛЕДНИЙ ВХОД'    : 'LAST SESSION',      value: new Date().toLocaleDateString('en-GB') + ' · 09:14 GST', color: '#6EC6FF' },
            ].map(row => (
              <div key={row.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.key}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: row.color, fontFamily: "'SF Mono','Consolas',monospace" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
