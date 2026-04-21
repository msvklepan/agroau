/** Pure CSS 3D Claymorphism crop icons — no emojis */

interface ShapeProps { s: number }

function CottonShape({ s }: ShapeProps) {
  const spheres = [
    { x: 0.30, y: 0.14, r: 0.40 },
    { x: 0.12, y: 0.34, r: 0.32 },
    { x: 0.50, y: 0.32, r: 0.34 },
    { x: 0.24, y: 0.48, r: 0.28 },
    { x: 0.46, y: 0.50, r: 0.24 },
  ]
  return (
    <>
      {spheres.map((sp, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: s * sp.r, height: s * sp.r,
          left: s * sp.x, top: s * sp.y,
          borderRadius: '50%',
          background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, #F2EDE6 55%, #DDD8D0 100%)`,
          boxShadow: `0 3px 10px rgba(0,0,0,0.13), inset 0 1.5px 2px rgba(255,255,255,0.95)`,
          zIndex: i,
        }} />
      ))}
      {/* glass stem */}
      <div style={{
        position: 'absolute', width: 3, height: s * 0.22,
        left: '47%', bottom: '4%',
        background: 'linear-gradient(180deg,rgba(74,124,63,0.9),rgba(45,90,39,0.85))',
        borderRadius: 2,
        boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(4px)',
      }} />
    </>
  )
}

function WheatShape({ s }: ShapeProps) {
  const bumpsL = [0.20, 0.30, 0.40, 0.50]
  const bumpsR = [0.25, 0.35, 0.45, 0.55]
  return (
    <>
      {/* stalk */}
      <div style={{
        position: 'absolute', width: 3, height: s * 0.55,
        left: '47%', top: '30%',
        background: 'linear-gradient(180deg,#F59E0B,#D97706)',
        borderRadius: 2,
      }} />
      {/* main grain head */}
      <div style={{
        position: 'absolute',
        width: s * 0.28, height: s * 0.46,
        left: '36%', top: '8%',
        borderRadius: '50% 50% 38% 38%',
        background: 'radial-gradient(ellipse at 38% 28%, #FDE68A 0%, #F59E0B 45%, #B45309 100%)',
        boxShadow: `0 4px 16px rgba(245,158,11,0.45), inset 0 1.5px 3px rgba(255,255,255,0.55)`,
        zIndex: 2,
      }} />
      {/* grain bumps left */}
      {bumpsL.map((y, i) => (
        <div key={`l${i}`} style={{
          position: 'absolute',
          width: s * 0.11, height: s * 0.11,
          left: '25%', top: `${y * 100}%`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30%, #FDE68A, #D97706)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          zIndex: 1,
        }} />
      ))}
      {/* grain bumps right */}
      {bumpsR.map((y, i) => (
        <div key={`r${i}`} style={{
          position: 'absolute',
          width: s * 0.11, height: s * 0.11,
          right: '25%', top: `${y * 100}%`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30%, #FDE68A, #D97706)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          zIndex: 1,
        }} />
      ))}
    </>
  )
}

