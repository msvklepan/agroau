import { useState, useRef } from 'react'
import { Send, Dna, TrendingUp, Zap, Droplets } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { useLang } from '../../contexts/LanguageContext'

interface Genotype {
  id: string; name: string; droughtRes: number; yieldScore: number
  diseaseRes: number; maturity: number; status: 'optimal' | 'candidate' | 'rejected'
}

const GENOTYPES: Genotype[] = [
  { id:'g1', name:'GNN-X7-Aral',   droughtRes:94, yieldScore:88, diseaseRes:79, maturity:128, status:'optimal'   },
  { id:'g2', name:'HYB-Cotton-42', droughtRes:87, yieldScore:92, diseaseRes:84, maturity:135, status:'optimal'   },
  { id:'g3', name:'DRC-Salt-Pro',  droughtRes:91, yieldScore:76, diseaseRes:90, maturity:122, status:'candidate' },
  { id:'g4', name:'GKZ-FastMat',   droughtRes:72, yieldScore:95, diseaseRes:68, maturity:115, status:'candidate' },
  { id:'g5', name:'OLD-Aksu-Ctrl', droughtRes:48, yieldScore:61, diseaseRes:55, maturity:142, status:'rejected'  },
]

const AI_RESPONSES: Record<string, string> = {
  drought:  'Top drought-resistant: GNN-X7-Aral (94%) and DRC-Salt-Pro (91%). Recommend crossing with HYB-Cotton-42 for +12% yield under water stress.',
  yield:    'Highest yield: GKZ-FastMat 95/100. Low disease resistance (68%) risks July–August. Pair with DRC-Salt-Pro for balance.',
  salinity: 'DRC-Salt-Pro: best EC tolerance (>4.2 mS/cm). GNN-X7-Aral is secondary. Avoid GKZ-FastMat on saline fields.',
  disease:  'DRC-Salt-Pro leads disease resistance (90/100). HYB-Cotton-42 at 84 is runner-up. Both suited for IPM under Code Red.',
  hybrid:   'Recommended: GNN-X7-Aral × HYB-Cotton-42. F1 traits: drought 91%, yield 90%, disease 82%, maturity ~131d. Confidence 87%.',
}

function getAiResponse(q: string): string {
  const lq = q.toLowerCase()
  if (lq.includes('drought') || lq.includes('water') || lq.includes('засух')) return AI_RESPONSES.drought
  if (lq.includes('yield')   || lq.includes('урожай'))                         return AI_RESPONSES.yield
  if (lq.includes('salin')   || lq.includes('соль')   || lq.includes('засол')) return AI_RESPONSES.salinity
  if (lq.includes('disease') || lq.includes('болезн') || lq.includes('pest'))  return AI_RESPONSES.disease
  if (lq.includes('hybrid')  || lq.includes('гибрид') || lq.includes('cross')) return AI_RESPONSES.hybrid
  return 'Analyzing genomic database… Ask about drought resistance, yield, salinity tolerance, disease resistance, or hybrid strategy.'
}

interface Msg { role: 'user' | 'ai'; text: string }

