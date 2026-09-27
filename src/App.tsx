import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, Pause, Play } from 'lucide-react'
import Logo from './components/Logo'
import Overlay, { stagger } from './components/Overlay'
import { AboutPanel, AwardsPanel, ProjectsPanel, SecurityPanel, TalkPanel } from './components/Panels'
import {
  AWARDS,
  CERTIFICATES,
  EMAIL,
  NAV_LINKS,
  PANEL_IDS,
  PRIZES,
  SKILLS,
  type NavLink,
  type PanelId,
} from './content'
import heroMp4 from './assets/hero-bg.mp4'
import heroWebm from './assets/hero-bg.webm'
import heroPoster from './assets/hero-poster.jpg'

const pixelWord = 'font-pixel font-normal text-[1.25em] inline-block leading-none align-baseline'

const PANEL_LABELS: Record<PanelId, string> = {
  about: 'About',
  projects: 'Projects',
  awards: 'Awards',
  security: 'Security',
  talk: 'Contact',
}

/** Panels are addressable by URL hash (#projects, #awards …) so they can be linked directly. */
function panelFromHash(): PanelId | null {
  const h = window.location.hash.slice(1)
  return (PANEL_IDS as readonly string[]).includes(h) ? (h as PanelId) : null
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [panel, setPanel] = useState<PanelId | null>(panelFromHash)
  const [motionOn, setMotionOn] = useState(() => !prefersReducedMotion())
  const videoRef = useRef<HTMLVideoElement>(null)

  // Browser back/forward opens and closes panels.
  useEffect(() => {
    const sync = () => setPanel(panelFromHash())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  // Background video: respects reduced-motion and the pause button.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (motionOn) v.play().catch(() => setMotionOn(false))
    else v.pause()
  }, [motionOn])

  const openPanel = useCallback((id: PanelId) => {
    window.history.pushState({ panel: id }, '', `#${id}`)
    setPanel(id)
  }, [])

  const closePanel = useCallback(() => {
    if (window.history.state?.panel) {
      window.history.back() // popstate clears the panel
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setPanel(null)
    }
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const linkProps = (link: NavLink, afterClick?: () => void) =>
    'href' in link
      ? { href: link.href, target: '_blank', rel: 'noopener noreferrer', onClick: afterClick }
      : {
          href: `#${link.panel}`,
          onClick: (e: React.MouseEvent) => {
            e.preventDefault()
            afterClick?.()
            openPanel(link.panel)
          },
        }

  const overlayOpen = menuOpen || panel !== null

  return (
    <div className="page-root relative h-svh w-full overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[center_10%] lg:object-[center_20%]"
        poster={heroPoster}
        autoPlay={motionOn}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={heroWebm} type="video/webm" />
        <source src={heroMp4} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-black/55 lg:hidden" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/55 lg:from-black/70 lg:via-black/10 lg:to-black/40" />

      <div inert={overlayOpen} className="relative z-10 flex h-full flex-col px-5 sm:px-6 md:px-10 lg:px-14">
        {/* 1. NAVBAR */}
        <header className="flex items-center justify-between py-6">
          <a href="/" aria-label="Amin Kaibov — home">
            <Logo />
          </a>
          <nav aria-label="Main">
            <ul className="hidden gap-8 text-sm tracking-wide md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a {...linkProps(link)} className="transition-opacity hover:opacity-70">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="p-2 transition-opacity hover:opacity-70 md:hidden"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex flex-1 flex-col">
          {/* 2. FOUR-COLUMN META GRID */}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            <div>
              <h1 className="text-lg leading-tight tracking-wide md:text-xl">
                <span className="block font-normal">AMIN</span>
                <span className="font-pixel block text-2xl md:text-3xl">KAIBOV</span>
              </h1>
              <p className="font-pixel mt-3 max-w-[26ch] text-sm leading-snug md:text-base text-white/75">
                Full-stack developer &amp; UI/UX designer based in Almaty, Kazakhstan — “design &amp; code as one”
              </p>
            </div>

            <div className="text-right lg:text-left">
              <p className="text-lg leading-tight tracking-wide md:text-xl">
                <span className="block font-normal">DESIGN &amp;</span>
                <span className="font-pixel block text-2xl md:text-3xl">ENGINEERING</span>
              </p>
            </div>

            <div>
              <h2 className="font-pixel mb-3 text-base uppercase tracking-widest text-white/60">What I Do</h2>
              <p className="max-w-[230px] text-xs leading-relaxed text-white/90 sm:text-sm">
                I build AI-driven products and secure, cinematic web experiences — from sensor hardware to the pixel
              </p>
            </div>

            <div className="text-right lg:text-left">
              <h2 className="font-pixel mb-3 text-base uppercase tracking-widest text-white/60">Skills</h2>
              <ul className="space-y-0.5 text-xs leading-relaxed text-white/90 sm:text-sm">
                {SKILLS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. FLEX SPACER */}
          <div className="flex-1" />

          {/* 4. HERO */}
          <div className="grid grid-cols-1 items-end gap-4 sm:gap-6 lg:grid-cols-2">
            <h2
              className="text-3xl font-normal uppercase tracking-wide sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.25rem]"
              style={{ lineHeight: 0.72 }}
            >
              BUILDING
              <br />
              <span className={pixelWord}>SECURE</span> AND
              <br />
              <span className={pixelWord}>INTELLIGENT</span>
              <br />
              PRODUCTS
            </h2>

            <div className="flex flex-col justify-end gap-4 sm:gap-6">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  openPanel('projects')
                }}
                className="flex items-center gap-3 self-start border border-white/30 bg-white/5 px-6 py-3 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <span className="text-sm tracking-wider">VIEW PROJECTS</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>

              <a
                href="#awards"
                onClick={(e) => {
                  e.preventDefault()
                  openPanel('awards')
                }}
                className="flex flex-wrap items-stretch gap-2 self-start text-left text-sm text-white/80 sm:gap-3 lg:self-end"
              >
                <span className="sr-only">View all awards: </span>
                {AWARDS.slice(0, 3).map((a) => (
                  <span key={a.short} className="flex items-center gap-2 bg-[#0B0B0B]/90 px-3 py-2 sm:px-4">
                    <span className="text-sm font-semibold tracking-tight sm:text-base">{a.short}</span>
                    <span className="text-xs text-white/60">{a.count}</span>
                  </span>
                ))}
                <span className="flex items-center gap-2 bg-[#0B0B0B]/90 px-3 py-2 sm:px-4">
                  <span className="text-xs text-white/70">+{AWARDS.length - 3} more</span>
                </span>
              </a>
            </div>
          </div>
        </main>

        {/* 5. FOOTER STRIP */}
        <footer className="mt-3 grid grid-cols-1 items-center gap-2 pt-2 pb-4 sm:mt-5 sm:grid-cols-[1fr_auto] sm:gap-4 sm:pt-4">
          <p className="text-xs text-white/80 sm:text-sm">
            Applying to AI Engineering &amp; Cybersecurity bachelor's programs in South Korea · Class of 2027.{' '}
            <a
              href={`mailto:${EMAIL}`}
              className="text-red-400 underline-offset-4 transition-colors hover:text-red-300 hover:underline"
            >
              Get in touch
            </a>
          </p>
          <div className="flex items-center gap-4 sm:justify-end">
            <p className="hidden text-xs text-white/60 sm:block">
              2 full cases &bull; {PRIZES.length} prizes &bull; {CERTIFICATES.length} certificates
            </p>
            <button
              type="button"
              onClick={() => setMotionOn((m) => !m)}
              aria-pressed={!motionOn}
              aria-label={motionOn ? 'Pause background video' : 'Play background video'}
              className="hidden items-center gap-1.5 text-xs text-white/60 transition-colors hover:text-white sm:flex"
            >
              {motionOn ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
              {motionOn ? 'Pause' : 'Play'}
            </button>
          </div>
        </footer>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <Overlay open={menuOpen} onClose={closeMenu} label="Menu" centered>
        <nav aria-label="Mobile" className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link, i) => {
            const s = stagger(menuOpen, i)
            return (
              <a key={link.label} {...linkProps(link, closeMenu)} {...s} className={`${s.className} text-2xl tracking-widest`}>
                {link.label}
              </a>
            )
          })}
          {(() => {
            const s = stagger(menuOpen, NAV_LINKS.length)
            return (
              <button
                type="button"
                onClick={() => setMotionOn((m) => !m)}
                aria-pressed={!motionOn}
                {...s}
                className={`${s.className} mt-4 flex items-center gap-2 text-xs tracking-widest text-white/60`}
              >
                {motionOn ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
                {motionOn ? 'PAUSE BACKGROUND VIDEO' : 'PLAY BACKGROUND VIDEO'}
              </button>
            )
          })()}
        </nav>
      </Overlay>

      {/* CONTENT PANELS */}
      <Overlay open={panel === 'projects'} onClose={closePanel} label={PANEL_LABELS.projects}>
        <ProjectsPanel open={panel === 'projects'} />
      </Overlay>
      <Overlay open={panel === 'awards'} onClose={closePanel} label={PANEL_LABELS.awards}>
        <AwardsPanel open={panel === 'awards'} />
      </Overlay>
      <Overlay open={panel === 'security'} onClose={closePanel} label={PANEL_LABELS.security}>
        <SecurityPanel open={panel === 'security'} />
      </Overlay>
      <Overlay open={panel === 'about'} onClose={closePanel} label={PANEL_LABELS.about}>
        <AboutPanel open={panel === 'about'} />
      </Overlay>
      <Overlay open={panel === 'talk'} onClose={closePanel} label={PANEL_LABELS.talk}>
        <TalkPanel open={panel === 'talk'} />
      </Overlay>
    </div>
  )
}
