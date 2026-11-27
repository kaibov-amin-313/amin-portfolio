import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ExpertReview from '@/components/ExpertReview'
import ProjectVisual from '@/components/ProjectVisual'
import RevealScope from '@/components/RevealScope'
import Contact from '@/components/sections/Contact'
import { PROJECTS } from '@/content'

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const p = PROJECTS.find((x) => x.slug === slug)
  return p ? { title: p.name, description: `${p.tagline}. ${p.description}` } : {}
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  if (i < 0) notFound()
  const p = PROJECTS[i]
  const next = PROJECTS[(i + 1) % PROJECTS.length]

  return (
    <>
      <RevealScope id="main">
        <article>
          <header className="gutter pt-32 md:pt-40">
            <div className="flex items-center justify-between">
              <Link href="/#work" className="label hover:text-paper">
                ← All work
              </Link>
              <span data-reveal="fade" className="font-pixel text-2xl text-signal">
                {p.index}
              </span>
            </div>
            <h1 className="mt-10 text-[19vw] md:text-[15vw]">
              <span data-reveal="lines" className="display block">
                {p.name}
              </span>
            </h1>
            <div data-reveal="rule" className="mt-8 h-px bg-line" />
            <dl className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
              {[
                ['Year', p.year],
                ['Role', p.role],
                ['Field', p.meta.join(' · ')],
                p.team ? ['Team', p.team] : ['Recognition', p.award ?? '—'],
              ].map(([k, v]) => (
                <div key={k} data-reveal="fade">
                  <dt className="label">{k}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-paper/85">{v}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div data-reveal="fade" className="gutter">
            <div className="h-[70svh] overflow-hidden rounded-2xl border border-line md:h-[86svh]">
              <ProjectVisual slug={p.slug} />
            </div>
          </div>

          <section className="gutter grid gap-10 py-[14vh] md:grid-cols-12">
            <p className="label md:col-span-3">(Overview)</p>
            <div className="md:col-span-8 md:col-start-5">
              <p data-reveal="lines" className="text-3xl leading-[1.12] tracking-[-0.03em] md:text-5xl">
                {p.tagline}.
              </p>
              <p data-reveal="fade" className="mt-8 max-w-[60ch] text-lg leading-relaxed text-paper/75">
                {p.description}
              </p>
            </div>
          </section>

          <section className="gutter pb-[14vh]">
            <div className="grid gap-10 md:grid-cols-12">
              <h2 className="label md:col-span-3">(What&apos;s inside)</h2>
              <ol className="md:col-span-8 md:col-start-5">
                {p.points.map((pt, k) => (
                  <li key={pt} data-reveal="fade" className="grid grid-cols-[4rem_1fr] items-baseline border-t border-line py-7 md:grid-cols-[7rem_1fr]">
                    <span className="font-pixel text-3xl text-paper/40 md:text-5xl">{String(k + 1).padStart(2, '0')}</span>
                    <span className="text-xl leading-snug tracking-[-0.015em] md:text-2xl">{pt}</span>
                  </li>
                ))}
              </ol>
            </div>

            {p.review && <ExpertReview review={p.review} />}

            <div className="mt-[10vh] grid gap-10 md:grid-cols-12">
              <h2 className="label md:col-span-3">(Stack)</h2>
              <ul className="flex flex-wrap gap-2 md:col-span-8 md:col-start-5">
                {p.stack.map((s) => (
                  <li key={s} data-reveal="fade" className="rounded-full border border-line px-4 py-2 text-sm text-paper/85">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-[10vh] grid gap-10 md:grid-cols-12">
              <h2 className="label md:col-span-3">(Links)</h2>
              <ul className="flex flex-wrap gap-3 md:col-span-8 md:col-start-5">
                {p.links.map((l) => (
                  <li key={l.href} data-reveal="fade">
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="Open"
                      className="group inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3 text-sm font-medium tracking-[0.08em] text-ink uppercase transition-colors hover:bg-signal"
                    >
                      {l.label}
                      <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Link href={`/projects/${next.slug}`} data-cursor="Next" className="gutter group block border-t border-line py-[12vh]">
            <span className="label">Next project — {next.index}</span>
            <span className="display mt-6 block text-[17vw] transition-transform duration-700 ease-expo group-hover:translate-x-4 md:text-[12vw]">
              {next.name} <span className="font-pixel text-[0.5em] tracking-normal text-signal">→</span>
            </span>
          </Link>
        </article>
        <Contact />
      </RevealScope>
    </>
  )
}
