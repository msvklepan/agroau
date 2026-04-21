import { Wind, Eye, Droplets } from 'lucide-react'
import { HOURLY_TEMP } from '../../data/sensors'
import { useLang } from '../../contexts/LanguageContext'

const CURRENT_HOUR = 14

function TempCurve({ data, currentHour }: { data: typeof HOURLY_TEMP; currentHour: number }) {
  const W = 240, H = 52, PAD = 6
  const temps = data.map(d => d.temp)
  const minT = Math.min(...temps) - 2
  const maxT = Math.max(...temps) + 2

  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((d.temp - minT) / (maxT - minT)) * (H - PAD * 2),
  }))

  // Cubic Bézier path
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const cur  = pts[i]
    const cpx  = (prev.x + cur.x) / 2
    d += ` C ${cpx},${prev.y} ${cpx},${cur.y} ${cur.x},${cur.y}`
  }

  // Fill path (close below)
  const fill = `${d} L ${pts[pts.length-1].x},${H} L ${pts[0].x},${H} Z`

  // Active point
  const activeIdx = data.findIndex(h => h.hour === `${currentHour}:00`)
  const ap = pts[activeIdx] ?? pts[4]
  const curPct = (ap.x - PAD) / (W - PAD * 2) * 100

  return (
    <div className="relative" style={{ height: H + 20 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f97316" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Fill */}
        <path d={fill} fill="url(#tempGrad)" />
        {/* Line */}
        <path d={d} fill="none" stroke="url(#lineGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#34C759" />
            <stop offset="50%"  stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Active dot */}
        <circle cx={ap.x} cy={ap.y} r="4.5" fill="white" stroke="#f97316" strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.7))' }} />
        <circle cx={ap.x} cy={ap.y} r="2" fill="#f97316" />
      </svg>

      {/* Hour labels below */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between" style={{ paddingLeft: PAD, paddingRight: PAD }}>
        {data.filter((_, i) => i % 2 === 0).map(h => (
          <span
            key={h.hour}
            className="text-[10px]"
            style={{
              color: h.hour === `${currentHour}:00` ? 'var(--text-primary)' : 'var(--text-hint)',
              fontWeight: h.hour === `${currentHour}:00` ? 700 : 400,
            }}
          >
            {h.hour}
          </span>
        ))}
      </div>

      {/* Active temp label */}
      <div
        className="absolute text-[10px] font-700 px-1.5 py-0.5 rounded-full"
        style={{
          left: `calc(${curPct}% - 14px)`,
          top: -16,
          background: 'rgba(249,115,22,0.12)',
          color: '#f97316',
          border: '0.5px solid rgba(249,115,22,0.3)',
          whiteSpace: 'nowrap',
        }}
      >
        {data[activeIdx]?.temp ?? ''}°
      </div>
    </div>
  )
}

export function WeatherCard() {
  const { t } = useLang()
  const w = t.weather

  return (
    <div className="card p-4 flex-shrink-0" style={{ minWidth: 272 }}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="meta-label mb-1.5 flex items-center gap-1">
            <span style={{ fontSize: 9 }}>📍</span>
            {w.location}
          </div>
          <div className="text-[36px] font-800 tracking-tight leading-none" style={{ letterSpacing: '-0.03em' }}>
            38°<span style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-hint)', verticalAlign: 'super' }}>C</span>
          </div>
          <div className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>{w.desc}</div>
        </div>

        {/* Sun icon — pure CSS */}
        <div style={{ position: 'relative', width: 46, height: 46, flexShrink: 0, marginTop: 4 }}>
          {/* Rays */}
          {[0,45,90,135,180,225,270,315].map(deg => (
            <div key={deg} style={{
              position: 'absolute', width: 2, height: 8, borderRadius: 1,
              background: 'linear-gradient(180deg,#FDE68A,#F59E0B)',
              left: '50%', top: '50%',
              transformOrigin: '50% 200%',
              transform: `translateX(-50%) translateY(-100%) rotate(${deg}deg) translateY(-100%)`,
              opacity: 0.9,
            }} />
          ))}
          {/* Core */}
          <div style={{
            position: 'absolute', inset: 9,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%, #FEF3C7 0%, #F59E0B 45%, #D97706 100%)',
            boxShadow: '0 0 14px rgba(245,158,11,0.6), inset 0 1px 2px rgba(255,255,255,0.6)',
          }} />
        </div>
      </div>

      {/* Conditions row */}
      <div className="flex gap-2 mb-3">
        {[
          { icon: Wind,     label: w.wind,     value: '14 km/h' },
          { icon: Droplets, label: w.humidity, value: '22%'     },
          { icon: Eye,      label: w.vis,      value: '30 km'   },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex-1 rounded-[10px] p-2"
            style={{
              background: 'var(--bg-surface)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <Icon size={9} style={{ color: 'var(--text-hint)' }} />
              <span className="meta-label" style={{ fontSize: 9 }}>{label}</span>
            </div>
            <span className="text-[12px] font-700" style={{ color: 'var(--text-primary)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* SVG Bézier temperature curve */}
      <TempCurve data={HOURLY_TEMP} currentHour={CURRENT_HOUR} />
    </div>
  )
}
