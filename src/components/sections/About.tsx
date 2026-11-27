import { ABOUT, STACK } from '@/content'
import SectionHead from '../SectionHead'
import Path from './Path'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-[16vh]">
      <div id="about-title">
        <SectionHead index="04" title="About" pixel="amin" />
      </div>

      <div className="gutter mt-[8vh] grid gap-x-8 gap-y-14 md:grid-cols-12">
        <p data-reveal="lines" className="text-3xl leading-[1.1] tracking-[-0.03em] md:col-span-7 md:text-5xl">
          {ABOUT[0].body}
        </p>
        <dl className="grid gap-10 md:col-span-4 md:col-start-9">
          {ABOUT.slice(1).map((b) => (
            <div key={b.title} data-reveal="fade" className="border-t border-line pt-4">
              <dt className="label">{b.title}</dt>
              <dd className="mt-3 text-base leading-relaxed text-paper/80">{b.body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Path />

      <div className="mt-[12vh] overflow-hidden border-y border-line py-6" aria-label="Stack">
        <div className="marquee flex w-max gap-12 whitespace-nowrap">
          {Array.from({ length: 2 }, (_, k) => (
            <ul key={k} aria-hidden={k === 1} className="flex gap-12">
              {STACK.map((s) => (
                <li key={s} className="display flex items-center gap-12 text-[9vw] md:text-[5vw]">
                  {s}
                  <span className="font-pixel text-[0.5em] text-signal">*</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
