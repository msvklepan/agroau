import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { TaskCard } from '../cards/TaskCard'
import { TASKS } from '../../data/tasks'
import { useLang } from '../../contexts/LanguageContext'

export function Sidebar() {
  const { t } = useLang()
  const [filter, setFilter]   = useState<string>('all')
  const [selectedId, setSel]  = useState<string | null>(null)
  const [query, setQuery]     = useState('')

  const inProgress = TASKS.filter(t => t.status === 'in-progress').length

  const filtered = TASKS
    .filter(task => filter === 'all' || task.module === filter)
    .filter(task => !query || task.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <aside className="flex flex-col gap-2 overflow-hidden" style={{ width: 268, flexShrink: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[14px] font-700 text-[var(--text-primary)]">{t.sidebar.title}</span>
        <span
          className="text-[10px] font-700 px-2.5 py-0.5"
          style={{ background: 'var(--accent-lime)', color: '#2a4a00', borderRadius: 4 }}
        >
          {inProgress} {t.sidebar.live}
        </span>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3"
        style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.60)', borderRadius: 5, height: 36 }}
      >
        <Search size={13} className="text-[var(--text-hint)] flex-shrink-0" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t.sidebar.search}
          className="flex-1 text-[12px] outline-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-hint)]"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-[var(--text-hint)] hover:text-[var(--text-secondary)]">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-1 flex-wrap px-0.5">
        {t.taskFilters.map(f => (
          <button
            key={f.id}
            className={`pill-btn text-[10px] py-0.5 px-2.5 ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="divider" />

      {/* Task list */}
      <div
        className="flex flex-col gap-2 overflow-y-auto flex-1 pb-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}
      >
        {filtered.length === 0 && (
          <div className="text-center py-8 text-[13px]" style={{ color: 'var(--text-hint)' }}>
            {t.sidebar.noTasks}
          </div>
        )}
        {filtered.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            selected={selectedId === task.id}
            onClick={() => setSel(prev => prev === task.id ? null : task.id)}
          />
        ))}
      </div>
    </aside>
  )
}
