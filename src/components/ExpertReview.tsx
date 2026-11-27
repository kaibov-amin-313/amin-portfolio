import type { Review } from '@/content'
import { AWARD_DOCS } from '@/lib/awardDocs'
import AwardDocs from './AwardDocs'

export default function ExpertReview({ review: r }: { review: Review }) {
  const docs = AWARD_DOCS[r.id]
  return (
    <div className="mt-[12vh] grid gap-10 md:grid-cols-12">
      <h2 className="label md:col-span-3">(Expert review)</h2>
      <div className="md:col-span-8 md:col-start-5">
        <p data-reveal="fade" className="font-pixel inline-flex items-center gap-2 text-lg text-signal">
          <span aria-hidden className="inline-block size-1.5 bg-signal" />
          {r.verdict}
        </p>
        <blockquote className="mt-6">
          <p data-reveal="lines" className="text-2xl leading-[1.15] tracking-[-0.025em] md:text-4xl">
            “{r.quote}”
          </p>
          <footer data-reveal="fade" className="mt-8 text-sm leading-relaxed">
            <span className="text-paper">{r.reviewer}</span>
            <span className="text-paper/50"> — {r.year}</span>
            {r.credentials.map((c) => (
              <span key={c} className="block text-paper/60">
                {c}
              </span>
            ))}
          </footer>
        </blockquote>
        <p data-reveal="fade" className="mt-4 text-xs leading-relaxed text-paper/40">
          Review of “{r.topic}”, {r.direction}. Translated from Russian.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {[
            { title: 'Strengths', items: r.strengths, mark: '+' },
            { title: 'Reviewer’s notes', items: r.notes, mark: '–' },
          ].map((group) => (
            <div key={group.title} data-reveal="fade">
              <h3 className="label">{group.title}</h3>
              <ul className="mt-4">
                {group.items.map((item) => (
                  <li key={item} className="grid grid-cols-[1.25rem_1fr] border-t border-line py-4 text-sm leading-relaxed text-paper/80">
                    <span aria-hidden className="font-pixel text-paper/40">
                      {group.mark}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {docs && (
          <div data-reveal="fade" className="mt-8">
            <AwardDocs title={`Expert review — ${r.topic}`} docs={docs} label="View review" />
          </div>
        )}
      </div>
    </div>
  )
}
