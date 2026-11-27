'use client'

import { useRef } from 'react'
import { HERO_CHAPTERS } from '@/content'
import { FRAMES } from '@/lib/frames'
import { getFrame, loadFrames } from '@/lib/frameStore'
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '@/lib/gsap'
import { introDone } from '@/lib/intro'

const pad = (n: number) => String(n).padStart(3, '0')

/** Where in the frame the face sits, so cover-cropping never cuts it off on narrow screens. */
const FOCUS = { x: 0.5, y: 0.25 }

export default function Hero() {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const frameLabel = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const cvs = canvas.current!
      const ctx = cvs.getContext('2d')!
      const reduced = prefersReducedMotion()
      let current = 0
      let drawn: HTMLImageElement | null = null

      const draw = (index: number, force = false) => {
        current = Math.max(0, Math.min(FRAMES.count - 1, Math.round(index)))
        const img = getFrame(current)
        if (!img || (!force && img === drawn)) return
        drawn = img
        const s = Math.max(cvs.width / img.naturalWidth, cvs.height / img.naturalHeight)
        const w = img.naturalWidth * s
        const h = img.naturalHeight * s
        ctx.drawImage(img, (cvs.width - w) * FOCUS.x, (cvs.height - h) * FOCUS.y, w, h)
        if (frameLabel.current) frameLabel.current.textContent = `${pad(current + 1)}/${pad(FRAMES.count)}`
      }

      const resize = () => {
        // Past the frame's own resolution extra canvas pixels add cost, not detail.
        const img = getFrame(0)
        const cover = img ? Math.max(cvs.clientWidth / img.naturalWidth, cvs.clientHeight / img.naturalHeight) : 1
        const dpr = Math.max(1, Math.min(window.devicePixelRatio, 1 / cover))
        cvs.width = Math.round(cvs.clientWidth * dpr)
        cvs.height = Math.round(cvs.clientHeight * dpr)
        draw(current, true)
      }
      const onResize = contextSafe!(resize)
      window.addEventListener('resize', onResize)

      const nameSplit = SplitText.create('[data-name]', { type: 'chars', mask: 'chars' })
      const headSplit = SplitText.create('[data-headline] [data-line]', { type: 'lines', mask: 'lines' })
      const chapterSplits = gsap.utils
        .toArray<HTMLElement>('[data-chapter]')
        .map((el) => SplitText.create(el.querySelectorAll('[data-split]'), { type: 'lines', mask: 'lines' }))

      gsap.set(headSplit.lines, { yPercent: 110 })
      chapterSplits.forEach((s) => gsap.set(s.lines, { yPercent: 110 }))
      gsap.set('[data-chapter]', { autoAlpha: 1 })

      // The intro and the scroll timeline never touch the same element/property pair:
      // intro → chars, [data-meta], [data-hud], stage opacity, parallax scale;
      // scroll → name wrappers, [data-meta-row], stage scale.
      if (!reduced) {
        gsap.set(nameSplit.chars, { yPercent: 105 })
        gsap.set(['[data-meta]', '[data-hud]'], { autoAlpha: 0, y: 12 })
        gsap.set('[data-stage]', { scale: 1.18, autoAlpha: 0 })
        gsap.set('[data-parallax]', { scale: 1.15 })
      }

      loadFrames().then(contextSafe!(resize))

      if (reduced) return () => window.removeEventListener('resize', onResize)

      let alive = true
      introDone.then(
        contextSafe!(() => {
          if (!alive) return
          gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .to('[data-stage]', { autoAlpha: 1, duration: 2.4 })
            .to('[data-parallax]', { scale: 1, duration: 2.4 }, 0)
            .to(nameSplit.chars, { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.15)
            .to(['[data-meta]', '[data-hud]'], { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.6)
        }),
      )

      // Scroll choreography, measured in timeline units (≈ 10 across the whole pinned stretch).
      const playhead = { f: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true },
      })

      tl.to(playhead, { f: FRAMES.count - 1, duration: 8.6, onUpdate: () => draw(playhead.f) }, 0)
        .fromTo('[data-stage]', { scale: 1.18 }, { scale: 1, duration: 8.6, immediateRender: false }, 0)
        .to('[data-meta-row]', { autoAlpha: 0, y: -24, duration: 1 }, 0.2)
        .to('[data-name-left]', { xPercent: -60, autoAlpha: 0, duration: 2.6, ease: 'power2.in' }, 0.3)
        .to('[data-name-right]', { xPercent: 60, autoAlpha: 0, duration: 2.6, ease: 'power2.in' }, 0.3)
        .to('[data-hud-progress]', { scaleX: 1, duration: 10 }, 0)

      chapterSplits.forEach((split, i) => {
        const at = 1.8 + i * 1.9
        tl.to(split.lines, { yPercent: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, at)
          .fromTo(`[data-chapter-rule="${i}"]`, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, at)
          .to(split.lines, { yPercent: -110, duration: 0.5, stagger: 0.05, ease: 'power2.in' }, at + 1.3)
          .to(`[data-chapter-rule="${i}"]`, { scaleX: 0, transformOrigin: 'right', duration: 0.5, ease: 'power2.in' }, at + 1.3)
      })

      tl.to('[data-shade]', { autoAlpha: 0.62, duration: 1.6 }, 7.4)
        .to(headSplit.lines, { yPercent: 0, duration: 1.1, stagger: 0.18, ease: 'expo.out' }, 7.6)
        // Scale + radius stays on the compositor; animating clip-path repainted the whole canvas every frame.
        .to('[data-stage-clip]', { scale: 0.93, borderRadius: 14, duration: 1.2, ease: 'power2.inOut' }, 8.8)

      // A touch of depth: the face drifts against the pointer.
      const px = gsap.quickTo('[data-parallax]', 'x', { duration: 1.2, ease: 'power3.out' })
      const py = gsap.quickTo('[data-parallax]', 'y', { duration: 1.2, ease: 'power3.out' })
      const onPointer = contextSafe!((e: PointerEvent) => {
        if (window.scrollY > section.current!.offsetHeight) return
        px((e.clientX / window.innerWidth - 0.5) * -24)
        py((e.clientY / window.innerHeight - 0.5) * -16)
      })
      window.addEventListener('pointermove', onPointer)

      return () => {
        alive = false
        window.removeEventListener('resize', onResize)
        window.removeEventListener('pointermove', onPointer)
      }
    },
    { scope: section },
  )

  return (
    <section id="top" ref={section} aria-label="Introduction" className="relative h-svh motion-safe:h-[420svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-stage-clip className="absolute inset-0 overflow-hidden will-change-transform">
          <div data-stage className="absolute inset-0">
            <div data-parallax className="absolute -inset-6">
              <canvas
                ref={canvas}
                className="size-full"
                role="img"
                aria-label="Portrait of Amin Kaibov"
                style={{ background: 'url(/hero-poster.jpg) center 25% / cover no-repeat' }}
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgb(5_5_5/0.75)_100%),linear-gradient(to_bottom,rgb(5_5_5/0.6),transparent_50%,rgb(5_5_5/0.85))]" />
          <div data-shade className="pointer-events-none invisible absolute inset-0 bg-ink opacity-0" />
        </div>

        {/* Meta row under the nav */}
        <div data-meta-row className="gutter absolute inset-x-0 top-20 grid grid-cols-2 gap-6 text-xs leading-relaxed text-paper/80 md:top-24 lg:grid-cols-4">
          <p data-meta>
            <span className="label mb-2 block">Role</span>
            Full-stack developer &amp;
            <br />
            UI/UX designer
          </p>
          <p data-meta className="text-right lg:text-left">
            <span className="label mb-2 block">Based in</span>
            Almaty, Kazakhstan
            <br />
            43.24°N 76.91°E
          </p>
          <p data-meta className="hidden lg:block">
            <span className="label mb-2 block">Now</span>
            Applying to AI Engineering &amp;
            <br />
            Cybersecurity — South Korea
          </p>
          <p data-meta className="hidden text-right lg:block">
            <span className="label mb-2 block">Class of</span>
            2027
          </p>
        </div>

        {/* Chapters: one caption per pose of the clip */}
        <div className="gutter pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
          {HERO_CHAPTERS.map((c, i) => (
            <div key={c.index} data-chapter className="invisible absolute">
              <div className="flex items-center gap-4">
                <span data-split className="font-pixel block text-lg text-signal">
                  {c.index}
                </span>
                <span data-chapter-rule={i} className="block h-px w-16 origin-left bg-paper/60" />
              </div>
              <p data-split className="display mt-3 text-[12vw] whitespace-nowrap md:text-7xl">
                {c.title}
              </p>
              <p data-split className="mt-4 max-w-[30ch] text-sm leading-relaxed text-paper/75">
                {c.body}
              </p>
            </div>
          ))}
        </div>

        {/* Closing headline */}
        <h2 data-headline className="gutter pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[11vw] md:text-[8.4vw]">
          <span data-line className="display block">Building</span>
          <span data-line className="display block">
            <span className="font-pixel text-[1.12em] tracking-normal normal-case">secure</span> and
          </span>
          <span data-line className="display block">
            <span className="font-pixel text-[1.12em] tracking-normal normal-case">intelligent</span>
          </span>
          <span data-line className="display block">products</span>
        </h2>

        {/* Name */}
        <h1 className="gutter absolute inset-x-0 bottom-16 flex flex-col gap-1 whitespace-nowrap md:bottom-14 md:flex-row md:items-end md:justify-between md:gap-4">
          <span data-name-left className="block">
            <span data-name className="display block text-[28vw] md:text-[16vw]">Amin</span>
          </span>
          <span data-name-right className="block self-end md:self-auto">
            <span data-name className="font-pixel block text-[22vw] leading-[0.8] md:text-[14vw]">KAIBOV</span>
          </span>
        </h1>

        {/* HUD */}
        <div data-hud className="gutter absolute inset-x-0 bottom-5 flex items-center gap-6 text-paper/70">
          <span className="font-pixel text-sm">SCROLL</span>
          <div className="h-px flex-1 bg-line">
            <div data-hud-progress className="h-px w-full origin-left scale-x-0 bg-paper" />
          </div>
          <span className="font-pixel text-sm tabular-nums">
            FRAME <span ref={frameLabel}>001/{pad(FRAMES.count)}</span>
          </span>
        </div>
      </div>
    </section>
  )
}
