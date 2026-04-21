import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  unit?: string
  sub?: string
  icon?: string
  accent?: string
  trend?: 'up' | 'down' | 'flat'
  trendValue?: string
}

export function MetricCard({ label, value, unit, sub, icon, accent, trend, trendValue }: Props) {
  const accentColor = accent ?? 'var(--accent-lime)'

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up'
    ? '#34C759'
    : trend === 'down'
    ? '#FF3B30'
    : 'var(--text-hint)'

  return (
    <div
      className="card p-3.5 flex flex-col gap-1.5"
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle accent glow top-right */}
      <div style={{
        position: 'absolute', top: -10, right: -10,
        width: 60, height: 60,
        borderRadius: '50%',
        background: accentColor,
        opacity: 0.07,
        filter: 'blur(18px)',
        pointerEvents: 'none',
      }} />

      <div className="meta-label flex items-center gap-1.5">
        {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
        {label}
      </div>

      <div className="flex items-baseline gap-1">
        <span
          className="text-[24px] font-extrabold tracking-tight"
          style={{ color: accent ? accentColor : 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-hint)' }}>
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {sub && <div className="meta-value text-[10px]">{sub}</div>}
        {trend && (
          <div
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ml-auto"
            style={{
              background: `${trendColor}18`,
              border: `0.5px solid ${trendColor}30`,
            }}
          >
            <TrendIcon size={9} style={{ color: trendColor }} />
            {trendValue && (
              <span style={{ fontSize: 9, fontWeight: 700, color: trendColor }}>{trendValue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
