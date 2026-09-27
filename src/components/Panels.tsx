import { ArrowUpRight } from 'lucide-react'
import { AWARDS, EDUCATION, EMAIL, GITHUB, PROJECTS, SECURITY, SKILLS } from '../content'
import { stagger } from './Overlay'

const label = 'font-pixel text-base uppercase tracking-widest text-white/60'

function PanelTitle({ open, top, pixel }: { open: boolean; top: string; pixel: string }) {
  const s = stagger(open, 0)
  return (
    <h2
      {...s}
      className={`${s.className} mb-10 text-3xl uppercase tracking-wide sm:text-4xl md:text-5xl`}
      style={{ ...s.style, lineHeight: 0.8 }}
    >
      {top}{' '}
      <span className="font-pixel inline-block align-baseline text-[1.25em] leading-none">
        {pixel}
      </span>
    </h2>
  )
}

export function ProjectsPanel({ open }: { open: boolean }) {
  return (
    <div className="mx-auto max-w-6xl">
      <PanelTitle open={open} top="Selected" pixel="PROJECTS" />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {PROJECTS.map((p, i) => {
          const s = stagger(open, i + 1)
          return (
            <article
              key={p.name}
              {...s}
              className={`${s.className} flex flex-col border border-white/15 bg-white/[0.03] p-6 sm:p-8`}
            >
              <div className="flex items-baseline justify-between text-xs text-white/50">
                <span className="font-pixel text-base">{p.index}</span>
                <span className="tracking-wider">{p.meta}</span>
              </div>
              <h3 className="mt-4 text-4xl uppercase tracking-wide sm:text-5xl" style={{ lineHeight: 0.85 }}>
                {p.name}
              </h3>
              <p className="mt-3 text-sm text-white/90">{p.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{p.description}</p>

              <p className={`${label} mt-6 mb-2`}>What's inside</p>
              <ul className="space-y-1 text-sm leading-relaxed text-white/80">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="text-white/40">*</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-xs leading-relaxed text-white/50">{p.stack.join(' • ')}</p>

              <div className="mt-6 flex flex-wrap gap-3 pt-2">
                {p.links.length ? (
                  p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 border border-white/30 bg-white/5 px-4 py-2 text-xs tracking-wider backdrop-blur-sm transition-colors hover:bg-white/10"
                    >
                      {l.label} <ArrowUpRight size={14} />
                    </a>
                  ))
                ) : (
                  <span className="bg-[#0B0B0B] px-4 py-2 text-xs tracking-wider text-white/60">
                    CASE STUDY — LINK ON REQUEST
                  </span>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export function AwardsPanel({ open }: { open: boolean }) {
  return (
    <div className="mx-auto max-w-4xl">
      <PanelTitle open={open} top="Awards &" pixel="RECOGNITION" />
      <ul className="border-t border-white/15">
        {AWARDS.map((a, i) => {
          const s = stagger(open, i + 1)
          return (
            <li
              key={a.title}
              {...s}
              className={`${s.className} grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-b border-white/15 py-5 sm:grid-cols-[170px_1fr_auto] sm:gap-x-6`}
            >
              <span className="font-pixel text-2xl leading-none text-white">{a.count}</span>
              <div>
                <p className="text-base text-white/95">{a.title}</p>
                <p className="mt-1 text-sm text-white/60">{a.detail}</p>
              </div>
              <span className="col-start-2 text-xs text-white/50 sm:col-start-auto sm:text-right">
                {a.date}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function AboutPanel({ open }: { open: boolean }) {
  const blocks = [
    {
      title: 'Who',
      body: "I'm a full-stack developer and UI/UX designer from Almaty, Kazakhstan. I think in systems — architecture first, then implementation — and I treat engineering and design as one problem, not two.",
    },
    {
      title: 'Now',
      body: 'Applying to undergraduate programs in AI Engineering & Cybersecurity in South Korea, while studying neural network foundations and AI system architecture.',
    },
    {
      title: 'Values',
      body: 'Quality over quantity. Consistency over decoration. Minimalism over complexity. Long-term thinking over shortcuts.',
    },
    {
      title: 'Education',
      body: `${EDUCATION.school} — ${EDUCATION.status}. ${EDUCATION.tests}.`,
    },
    {
      title: 'Next',
      body: 'Master software architecture, build products used by thousands of people, and start companies around technology.',
    },
  ]
  return (
    <div className="mx-auto max-w-5xl">
      <PanelTitle open={open} top="About" pixel="AMIN" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
        {blocks.map((b, i) => {
          const s = stagger(open, i + 1)
          return (
            <div key={b.title} {...s}>
              <p className={`${label} mb-3`}>{b.title}</p>
              <p className="text-base leading-relaxed text-white/90">{b.body}</p>
            </div>
          )
        })}
        {(() => {
          const s = stagger(open, blocks.length + 1)
          return (
            <div {...s} className={`${s.className} sm:col-span-2`}>
              <p className={`${label} mb-3`}>Stack</p>
              <p className="text-sm leading-relaxed text-white/70">
                {SKILLS.join(' • ')} • Git • Vercel • Prisma • Neon
              </p>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export function TalkPanel({ open }: { open: boolean }) {
  const items = [
    { k: 'Email', v: EMAIL, href: `mailto:${EMAIL}` },
    { k: 'GitHub', v: 'kaibov-amin-313', href: GITHUB },
    { k: 'Based in', v: 'Almaty, Kazakhstan' },
  ]
  return (
    <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center py-10">
      <PanelTitle open={open} top="Let's" pixel="TALK" />
      <div className="space-y-6">
        {items.map((it, i) => {
          const s = stagger(open, i + 1)
          return (
            <div key={it.k} {...s} className={`${s.className} border-b border-white/15 pb-6`}>
              <p className={`${label} mb-2`}>{it.k}</p>
              {it.href ? (
                <a
                  href={it.href}
                  target={it.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-2xl tracking-wide transition-opacity hover:opacity-70 sm:text-3xl"
                >
                  {it.v}
                </a>
              ) : (
                <p className="text-2xl tracking-wide sm:text-3xl">{it.v}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function SecurityPanel({ open }: { open: boolean }) {
  return (
    <div className="mx-auto max-w-5xl">
      <PanelTitle open={open} top="Built" pixel="SECURE" />
      <div className="space-y-10">
        {SECURITY.map((g, i) => {
          const s = stagger(open, i + 1)
          return (
            <section key={g.title} {...s} className={`${s.className} border-t border-white/15 pt-6`}>
              <h3 className={`${label} mb-3`}>{g.title}</h3>
              <p className="max-w-3xl text-base leading-relaxed text-white/90">{g.intro}</p>
              {g.points.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/75">
                  {g.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <span className="text-white/40" aria-hidden="true">*</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
