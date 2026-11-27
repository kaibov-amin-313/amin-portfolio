'use client'

import { useRef } from 'react'
import { PATH } from '@/content'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'

export default function Path() {
  const root = useRef<HTMLDivElement>(null)
  const first = PATH[0].year
  const steps = PATH.reduce((n, g) => n + g.steps.length, 0)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '[data-path-fill]',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-path-track]', start: 'top 70%', end: 'bottom 70%', scrub: true } },
      )
    },
    { scope: root },
  )

  return (
    <div ref={root} className="gutter mt-[14vh]">
      <div className="flex items-center justify-between pb-5">
        <span data-reveal="fade" className="label">
          (Path)
        </span>
        <span data-reveal="fade" className="label">
          {first}–{PATH[PATH.length - 1].year} · {steps} steps
        </span>
      </div>
      <div data-reveal="rule" className="h-px bg-line" />
      <h3 className="mt-8 text-[11vw] md:text-[6.5vw]">
        <span data-reveal="lines" className="display block">
          Writing code since <span className="font-pixel text-[1.1em] tracking-normal">{first}</span>
        </span>
      </h3>

      <div data-path-track className="relative mt-[8vh]">
        <div aria-hidden className="absolute top-0 bottom-0 left-[3.5rem] w-px bg-line md:left-[11rem]">
          <div data-path-fill className="size-full origin-top bg-signal motion-safe:scale-y-0" />
        </div>

        {PATH.map((group) => (
          <section key={group.year} aria-label={group.year} className="grid grid-cols-[3.5rem_1fr] pb-14 md:grid-cols-[11rem_1fr]">
            <p className="font-pixel sticky top-28 self-start text-2xl leading-none md:text-5xl">{group.year}</p>
            <ol className="space-y-9 pl-6 md:pl-12">
              {group.steps.map((s) => {
                const milestone = s.kind === 'Milestone'
                return (
                  <li key={s.title} data-reveal="fade" className="relative">
                    <span
                      aria-hidden
                      className={`absolute top-1 -left-[calc(1.5rem+5px)] size-2.5 rounded-full border-2 border-ink md:-left-[calc(3rem+5px)] ${milestone ? 'bg-signal' : 'bg-paper/60'}`}
                    />
                    <p className={`font-pixel text-sm uppercase ${milestone ? 'text-signal' : 'text-paper/40'}`}>
                      {s.kind}
                      {s.hours && <span className="text-paper/40"> · {s.hours}</span>}
                    </p>
                    <h4 className="mt-2 text-xl leading-snug font-medium tracking-[-0.02em] md:text-2xl">{s.title}</h4>
                    <p className="mt-1 text-sm text-paper/50">{s.org}</p>
                    <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-paper/75">{s.detail}</p>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
