import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, X } from 'lucide-react'

interface Suggestion { id: number; title: string; body: string; color: string }

const SUGGESTIONS: Suggestion[] = [
  { id: 1, title: 'Brix Rising · Yolöten-04', body: 'Рекомендуется точечный полив на северо-западе участка 04 — stress index превышает 0.72', color: '#FF8C42' },
  { id: 2, title: 'EC Alert · Daşoguz-S1',    body: 'Уровень засоления ЕС 4.2 mS/cm. Плановый промывной полив через 2 суток', color: '#EF4444' },
  { id: 3, title: 'Optimal Window · Miwe-02', body: 'Текущие условия идеальны для сбора миндаля (°Brix 18.4). Рекомендуем начать в течение 48 ч', color: '#34C759' },
  { id: 4, title: 'Pest Pattern · Miwe-01',   body: 'H. armigera пик активности прогнозируется через 6–8 часов. Активируйте Laser Unit A', color: '#FF3B30' },
]

export function SmartSuggestion() {
  const [queue, setQueue] = useState<Suggestion[]>([])
  const [dismissed, setDismissed] = useState<number[]>([])

  useEffect(() => {
    let i = 0
    const fire = () => {
      const s = SUGGESTIONS[i % SUGGESTIONS.length]
      if (!dismissed.includes(s.id)) setQueue(q => [...q.slice(-1), s])
      i++
    }
    fire()
    const id = setInterval(fire, 18000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line

  function dismiss(id: number) {
    setDismissed(d => [...d, id])
    setQueue(q => q.filter(s => s.id !== id))
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9000] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {queue.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="pointer-events-auto"
            style={{ maxWidth: 320 }}
          >
            <div
              style={{
                background: 'rgba(28,28,30,0.82)',
                backdropFilter: 'saturate(160%) blur(32px)',
                WebkitBackdropFilter: 'saturate(160%) blur(32px)',
                border: `0.5px solid ${s.color}40`,
                borderRadius: 20,
                padding: '14px 16px',
                boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.07), 0 0 20px ${s.color}22`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${s.color}22`, border: `1px solid ${s.color}40` }}
                >
                  <Lightbulb size={14} style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-700 mb-1" style={{ color: s.color }}>{s.title}</div>
                  <div className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.body}</div>
                </div>
                <button
                  onClick={() => dismiss(s.id)}
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-opacity hover:opacity-60"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <X size={9} color="#fff" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 pl-11">
                <Lightbulb size={9} style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span className="text-[10px] font-500" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.03em' }}>
                  Smart Suggestion · ARGOAU AI
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
