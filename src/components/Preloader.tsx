'use client'

import { useRef } from 'react'
import { framesReady, KEY_FRAME_COUNT, loadFrames, onFrameProgress } from '@/lib/frameStore'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import { startIntro } from '@/lib/intro'
import { getLenis, scrollToTarget } from '@/lib/lenis'

const pad = (n: number, len = 3) => String(Math.round(n)).padStart(len, '0')

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const frames = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const html = document.documentElement
      // Links like /#work from a case-study page land on their section once loading is done.
      const jumpToHash = () => {
        const hash = window.location.hash
        if (hash.length > 1 && document.querySelector(hash)) requestAnimationFrame(() => scrollToTarget(hash, true))
      }

      // Back on the home page within the same visit: the frames are cached, so skip the curtain.
      if (framesReady()) {
        gsap.set(root.current, { display: 'none' })
        startIntro()
        jumpToHash()
        return
      }

      history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
      html.classList.add('is-loading')
      requestAnimationFrame(() => getLenis()?.stop())

      const shown = { v: 0 }
      const render = () => {
        if (counter.current) counter.current.textContent = pad(shown.v)
        if (bar.current) bar.current.style.transform = `scaleX(${shown.v / 100})`
      }
      const unsubscribe = onFrameProgress((p) => {
        if (frames.current) frames.current.textContent = `${pad(p * KEY_FRAME_COUNT)}/${pad(KEY_FRAME_COUNT)}`
        gsap.to(shown, { v: p * 100, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: render })
      })

      const minTime = new Promise((r) => setTimeout(r, prefersReducedMotion() ? 0 : 900))
      let cancelled = false

      Promise.all([loadFrames(), minTime]).then(() => {
        if (cancelled) return
        unsubscribe()
        let finished = false
        const finish = () => {
          if (finished) return
          finished = true
          html.classList.remove('is-loading')
          getLenis()?.start()
          startIntro()
          jumpToHash()
        }
        if (prefersReducedMotion()) {
          gsap.set(root.current, { display: 'none' })
          finish()
          return
        }
        // finish is also the onComplete so a throttled background tab can't skip it.
        gsap
          .timeline({ onComplete: finish })
          .to(shown, { v: 100, duration: 0.5, ease: 'power2.out', onUpdate: render })
          .to('[data-out]', { yPercent: -110, duration: 0.8, ease: 'expo.in', stagger: 0.05 })
          .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.25')
          .add(finish, '-=0.75')
          .set(root.current, { display: 'none' })
      })

      return () => {
        cancelled = true
        unsubscribe()
        html.classList.remove('is-loading')
      }
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading"
      className="gutter fixed inset-0 z-[80] flex flex-col justify-between bg-ink pt-6 pb-8 text-paper"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="flex justify-between">
        <span className="line-mask block"><span data-out className="font-pixel block text-sm">AMIN KAIBOV — PORTFOLIO</span></span>
        <span className="line-mask block"><span data-out className="font-pixel block text-sm">©2026</span></span>
      </div>

      <div>
        <div className="flex items-end justify-between">
          <span className="line-mask block">
            <span data-out className="display block text-[28vw] tabular-nums leading-[0.78] md:text-[20vw]">
              <span ref={counter}>000</span>
            </span>
          </span>
          <span className="line-mask mb-[1.5vw] block text-right">
            <span data-out className="font-pixel block text-sm text-dim">
              KEYFRAMES <span ref={frames}>000/{pad(KEY_FRAME_COUNT)}</span>
            </span>
          </span>
        </div>
        <div className="mt-6 h-px w-full bg-line">
          <div ref={bar} className="h-px w-full origin-left scale-x-0 bg-paper" />
        </div>
      </div>
    </div>
  )
}
