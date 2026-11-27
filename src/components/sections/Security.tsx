import { Fragment } from 'react'
import { HMAC_SNIPPET, SECURITY } from '@/content'
import SectionHead from '../SectionHead'

const TOKEN = /(\/\/.*$|'[^']*'|\b(?:const|if|return|await)\b|\b(?:createHmac|timingSafeEqual)\b)/g

function highlight(line: string) {
  return line.split(TOKEN).map((part, i) => {
    if (!part) return null
    const cls = part.startsWith('//')
      ? 'text-paper/35 italic'
      : part.startsWith("'")
        ? 'text-[#c9d6a3]'
        : /^(const|if|return|await)$/.test(part)
          ? 'text-signal'
          : /^(createHmac|timingSafeEqual)$/.test(part)
            ? 'text-paper underline decoration-signal/60 underline-offset-4'
            : undefined
    return cls ? (
      <span key={i} className={cls}>
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  })
}

export default function Security() {
  const [backend, site, learning] = SECURITY
  return (
    <section id="security" aria-labelledby="security-title" className="py-[16vh]">
      <div id="security-title">
        <SectionHead index="03" title="Built" pixel="secure" />
      </div>

      <div className="gutter mt-[8vh] grid grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <p data-reveal="lines" className="max-w-[28ch] text-2xl leading-snug tracking-[-0.02em] md:text-3xl">
              {backend.intro}
            </p>
            <p data-reveal="fade" className="label mt-8">
              {backend.title}
            </p>
          </div>
        </div>

        <div className="md:col-span-7">
          <figure data-reveal="fade" className="overflow-hidden rounded-xl border border-line bg-[#0b0b0a]">
            <figcaption className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-pixel text-sm text-paper/60">aua/server/ingest.ts — simplified</span>
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2 rounded-full bg-paper/20" />
                <span className="size-2 rounded-full bg-paper/20" />
                <span className="size-2 rounded-full bg-signal" />
              </span>
            </figcaption>
            <pre className="overflow-x-auto p-4 text-[0.7rem] leading-[1.75] sm:p-5 sm:text-[0.8rem] md:text-sm">
              <code>
                {HMAC_SNIPPET.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    <span className="mr-5 inline-block w-5 text-right text-paper/25 select-none">{i + 1}</span>
                    {highlight(line)}
                  </span>
                ))}
              </code>
            </pre>
          </figure>

          <ul className="mt-10">
            {backend.points.map((p, i) => (
              <li key={p} data-reveal="fade" className="grid grid-cols-[3rem_1fr] border-t border-line py-5 text-base leading-relaxed text-paper/85">
                <span className="font-pixel text-paper/40">{String(i + 1).padStart(2, '0')}</span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <div data-reveal="fade">
              <h3 className="label">{site.title}</h3>
              <p className="mt-4 text-paper/70">{site.intro}</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-paper/85">
                {site.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden className="mt-2 inline-block size-1 shrink-0 bg-signal" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal="fade">
              <h3 className="label">{learning.title}</h3>
              <p className="mt-4 text-paper/70">{learning.intro}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
