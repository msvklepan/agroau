import { useEffect, useState } from 'react'
import { Badge } from '../ui/Badge'
import { Shield, Activity, Zap } from 'lucide-react'
import { useLang } from '../../contexts/LanguageContext'

const LASER_MODULES = [
  { id: 'A', name: 'Jetson A', field: 'TM-01', status: 'active',  shots: 512, battery: 88 },
  { id: 'B', name: 'Jetson B', field: 'TM-02', status: 'active',  shots: 488, battery: 72 },
  { id: 'C', name: 'Jetson C', field: 'TM-03', status: 'standby', shots: 247, battery: 95 },
]

const INITIAL_LOG = [
  { time: '14:23:01', field: 'TM-01', species: 'H. armigera',  count: 340 },
  { time: '14:19:44', field: 'TM-01', species: 'S. exigua',    count: 87  },
  { time: '14:11:30', field: 'TM-02', species: 'H. armigera',  count: 215 },
  { time: '14:07:09', field: 'TM-03', species: 'T. urticae',   count: 52  },
]

function useCounter(start: number, target: number, ms = 1400) {
  const [n, setN] = useState(start)
  useEffect(() => {
    const id = setInterval(() => setN(p => p < target ? p + Math.floor(Math.random() * 3) + 1 : p), ms)
    return () => clearInterval(id)
  }, [target, ms])
  return n
}

function useLiveLog() {
  const [log, setLog] = useState(INITIAL_LOG)
  useEffect(() => {
    const FIELDS  = ['TM-01','TM-02','TM-03']
    const SPECIES = ['H. armigera','S. exigua','T. urticae','A. gossypii']
    const id = setInterval(() => {
      const now = new Date()
      setLog(p => [{
        time:    `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`,
        field:   FIELDS[Math.floor(Math.random() * FIELDS.length)],
        species: SPECIES[Math.floor(Math.random() * SPECIES.length)],
        count:   Math.floor(Math.random() * 300) + 30,
      }, ...p.slice(0, 5)])
    }, 4200)
    return () => clearInterval(id)
  }, [])
  return log
}

const sep = { borderBottom: '0.5px solid rgba(255,255,255,0.10)' }

export function CodeRedPanel() {
  const { t } = useLang()
  const cr = t.codeRed
  const eliminated = useCounter(1247, 2100)
  const log = useLiveLog()
  const progress = Math.round((eliminated / 2100) * 100)

  return (
    <div className="card flex flex-col gap-0 overflow-hidden" style={{ background: 'rgba(18,14,14,0.72)', backdropFilter: 'saturate(180%) blur(40px)', WebkitBackdropFilter: 'saturate(180%) blur(40px)', border: '1px solid rgba(255,59,48,0.18)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3" style={sep}>
        <div className="flex items-center gap-2.5">
          <div style={{
            width: 28, height: 28, borderRadius: 5, flexShrink: 0,
            background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(255,59,48,0.20)',
          }}>
            <div className="laser-pulse" style={{ width: 10, height: 10, borderRadius: 2, background: 'radial-gradient(circle,#FF8080,#FF3B30)' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>{cr.title}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,59,48,0.65)', fontFamily: "'SF Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase' }}>CODE RED · AHAL TM</div>
          </div>
        </div>
        <Badge variant="orange" lightning pulse>Live</Badge>
      </div>

      {/* Counter */}
      <div className="px-3.5 py-3 flex items-center justify-between" style={sep}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 4 }}>{cr.eliminated}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FF3B30', letterSpacing: '-0.04em', lineHeight: 1, fontFeatureSettings: "'tnum'", fontFamily: "'SF Mono',monospace" }}>
            {eliminated.toLocaleString()}
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.30)', marginTop: 4, fontFamily: "'SF Mono',monospace" }}>{cr.estTarget}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(52,199,89,0.12)', border: '1px solid rgba(52,199,89,0.25)', borderRadius: 4 }}>
            <Shield size={9} style={{ color: '#34C759' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#34C759', fontFamily: "'SF Mono',monospace" }}>98.3%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Activity size={9} style={{ color: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: "'SF Mono',monospace", letterSpacing: '0.04em' }}>ACCURACY</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-3.5 py-2.5" style={sep}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>{cr.progress}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#FF8C42', fontFamily: "'SF Mono',monospace" }}>{progress}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#FF3B30,#FF8C42)', borderRadius: 2, transition: 'width 0.7s var(--expo)' }} />
        </div>
      </div>

      {/* Density minibar chart */}
      <div className="px-3.5 py-2.5" style={sep}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6 }}>{cr.density}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
          {[72,45,98,61,34,88,52,76].map((v, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 1,
              height: `${v}%`,
              background: v > 70
                ? 'linear-gradient(180deg,rgba(255,59,48,0.85),rgba(255,59,48,0.35))'
                : v > 50
                ? 'linear-gradient(180deg,rgba(255,140,66,0.80),rgba(255,140,66,0.30))'
                : 'linear-gradient(180deg,rgba(52,199,89,0.70),rgba(52,199,89,0.25))',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          {['A1','A2','B1','B2','C1','C2','C3','C4'].map(z => (
            <span key={z} style={{ fontSize: 7, color: 'rgba(255,255,255,0.20)', fontFamily: "'SF Mono',monospace", letterSpacing: '0.04em' }}>{z}</span>
          ))}
        </div>
      </div>

      {/* Laser units */}
      <div className="px-3.5 py-2.5" style={sep}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6 }}>{cr.modules}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {LASER_MODULES.map(mod => {
            const active = mod.status === 'active'
            const col = active ? '#34C759' : '#fbbf24'
            return (
              <div key={mod.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '5px 8px',
                background: active ? 'rgba(52,199,89,0.06)' : 'rgba(251,191,36,0.05)',
                border: `1px solid ${active ? 'rgba(52,199,89,0.15)' : 'rgba(251,191,36,0.12)'}`,
                borderRadius: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className={active ? 'dot-active' : ''} style={{
                    display: 'inline-block', width: 5, height: 5, borderRadius: 1,
                    background: col, flexShrink: 0, boxShadow: `0 0 5px ${col}`,
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{mod.name}</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.30)', fontFamily: "'SF Mono',monospace" }}>·{mod.field}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Zap size={8} style={{ color: 'rgba(255,255,255,0.25)' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', fontFamily: "'SF Mono',monospace" }}>{mod.shots}</span>
                  </div>
                  <div style={{ width: 30, height: 3, background: 'rgba(255,255,255,0.10)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{ width: `${mod.battery}%`, height: '100%', background: col, borderRadius: 1 }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Live log */}
      <div className="px-3.5 py-2.5">
        <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6 }}>{cr.log}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {log.slice(0, 4).map((e, i) => (
            <div key={e.time + i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 0',
              borderBottom: i < 3 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
              fontFamily: "'SF Mono','Consolas',monospace", fontSize: 10,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', minWidth: 50 }}>{e.time}</span>
              <span style={{ color: '#FF8C42', fontWeight: 700, minWidth: 34 }}>{e.field}</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{e.species}</span>
              <span style={{ color: '#FF3B30', fontWeight: 800, flexShrink: 0 }}>−{e.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
