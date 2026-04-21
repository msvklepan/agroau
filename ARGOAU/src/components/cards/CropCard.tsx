import type { Field } from '../../data/fields'
import { CropIcon3D } from '../ui/CropIcon3D'

interface Props {
  field: Field
  onClick?: () => void
  selected?: boolean
}

export function CropCard({ field, onClick, selected }: Props) {
  const isPest = field.status === 'critical'
  const isWarn = field.status === 'warning'

  return (
    <div
      className={`card overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-hover
        ${selected ? 'selected' : ''}`}
      style={{ width: 152, transition: 'box-shadow 0.30s var(--expo), transform 0.30s var(--expo)' }}
      onClick={onClick}
    >
      {/* 3D illustration area */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: 110,
          background: `linear-gradient(145deg, ${field.color}0E 0%, ${field.color}22 100%)`,
        }}
      >
        <CropIcon3D crop={field.crop} color={field.color} size={72} />

        {/* Status ribbon */}
        {(isPest || isWarn) && (
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-center gap-1.5 py-1 pest-pulse"
            style={{
              background: isPest ? 'rgba(255,59,48,0.88)' : 'rgba(255,140,66,0.82)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
            <span className="text-white text-[9px] font-700 tracking-wider uppercase">
              {isPest ? 'Pest Alert' : 'Monitor'}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="text-[13px] font-700 text-[var(--text-primary)] leading-tight">{field.crop}</div>
        <div className="text-[11px] text-[var(--text-hint)] mt-0.5 truncate">{field.name}</div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px]" style={{ color: 'var(--text-hint)' }}>{field.area} ha</span>
          <span
            className="text-[9px] font-700 px-1.5 py-0.5"
            style={{
              borderRadius: 3,
              background: field.ndvi > 0.65 ? 'rgba(52,199,89,0.12)' : field.ndvi > 0.45 ? 'rgba(251,191,36,0.12)' : 'rgba(255,59,48,0.10)',
              color:      field.ndvi > 0.65 ? '#34C759' : field.ndvi > 0.45 ? '#fbbf24' : '#FF3B30',
            }}
          >
            {field.ndvi}
          </span>
        </div>

        <div className="mt-1.5">
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${field.ndvi * 100}%`,
                background: field.ndvi > 0.65 ? '#34C759' : field.ndvi > 0.45 ? '#fbbf24' : '#FF3B30',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
