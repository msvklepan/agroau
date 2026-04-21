import { useEffect, useState } from 'react'
import { Badge } from '../ui/Badge'
import { CropIllustration } from '../ui/CropIllustration'
import { useLang } from '../../contexts/LanguageContext'
import type { Task } from '../../data/tasks'

interface Props {
  task: Task
  selected?: boolean
  onClick?: () => void
}

export function TaskCard({ task, selected, onClick }: Props) {
  const { t } = useLang()
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(false)

  const badgeConfig = {
    'in-progress': { variant: 'lime'    as const, label: t.badge.inProgress, pulse: true  },
    'pending':     { variant: 'blue'    as const, label: t.badge.pending,     pulse: false },
    'completed':   { variant: 'surface' as const, label: t.badge.completed,   pulse: false },
  }
  const badge = badgeConfig[task.status]

  useEffect(() => {
    const tid = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(tid)
  }, [])

  if (loading) {
    return (
      <div className="card p-4" style={{ minHeight: 148 }}>
        <div className="flex items-start gap-3 mb-3">
          <div className="skeleton rounded-[13px] flex-shrink-0" style={{ width: 44, height: 44 }} />
          <div className="flex-1 flex flex-col gap-2 pt-0.5">
            <div className="skeleton h-3.5 rounded" style={{ width: '70%' }} />
            <div className="skeleton h-3 rounded" style={{ width: '40%' }} />
          </div>
        </div>
        <div className="skeleton rounded-[12px] mb-3" style={{ height: 64 }} />
        <div className="skeleton rounded-full" style={{ height: 5 }} />
      </div>
    )
  }

  return (
    <div
      className={`card p-4 cursor-pointer select-none transition-all duration-300
        hover:-translate-y-px hover:shadow-hover
        ${selected ? 'selected' : ''}`}
      style={{
        borderLeft: hovered || selected ? `3px solid ${task.bgColor}` : '3px solid transparent',
        transition: 'box-shadow 0.30s var(--expo), transform 0.30s var(--expo), border-color 0.2s',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3 mb-3">
        <CropIllustration emoji={task.emoji} color={task.bgColor} size={44} crop={task.title} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[13px] font-700 text-[var(--text-primary)] leading-snug">{task.title}</span>
            <Badge variant={badge.variant} lightning pulse={badge.pulse} className="flex-shrink-0 mt-0.5">
              {badge.label}
            </Badge>
          </div>
          <div className="text-[11px] text-[var(--text-hint)] mt-0.5 truncate">{task.subtitle}</div>
        </div>
      </div>

      <div className="surface p-3 grid grid-cols-2 gap-x-3 gap-y-2" style={{ borderRadius: 5 }}>
        {[
          { label: t.task.season, value: task.season },
          { label: t.task.dates,  value: task.dates  },
          { label: t.task.worker, value: task.worker },
          { label: t.task.action, value: task.action },
        ].map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <div className="meta-label leading-none mb-0.5">{label}</div>
            <div className="meta-value truncate text-[11px]">{value}</div>
          </div>
        ))}
      </div>

      {task.status !== 'completed' && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="meta-label">{t.task.progress}</span>
            <span className="text-[11px] font-700" style={{ color: 'var(--text-secondary)' }}>{task.progress}%</span>
          </div>
          <div style={{ height: 3, borderRadius: 1, overflow: 'hidden', background: 'var(--bg-surface)' }}>
            <div
              className="h-full transition-all duration-700"
              style={{
                borderRadius: 1,
                width: `${task.progress}%`,
                background: task.status === 'in-progress'
                  ? 'linear-gradient(90deg, #C5FF4A, #8edb00)'
                  : '#6EC6FF',
              }}
            />
          </div>
        </div>
      )}
      {task.status === 'completed' && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="text-[11px]">✓</span>
          <span className="text-[11px]" style={{ color: 'var(--text-hint)' }}>{t.task.done}</span>
        </div>
      )}
    </div>
  )
}
