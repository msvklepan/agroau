import { useLang } from '../contexts/LanguageContext'
import { TrendingDown, TrendingUp, BarChart2, DollarSign, Download } from 'lucide-react'

/* ── Revenue SVG chart with proper grid ── */
function RevenueChart({
  traditional, platform, color, months,
}: {
  traditional: number[]; platform: number[]; color: string;
  months: { short: string }[]
}) {
  const W = 480, H = 110, PAD = { t: 12, r: 8, b: 28, l: 32 }
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b

  const allVals = [...traditional, ...platform]
  const min = Math.min(...allVals)
  const max = Math.max(...allVals)
  const range = max - min || 1

  function toX(i: number) { return PAD.l + (i / (months.length - 1)) * innerW }
  function toY(v: number) { return PAD.t + innerH - ((v - min) / range) * innerH }

  function bezierPath(data: number[], closed = false) {
    const pts = data.map((v, i) => ({ x: toX(i), y: toY(v) }))
    let d = `M ${pts[0].x},${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1], cur = pts[i]
      const cpx = (prev.x + cur.x) / 2
      d += ` C ${cpx},${prev.y} ${cpx},${cur.y} ${cur.x},${cur.y}`
    }
    if (closed) {
      d += ` L ${pts[pts.length-1].x},${H - PAD.b} L ${pts[0].x},${H - PAD.b} Z`
    }
    return d
  }

  const yTicks = [min, min + range * 0.5, max].map(v => Math.round(v))

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="fg-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="trad-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FF3B30" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Y-axis grid lines + labels */}
      {yTicks.map((v, i) => {
        const y = toY(v)
        return (
          <g key={i}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
              stroke="rgba(60,60,67,0.08)" strokeWidth="0.5" strokeDasharray="3 3" />
            <text x={PAD.l - 4} y={y + 3.5} textAnchor="end"
              style={{ fontSize: 8, fill: 'var(--text-hint)', fontFamily: "'SF Mono','Consolas',monospace", fontWeight: 600 }}>
              {v}k
            </text>
          </g>
        )
      })}

      {/* Traditional area */}
      <path d={bezierPath(traditional, true)} fill="url(#trad-fill)" />
      <path d={bezierPath(traditional)} fill="none"
        stroke="rgba(255,59,48,0.40)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 3" />

      {/* Platform area */}
      <path d={bezierPath(platform, true)} fill="url(#fg-fill)" />
      <path d={bezierPath(platform)} fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points on platform line */}
      {platform.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5"
          fill={color} stroke="rgba(14,14,18,0.85)" strokeWidth="1.5" />
      ))}

      {/* X axis month labels */}
      {months.map((m, i) => (
        <text key={i} x={toX(i)} y={H - 6} textAnchor="middle"
          style={{ fontSize: 8, fill: 'var(--text-hint)', fontFamily: '-apple-system,sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {m.short}
        </text>
      ))}
    </svg>
  )
}

/* ── Horizontal comparison bar ── */
function CompareBar({ traditional, platform, color }: { traditional: number; platform: number; color: string }) {
  const max = traditional
  const platPct = max > 0 ? (platform / max) * 100 : 100
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 36, fontSize: 8, fontWeight: 600, color: 'rgba(255,59,48,0.7)', textAlign: 'right', fontFamily: 'SF Mono,Consolas,monospace', flexShrink: 0 }}>
          TRAD
        </div>
        <div style={{ flex: 1, height: 5, background: 'rgba(255,59,48,0.15)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: 'rgba(255,59,48,0.45)', borderRadius: 1 }} />
        </div>
        <div style={{ width: 52, fontSize: 9, fontWeight: 700, color: 'rgba(255,59,48,0.7)', textAlign: 'right', fontFamily: 'SF Mono,Consolas,monospace', flexShrink: 0, fontFeatureSettings: "'tnum'" }}>
          ${traditional.toLocaleString()}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 36, fontSize: 8, fontWeight: 600, color: '#34C759', textAlign: 'right', fontFamily: 'SF Mono,Consolas,monospace', flexShrink: 0 }}>
          ARG
        </div>
        <div style={{ flex: 1, height: 5, background: 'rgba(60,60,67,0.06)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ width: `${platPct}%`, height: '100%', background: color, borderRadius: 1, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
        </div>
        <div style={{ width: 52, fontSize: 9, fontWeight: 700, color: '#34C759', textAlign: 'right', fontFamily: 'SF Mono,Consolas,monospace', flexShrink: 0, fontFeatureSettings: "'tnum'" }}>
          ${platform.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

/* ── Region data ── */
const REGION_DATA: Record<string, {
  name: string; nameRu: string; color: string;
  costs: { label: string; ru: string; traditional: number; platform: number }[];
  revenue: { short: string; ru: string; trad: number; platform: number }[];
  budget: { allocated: number; spent: number; forecast: number };
}> = {
  default: {
    name: 'All Regions · TM 2025', nameRu: 'Все регионы · ТМ 2025', color: '#FF8C42',
    costs: [
      { label: 'Pesticides', ru: 'Пестициды',  traditional: 4200, platform: 940  },
      { label: 'Irrigation', ru: 'Орошение',   traditional: 3800, platform: 1720 },
      { label: 'Labour',     ru: 'Труд',        traditional: 5100, platform: 1800 },
      { label: 'Fuel',       ru: 'Топливо',     traditional: 1900, platform: 780  },
      { label: 'Equipment',  ru: 'Техника',     traditional: 2600, platform: 1100 },
    ],
    revenue: [
      { short: 'APR', ru: 'АПР', trad: 9,  platform: 12 },
      { short: 'MAY', ru: 'МАЙ', trad: 11, platform: 18 },
      { short: 'JUN', ru: 'ИЮН', trad: 14, platform: 24 },
      { short: 'JUL', ru: 'ИЮЛ', trad: 16, platform: 31 },
      { short: 'AUG', ru: 'АВГ', trad: 15, platform: 28 },
      { short: 'SEP', ru: 'СЕН', trad: 13, platform: 22 },
    ],
    budget: { allocated: 62000, spent: 38200, forecast: 44000 },
  },
  ahal: {
    name: 'Miwe Holding · Ahal', nameRu: 'Мивэ Холдинг · Ахал', color: '#C5FF4A',
    costs: [
      { label: 'Irrigation', ru: 'Полив',      traditional: 2800, platform: 1200 },
      { label: 'Labour',     ru: 'Труд',       traditional: 3200, platform: 1100 },
      { label: 'Pesticides', ru: 'Пестициды',  traditional: 1800, platform: 420  },
      { label: 'Harvest',    ru: 'Уборка',     traditional: 2100, platform: 850  },
      { label: 'Fuel',       ru: 'Топливо',    traditional: 1400, platform: 560  },
    ],
    revenue: [
      { short: 'APR', ru: 'АПР', trad: 6,  platform: 8  },
      { short: 'MAY', ru: 'МАЙ', trad: 9,  platform: 14 },
      { short: 'JUN', ru: 'ИЮН', trad: 12, platform: 19 },
      { short: 'JUL', ru: 'ИЮЛ', trad: 14, platform: 26 },
      { short: 'AUG', ru: 'АВГ', trad: 13, platform: 24 },
      { short: 'SEP', ru: 'СЕН', trad: 11, platform: 20 },
    ],
    budget: { allocated: 38000, spent: 22400, forecast: 26000 },
  },
  mary: {
    name: 'Türkmenpagta · Mary', nameRu: 'Türkmenpagta · Мары', color: '#FF8C42',
    costs: [
      { label: 'Pesticides', ru: 'Пестициды',  traditional: 5800, platform: 1100 },
      { label: 'Irrigation', ru: 'Орошение',   traditional: 4900, platform: 2100 },
      { label: 'Laser Ops',  ru: 'Лазер',      traditional: 0,    platform: 1200 },
      { label: 'Labour',     ru: 'Труд',        traditional: 6200, platform: 2000 },
      { label: 'Logistics',  ru: 'Логистика',  traditional: 1800, platform: 900  },
    ],
    revenue: [
      { short: 'APR', ru: 'АПР', trad: 12, platform: 16 },
      { short: 'MAY', ru: 'МАЙ', trad: 15, platform: 24 },
      { short: 'JUN', ru: 'ИЮН', trad: 18, platform: 31 },
      { short: 'JUL', ru: 'ИЮЛ', trad: 20, platform: 41 },
      { short: 'AUG', ru: 'АВГ', trad: 18, platform: 36 },
      { short: 'SEP', ru: 'СЕН', trad: 15, platform: 28 },
    ],
    budget: { allocated: 78000, spent: 51000, forecast: 58000 },
  },
  dashoguz: {
    name: 'Salinity Zone · Dashoguz', nameRu: 'Зона засоления · Дашогуз', color: '#EF4444',
    costs: [
      { label: 'Leaching',   ru: 'Промывка',   traditional: 6100, platform: 2200 },
      { label: 'Fertilizer', ru: 'Удобрения',  traditional: 3200, platform: 1800 },
      { label: 'Irrigation', ru: 'Орошение',   traditional: 5500, platform: 2800 },
      { label: 'Labour',     ru: 'Труд',        traditional: 3900, platform: 1600 },
      { label: 'Monitoring', ru: 'Мониторинг', traditional: 1200, platform: 600  },
    ],
    revenue: [
      { short: 'APR', ru: 'АПР', trad: 5,  platform: 7  },
      { short: 'MAY', ru: 'МАЙ', trad: 7,  platform: 11 },
      { short: 'JUN', ru: 'ИЮН', trad: 8,  platform: 15 },
      { short: 'JUL', ru: 'ИЮЛ', trad: 9,  platform: 18 },
      { short: 'AUG', ru: 'АВГ', trad: 8,  platform: 16 },
      { short: 'SEP', ru: 'СЕН', trad: 7,  platform: 13 },
    ],
    budget: { allocated: 44000, spent: 31400, forecast: 36000 },
  },
}

interface Props { region?: string | null }

export function FinancePage({ region }: Props) {
  const { lang } = useLang()
  const isRu = lang === 'ru'
  const d = REGION_DATA[region ?? 'default'] ?? REGION_DATA['default']

  const totalSaved   = d.costs.reduce((s, r) => s + Math.max(0, r.traditional - r.platform), 0)
  const totalTrad    = d.costs.reduce((s, r) => s + r.traditional, 0)
  const totalPlatform = d.costs.reduce((s, r) => s + r.platform, 0)
  const lastRev      = d.revenue[d.revenue.length - 1]
  const roi          = lastRev.trad > 0 ? Math.round(((lastRev.platform - lastRev.trad) / lastRev.trad) * 100) : 0
  const budgetPct    = Math.round((d.budget.spent / d.budget.allocated) * 100)

  const kpis = [
    { label: isRu ? 'ДОХОД'    : 'REVENUE',   value: `$${lastRev.platform}k`, sub: `+${roi}% vs trad.`,    color: d.color,    Icon: TrendingUp   },
    { label: isRu ? 'ЭКОНОМИЯ' : 'SAVINGS',   value: `$${(totalSaved/1000).toFixed(1)}k`, sub: `${Math.round((totalSaved/totalTrad)*100)}% cost cut`, color: '#34C759',  Icon: TrendingDown },
    { label: 'ROI',                            value: `+${roi}%`,              sub: 'vs traditional',        color: '#5856D6',  Icon: BarChart2    },
    { label: isRu ? 'БЮДЖЕТ'   : 'BUDGET',    value: `${budgetPct}%`,         sub: `$${(d.budget.spent/1000).toFixed(0)}k / $${(d.budget.allocated/1000).toFixed(0)}k`, color: '#6EC6FF',  Icon: DollarSign   },
  ]

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 24px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ overflowY: 'auto', scrollbarWidth: 'none', flex: 1, paddingBottom: 24 }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg,#1C1C1E 0%,#2C2C2E 70%,#1C1C1E 100%)',
          borderRadius: 6, padding: '16px 20px', marginBottom: 16, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${d.color}`, opacity: 0.06, filter: 'blur(40px)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'SF Mono,Consolas,monospace' }}>
                ARGOAU · FINANCIAL INTELLIGENCE
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {isRu ? d.nameRu : d.name}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3, fontFamily: 'SF Mono,Consolas,monospace' }}>
                SEASON 2025 · TM · {new Date().toLocaleDateString('en-GB')}
              </div>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 4, color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.05em', cursor: 'pointer', textTransform: 'uppercase',
            }}>
              <Download size={11} />
              {isRu ? 'Экспорт' : 'Export'}
            </button>
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
          {kpis.map(k => (
            <div key={k.label} className="card" style={{ padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -8, right: -8, width: 50, height: 50, borderRadius: '50%', background: k.color, opacity: 0.07, filter: 'blur(16px)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="meta-label">{k.label}</span>
                <k.Icon size={12} style={{ color: k.color, opacity: 0.8 }} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color, letterSpacing: '-0.03em', lineHeight: 1, fontFeatureSettings: "'tnum'" }}>
                {k.value}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-hint)', marginTop: 5, fontFamily: 'SF Mono,Consolas,monospace', fontWeight: 500 }}>
                {k.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── Revenue chart ── */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {isRu ? 'Динамика дохода ($k)' : 'Revenue Dynamics ($k)'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-hint)', marginTop: 2, fontFamily: 'SF Mono,Consolas,monospace' }}>
                APR – SEP 2025
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 20, height: 1.5, background: 'rgba(255,59,48,0.45)', borderRadius: 1 }} />
                <span style={{ fontSize: 9, color: 'var(--text-hint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isRu ? 'Традиц.' : 'Traditional'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 20, height: 2, background: d.color, borderRadius: 1 }} />
                <span style={{ fontSize: 9, color: 'var(--text-hint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ARGOAU
                </span>
              </div>
            </div>
          </div>
          <RevenueChart
            traditional={d.revenue.map(r => r.trad)}
            platform={d.revenue.map(r => r.platform)}
            color={d.color}
            months={d.revenue.map(r => ({ short: isRu ? r.ru : r.short }))}
          />
        </div>

        {/* ── Cost breakdown table ── */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid var(--border-strong)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
              {isRu ? 'Анализ затрат' : 'Cost Breakdown'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-hint)', marginTop: 2, fontFamily: 'SF Mono,Consolas,monospace' }}>
              {isRu ? 'Традиционное земледелие vs ARGOAU' : 'Traditional farming vs ARGOAU Platform'}
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>{isRu ? 'СТАТЬЯ' : 'CATEGORY'}</th>
                <th style={{ textAlign: 'right' }}>{isRu ? 'ТРАДИЦ.' : 'TRADITIONAL'}</th>
                <th style={{ textAlign: 'right' }}>ARGOAU</th>
                <th style={{ textAlign: 'right' }}>{isRu ? 'ЭКОНОМИЯ' : 'SAVINGS'}</th>
                <th style={{ textAlign: 'right' }}>Δ%</th>
              </tr>
            </thead>
            <tbody>
              {d.costs.map(row => {
                const saved = Math.max(0, row.traditional - row.platform)
                const pct   = row.traditional > 0 ? Math.round((saved / row.traditional) * 100) : 0
                return (
                  <tr key={row.label}>
                    <td style={{ fontWeight: 600 }}>{isRu ? row.ru : row.label}</td>
                    <td style={{ textAlign: 'right', color: 'rgba(255,59,48,0.75)', fontFamily: 'SF Mono,Consolas,monospace' }}>
                      ${row.traditional.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'SF Mono,Consolas,monospace' }}>
                      ${row.platform.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', color: '#34C759', fontFamily: 'SF Mono,Consolas,monospace', fontWeight: 700 }}>
                      ${saved.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {pct > 0 && (
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 3,
                          background: 'rgba(52,199,89,0.10)', color: '#34C759',
                          border: '0.5px solid rgba(52,199,89,0.25)',
                          fontFamily: 'SF Mono,Consolas,monospace',
                        }}>
                          −{pct}%
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/* Totals footer */}
          <div style={{ padding: '10px 14px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-strong)', display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>TOTAL TRAD.</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,59,48,0.7)', fontFamily: 'SF Mono,Consolas,monospace', fontFeatureSettings: "'tnum'" }}>
                ${totalTrad.toLocaleString()}
              </span>
            </div>
            <div style={{ width: 1, background: 'var(--border-strong)' }} />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>ARGOAU</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: d.color, fontFamily: 'SF Mono,Consolas,monospace', fontFeatureSettings: "'tnum'" }}>
                ${totalPlatform.toLocaleString()}
              </span>
            </div>
            <div style={{ width: 1, background: 'var(--border-strong)' }} />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>SAVED</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#34C759', fontFamily: 'SF Mono,Consolas,monospace', fontFeatureSettings: "'tnum'" }}>
                ${totalSaved.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Cost comparison bars ── */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {isRu ? 'Сравнение затрат по статьям' : 'Per-Category Cost Comparison'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-hint)', fontFamily: 'SF Mono,Consolas,monospace', marginBottom: 14 }}>
            Traditional vs ARGOAU ($)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {d.costs.map(row => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isRu ? row.ru : row.label}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#34C759', fontFamily: 'SF Mono,Consolas,monospace' }}>
                    {row.traditional > 0 ? `−${Math.round(((row.traditional - row.platform) / row.traditional) * 100)}%` : 'NEW'}
                  </span>
                </div>
                <CompareBar traditional={row.traditional} platform={row.platform} color={d.color} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
