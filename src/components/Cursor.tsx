'use client'

import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'

/** Dot that trails the pointer; grows with a label over elements marked data-cursor="Label". */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return

    // The dot is a 96px circle scaled down, so size changes stay on the compositor.
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 10 / 96, autoAlpha: 0 })
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    let label = ''
    let shown = false

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.to(el, { autoAlpha: 1, duration: 0.3 })
      }
      x(e.clientX)
      y(e.clientY)
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button')
      const next = target?.dataset.cursor ?? (target ? '' : null)
      const key = next === null ? 'none' : next
      if (key === label) return
      label = key
      if (labelRef.current) labelRef.current.textContent = next ?? ''
      gsap.to(el, { scale: next ? 1 : next === '' ? 40 / 96 : 10 / 96, duration: 0.5, ease: 'expo.out', overwrite: 'auto' })
    }
    const leave = () => {
      shown = false
      gsap.to(el, { autoAlpha: 0, duration: 0.3 })
    }

    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  })

  return (
    <div
      ref={ref}
      aria-hidden
      className="cursor-only pointer-events-none fixed top-0 left-0 z-[70] flex size-24 items-center justify-center rounded-full bg-paper opacity-0 mix-blend-difference"
    >
      <span ref={labelRef} className="font-pixel text-sm text-ink uppercase" />
    </div>
  )
}
