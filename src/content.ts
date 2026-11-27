export const EMAIL = 'kaibovamin313@gmail.com'
export const GITHUB = 'https://github.com/kaibov-amin-313'
export const SITE_URL = 'https://amin-kaibov.vercel.app'

export const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Awards', href: '#awards' },
  { label: 'Security', href: '#security' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
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

export const STACK = [...SKILLS, 'Git', 'Vercel', 'Prisma', 'Neon']

/** The hero clip is split into chapters; each caption shows while its part of the clip plays. */
export const HERO_CHAPTERS = [
  { index: '01', title: 'Design', body: 'Interfaces where typography, spacing and motion do the work.' },
  { index: '02', title: 'Engineering', body: 'Full-stack systems — from ESP8266 sensors to the pixel.' },
  { index: '03', title: 'Security', body: 'Every packet is untrusted until it proves otherwise.' },
]

export type Project = {
  slug: string
  index: string
  name: string
  pixelWord: string
  tagline: string
  description: string
  points: string[]
  stack: string[]
  links: { label: string; href: string }[]
  meta: string[]
  year: string
  role: string
  award?: string
  team?: string
  review?: Review
}

export type Review = {
  id: string
  topic: string
  direction: string
  verdict: string
  quote: string
  strengths: string[]
  notes: string[]
  reviewer: string
  credentials: string[]
  year: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'aua',
    index: '01',
    name: 'AUA',
    pixelWord: 'AIR',
    tagline: 'Hyperlocal air-quality monitoring for Almaty',
    description:
      'A full platform that fuses a self-built sensor network with open weather data to give residents street-level air quality — not one number for the whole city. It reports how confident each estimate is and marks the “blind zones” where no station can see.',
    points: [
      'Own ESP8266 + MQ-135 gas-sensor station with T/RH compensation — one physical node live, six more simulated while the network is built out',
      'Sensor fusion with Open-Meteo background data (IDW / gaussian)',
      '6-hour forecast — gradient-boosted trees built from scratch (37 features, retrains every 30 min), falling back to Holt’s method while data accumulates',
      'Anomaly detection + event classifier: fire, gas leak, traffic, inversion',
      'Coverage map with blind zones, official-vs-local "gap" comparison',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Leaflet', 'Node.js', 'Fastify', 'SQLite', 'ESP8266'],
    links: [
      { label: 'Live site', href: 'https://aua-almaty.vercel.app' },
      { label: 'Source', href: 'https://github.com/kaibov-amin-313/-hilli-express' },
    ],
    meta: ['Smart City', 'GreenTech', 'B2G'],
    year: '2026',
    role: 'Full-stack, hardware, ML',
    award: 'TechVision Hackathon 2026 — 1st place',
    review: {
      id: 'aua-review-2026',
      topic: 'Air blind zones: a hyperlocal sensor network and mathematical modelling — AUA',
      direction: 'Information Systems and Technologies',
      verdict: 'Recommended for defence',
      quote:
        'The author built the physical ESP8266 + MQ-135 station himself and designed the platform architecture and the algorithmic pipeline. For a school project, this is a high level of independence.',
      strengths: [
        'A working, verifiable result: the service is public and the code is open, which makes it reproducible.',
        'Scientific honesty: the limitations are stated outright — MQ sensors are not reference-grade, part of the network runs in demo mode, the ML forecast temporarily gives way to Holt’s method, thresholds are set by expert judgement; MAE/RMSE are not reported while data is insufficient.',
        'The notion of a “blind zone”, and an explicit confidence for each estimate instead of an arbitrary number.',
        'Practical value: school monitoring, planning where to place sensor posts, education projects; a low-cost network node.',
      ],
      notes: [
        'Field data so far come from one real station; the other six run as generators. The study should continue.',
        'MQ-series sensors measure gases, not particulate matter, while the motivation is built on PM2.5 and the calculations use µg/m³ — the link between the gas-sensor signal and PM2.5 should be explained.',
      ],
      reviewer: 'V. F. Grishchenko',
      credentials: [
        'Head of the Space Systems Reliability Laboratory, Institute of the Ionosphere',
        'Cand. Sc. (Phys.–Math.); Academician of the International Academy of Sciences of Eurasia',
        'Vice-President of the Small Academy of Sciences of Kazakhstan',
      ],
      year: '2026',
    },
  },
  {
    slug: 'almaty-suborbital',
    index: '02',
    name: 'ALMATY HUB',
    pixelWord: 'ORBIT',
    tagline: 'Can Almaty become a hub for suborbital passenger flights?',
    description:
      'A research project with its own physics model: Starship-class point-to-point flights from Almaty to 15 world cities, compared with a Boeing 777 on time, g-load, energy, emissions and cost — ending in an honest verdict on whether Almaty can be the hub.',
    points: [
      'Own trajectory model in Python — numerical integration in polar coordinates, US Standard Atmosphere 1976, variable mass, Earth-rotation correction',
      '15 cities × 3 cabins (100 / 400 / 1,000 seats): burnout speed and altitude solved per city to land on target without exceeding the g-limit',
      'New York in 35 minutes instead of 12.5 hours — 21.7× faster; every city within 16–43 minutes, ascent capped at 3 g',
      "Validated twice: against Kepler's analytical solution and SpaceX's announced New York–Shanghai flight — 38.8 vs 39 min, under 1% off",
      'Found and fixed a range bug that left New York 1,256 km short; all 15 routes recomputed and every conclusion re-checked',
      'The costs, stated up front: ~47× the energy per passenger of a 777 and 38 t of CO₂ per seat; Almaty ranks last of six candidate hubs but holds the long-haul niche',
    ],
    stack: ['Python', 'NumPy', 'SciPy', 'Next.js', 'TypeScript', 'Three.js', 'GSAP'],
    links: [{ label: 'Live site', href: 'https://almaty-suborbital-hub.vercel.app' }],
    meta: ['Aerospace', 'Research', 'Data viz'],
    year: '2026',
    role: 'Co-author — model, analysis, site',
    team: 'With Georgy Lakhonin · Lyceum No. 166 · supervisor A. V. Berkman',
  },
  {
    slug: 'bashir-co',
    index: '03',
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
    links: [{ label: 'Live site', href: 'https://bashir-co.vercel.app' }],
    meta: ['Luxury', 'Editorial', 'Motion'],
    year: '2026',
    role: 'Design, front-end, motion',
  },
]

export type Award = {
  id: string
  rank: string
  title: string
  detail: string
  date: string
}

export const AWARDS: Award[] = [
  {
    id: 'techvision-2026',
    rank: '1st',
    title: 'TechVision Hackathon 2026',
    detail: 'Smart City & GreenTech track. Team Chilli Express, Nazarbayev University, Astana. Project: AUA.',
    date: '27.07.2026',
  },
  {
    id: 'future-with-ai-2025',
    rank: '1st',
    title: 'Future with AI 2025',
    detail: 'International hackathon, UX/UI track, Senior level.',
    date: '2025',
  },
  {
    id: 'zertte-2025',
    rank: '2nd',
    title: 'ZERTTE Championship 2025',
    detail: 'Microcontrollers category.',
    date: '2025',
  },
  {
    id: 'teniz-conference-2026',
    rank: '2nd',
    title: 'AI-Physics-Math-Chemistry-Tech Conference',
    detail:
      'V School-Student Scientific & Technical Conference "Artificial Intelligence – Physics – Mathematics – Chemistry – Technics and Technology," organized by Teniz. With Osman Malsagov. Almaty.',
    date: '11.03.2026',
  },
  {
    id: 'robotics-for-good-2025',
    rank: 'Part.',
    title: 'Robotics for Good Youth Challenge',
    detail: 'AI for Good Impact Initiative × Haileybury Almaty × DARYN.',
    date: '22.11.2025',
  },
  {
    id: 'ionosphere-2025',
    rank: 'Cert',
    title: 'Institute of Ionosphere RK',
    detail: 'Certificate of participation.',
    date: '28.05.2025',
  },
  {
    id: 'atu-2026',
    rank: 'Cert',
    title: 'Almaty Technological University',
    detail:
      'Active participation in the International Scientific & Practical Conference among university students and school pupils — Department of Machines & Apparatus of Production Processes, Faculty of Intelligent & Engineering Systems.',
    date: '2026',
  },
]

export const PRIZES = AWARDS.filter((a) => /^[123](st|nd|rd)$/.test(a.rank))
export const CERTIFICATES = AWARDS.filter((a) => !PRIZES.includes(a))

export type Publication = {
  id: string
  title: string
  originalTitle: string
  authors: string[]
  me: string
  collection: string
  editors: string
  venue: string
  place: string
  year: string
  pages: string
  isbn: string
  section: string
  languages: string
  supervisors: string
  summary: string
}

export const PUBLICATIONS: Publication[] = [
  {
    id: 'man-theses-2025',
    title: 'Search for earthquake precursors',
    originalTitle: 'Поиск предвестников землетрясений',
    authors: ['G. Lakhonin', 'D. Kunakbayev', 'A. Khamza', 'K. Shirin', 'A. Kaibov'],
    me: 'A. Kaibov',
    collection: 'Theses of Reports of the 49th Republican Scientific and Practical Conference of the Small Academy of Sciences of the Republic of Kazakhstan',
    editors: 'V. F. Grishchenko, A. Kalybekova',
    venue: 'Al-Farabi Kazakh National University, May 2025',
    place: 'Almaty',
    year: '2025',
    pages: '28–29',
    isbn: '978-601-80370-7-8',
    section: 'Geophysics',
    languages: 'Russian & Kazakh',
    supervisors: 'A. V. Berkman (Lyceum No. 166); scientific supervisor V. F. Grishchenko, Cand. Sc. (Phys.–Math.)',
    summary:
      'A portable station, shielded from outside interference, that sends readings to a server, logs them locally and warns people on site. Over 11 months of operation it flagged foreshock and aftershock activity at least 5 minutes ahead with 71% accuracy; the work also includes a prototype of a digital alert system.',
  },
]

export type PathStep = {
  kind: 'Course' | 'Hackathon' | 'Milestone'
  title: string
  org: string
  detail: string
  hours?: string
}

/** Learning path, oldest first. Milestones point at things shown elsewhere on the site. */
export const PATH: { year: string; steps: PathStep[] }[] = [
  {
    year: '2019',
    steps: [
      {
        kind: 'Course',
        title: 'Data Master — Mars Station project',
        org: 'Algoritmika',
        detail: 'First program that answered back: a chatbot for a mission to Mars.',
      },
    ],
  },
  {
    year: '2021',
    steps: [
      {
        kind: 'Course',
        title: 'Game development in Unity (C#)',
        org: 'Algoritmika',
        detail: 'C# and object-oriented programming; scripted 2D games in Unity with their own storylines, player types, animation and game design.',
        hours: '64 ac. h',
      },
    ],
  },
  {
    year: '2022',
    steps: [
      {
        kind: 'Course',
        title: 'Python Start',
        org: 'Algoritmika',
        detail: 'Python fundamentals, OOP and games in PyGame, applied to automating everyday tasks; the course ended with a team Python hackathon.',
        hours: '64 ac. h',
      },
    ],
  },
  {
    year: '2023',
    steps: [
      {
        kind: 'Course',
        title: 'Python Pro',
        org: 'Algoritmika',
        detail: 'Classes and inheritance, PyGame and PyQt5 desktop apps; wrote my own text-encryption program and a class-based database.',
        hours: '64 ac. h',
      },
      {
        kind: 'Course',
        title: 'Front-end development fundamentals',
        org: 'Algoritmika',
        detail: 'HTML & CSS, responsive layout, JavaScript — arrays, objects, functions; interactive pages that work on any screen.',
        hours: '64 ac. h',
      },
    ],
  },
  {
    year: '2024',
    steps: [
      {
        kind: 'Course',
        title: 'UI/UX interface design',
        org: 'Algoritmika',
        detail: 'Composition, colour and typography, UX, responsive and mobile design, prototyping.',
        hours: '72 ac. h',
      },
      {
        kind: 'Hackathon',
        title: 'Impostor Games 2024 — online GameDev hackathon',
        org: 'Algoritmika',
        detail: 'UX/UI design track, Middle category.',
      },
    ],
  },
  {
    year: '2025',
    steps: [
      {
        kind: 'Course',
        title: 'UX/UI design, second year',
        org: 'FunCode',
        detail: 'Multi-page and mobile interfaces, the Figma toolset, a portfolio site with responsive layouts.',
        hours: '72 ac. h',
      },
      {
        kind: 'Milestone',
        title: 'First publication — Small Academy of Sciences of Kazakhstan',
        org: 'Geophysics section',
        detail: 'Search for earthquake precursors: a portable sensor station, published with ISBN.',
      },
      {
        kind: 'Milestone',
        title: 'Future with AI — 1st place',
        org: 'International hackathon',
        detail: 'UX/UI track, Senior level.',
      },
    ],
  },
  {
    year: '2026',
    steps: [
      {
        kind: 'Course',
        title: 'Web development in Python',
        org: 'FunCode',
        detail: 'Django, Jinja templates and databases; built a game search, a marketplace and a blog.',
        hours: '72 ac. h',
      },
      {
        kind: 'Hackathon',
        title: 'Super Hero Hackathon — 6th international FunCode hackathon',
        org: 'FunCode',
        detail: 'Python Developer track, Middle category — own project built end to end.',
      },
      {
        kind: 'Milestone',
        title: 'TechVision Hackathon — 1st place with AUA',
        org: 'Nazarbayev University, Astana',
        detail: 'Hyperlocal air-quality platform with its own sensor station; later reviewed and recommended for defence.',
      },
    ],
  },
]

export const STATS = [
  { value: PRIZES.length, label: 'Prizes' },
  { value: CERTIFICATES.length, label: 'Certificates' },
  { value: PROJECTS.length, label: 'Full case studies' },
  { value: PUBLICATIONS.length, label: 'Publication' },
]

export const ABOUT = [
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
    body: 'KGU Lyceum No. 166 — final year, graduating 2027. Preparing for IELTS; SAT scheduled for November 2026.',
  },
  {
    title: 'Next',
    body: 'Master software architecture, build products used by thousands of people, and start companies around technology.',
  },
]

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
    intro: 'A portfolio still has an attack surface — mostly the browser.',
    points: [
      'Content-Security-Policy with a fresh nonce on every request: only scripts this server issued can run',
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

export const HMAC_SNIPPET = `// Verify a sensor packet before trusting a single byte of it
const given = Buffer.from(req.headers['x-signature'] ?? '', 'hex')
const expected = createHmac('sha256', deviceSecret(id))
  .update(rawBody)
  .digest()

if (given.length !== expected.length) return reply.code(401).send()
if (!timingSafeEqual(given, expected)) return reply.code(401).send()

await ingest(id, JSON.parse(rawBody))`