function MelonShape({ s }: ShapeProps) {
  return (
    <>
      {/* main fruit */}
      <div style={{
        position: 'absolute',
        width: s * 0.68, height: s * 0.70,
        left: '16%', top: '10%',
        borderRadius: '50% 50% 46% 46%',
        background: 'radial-gradient(ellipse at 38% 30%, #B2F5C0 0%, #6EC6FF 45%, #2563EB 100%)',
        boxShadow: `0 4px 18px rgba(110,198,255,0.40), inset 0 2px 4px rgba(255,255,255,0.55)`,
        overflow: 'hidden',
      }}>
        {/* stripes */}
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${i * 28 - 5}%`, width: '14%',
            background: 'rgba(255,255,255,0.07)',
            transform: 'skewX(-6deg)',
          }} />
        ))}
      </div>
      {/* stem */}
      <div style={{
        position: 'absolute', width: 4, height: s * 0.14,
        left: '46%', top: '4%',
        background: 'linear-gradient(180deg,#15803D,#4a7c3f)',
        borderRadius: '2px 2px 0 0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
      }} />
    </>
  )
}

function AlmondShape({ s }: ShapeProps) {
  return (
    <>
      {/* shell */}
      <div style={{
        position: 'absolute',
        width: s * 0.52, height: s * 0.70,
        left: '24%', top: '10%',
        borderRadius: '48% 48% 52% 52% / 40% 40% 60% 60%',
        background: 'radial-gradient(ellipse at 38% 28%, #FEF3C7 0%, #D97706 40%, #92400E 100%)',
        boxShadow: `0 5px 18px rgba(180,83,9,0.35), inset 0 2px 4px rgba(255,255,255,0.45)`,
      }} />
      {/* crease line */}
      <div style={{
        position: 'absolute',
        width: 2, height: s * 0.52,
        left: '49%', top: '14%',
        background: 'rgba(92,40,14,0.25)',
        borderRadius: 1,
      }} />
    </>
  )
}

function TomatoShape({ s }: ShapeProps) {
  return (
    <>
      {/* main sphere */}
      <div style={{
        position: 'absolute',
        width: s * 0.70, height: s * 0.68,
        left: '15%', top: '12%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 28%, #FCA5A5 0%, #EF4444 45%, #991B1B 100%)',
        boxShadow: `0 5px 20px rgba(239,68,68,0.45), inset 0 2px 4px rgba(255,255,255,0.30)`,
      }} />
      {/* gloss highlight */}
      <div style={{
        position: 'absolute',
        width: s * 0.28, height: s * 0.18,
        left: '28%', top: '18%',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.55)',
        filter: 'blur(2px)',
      }} />
      {/* calyx */}
      <div style={{
        position: 'absolute', top: '8%', left: '40%',
        fontSize: s * 0.16, lineHeight: 1,
        color: '#15803D', userSelect: 'none',
      }}>✦</div>
    </>
  )
}

function LaserTurretShape({ s }: ShapeProps) {
  return (
    <>
      {/* outer ring */}
      <div style={{
        position: 'absolute',
        width: s * 0.72, height: s * 0.72,
        left: '14%', top: '12%',
        borderRadius: '50%',
        border: '2px solid rgba(255,59,48,0.7)',
        boxShadow: '0 0 14px rgba(255,59,48,0.55), inset 0 0 10px rgba(255,59,48,0.12)',
      }} />
      {/* inner body */}
      <div style={{
        position: 'absolute',
        width: s * 0.48, height: s * 0.48,
        left: '26%', top: '26%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #374151 0%, #111827 100%)',
        boxShadow: `0 3px 14px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,255,255,0.08)`,
      }} />
      {/* neon core */}
      <div className="laser-pulse" style={{
        position: 'absolute',
        width: s * 0.22, height: s * 0.22,
        left: '39%', top: '39%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40%, #FF8080 0%, #FF3B30 60%, #AA0000 100%)',
      }} />
      {/* 4 prongs */}
      {[0,90,180,270].map(deg => (
        <div key={deg} style={{
          position: 'absolute',
          width: s * 0.08, height: 2,
          left: '46%', top: '49%',
          background: 'rgba(255,59,48,0.7)',
          transformOrigin: '0 50%',
          transform: `rotate(${deg}deg) translateX(${s*0.28}px)`,
          borderRadius: 1,
        }} />
      ))}
    </>
  )
}

function SoilLayerShape({ s }: ShapeProps) {
  const layers = [
    { color: '#92400E', label: '─ Organic',  pct: 30 },
    { color: '#D97706', label: '─ Clay',     pct: 35 },
    { color: '#FCD34D', label: '─ Mineral',  pct: 35 },
  ]
  let top = 0
  return (
    <>
      {/* soil block */}
      <div style={{
        position: 'absolute',
        width: s * 0.70, height: s * 0.72,
        left: '15%', top: '12%',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: `0 5px 18px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.15)`,
      }}>
        {layers.map((l, i) => {
          const pct = l.pct
          const t = top; top += pct
          return (
            <div key={i} style={{
              position: 'absolute',
              left: 0, right: 0,
              top: `${t}%`, height: `${pct}%`,
              background: l.color,
              borderBottom: i < 2 ? '1px dashed rgba(0,0,0,0.12)' : 'none',
            }} />
          )
        })}
        {/* scan overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.04) 0,rgba(0,0,0,0.04) 1px,transparent 1px,transparent 4px)',
        }} />
      </div>
      {/* depth indicator */}
      <div style={{
        position: 'absolute', right: '8%', top: '18%',
        width: 2, height: s * 0.62,
        background: 'linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0.1))',
        borderRadius: 1,
      }} />
    </>
  )
}

function GenericShape({ s, color }: ShapeProps & { color: string }) {
  return (
    <div style={{
      position: 'absolute',
      width: s * 0.56, height: s * 0.56,
      left: '22%', top: '22%',
      borderRadius: '50%',
      background: `radial-gradient(circle at 38% 30%, ${color}FF 0%, ${color}BB 60%, ${color}55 100%)`,
      boxShadow: `0 4px 14px ${color}40, inset 0 1px 3px rgba(255,255,255,0.5)`,
    }} />
  )
}

type CropType = 'cotton' | 'wheat' | 'melon' | 'almond' | 'tomato' | 'laser' | 'soil' | 'generic'

function getCropType(crop: string): CropType {
  const c = crop.toLowerCase()
  if (c.includes('cotton') || c.includes('хлопок') || c.includes('pagta')) return 'cotton'
  if (c.includes('wheat') || c.includes('пшениц') || c.includes('grain')) return 'wheat'
  if (c.includes('melon') || c.includes('дыня')) return 'melon'
  if (c.includes('almond') || c.includes('миндаль')) return 'almond'
  if (c.includes('tomato') || c.includes('томат')) return 'tomato'
  if (c.includes('laser') || c.includes('лазер') || c.includes('code red')) return 'laser'
  if (c.includes('soil') || c.includes('wall') || c.includes('почв')) return 'soil'
  return 'generic'
}

interface Props {
  crop: string
  color: string
  size?: number
}

export function CropIcon3D({ crop, color, size = 56 }: Props) {
  const s = size
  const type = getCropType(crop)
  const r = Math.round(s * 0.26)

  return (
    <div style={{ width: s, height: s, position: 'relative', flexShrink: 0 }}>
      {/* Tile background — squircle */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: r,
        background: `linear-gradient(145deg, ${color}1A 0%, ${color}38 100%)`,
        boxShadow: [
          `0 ${Math.round(s*0.09)}px ${Math.round(s*0.28)}px ${color}20`,
          `0 ${Math.round(s*0.02)}px ${Math.round(s*0.06)}px rgba(0,0,0,0.05)`,
          `inset 0 1px 0 rgba(255,255,255,0.75)`,
          `inset 0 -1px 0 rgba(0,0,0,0.03)`,
        ].join(', '),
      }}>
        {/* crop-specific shape */}
        {type === 'cotton'  && <CottonShape s={s} />}
        {type === 'wheat'   && <WheatShape  s={s} />}
        {type === 'melon'   && <MelonShape  s={s} />}
        {type === 'almond'  && <AlmondShape s={s} />}
        {type === 'tomato'  && <TomatoShape s={s} />}
        {type === 'laser'   && <LaserTurretShape s={s} />}
        {type === 'soil'    && <SoilLayerShape   s={s} />}
        {type === 'generic' && <GenericShape s={s} color={color} />}

        {/* gloss highlight overlay — top-left */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: r,
          background: 'radial-gradient(ellipse at 28% 24%, rgba(255,255,255,0.48) 0%, transparent 58%)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}
