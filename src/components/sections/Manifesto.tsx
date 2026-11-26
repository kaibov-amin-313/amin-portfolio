'use client'

import { useRef } from 'react'
import { STATS } from '@/content'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'

export default function Manifesto() {
  const stats = useRef<HTMLDListElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const o = { v: 0 }
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => void (el.textContent = String(Math.round(o.v)).padStart(2, '0')),
        })
      })
    },
    { scope: stats },
  )

  return (
    <section aria-label="Manifesto" className="gutter py-[18vh]">
      <p className="label mb-10" data-reveal="fade">
        (Manifesto)
      </p>
      <p data-reveal="scrub" className="max-w-[22ch] text-[8.5vw] leading-[1.02] font-medium tracking-[-0.045em] md:max-w-[26ch] md:text-[4.6vw]">
        I think in systems — architecture first, then implementation. Engineering and design are one problem, not two. From sensor hardware to the pixel.
      </p>

      <dl ref={stats} className="mt-[14vh] grid grid-cols-2 border-t border-line md:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} data-reveal="fade" className={`border-line pt-6 pb-2 ${i % 2 ? 'pl-5 md:border-l' : 'pr-5'} ${i === 2 ? 'md:border-l md:pl-5' : ''} ${i > 1 ? 'border-t md:border-t-0' : ''}`}>
            <dt className="label">{s.label}</dt>
            <dd className="display mt-6 text-[22vw] tabular-nums md:text-[9vw]" data-count={s.value}>
              {String(s.value).padStart(2, '0')}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
