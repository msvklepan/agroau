import { useState } from 'react'
import { CropCard } from '../cards/CropCard'
import { AddFieldModal } from '../ui/AddFieldModal'
import { useLang } from '../../contexts/LanguageContext'
import type { Field } from '../../data/fields'

interface Props {
  fields: Field[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CropProductionPanel({ fields, selectedId, onSelect }: Props) {
  const { t } = useLang()
  const [modalOpen, setModalOpen] = useState(false)
  const [extraFields, setExtraFields] = useState<Field[]>([])

  const allFields = [...fields, ...extraFields]
  const criticalCount = allFields.filter(f => f.status === 'critical').length

  function handleAdd(f: Field) {
    setExtraFields(prev => [...prev, f])
    onSelect(f.id)
  }

  return (
    <>
      <div className="card p-4 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-700 text-[var(--text-primary)]">{t.cropPanel.title}</span>
            {criticalCount > 0 && (
              <span
                className="text-[10px] font-700 px-2 py-0.5 rounded-full pest-pulse"
                style={{ background: 'var(--accent-orange)', color: '#fff' }}
              >
                {criticalCount} !
              </span>
            )}
          </div>
          <button
            className="text-[11px] font-500 transition-colors"
            style={{ color: 'var(--text-link)' }}
            onClick={() => alert(`${allFields.length} fields total: ${allFields.map(f => f.name).join(', ')}`)}
          >
            {t.cropPanel.viewAll}
          </button>
        </div>

        <div
          className="flex gap-2.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {allFields.map(f => (
            <CropCard
              key={f.id}
              field={f}
              selected={f.id === selectedId}
              onClick={() => onSelect(f.id)}
            />
          ))}

          {/* Add field button */}
          <button
            className="flex-shrink-0 flex flex-col items-center justify-center rounded-[20px] transition-all duration-200 hover:shadow-hover hover:-translate-y-0.5"
            style={{
              width: 110,
              minHeight: 170,
              background: 'var(--bg-surface)',
              border: '1.5px dashed var(--border)',
              color: 'var(--text-hint)',
              cursor: 'pointer',
            }}
            onClick={() => setModalOpen(true)}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200"
              style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
            >
              <span className="text-[20px] leading-none">＋</span>
            </div>
            <div className="text-[11px] font-500 text-center leading-snug px-2" style={{ color: 'var(--text-hint)' }}>
              {t.cropPanel.addField}
            </div>
          </button>
        </div>
      </div>

      <AddFieldModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        fieldCount={allFields.length}
      />
    </>
  )
}
