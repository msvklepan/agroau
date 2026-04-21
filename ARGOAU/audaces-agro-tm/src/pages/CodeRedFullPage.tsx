import { useEffect, useState, useRef } from 'react'
import { Zap, StopCircle, Radio, Thermometer, Activity, Shield, Cpu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../components/ui/Badge'
import { ThermalCanvas } from '../components/ui/ThermalCanvas'
import { useLang } from '../contexts/LanguageContext'

function useCounter(start: number, target: number, ms = 900) {
  const [n, setN] = useState(start)
  useEffect(() => {
    const id = setInterval(() => setN(p => p < target ? p + Math.floor(Math.random() * 5) + 1 : p), ms)
    return () => clearInterval(id)
  }, [target, ms])
  return n
}

const TARGETS = [
  { x: '14%', y: '28%', label: 'H. armigera', conf: 0.97, w: 82, h: 52 },
  { x: '52%', y: '48%', label: 'S. exigua',   conf: 0.91, w: 64, h: 44 },
  { x: '68%', y: '20%', label: 'H. armigera', conf: 0.88, w: 72, h: 48 },
]

const LOG_INIT = [
  { t: '14:23:01', f: 'TM-01', sp: 'H. armigera', n: 340 },
  { t: '14:19:44', f: 'TM-01', sp: 'S. exigua',   n: 87  },
  { t: '14:11:30', f: 'TM-02', sp: 'H. armigera', n: 215 },
  { t: '14:07:09', f: 'TM-03', sp: 'T. urticae',  n: 52  },
  { t: '14:03:22', f: 'TM-01', sp: 'A. gossypii', n: 128 },
  { t: '13:58:41', f: 'TM-02', sp: 'H. armigera', n: 309 },
]

const UNITS = [
  { id: 'A', name: 'Jetson A', field: 'TM-01', shots: 512, battery: 88, status: 'active'  },
  { id: 'B', name: 'Jetson B', field: 'TM-02', shots: 488, battery: 72, status: 'active'  },
  { id: 'C', name: 'Jetson C', field: 'TM-03', shots: 247, battery: 95, status: 'standby' },
]

const FIELDS = ['TM-01', 'TM-02', 'TM-03']
const SPECIES = ['H. armigera', 'S. exigua', 'T. urticae', 'A. gossypii']

export function CodeRedFullPage() {
  const { lang } = useLang()
  const isRu = lang === 'ru'
  const eliminated = useCounter(1247, 2100)
  const progress    = Math.round((eliminated / 2100) * 100)

  const [emergency, setEmergency] = useState(false)
  const [liveLog, setLiveLog]     = useState(LOG_INIT)
  const [blinkBox, setBlinkBox]   = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const id1 = setInterval(() => {
      const now = new Date()
      const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
      setLiveLog(p => [{ t, f: FIELDS[Math.floor(Math.random()*3)], sp: SPECIES[Math.floor(Math.random()*4)], n: Math.floor(Math.random()*300)+30 }, ...p.slice(0, 9)])
    }, 3800)
    timerRef.current = setInterval(() => setBlinkBox(b => (b + 1) % 3), 1600)
    return () => { clearInterval(id1); if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  return (
    <div style={{
      maxWidth: 1140, margin: '0 auto', padding: '0 24px',
      height: '100%', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, paddingTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 6, flexShrink: 0,
            background: 'linear-gradient(145deg,rgba(255,59,48,0.20),rgba(255,59,48,0.07))',
            border: '1px solid rgba(255,59,48,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255,59,48,0.18)',
          }}>
            <div className="laser-pulse" style={{
              width: 14, height: 14, borderRadius: 3,
              background: 'radial-gradient(circle at 38%,#FF9090,#FF3B30)',
            }} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {isRu ? 'Пульт Лазерного Контроля' : 'Laser Control Center'}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono','Consolas',monospace", letterSpacing: '0.05em', marginTop: 2 }}>
              CODE RED · NVIDIA JETSON FLEET · AHAL TM
            </div>
          </div>
        </div>
        <Badge variant="orange" lightning pulse>LIVE</Badge>
      </div>

      {/* ── Main 2-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* ── LEFT: Thermal feed + controls ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden', minHeight: 0 }}>

          {/* Thermal video feed */}
          <div style={{
            position: 'relative', borderRadius: 6, overflow: 'hidden', flex: 1, minHeight: 0,
            border: emergency ? '1px solid rgba(255,59,48,0.50)' : '1px solid rgba(0,255,100,0.15)',
            boxShadow: emergency
              ? '0 0 0 1px rgba(255,59,48,0.18), 0 12px 40px rgba(255,59,48,0.12)'
              : '0 0 0 0.5px rgba(0,255,80,0.05), 0 12px 36px rgba(0,0,0,0.28)',
          }}>
            <ThermalCanvas emergency={emergency} />

            {/* HUD: top-left */}
            <div className="absolute top-2.5 left-3 flex items-center gap-2 z-10">
              <Thermometer size={9} style={{ color: 'rgba(0,255,80,0.70)' }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(0,255,80,0.70)', fontFamily: "'SF Mono','Consolas',monospace" }}>
                IR·THERMAL · JT-A · FIELD TM-01
              </span>
            </div>

            {/* HUD: top-center */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10">
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(0,255,80,0.45)', fontFamily: "'SF Mono','Consolas',monospace" }}>
                YOLOv8-AGRO · 24 FPS
              </span>
            </div>

            {/* HUD: top-right */}
            <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
              <span className={emergency ? '' : 'dot-active'} style={{
                display: 'inline-block', width: 6, height: 6, borderRadius: 1,
                background: emergency ? '#FF3B30' : '#00FF50',
                boxShadow: emergency ? '0 0 7px #FF3B30' : '0 0 7px #00FF50',
              }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: emergency ? '#FF3B30' : '#00FF50', fontFamily: "'SF Mono','Consolas',monospace" }}>
                {emergency ? 'STOPPED' : 'REC'}
              </span>
            </div>

            {/* AI detection boxes */}
            {!emergency && TARGETS.map((tgt, i) => {
              const isActive = i === blinkBox
              const col = isActive ? '#FF3B30' : '#00E560'
              return (
                <div key={i} style={{
                  position: 'absolute', left: tgt.x, top: tgt.y,
                  width: tgt.w, height: tgt.h, zIndex: 8,
                  border: `1.5px solid ${col}`, borderRadius: 2,
                  boxShadow: isActive ? `0 0 16px rgba(255,59,48,0.55)` : `0 0 10px rgba(0,229,96,0.35)`,
                  transition: 'border-color 0.35s, box-shadow 0.35s',
                }}>
                  {(['tl','tr','bl','br'] as const).map(c => (
                    <div key={c} style={{
                      position: 'absolute', width: 8, height: 8,
                      ...(c[0]==='t' ? { top: -1 } : { bottom: -1 }),
                      ...(c[1]==='l' ? { left: -1 } : { right: -1 }),
                      borderTop:    c[0]==='t' ? `2px solid ${col}` : 'none',
                      borderBottom: c[0]==='b' ? `2px solid ${col}` : 'none',
                      borderLeft:   c[1]==='l' ? `2px solid ${col}` : 'none',
                      borderRight:  c[1]==='r' ? `2px solid ${col}` : 'none',
                    }} />
                  ))}
                  <div style={{
                    position: 'absolute', top: -18, left: 0,
                    background: isActive ? 'rgba(255,59,48,0.90)' : 'rgba(0,160,60,0.86)',
                    borderRadius: 2, padding: '2px 6px',
                    fontSize: 8, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap',
                    fontFamily: "'SF Mono','Consolas',monospace",
                  }}>
                    {tgt.label} {Math.round(tgt.conf * 100)}%
                  </div>
                </div>
              )
            })}

            {/* Emergency overlay */}
            <AnimatePresence>
              {emergency && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                  style={{ background: 'rgba(255,0,0,0.06)' }}>
                  <div className="text-center">
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#FF3B30', fontFamily: "'SF Mono','Consolas',monospace", letterSpacing: '0.14em' }}>
                      ■ EMERGENCY STOP
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,59,48,0.6)', fontFamily: "'SF Mono','Consolas',monospace", marginTop: 4, letterSpacing: '0.08em' }}>
                      {isRu ? 'ВСЕ ЛАЗЕРЫ ДЕАКТИВИРОВАНЫ' : 'ALL LASERS DEACTIVATED'}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom status bar */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 12px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', zIndex: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Radio size={8} style={{ color: emergency ? '#FF3B30' : '#00FF50' }} />
                <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.06em', color: emergency ? 'rgba(255,59,48,0.7)' : 'rgba(0,255,80,0.65)', fontFamily: "'SF Mono','Consolas',monospace" }}>
                  {emergency ? 'STREAM PAUSED' : 'STREAM ACTIVE · THERMAL MODE'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', fontFamily: "'SF Mono','Consolas',monospace" }}>
                  {eliminated.toLocaleString()} ELIM
                </span>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', fontFamily: "'SF Mono','Consolas',monospace" }}>
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Emergency stop + progress row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flexShrink: 0 }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setEmergency(e => !e)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                borderRadius: 6, padding: '10px 16px',
                background: emergency ? 'rgba(52,199,89,0.08)' : 'rgba(255,59,48,0.08)',
                border: `1px solid ${emergency ? 'rgba(52,199,89,0.30)' : 'rgba(255,59,48,0.30)'}`,
                color: emergency ? '#34C759' : '#FF3B30',
                fontSize: 11, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.04em',
                boxShadow: emergency ? '0 0 20px rgba(52,199,89,0.10)' : '0 0 20px rgba(255,59,48,0.10)',
              }}
            >
              <StopCircle size={14} />
              {emergency
                ? (isRu ? 'ВОЗОБНОВИТЬ' : 'RESUME OPS')
                : (isRu ? '⚠ АВАРИЙНАЯ ОСТАНОВКА' : '⚠ EMERGENCY STOP')}
            </motion.button>

            {/* Mission progress */}
            <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {isRu ? 'Прогресс' : 'Mission Progress'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-orange)', fontFamily: "'SF Mono','Consolas',monospace" }}>
                  {progress}%
                </span>
              </div>
              <div style={{ height: 5, background: 'var(--bg-surface)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(90deg,#FF8C42,#ffb347)', borderRadius: 2 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 8, color: 'var(--text-hint)', fontFamily: "'SF Mono','Consolas',monospace" }}>0</span>
                <span style={{ fontSize: 8, color: 'var(--text-hint)', fontFamily: "'SF Mono','Consolas',monospace" }}>2,100 est.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Stats + units ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden', minHeight: 0 }}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, flexShrink: 0 }}>
            {[
              { label: isRu ? 'УНИЧТОЖЕНО' : 'ELIMINATED', value: eliminated.toLocaleString(), color: '#FF3B30', Icon: Activity },
              { label: isRu ? 'ТОЧНОСТЬ'   : 'ACCURACY',   value: '98.3%',                     color: '#34C759', Icon: Shield  },
              { label: isRu ? 'ПРОГРЕСС'   : 'PROGRESS',   value: `${progress}%`,              color: 'var(--accent-orange)', Icon: Zap },
            ].map(({ label, value, color, Icon }) => (
              <div key={label} className="card" style={{ padding: '10px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span className="meta-label" style={{ fontSize: 8 }}>{label}</span>
                  <Icon size={10} style={{ color, opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color, fontFeatureSettings: "'tnum'", fontFamily: "'SF Mono','Consolas',monospace" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Jetson units */}
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', flexShrink: 0 }}>
            <Cpu size={9} style={{ display: 'inline', marginRight: 5 }} />
            {isRu ? 'ЛАЗЕРНЫЕ МОДУЛИ' : 'LASER UNITS'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden', flex: 1 }}>
            {UNITS.map(u => (
              <motion.div key={u.id} className="card" style={{ padding: '11px 14px', flexShrink: 0 }} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 500, damping: 35 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{
                      display: 'inline-block', width: 6, height: 6, borderRadius: 1, flexShrink: 0,
                      background: u.status === 'active' ? '#34C759' : '#fbbf24',
                      boxShadow: u.status === 'active' ? '0 0 7px rgba(52,199,89,0.7)' : '0 0 7px rgba(251,191,36,0.6)',
                      ...(u.status === 'active' ? { animation: 'dot-ping 2s ease-in-out infinite' } : {}),
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {u.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, fontFamily: "'SF Mono','Consolas',monospace", color: 'var(--text-hint)' }}>
                      {u.field}
                    </span>
                    <span style={{
                      fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 2,
                      background: u.status === 'active' ? 'rgba(52,199,89,0.10)' : 'rgba(251,191,36,0.10)',
                      color: u.status === 'active' ? '#34C759' : '#fbbf24',
                      border: u.status === 'active' ? '0.5px solid rgba(52,199,89,0.25)' : '0.5px solid rgba(251,191,36,0.25)',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                      {u.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 7 }}>
                  {[
                    { label: isRu ? 'Выстрелов' : 'Shots',   value: u.shots.toLocaleString(), color: 'var(--accent-orange)' },
                    { label: isRu ? 'Заряд'     : 'Battery', value: `${u.battery}%`, color: u.battery > 80 ? '#34C759' : u.battery > 50 ? '#fbbf24' : '#FF3B30' },
                  ].map(m => (
                    <div key={m.label} style={{ background: 'var(--bg-surface)', borderRadius: 4, padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: m.color, fontFamily: "'SF Mono','Consolas',monospace" }}>{m.value}</div>
                      <div className="meta-label" style={{ fontSize: 8, marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 3, background: 'var(--bg-surface)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{
                    width: `${u.battery}%`, height: '100%', borderRadius: 1,
                    background: u.battery > 80 ? '#34C759' : u.battery > 50 ? '#fbbf24' : '#FF3B30',
                  }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Safety status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 5,
            background: 'rgba(52,199,89,0.06)', border: '1px solid rgba(52,199,89,0.18)', flexShrink: 0,
          }}>
            <Shield size={11} style={{ color: '#34C759', flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#1a7a00' }}>
              {isRu ? 'Зоны чисты · Крупные животные не обнаружены' : 'All zones clear · No large mammals detected'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Event log — full width ── */}
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6 }}>
          {isRu ? 'ЖУРНАЛ СОБЫТИЙ' : 'EVENT LOG'}
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)' }}>
            <AnimatePresence initial={false}>
              {liveLog.slice(0, 6).map((e, i) => (
                <motion.div
                  key={e.t + e.sp}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 14px',
                    borderTop: i >= 2 ? '0.5px solid var(--border)' : 'none',
                    borderRight: i % 2 === 0 ? '0.5px solid var(--border)' : 'none',
                    fontFamily: "'SF Mono','Consolas',monospace",
                  }}
                >
                  <span style={{ fontSize: 10, color: 'var(--text-hint)', minWidth: 52, flexShrink: 0 }}>{e.t}</span>
                  <span style={{ fontSize: 10, color: 'var(--accent-orange)', fontWeight: 700, minWidth: 38, flexShrink: 0 }}>{e.f}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{e.sp}</span>
                  <span style={{ fontSize: 10, color: '#FF3B30', fontWeight: 800, flexShrink: 0 }}>−{e.n}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
