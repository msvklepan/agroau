import { useState } from 'react'
import { Send, Lightbulb, BookOpen, ChevronRight, Sparkles, Zap } from 'lucide-react'
import { useLang } from '../contexts/LanguageContext'

const TIPS_EN = [
  { title: 'Irrigation Timing',   body: 'Water stress index >0.65 in morning readings predicts yield loss. Act within 24h.',             color: '#6EC6FF', Icon: Zap       },
  { title: 'Heat Stress Watch',   body: 'Above 38°C for 3+ days: activate drip micro-irrigation on cotton rows 1–12.',                   color: '#FF8C42', Icon: Sparkles  },
  { title: 'EC Management',       body: 'EC >3.5 mS/cm: leaching irrigation required. Use 2× normal dose over 2 cycles.',               color: '#EF4444', Icon: Sparkles  },
  { title: 'Pest Peak Forecast',  body: 'H. armigera peaks post-rain event. Pre-activate Jetson units 6–8h prior.',                      color: '#C5FF4A', Icon: Zap       },
]

const TIPS_RU = [
  { title: 'Полив',                body: 'Индекс водного стресса >0.65 утром — прогноз потери урожая. Действовать в течение 24 ч.',         color: '#6EC6FF', Icon: Zap       },
  { title: 'Жара',                 body: 'Выше 38°C более 3 дней: включить капельный полив на рядах хлопка 1–12.',                          color: '#FF8C42', Icon: Sparkles  },
  { title: 'Засоление ЕС',        body: 'ЕС >3.5 mS/cm: промывка удвоенной дозой за 2 цикла обязательна.',                               color: '#EF4444', Icon: Sparkles  },
  { title: 'Прогноз вредителей',  body: 'H. armigera пик после дождей. Активировать Jetson за 6–8 ч до пика.',                            color: '#C5FF4A', Icon: Zap       },
]

const AI_ANSWERS = [
  { q: 'salinity|засол|ec', a: 'EC >3.5 mS/cm detected in Daşoguz-S1. Recommend leaching: 2× dose over 2 cycles. Expected reduction: 1.8→2.1 mS/cm within 10 days.' },
  { q: 'cotton|хлопок|pagta', a: 'Türkmenpagta cluster (Yolöten) NDVI 0.71 — above regional average. Pest risk moderate. Maintain current irrigation schedule.' },
  { q: 'laser|red|лазер', a: 'Code Red TM-01: 1,247 targets eliminated at 98.3% accuracy. Jetson A & B active. Est. completion 3.2h.' },
  { q: 'weather|погода|rain|дождь', a: 'No precipitation for Ahal Province in 10 days. Heat index 42°C Thursday. Recommend pre-emptive irrigation.' },
]

const REGION_CONDITIONS: Record<string, { title: string; titleRu: string; temp: number; alert: string; alertRu: string; advice: string; adviceRu: string; color: string }> = {
  ahal:     { title: 'Kaka etrap · Ahal',         titleRu: 'Какаский этрап · Ахал',     temp: 42, alert: 'Brix 16.8 — rising fast',         alertRu: 'Брикс 16.8 — растёт',       advice: 'Recommend night irrigation on almond rows',      adviceRu: 'Рекомендуем ночной полив миндальных рядов', color: '#C5FF4A' },
  mary:     { title: 'Yolöten · Mary',            titleRu: 'Йолотань · Мары',           temp: 38, alert: 'Code Red — H. armigera attack',    alertRu: 'Красный Код — H. armigera', advice: 'Jetson A active, 1,247 eliminated',              adviceRu: 'Jetson A активен, уничтожено 1 247',       color: '#FF3B30' },
  dashoguz: { title: 'Köneürgench · Dashoguz',    titleRu: 'Көнеүргенч · Дашогуз',     temp: 34, alert: 'EC 4.2 mS/cm — critical salinity', alertRu: 'ЕС 4.2 — засоление крит.', advice: 'Leaching irrigation scheduled in 2 days',        adviceRu: 'Промывной полив запланирован через 2 дня',  color: '#EF4444' },
}

function aiAnswer(q: string) {
  const lq = q.toLowerCase()
  return AI_ANSWERS.find(a => a.q.split('|').some(k => lq.includes(k)))?.a
    ?? 'Analyzing field conditions… Try: salinity, cotton, laser, or weather.'
}

interface Msg { role: 'user'|'ai'; text: string }

