'use client'

import { EMAIL, GITHUB } from '@/content'
import { scrollToTarget } from '@/lib/lenis'
import { useAlmatyTime } from '../useAlmatyTime'

export default function Contact() {
  const time = useAlmatyTime()
  return (
    <footer id="contact" className="gutter relative flex min-h-svh flex-col justify-between overflow-hidden bg-paper pt-28 pb-8 text-ink">
      <div className="grid gap-8 md:grid-cols-12">
        <p className="label !text-ink/50 md:col-span-3">(05) Contact</p>
        <p className="max-w-[36ch] text-lg leading-snug md:col-span-5">
          Applying to AI Engineering &amp; Cybersecurity bachelor&apos;s programs in South Korea — Class of 2027. Open to conversations about research, products and collaboration.
        </p>
      </div>

      <div>
        <h2 className="text-[17vw] md:text-[14.5vw]">
          <span data-reveal="lines" className="display block">
            Let&apos;s <span className="font-pixel text-[1.1em] tracking-normal normal-case">talk</span>
          </span>
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          data-cursor="Write"
          className="group mt-6 inline-flex items-center gap-4 text-[6.2vw] font-medium tracking-[-0.04em] md:text-[3.6vw]"
        >
          <span className="relative">
            {EMAIL}
            <span className="absolute -bottom-1 left-0 h-[0.06em] w-full origin-right scale-x-0 bg-signal transition-transform duration-700 ease-expo group-hover:origin-left group-hover:scale-x-100" />
          </span>
          <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-2 group-hover:-translate-y-2">
            ↗
          </span>
        </a>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-6 border-t border-ink/15 pt-6 text-xs tracking-[0.12em] uppercase md:grid-cols-4">
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-signal">
          GitHub ↗
        </a>
        <span className="font-pixel text-sm tracking-normal">ALMATY {time} — UTC+5</span>
        <span className="text-ink/60">No trackers. No third-party requests.</span>
        <button type="button" onClick={() => scrollToTarget(0)} className="text-left uppercase hover:text-signal md:text-right">
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
