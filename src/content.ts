export const EMAIL = 'aminkaibov0@gmail.com'
export const GITHUB = 'https://github.com/kaibov-amin-313'

export const PANEL_IDS = ['about', 'projects', 'awards', 'security', 'talk'] as const
export type PanelId = (typeof PANEL_IDS)[number]

export type NavLink =
  | { label: string; panel: PanelId }
  | { label: string; href: string }

export const NAV_LINKS: NavLink[] = [
  { label: 'ABOUT', panel: 'about' },
  { label: 'PROJECTS', panel: 'projects' },
  { label: 'AWARDS', panel: 'awards' },
  { label: 'SECURITY', panel: 'security' },
  { label: 'GITHUB', href: GITHUB },
  { label: 'TALK', panel: 'talk' },
]

export const SKILLS = [
  'Full-stack (React / Next.js)',
  'UI/UX Design',
  'Node.js / PostgreSQL',
  'Applied ML & Forecasting',
  'IoT Sensor Networks',
  'Secure API Design',
  'Motion & Animation (GSAP)',
]

export type Project = {
  index: string
  name: string
  pixelWord: string
  tagline: string
  description: string
  points: string[]
  stack: string[]
  links: { label: string; href: string }[]
  meta: string
}

export const PROJECTS: Project[] = [
  {
    index: '01',
    name: 'AUA',
    pixelWord: 'AIR',
    tagline: 'Hyperlocal air-quality monitoring for Almaty',
    description:
      'A full platform that fuses a self-built sensor network with open weather data to give residents street-level air quality — not one number for the whole city. Won 1st place at TechVision Hackathon 2026.',
    points: [
      'Own station network — ESP8266 + MQ-135 gas sensors, T/RH compensation',
      'Sensor fusion with Open-Meteo background data (IDW / gaussian)',
      '6-hour forecast — gradient-boosted trees built from scratch, 37 features, retrains every 30 min',
      'Anomaly detection + event classifier: fire, gas leak, traffic, inversion',
      'Coverage map with blind zones, official-vs-local "gap" comparison',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Leaflet', 'Node.js', 'Fastify', 'SQLite', 'ESP8266'],
    links: [
      { label: 'LIVE SITE', href: 'https://aua-almaty.vercel.app' },
      { label: 'SOURCE', href: 'https://github.com/kaibov-amin-313/-hilli-express' },
    ],
    meta: 'Smart City • GreenTech • B2G',
  },
  {
    index: '02',
    name: 'BASHIR&CO',
    pixelWord: 'LUXURY',
    tagline: 'Cinematic website for a private luxury sourcing house',
    description:
      'A six-page cinematic SPA for a luxury sourcing brand in the Kazakh market — designed as a digital gallery rather than a storefront. Typography, spacing and motion carry the design.',
    points: [
      'Six cinematic pages with GSAP scroll choreography and smooth scrolling',
      'Filterable catalog presented as a private collection',
      'Inquiry / contact flow for high-touch clients',
      'Editorial art direction — quality through restraint',
    ],
    stack: ['React', 'TypeScript', 'Tailwind', 'GSAP', 'ScrollTrigger'],
    links: [{ label: 'LIVE SITE', href: 'https://bashir-co.vercel.app' }],
    meta: 'Luxury • Editorial • Motion',
  },
]

export type Award = {
  short: string
  count: string
  title: string
  detail: string
  date: string
}

export const AWARDS: Award[] = [
  {
    short: 'TechVision',
    count: '1st',
    title: 'TechVision Hackathon 2026 — 1st place',
    detail:
      'Smart City & GreenTech track. Team Chilli Express, Nazarbayev University, Astana. Project: AUA.',
    date: '27.07.2026',
  },
  {
    short: 'Future w/ AI',
    count: '1st',
    title: 'Future with AI 2025 — 1st place',
    detail: 'International hackathon, UX/UI track, Senior level.',
    date: '2025',
  },
  {
    short: 'ZERTTE',
    count: '2nd',
    title: 'ZERTTE Championship 2025 — 2nd place',
    detail: 'Microcontrollers category.',
    date: '2025',
  },
  {
    short: 'Robotics for Good',
    count: 'Participant',
    title: 'Robotics for Good Youth Challenge — Participant',
    detail: 'AI for Good Impact Initiative × Haileybury Almaty × DARYN.',
    date: '22.11.2025',
  },
  {
    short: 'Ionosphere Inst.',
    count: 'Cert',
    title: 'Institute of Ionosphere RK — Certificate',
    detail: 'Certificate of participation.',
    date: '28.05.2025',
  },
  {
    short: 'Teniz AI Conf.',
    count: '2nd',
    title: 'AI-Physics-Math-Chemistry-Tech Conference — 2nd place',
    detail:
      'V School-Student Scientific & Technical Conference "Artificial Intelligence – Physics – Mathematics – Chemistry – Technics and Technology," organized by Teniz. With Osman Malsagov. Almaty.',
    date: '11.03.2026',
  },
  {
    short: 'ATU',
    count: 'Cert',
    title: 'Almaty Technological University — Certificate',
    detail:
      'Certificate for active participation in the International Scientific & Practical Conference among university students and school pupils, held by the Department of Machines & Apparatus of Production Processes, Faculty of Intelligent & Engineering Systems.',
    date: '2026',
  },
]

/** Prize = placed 1st–3rd; everything else is a participation certificate. */
export const PRIZES = AWARDS.filter((a) => /^[123](st|nd|rd)$/.test(a.count))
export const CERTIFICATES = AWARDS.filter((a) => !PRIZES.includes(a))

export const EDUCATION = {
  school: 'KGU Lyceum No. 166',
  status: 'final year, graduating 2027',
  tests: 'Preparing for IELTS; SAT scheduled for November 2026',
}

export type SecurityGroup = { title: string; intro: string; points: string[] }

/** Only measures that are actually implemented — each one can be checked in the code. */
export const SECURITY: SecurityGroup[] = [
  {
    title: 'In AUA (backend)',
    intro: 'The sensor network accepts data from physical devices over the internet, so every packet is treated as untrusted.',
    points: [
      'Each sensor packet is signed with HMAC-SHA256 using a per-device secret; the server verifies it in constant time (timingSafeEqual) and rejects malformed signatures before comparing',
      'Admin endpoints (calibration, mock controls) require a bearer token and fail closed — if the token is not configured, access is denied, never opened',
      'Rate limiting (120 requests / minute per IP) and a CORS allow-list',
      'JSON-schema validation on API routes and parameterized SQL (prepared statements) only',
      'Secrets live only in environment variables and are excluded from git',
    ],
  },
  {
    title: 'On this site',
    intro: 'A static site still has an attack surface — mostly the browser.',
    points: [
      'Strict Content-Security-Policy: scripts, fonts and media only from this origin',
      'Clickjacking protection (frame-ancestors none, X-Frame-Options DENY), HSTS, nosniff, strict Referrer-Policy and Permissions-Policy',
      'Zero third-party requests — fonts are self-hosted, no trackers or analytics',
      'A security.txt contact at /.well-known/security.txt and 0 known vulnerabilities in dependencies (npm audit)',
    ],
  },
  {
    title: 'Learning',
    intro: 'Self-studying application security through courses and books, alongside neural-network foundations and AI system architecture — the two fields I am applying to.',
    points: [],
  },
]
