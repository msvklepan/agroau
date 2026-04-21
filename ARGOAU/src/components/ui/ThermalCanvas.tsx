import { useEffect, useRef } from 'react'

interface Props {
  emergency: boolean
  width?: number
  height?: number
}

export function ThermalCanvas({ emergency, width = 480, height = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let frame = 0
    let raf: number

    const BLOBS = [
      { bx: 0.22, by: 0.38, r: 13, spd: 0.40, phase: 0.0, dr: 0.012 },
      { bx: 0.55, by: 0.55, r: 10, spd: 0.55, phase: 1.2, dr: 0.018 },
      { bx: 0.71, by: 0.28, r: 12, spd: 0.32, phase: 2.4, dr: 0.010 },
      { bx: 0.36, by: 0.65, r:  8, spd: 0.72, phase: 0.8, dr: 0.022 },
      { bx: 0.63, by: 0.44, r:  9, spd: 0.48, phase: 3.1, dr: 0.015 },
      { bx: 0.48, by: 0.72, r:  6, spd: 0.90, phase: 1.8, dr: 0.028 },
    ]

    function draw() {
      frame++
      const w = canvas!.width
      const h = canvas!.height

      /* ── Base background ── */
      ctx.fillStyle = emergency
        ? '#160000'
        : '#001209'
      ctx.fillRect(0, 0, w, h)

      if (!emergency) {
        /* Slow horizontal crop-row lines */
        const rowOff = (frame * 0.25) % 28
        for (let y = -28 + rowOff; y < h + 28; y += 28) {
          ctx.strokeStyle = 'rgba(0,220,70,0.055)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
          ctx.stroke()
        }
        /* Vertical field seams */
        for (let x = 0; x < w; x += 88) {
          ctx.strokeStyle = 'rgba(0,220,70,0.03)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, h)
          ctx.stroke()
        }

        /* Ground-heat gradient (soil radiating warmth upward) */
        const gGrad = ctx.createLinearGradient(0, h * 0.55, 0, h)
        gGrad.addColorStop(0, 'rgba(0,0,0,0)')
        gGrad.addColorStop(1, 'rgba(255,80,0,0.07)')
        ctx.fillStyle = gGrad
        ctx.fillRect(0, h * 0.55, w, h)

        /* Animated heat blobs (insects) */
        BLOBS.forEach(b => {
          const px = b.bx * w + Math.sin(frame * 0.018 * b.spd + b.phase) * 10
          const py = b.by * h + Math.cos(frame * 0.014 * b.spd + b.phase) * 7
          const pulse = 1 + Math.sin(frame * b.dr * Math.PI) * 0.3

          /* Outer aura */
          const aura = ctx.createRadialGradient(px, py, 0, px, py, b.r * 4 * pulse)
          aura.addColorStop(0,   'rgba(255,140,0,0.22)')
          aura.addColorStop(0.5, 'rgba(255,60,0,0.08)')
          aura.addColorStop(1,   'rgba(255,0,0,0)')
          ctx.fillStyle = aura
          ctx.beginPath()
          ctx.arc(px, py, b.r * 4 * pulse, 0, Math.PI * 2)
          ctx.fill()

          /* Hot core */
          const core = ctx.createRadialGradient(px - b.r * 0.2, py - b.r * 0.2, 0, px, py, b.r * pulse)
          core.addColorStop(0,   'rgba(255,255,210,0.95)')
          core.addColorStop(0.4, 'rgba(255,200,0,0.75)')
          core.addColorStop(1,   'rgba(255,40,0,0.0)')
          ctx.fillStyle = core
          ctx.beginPath()
          ctx.arc(px, py, b.r * pulse, 0, Math.PI * 2)
          ctx.fill()
        })

        /* Moving phosphor scan line */
        const scanY = ((frame * 1.8) % (h + 12)) - 6
        const sl = ctx.createLinearGradient(0, scanY - 3, 0, scanY + 3)
        sl.addColorStop(0,   'rgba(0,255,80,0)')
        sl.addColorStop(0.5, 'rgba(0,255,80,0.65)')
        sl.addColorStop(1,   'rgba(0,255,80,0)')
        ctx.fillStyle = sl
        ctx.fillRect(0, scanY - 3, w, 6)

        /* Faint horizon-like atmospheric haze */
        const haze = ctx.createLinearGradient(0, 0, 0, h * 0.35)
        haze.addColorStop(0, 'rgba(0,80,30,0.06)')
        haze.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = haze
        ctx.fillRect(0, 0, w, h * 0.35)
      } else {
        /* Emergency — red wash */
        const redWash = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.7)
        redWash.addColorStop(0,   'rgba(255,0,0,0.08)')
        redWash.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = redWash
        ctx.fillRect(0, 0, w, h)
      }

      /* CRT phosphor scanlines */
      for (let y = 0; y < h; y += 3) {
        ctx.fillStyle = 'rgba(0,0,0,0.14)'
        ctx.fillRect(0, y, w, 1)
      }

      /* Vignette */
      const vig = ctx.createRadialGradient(w/2, h/2, h * 0.15, w/2, h/2, h * 0.9)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.55)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, w, h)

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [emergency])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
