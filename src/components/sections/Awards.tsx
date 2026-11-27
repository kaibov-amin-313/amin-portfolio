import { AWARDS, PUBLICATIONS } from '@/content'
import { AWARD_DOCS } from '@/lib/awardDocs'
import AwardDocs from '../AwardDocs'
import SectionHead from '../SectionHead'

export default function Awards() {
  return (
    <section id="awards" aria-labelledby="awards-title" className="py-[16vh]">
      <div id="awards-title">
        <SectionHead index="02" title="Awards &" pixel="recognition" count={AWARDS.length} />
      </div>

      <ol className="gutter mt-[8vh]">
        {AWARDS.map((a) => {
          const top = a.rank === '1st'
          const docs = AWARD_DOCS[a.id]
          return (
            <li key={a.id} data-reveal="fade" className="group relative border-b border-line">
              <div className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-700 ease-expo group-hover:scale-y-100" />
              <div className="relative grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-2 py-7 transition-colors duration-500 group-hover:text-ink md:grid-cols-[6rem_minmax(0,1.1fr)_minmax(0,1fr)_8rem] md:items-baseline md:gap-x-8 md:px-4">
                <span className={`font-pixel text-2xl leading-none md:text-3xl ${top ? 'text-signal' : ''}`}>{a.rank}</span>
                <h3 className="text-xl leading-tight font-medium tracking-[-0.02em] md:text-[2.1rem]">{a.title}</h3>
                <p className="col-start-2 max-w-[60ch] text-sm leading-relaxed text-paper/60 transition-colors duration-500 group-hover:text-ink/70 md:col-start-auto">
                  {a.detail}
                </p>
                <div className="col-start-2 flex items-center gap-4 md:col-start-auto md:flex-col md:items-end md:gap-3">
                  <span className="font-pixel text-sm text-paper/50 transition-colors duration-500 group-hover:text-ink/60">{a.date}</span>
                  {docs && <AwardDocs title={a.title} docs={docs} />}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="gutter mt-[14vh]">
        <div className="flex items-center justify-between pb-5">
          <span data-reveal="fade" className="label">
            (Published)
          </span>
          <span data-reveal="fade" className="label">
            {String(PUBLICATIONS.length).padStart(2, '0')} {PUBLICATIONS.length === 1 ? 'paper' : 'papers'}
          </span>
        </div>
        <div data-reveal="rule" className="h-px bg-line" />

        {PUBLICATIONS.map((p) => {
          const docs = AWARD_DOCS[p.id]
          return (
            <article key={p.id} className="grid gap-x-8 gap-y-10 border-b border-line py-12 md:grid-cols-12">
              <div data-reveal="fade" className="md:col-span-3">
                <p className="font-pixel text-3xl leading-none text-signal">Pub.</p>
                <p className="label mt-4">
                  {p.section} · {p.year}
                </p>
              </div>

              <div className="md:col-span-6">
                <h3 data-reveal="lines" className="text-3xl leading-[1.05] font-medium tracking-[-0.03em] md:text-[2.6rem]">
                  {p.title}
                </h3>
                <p data-reveal="fade" className="mt-3 text-sm text-paper/50">
                  «{p.originalTitle}» — published in {p.languages}
                </p>
                <p data-reveal="fade" className="mt-8 max-w-[60ch] text-base leading-relaxed text-paper/80">
                  {p.summary}
                </p>
                <p data-reveal="fade" className="mt-8 max-w-[70ch] border-l border-signal/60 pl-4 text-sm leading-relaxed text-paper/60">
                  {p.authors.map((a, i) => (
                    <span key={a}>
                      {a === p.me ? <strong className="font-medium text-paper">{a}</strong> : a}
                      {i < p.authors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  . {p.title} // <em>{p.collection}</em> / eds. {p.editors}. — {p.place}, {p.year}. — pp. {p.pages}. — ISBN {p.isbn}.
                </p>
              </div>

              <dl data-reveal="fade" className="grid content-start gap-6 text-sm md:col-span-3">
                <div>
                  <dt className="label">ISBN</dt>
                  <dd className="font-pixel mt-2 text-xl text-paper">{p.isbn}</dd>
                </div>
                <div>
                  <dt className="label">Presented at</dt>
                  <dd className="mt-2 leading-relaxed text-paper/80">{p.venue}</dd>
                </div>
                <div>
                  <dt className="label">Supervisors</dt>
                  <dd className="mt-2 leading-relaxed text-paper/80">{p.supervisors}</dd>
                </div>
                {docs && (
                  <div>
                    <AwardDocs title={p.title} docs={docs} label="View pages" />
                  </div>
                )}
              </dl>
            </article>
          )
        })}
      </div>

    </section>
  )
}
