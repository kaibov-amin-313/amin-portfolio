export default function SectionHead({ index, title, pixel, count }: { index: string; title: string; pixel: string; count?: number }) {
  return (
    <div className="gutter">
      <div className="flex items-center justify-between pb-5">
        <span data-reveal="fade" className="label">
          ({index})
        </span>
        {count !== undefined && (
          <span data-reveal="fade" className="label">
            {String(count).padStart(2, '0')} entries
          </span>
        )}
      </div>
      <div data-reveal="rule" className="h-px bg-line" />
      <h2 className="mt-8 text-[13vw] md:text-[9vw]">
        <span data-reveal="lines" className="display block">
          {title} <span className="font-pixel text-[1.1em] tracking-normal normal-case">{pixel}</span>
        </span>
      </h2>
    </div>
  )
}
