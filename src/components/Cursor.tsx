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

    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    let label = ''

    const move = (e: PointerEvent) => {
      gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' })
      x(e.clientX)
      y(e.clientY)
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button')
      const next = target?.dataset.cursor ?? (target ? '' : null)
      const key = next === null ? 'none' : next
      if (key === label) return
      label = key
      if (labelRef.current) labelRef.current.textContent = next ?? ''
      gsap.to(el, {
        width: next ? 96 : next === '' ? 40 : 10,
        height: next ? 96 : next === '' ? 40 : 10,
        duration: 0.5,
        ease: 'expo.out',
      })
    }
    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 })

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
      className="cursor-only pointer-events-none fixed top-0 left-0 z-[70] flex size-2.5 items-center justify-center rounded-full bg-paper opacity-0 mix-blend-difference"
    >
      <span ref={labelRef} className="font-pixel text-sm text-ink uppercase" />
    </div>
  )
}
