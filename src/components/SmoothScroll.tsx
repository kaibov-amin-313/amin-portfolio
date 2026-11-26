'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap'
import { setLenis } from '@/lib/lenis'

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])
  return null
}