const STATUS_STYLE: Record<Genotype['status'], { bg: string; color: string; label: string }> = {
  optimal:   { bg: 'rgba(52,199,89,0.12)',   color: '#34C759', label: 'Optimal'   },
  candidate: { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', label: 'Candidate' },
  rejected:  { bg: 'rgba(255,59,48,0.10)',   color: '#FF3B30', label: 'Rejected'  },
}

const sep = { borderBottom: '0.5px solid rgba(60,60,67,0.07)' }

export function DigitalBreedingModule() {
  const { t } = useLang()
  const br = t.breeding
  const initMsg = 'Hello! I am your AI breeding advisor. Ask me about drought resistance, yield, salinity tolerance, disease resistance, or hybrid strategy.'
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: initMsg }])
  const [input, setInput]       = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  function send() {
    const q = input.trim()
    if (!q) return
    setMessages(p => [...p, { role: 'user', text: q }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setMessages(p => [...p, { role: 'ai', text: getAiResponse(q) }])
      setThinking(false)
      setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 50)
    }, 900)
  }

  return (
    <div className="card flex flex-col gap-0 overflow-hidden">

      {/* Header */}
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sep }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 5,
            background: 'rgba(197,255,74,0.12)', border: '1px solid rgba(197,255,74,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Dna size={12} style={{ color: '#8edb00' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{br.title}</div>
            <div style={{ fontSize: 9, color: 'var(--text-hint)', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'SF Mono',monospace" }}>{br.sub}</div>
          </div>
        </div>
        <Badge variant="lime" dot pulse>Active</Badge>
      </div>

      {/* Sim progress */}
      <div style={{ padding: '10px 14px', ...sep }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>{br.simProg}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'SF Mono',monospace" }}>74%</span>
        </div>
        <div style={{ height: 3, borderRadius: 1, background: 'var(--bg-surface)', overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ width: '74%', height: '100%', background: 'linear-gradient(90deg,#C5FF4A,#8edb00)', borderRadius: 1 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace" }}>627 {br.evaluated}</span>
          <span style={{ fontSize: 9, color: 'var(--text-hint)', fontFamily: "'SF Mono',monospace" }}>{br.eta}</span>
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, ...sep }}>
        {[
          { icon: Droplets,   label: 'Drought', value: '94%',  color: '#5AC8FA' },
          { icon: TrendingUp, label: 'Yield',   value: '92%',  color: '#34C759' },
          { icon: Zap,        label: 'Disease', value: '84%',  color: '#5856D6' },
          { icon: Dna,        label: 'Maturity',value: '128d', color: '#FF8C42' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{
            background: 'var(--bg-surface)', borderRadius: 5, padding: '7px 6px', textAlign: 'center',
            border: `0.5px solid ${color}18`,
          }}>
            <Icon size={10} style={{ color, margin: '0 auto 3px' }} />
            <div style={{ fontSize: 13, fontWeight: 800, color, fontFamily: "'SF Mono',monospace", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 8, color: 'var(--text-hint)', marginTop: 2, fontFamily: "'SF Mono',monospace" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Genotype table */}
      <div style={{ ...sep }}>
        <div style={{
          display: 'grid', padding: '6px 14px',
          gridTemplateColumns: '1fr 36px 36px 36px 36px 58px',
          fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
          color: 'var(--text-hint)', background: 'var(--bg-surface)',
        }}>
          <div>Genotype</div><div style={{ textAlign: 'center' }}>DR%</div><div style={{ textAlign: 'center' }}>YLD</div>
          <div style={{ textAlign: 'center' }}>DIS</div><div style={{ textAlign: 'center' }}>Day</div><div style={{ textAlign: 'center' }}>Status</div>
        </div>
        {GENOTYPES.map((g, i) => {
          const st = STATUS_STYLE[g.status]
          return (
            <div key={g.id} style={{
              display: 'grid', padding: '7px 14px', alignItems: 'center', fontSize: 11,
              gridTemplateColumns: '1fr 36px 36px 36px 36px 58px',
              borderTop: '0.5px solid rgba(60,60,67,0.07)',
              background: i % 2 === 0 ? 'transparent' : 'rgba(60,60,67,0.02)',
            }}>
              <div style={{ fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', paddingRight: 8, color: 'var(--text-primary)' }}>{g.name}</div>
              <div style={{ textAlign: 'center', fontWeight: 700, fontFamily: "'SF Mono',monospace", color: g.droughtRes>80?'#34C759':g.droughtRes>65?'#fbbf24':'#FF3B30' }}>{g.droughtRes}</div>
              <div style={{ textAlign: 'center', fontWeight: 700, fontFamily: "'SF Mono',monospace", color: g.yieldScore>80?'#34C759':'#fbbf24' }}>{g.yieldScore}</div>
              <div style={{ textAlign: 'center', fontWeight: 700, fontFamily: "'SF Mono',monospace", color: g.diseaseRes>75?'#34C759':'#fbbf24' }}>{g.diseaseRes}</div>
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontFamily: "'SF Mono',monospace" }}>{g.maturity}</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: st.bg, color: st.color, letterSpacing: '0.04em' }}>{st.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Chat */}
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-hint)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>{br.advisor}</div>
        <div
          ref={scrollRef}
          style={{
            display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 140,
            padding: '10px 10px', borderRadius: 5,
            background: 'rgba(255,255,255,0.50)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.55)',
            scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent',
          }}
        >
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding: '6px 10px', fontSize: 12, lineHeight: 1.45, maxWidth: '88%',
                background: m.role === 'user' ? 'var(--text-primary)' : 'rgba(255,255,255,0.88)',
                color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                borderRadius: m.role === 'user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}>{m.text}</div>
            </div>
          ))}
          {thinking && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.88)', borderRadius: '10px 10px 10px 3px', fontSize: 12 }}>
                <span style={{ color: 'var(--text-hint)' }}>Analyzing</span>
                <span style={{ display: 'inline-flex', gap: 2, marginLeft: 4 }}>
                  {[0,150,300].map(d => (
                    <span key={d} style={{ display: 'inline-block', width: 3, height: 3, borderRadius: 1, background: 'var(--text-hint)', animation: `dot-ping 1.2s ease-in-out ${d}ms infinite` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', height: 36,
          background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.60)', borderRadius: 5,
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={br.chatPh}
            style={{ flex: 1, fontSize: 12, outline: 'none', background: 'transparent', color: 'var(--text-primary)', border: 'none' }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || thinking}
            style={{
              width: 26, height: 26, borderRadius: 4, flexShrink: 0,
              background: input.trim() ? 'var(--text-primary)' : 'rgba(60,60,67,0.08)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: input.trim() ? 1 : 0.4,
            }}
          >
            <Send size={11} style={{ color: input.trim() ? '#fff' : 'var(--text-hint)' }} />
          </button>
        </div>

        {/* Quick prompts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {br.quickPrompts.map(q => (
            <button key={q} onClick={() => setInput(q)} style={{
              padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
              background: 'rgba(60,60,67,0.06)', color: 'var(--text-secondary)',
              border: '0.5px solid rgba(60,60,67,0.10)', cursor: 'pointer',
              transition: 'all 0.15s',
            }}>{q}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
