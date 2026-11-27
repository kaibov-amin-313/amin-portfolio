import { AWARDS } from '@/content'
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
    </section>
  )
}