export function HelpCenterPage({ region }: { region?: string | null }) {
  const { lang } = useLang()
  const isRu = lang === 'ru'
  const tips = isRu ? TIPS_RU : TIPS_EN
  const [messages, setMessages] = useState<Msg[]>([
    { role:'ai', text: isRu ? 'Привет! Я ИИ-агроном ARGOAU. Спросите про засоление, хлопок, погоду или статус лазера.' : "Hello! I'm your ARGOAU AI agronomist. Ask about salinity, cotton, weather, or laser status." }
  ])
  const [input, setInput] = useState('')
  const [tab, setTab] = useState<'tips'|'chat'>('tips')
  const cond = region ? REGION_CONDITIONS[region] : null

  function send() {
    const q = input.trim()
    if (!q) return
    setMessages(p => [...p, { role:'user', text:q }, { role:'ai', text:aiAnswer(q) }])
    setInput('')
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          {isRu ? 'Справочный центр' : 'Help Center'}
        </div>
        <div style={{ fontSize: 9, color: 'var(--text-hint)', marginTop: 3, fontFamily: "'SF Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {isRu ? 'ИИ-агроном · Аналитика и советы' : 'AI Agronomist · Tips & Analytics'}
        </div>
      </div>

      {/* Region conditions widget */}
      {cond && (
        <div style={{
          flexShrink: 0, borderRadius: 6, padding: '12px 14px',
          background: `${cond.color}10`,
          border: `1px solid ${cond.color}35`,
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          boxShadow: `0 0 20px ${cond.color}12`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Sparkles size={10} style={{ color: cond.color }} />
                <span style={{ fontSize: 8, fontWeight: 800, color: cond.color, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                  {isRu ? 'Рекомендация AI' : 'AI Recommendation'}
                </span>
                <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.55)', fontFamily: "'SF Mono',monospace", background: 'rgba(255,255,255,0.10)', padding: '1px 5px', borderRadius: 2 }}>
                  {cond.temp}°C
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                {isRu ? cond.titleRu : cond.title}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: cond.color, marginBottom: 3 }}>
                ⚡ {isRu ? cond.alertRu : cond.alert}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {isRu ? cond.adviceRu : cond.advice}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab switcher */}
      <div style={{
        display: 'flex', gap: 2, padding: '3px', borderRadius: 6, flexShrink: 0,
        background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.55)',
      }}>
        {(['tips','chat'] as const).map(id => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '7px', borderRadius: 4,
            background: tab === id ? 'rgba(255,255,255,0.88)' : 'transparent',
            color: tab === id ? 'var(--text-primary)' : 'var(--text-hint)',
            fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
            boxShadow: tab === id ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s',
          }}>
            {id === 'tips' ? <BookOpen size={12} /> : <Lightbulb size={12} />}
            {id === 'tips' ? (isRu ? 'Советы' : 'Tips') : (isRu ? 'ИИ-чат' : 'AI Chat')}
          </button>
        ))}
      </div>

      {tab === 'tips' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }}>
          {tips.map((tip, i) => (
            <div key={i} className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 5, flexShrink: 0, marginTop: 1,
                background: `${tip.color}14`, border: `1px solid ${tip.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <tip.Icon size={12} style={{ color: tip.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{tip.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip.body}</div>
              </div>
              <ChevronRight size={13} style={{ color: 'var(--text-hint)', flexShrink: 0, marginTop: 6 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', gap: 8 }}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1,
            padding: '10px 12px', borderRadius: 6,
            background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.55)',
            scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '8px 12px', fontSize: 13, lineHeight: 1.5, maxWidth: '88%',
                  background: m.role==='user' ? 'var(--text-primary)' : 'rgba(255,255,255,0.88)',
                  color: m.role==='user' ? '#fff' : 'var(--text-primary)',
                  borderRadius: m.role==='user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  backdropFilter: 'blur(12px)',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', height: 44, flexShrink: 0,
            background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.60)', borderRadius: 6,
          }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
              placeholder={isRu ? 'Спросите ИИ-агронома…' : 'Ask the AI agronomist…'}
              style={{ flex: 1, fontSize: 13, outline: 'none', background: 'transparent', color: 'var(--text-primary)', border: 'none' }} />
            <button onClick={send} disabled={!input.trim()} style={{
              width: 30, height: 30, borderRadius: 4, flexShrink: 0,
              background: input.trim() ? 'var(--text-primary)' : 'rgba(60,60,67,0.08)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: input.trim() ? 1 : 0.4,
            }}>
              <Send size={12} style={{ color: input.trim() ? '#fff' : 'var(--text-hint)' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
