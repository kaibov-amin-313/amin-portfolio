import AuaField from './AuaField'

export default function ProjectVisual({ slug }: { slug: string }) {
  if (slug === 'aua') {
    return (
      <div className="relative size-full bg-[#0b0b0a]">
        <AuaField />
        <div className="font-pixel pointer-events-none absolute inset-x-4 bottom-4 flex justify-between text-sm text-paper/70">
          <span>AQI FIELD — ALMATY</span>
          <span>IDW · LIVE</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex size-full flex-col justify-between overflow-hidden bg-[#14120f] p-6 text-[#e9e1d3]">
      <div className="font-pixel flex justify-between text-sm text-[#e9e1d3]/60">
        <span>PRIVATE COLLECTION</span>
        <span>BY APPOINTMENT</span>
      </div>
      <p className="display text-center text-[clamp(3rem,9vw,9rem)] leading-[0.8] tracking-[-0.07em]">
        Bashir
        <span className="font-pixel mx-[0.08em] align-middle text-[0.6em] tracking-normal text-[#c8a96a]">&amp;</span>
        Co
      </p>
      <div className="overflow-hidden border-t border-[#e9e1d3]/15 pt-4">
        <div className="marquee font-pixel flex w-max gap-10 text-sm whitespace-nowrap text-[#e9e1d3]/60">
          {Array.from({ length: 2 }, (_, k) => (
            <span key={k} className="flex gap-10">
              {['Luxury sourcing house', 'Kazakhstan', 'A digital gallery', 'Six cinematic pages', 'Quality through restraint'].map((w) => (
                <span key={w}>{w.toUpperCase()} —</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
