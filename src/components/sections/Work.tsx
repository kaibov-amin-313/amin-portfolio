'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { PROJECTS } from '@/content'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import ProjectVisual from '../ProjectVisual'
import SectionHead from '../SectionHead'

export default function Work() {
  const list = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]')
      // Each card sinks back as the next one slides over it.
      cards.slice(0, -1).forEach((card, i) => {
        gsap.to(card, {
          scale: 0.9,
          ease: 'none',
          scrollTrigger: { trigger: cards[i + 1].parentElement, start: 'top bottom', end: 'top 6rem', scrub: true },
        })
        gsap.to(card.querySelector('[data-dim]'), {
          opacity: 0.7,
          ease: 'none',
          scrollTrigger: { trigger: cards[i + 1].parentElement, start: 'top bottom', end: 'top 6rem', scrub: true },
        })
      })
      cards.forEach((card) => {
        gsap.fromTo(
          card.querySelector('[data-visual]'),
          { clipPath: 'inset(18% 12% 18% 12%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 30%', scrub: true } },
        )
      })
    },
    { scope: list },
  )

  return (
    <section id="work" aria-labelledby="work-title" className="pt-[12vh]">
      <div id="work-title">
        <SectionHead index="01" title="Selected" pixel="work" count={PROJECTS.length} />
      </div>

      <div ref={list} className="gutter mt-[8vh] pb-[10vh]">
        {PROJECTS.map((p) => (
          <div key={p.slug} className="sticky top-24 mb-[12vh] h-[calc(100svh-8rem)] last:mb-0">
            <Link
              href={`/projects/${p.slug}`}
              data-card
              data-cursor="View"
              className="group relative grid size-full origin-top grid-rows-[auto_1fr] overflow-hidden rounded-2xl border border-line bg-[#0c0c0b] lg:grid-cols-12 lg:grid-rows-1"
            >
              <div className="relative z-10 flex flex-col justify-between gap-6 p-6 md:p-10 lg:col-span-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-pixel text-2xl text-signal">{p.index}</span>
                  <ul className="flex min-w-0 flex-wrap justify-end gap-1.5">
                    {p.meta.map((m) => (
                      <li key={m} className="rounded-full border border-line px-3 py-1 text-[0.68rem] tracking-[0.12em] text-paper/70 uppercase">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="display text-[12.5vw] transition-transform duration-700 ease-expo group-hover:translate-x-2 md:text-[10vw] lg:text-[5.6vw]">{p.name}</h3>
                  <p className="mt-4 max-w-[34ch] text-base leading-snug text-paper/80 md:text-lg">{p.tagline}</p>
                  {p.award && (
                    <p className="font-pixel mt-5 inline-flex items-center gap-2 text-base text-signal">
                      <span className="inline-block size-1.5 bg-signal" /> {p.award}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-line pt-5 text-xs tracking-[0.14em] uppercase">
                  <span className="hidden text-paper/60 sm:inline">
                    {p.year} — {p.role}
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    Case study
                    <span aria-hidden className="inline-block transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </div>
              </div>
              <div data-visual className="relative min-h-0 overflow-hidden lg:col-span-7">
                <div className="size-full transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.03]">
                  <ProjectVisual slug={p.slug} />
                </div>
              </div>
              <div data-dim className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
