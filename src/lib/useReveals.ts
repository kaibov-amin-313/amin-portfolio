'use client'

import type { RefObject } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from './gsap'

/**
 * Scroll reveals inside `scope`:
 *  [data-reveal="lines"] — text rises line by line from a mask
 *  [data-reveal="fade"]  — element fades up
 *  [data-reveal="rule"]  — hairline draws from the left
 *  [data-reveal="scrub"] — words light up as you scroll past
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => {
            // The CSS keeps it hidden until the lines are masked and parked below.
            gsap.set(el, { visibility: 'visible' })
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.3,
              ease: 'expo.out',
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            })
          },
        })
      })

      ScrollTrigger.batch('[data-reveal="fade"]', {
        start: 'top 92%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07 }),
      })
      gsap.set('[data-reveal="fade"]', { autoAlpha: 0 })

      gsap.utils.toArray<HTMLElement>('[data-reveal="rule"]').forEach((el) =>
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } },
        ),
      )

      gsap.utils.toArray<HTMLElement>('[data-reveal="scrub"]').forEach((el) => {
        const split = SplitText.create(el, { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        )
      })
    },
    { scope },
  )
}
