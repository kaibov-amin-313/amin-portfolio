import AuaField from './AuaField'

// Ballistic arcs from Almaty over an Earth of radius 1500 (centre 400,1900) in SVG units;
// heights are exaggerated, flight times are the model's results.
const ROUTES = [
  { code: 'DEL', min: 16, d: 'M110 428 Q170 241 230 410', x: 230, y: 410 },
  { code: 'DXB', min: 18, d: 'M110 428 Q215 145 320 402', x: 320, y: 402 },
  { code: 'LON', min: 25, d: 'M110 428 Q315 -36 520 405', x: 520, y: 405 },
  { code: 'NYC', min: 35, d: 'M110 428 Q405 -189 700 430', x: 700, y: 430, main: true },
  { code: 'SAO', min: 43, d: 'M110 428 Q435 -246 760 444', x: 760, y: 444 },
]

function SuborbitalVisual() {
  const main = ROUTES.find((r) => r.main)!
  return (
    <div className="relative size-full overflow-hidden bg-[#08090b] text-paper">
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" overflow="visible" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <linearGradient id="earth" gradientUnits="userSpaceOnUse" x1="0" y1="400" x2="0" y2="620">
            <stop offset="0" stopColor="#16181c" />
            <stop offset="1" stopColor="#08090b" />
          </linearGradient>
        </defs>
        <circle cx="400" cy="1900" r="1660" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="2 6" />
        <text x="18" y="282" className="font-pixel" fontSize="15" fill="currentColor" fillOpacity="0.4">
          KÁRMÁN LINE · 100 KM
        </text>
        {ROUTES.map((r) => (
          <g key={r.code}>
            <path d={r.d} fill="none" stroke={r.main ? '#ff4d2e' : 'currentColor'} strokeOpacity={r.main ? 1 : 0.35} strokeWidth={r.main ? 1.6 : 1} />
            <circle cx={r.x} cy={r.y} r="3" fill={r.main ? '#ff4d2e' : 'currentColor'} />
            <text x={r.x} y={r.y - 12} textAnchor="middle" className="font-pixel" fontSize="16" fill={r.main ? '#ff4d2e' : 'currentColor'} fillOpacity={r.main ? 1 : 0.7}>
              {r.code} {r.min}′
            </text>
          </g>
        ))}
        <path d="M110 424 Q405 349 700 426" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeDasharray="1 5" />
        <text x="405" y="378" textAnchor="middle" className="font-pixel" fontSize="14" fill="currentColor" fillOpacity="0.55">
          BOEING 777 · 12.5 H
        </text>
        <circle cx="400" cy="1900" r="1500" fill="url(#earth)" stroke="currentColor" strokeOpacity="0.3" />
        <circle cx="110" cy="428" r="4.5" fill="currentColor" />
        <text x="110" y="458" textAnchor="middle" className="font-pixel" fontSize="16" fill="currentColor">
          ALA
        </text>
        <text x="405" y="108" textAnchor="middle" className="font-pixel" fontSize="15" fill="currentColor" fillOpacity="0.75">
          APOGEE 187 KM · 7.70 KM/S
        </text>
        <g className="motion-reduce:hidden">
          <circle r="5" fill="#ff4d2e">
            <animateMotion dur="5s" repeatCount="indefinite" path={main.d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.6 1" />
          </circle>
        </g>
      </svg>
      <div className="font-pixel pointer-events-none absolute inset-x-4 top-4 flex justify-between text-sm text-paper/70">
        <span>ALMATY → 15 CITIES</span>
        <span>16–43 MIN</span>
      </div>
    </div>
  )
}

export default function ProjectVisual({ slug }: { slug: string }) {
  if (slug === 'almaty-suborbital') return <SuborbitalVisual />
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
