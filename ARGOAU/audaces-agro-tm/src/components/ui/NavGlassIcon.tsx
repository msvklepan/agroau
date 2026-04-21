import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  active?: boolean
  size?: number
  accentColor?: string
}

export function NavGlassIcon({ icon: Icon, active, size = 15, accentColor = '#C5FF4A' }: Props) {
  return (
    <div style={{
      width: 36, height: 36,
      borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      background: active
        ? `linear-gradient(145deg, ${accentColor}28, ${accentColor}14)`
        : 'rgba(255,255,255,0.06)',
      boxShadow: active
        ? `inset 0 0 0 1px ${accentColor}40, 0 0 16px ${accentColor}22, inset 0 1px 0 rgba(255,255,255,0.3)`
        : `inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 3px rgba(0,0,0,0.08)`,
      backdropFilter: 'saturate(160%) blur(16px)',
      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <Icon
        size={size}
        style={{
          color: active ? accentColor : 'rgba(60,60,67,0.5)',
          filter: active ? `drop-shadow(0 0 4px ${accentColor}80)` : 'none',
          transition: 'all 0.25s ease',
        }}
      />
    </div>
  )
}
