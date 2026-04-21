import { useState } from 'react'
import { X } from 'lucide-react'
import { useLang } from '../../contexts/LanguageContext'
import type { Field } from '../../data/fields'

const CROP_OPTIONS = [
  { crop: 'Cotton',      emoji: '🌿', color: '#FF8C42' },
  { crop: 'Wheat',       emoji: '🌾', color: '#C5FF4A' },
  { crop: 'Melon',       emoji: '🍈', color: '#6EC6FF' },
  { crop: 'Sesame',      emoji: '🌱', color: '#FBBF24' },
  { crop: 'Pomegranate', emoji: '🍎', color: '#F43F5E' },
  { crop: 'Corn',        emoji: '🌽', color: '#F59E0B' },
  { crop: 'Grapes',      emoji: '🍇', color: '#8B5CF6' },
  { crop: 'Tomato',      emoji: '🍅', color: '#EF4444' },
]

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (field: Field) => void
  fieldCount: number
}

export function AddFieldModal({ open, onClose, onAdd, fieldCount }: Props) {
  const { t } = useLang()
  const m = t.modal
  const [name, setName]    = useState('')
  const [sel, setSel]      = useState(CROP_OPTIONS[0])
  const [area, setArea]    = useState('')
  const [region, setRegion] = useState('')

  if (!open) return null

  function submit() {
    if (!name.trim()) return
    const idx = fieldCount + 1
    const newField: Field = {
      id: `f${Date.now()}`,
      name: name.trim(),
      crop: sel.crop,
      cropEmoji: sel.emoji,
      color: sel.color,
      area: Number(area) || 0,
      status: 'healthy',
      ndvi: 0.65,
      moisture: 45,
      region: region.trim() || 'Kaka etrap',
      province: 'Ahal Province',
      polygon: [
        [58.530 + idx * 0.02, 37.970 + idx * 0.01],
        [58.555 + idx * 0.02, 37.973 + idx * 0.01],
        [58.557 + idx * 0.02, 37.950 + idx * 0.01],
        [58.532 + idx * 0.02, 37.947 + idx * 0.01],
      ],
      center: [37.960 + idx * 0.01, 58.543 + idx * 0.02],
    }
    onAdd(newField)
    setName(''); setArea(''); setRegion(''); setSel(CROP_OPTIONS[0])
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(10px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="flex flex-col gap-5 rounded-[24px] p-6"
        style={{
          width: 420,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'saturate(180%) blur(20px)',
          boxShadow: 'var(--shadow-modal)',
          border: '0.5px solid rgba(255,255,255,0.8)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-[18px] font-700 text-[var(--text-primary)] tracking-tight">{m.title}</div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-hint)] transition-colors"
            style={{ background: 'var(--bg-surface)' }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Crop type */}
        <div>
          <div className="meta-label mb-2">{m.cropLabel}</div>
          <div className="flex flex-wrap gap-1.5">
            {CROP_OPTIONS.map(opt => (
              <button
                key={opt.crop}
                onClick={() => setSel(opt)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[12px] font-600 transition-all duration-150"
                style={{
                  background: sel.crop === opt.crop ? opt.color + '22' : 'var(--bg-surface)',
                  border: sel.crop === opt.crop ? `1.5px solid ${opt.color}55` : '1.5px solid transparent',
                  color: sel.crop === opt.crop ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>{opt.emoji}</span>
                <span>{opt.crop}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text inputs */}
        {[
          { label: m.nameLabel, value: name,   set: setName,   ph: m.namePh,   type: 'text'   },
          { label: m.areaLabel, value: area,   set: setArea,   ph: m.areaPh,   type: 'number' },
          { label: m.regionLabel, value: region, set: setRegion, ph: m.regionPh, type: 'text'   },
        ].map(({ label, value, set, ph, type }) => (
          <div key={label}>
            <div className="meta-label mb-1.5">{label}</div>
            <input
              type={type}
              value={value}
              onChange={e => set(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder={ph}
              className="w-full rounded-[12px] px-3 text-[14px] outline-none text-[var(--text-primary)] placeholder:text-[var(--text-hint)]"
              style={{ height: 42, background: 'var(--bg-surface)', border: '0.5px solid var(--border)' }}
            />
          </div>
        ))}

        {/* Actions */}
        <div className="flex gap-2.5 pt-1">
          <button
            onClick={onClose}
            className="flex-1 rounded-[14px] text-[14px] font-600 transition-all duration-150 hover:opacity-80"
            style={{ height: 44, background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '0.5px solid var(--border)' }}
          >
            {m.cancel}
          </button>
          <button
            onClick={submit}
            disabled={!name.trim()}
            className="flex-1 rounded-[14px] text-[14px] font-700 transition-all duration-150 disabled:opacity-35"
            style={{ height: 44, background: 'var(--text-primary)', color: '#fff' }}
          >
            {sel.emoji} {m.submit}
          </button>
        </div>
      </div>
    </div>
  )
}
