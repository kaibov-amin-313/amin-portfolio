'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'

type Sensor = { x: number; y: number; vx: number; vy: number; v: number; phase: number }

const CELL = 14

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
    let raf = 0
    let visible = false
    let w = 0
    let h = 0
    let dpr = 1

    const nodes: Sensor[] = Array.from({ length: sensors }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      v: i === 0 ? 1 : 0.15 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2)
      w = cvs.clientWidth
      h = cvs.clientHeight
      cvs.width = Math.round(w * dpr)
      cvs.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > 1) n.vx *= -1
        if (n.y < 0 || n.y > 1) n.vy *= -1
      }
      const cols = Math.ceil(w / CELL)
      const rows = Math.ceil(h / CELL)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = (c + 0.5) * CELL
          const py = (r + 0.5) * CELL
          let num = 0
          let den = 0
          for (const n of nodes) {
            const dx = px - n.x * w
            const dy = py - n.y * h
            const wgt = 1 / (dx * dx + dy * dy + 900)
            num += wgt * n.v * (0.85 + 0.15 * Math.sin(t / 900 + n.phase))
            den += wgt
          }
          const v = num / den
          const size = 0.6 + v * (CELL * 0.42)
          ctx.fillStyle = v > 0.62 ? `rgba(255,77,46,${0.35 + v * 0.65})` : `rgba(236,235,230,${0.12 + v * 0.55})`
          ctx.fillRect(px - size / 2, py - size / 2, size, size)
        }
      }
      ctx.fillStyle = '#ecebe6'
      ctx.font = `13px ${getComputedStyle(cvs).getPropertyValue('--font-basis33') || 'monospace'}`
      nodes.forEach((n, i) => {
        const x = n.x * w
        const y = n.y * h
        ctx.fillRect(x - 3, y - 3, 6, 6)
        ctx.fillText(`ST-${String(i + 1).padStart(2, '0')} ${Math.round(n.v * 180)}`, x + 8, y - 6)
      })
      if (visible && !reduced) raf = requestAnimationFrame(frame)
    }

    resize()
    frame(0)
    const ro = new ResizeObserver(() => {
      resize()
      frame(performance.now())
    })
    ro.observe(cvs)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduced) raf = requestAnimationFrame(frame)
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
