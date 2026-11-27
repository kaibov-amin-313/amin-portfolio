'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'

type Sensor = { x: number; y: number; vx: number; vy: number; v: number; phase: number }

const CELL = 14
const LEVELS = 48
const FRAME_MS = 1000 / 30

// One colour per quantised level, so a frame costs LEVELS fills instead of one per dot.
const PALETTE = Array.from({ length: LEVELS }, (_, k) => {
  const v = k / (LEVELS - 1)
  return v > 0.62 ? `rgba(255,77,46,${(0.35 + v * 0.65).toFixed(3)})` : `rgba(236,235,230,${(0.12 + v * 0.55).toFixed(3)})`
})

/**
 * A live dot-matrix of an air-quality field: drifting "stations" are blended with
 * inverse-distance weighting — the same interpolation AUA uses between real sensors.
 */
export default function AuaField({ className = '', sensors = 9 }: { className?: string; sensors?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cvs = ref.current!
    const ctx = cvs.getContext('2d')!
    const reduced = prefersReducedMotion()
    const font = `13px ${getComputedStyle(cvs).getPropertyValue('--font-basis33') || 'monospace'}`
    let raf = 0
    let last = 0
    let visible = false
    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let buckets: number[][] = []

    const nodes: Sensor[] = Array.from({ length: sensors }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0012,
      vy: (Math.random() - 0.5) * 0.0012,
      v: i === 0 ? 1 : 0.15 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      w = cvs.clientWidth
      h = cvs.clientHeight
      cvs.width = Math.round(w * dpr)
      cvs.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / CELL)
      rows = Math.ceil(h / CELL)
    }

    const render = (t: number) => {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > 1) n.vx *= -1
        if (n.y < 0 || n.y > 1) n.vy *= -1
      }
      const sx = nodes.map((n) => n.x * w)
      const sy = nodes.map((n) => n.y * h)
      const sv = nodes.map((n) => n.v * (0.85 + 0.15 * Math.sin(t / 900 + n.phase)))

      buckets = Array.from({ length: LEVELS }, () => [])
      for (let r = 0; r < rows; r++) {
        const py = (r + 0.5) * CELL
        for (let c = 0; c < cols; c++) {
          const px = (c + 0.5) * CELL
          let num = 0
          let den = 0
          for (let k = 0; k < sx.length; k++) {
            const dx = px - sx[k]
            const dy = py - sy[k]
            const wgt = 1 / (dx * dx + dy * dy + 900)
            num += wgt * sv[k]
            den += wgt
          }
          buckets[Math.min(LEVELS - 1, Math.round((num / den) * (LEVELS - 1)))].push(px, py)
        }
      }

      ctx.clearRect(0, 0, w, h)
      for (let k = 0; k < LEVELS; k++) {
        const pts = buckets[k]
        if (!pts.length) continue
        const size = 0.6 + (k / (LEVELS - 1)) * (CELL * 0.42)
        const half = size / 2
        ctx.fillStyle = PALETTE[k]
        ctx.beginPath()
        for (let p = 0; p < pts.length; p += 2) ctx.rect(pts[p] - half, pts[p + 1] - half, size, size)
        ctx.fill()
      }

      ctx.fillStyle = '#ecebe6'
      ctx.font = font
      nodes.forEach((n, i) => {
        ctx.fillRect(sx[i] - 3, sy[i] - 3, 6, 6)
        ctx.fillText(`ST-${String(i + 1).padStart(2, '0')} ${Math.round(n.v * 180)}`, sx[i] + 8, sy[i] - 6)
      })
    }

    const loop = (t: number) => {
      if (t - last >= FRAME_MS) {
        last = t
        render(t)
      }
      if (visible && !reduced) raf = requestAnimationFrame(loop)
    }

    resize()
    render(0)
    const ro = new ResizeObserver(() => {
      resize()
      render(performance.now())
    })
    ro.observe(cvs)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduced) raf = requestAnimationFrame(loop)
    })
    io.observe(cvs)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [sensors])

  return <canvas ref={ref} aria-hidden className={`size-full ${className}`} />
}
