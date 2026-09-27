import { useCallback, useState } from 'react'
import { Menu, Play } from 'lucide-react'
import Logo from './components/Logo'
import Overlay, { stagger } from './components/Overlay'
import { AboutPanel, AwardsPanel, ProjectsPanel, TalkPanel } from './components/Panels'
import { AWARDS, EMAIL, NAV_LINKS, SERVICES, type NavLink, type PanelId } from './content'
import heroVideo from './assets/hero-bg.mp4'

const pixelWord = 'font-pixel font-normal text-[1.25em] inline-block leading-none align-baseline'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [panel, setPanel] = useState<PanelId | null>(null)

  const closePanel = useCallback(() => setPanel(null), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const linkProps = (link: NavLink, afterClick?: () => void) =>
    'href' in link
      ? { href: link.href, target: '_blank', rel: 'noreferrer', onClick: afterClick }
      : {
          href: `#${link.panel}`,
          onClick: (e: React.MouseEvent) => {
            e.preventDefault()
            afterClick?.()
            setPanel(link.panel)
          },
        }

  return (
    <div className="page-root relative h-screen w-full overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover object-[center_10%] lg:object-[center_20%]"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/55 lg:hidden" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/55 lg:from-black/70 lg:via-black/10 lg:to-black/40" />

      <div className="relative z-10 flex h-full flex-col px-5 sm:px-6 md:px-10 lg:px-14">
        {/* 1. NAVBAR */}
        <nav className="flex items-center justify-between py-6">
          <a href="#" aria-label="Home">
            <Logo />
          </a>
          <ul className="hidden gap-8 text-sm tracking-wide md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a {...linkProps(link)} className="transition-opacity hover:opacity-70">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="p-2 transition-opacity hover:opacity-70 md:hidden"
          >
            <Menu size={24} />
          </button>
        </nav>

        {/* 2. FOUR-COLUMN META GRID */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          <div>
            <h2 className="text-lg leading-tight tracking-wide md:text-xl">
              <span className="block font-normal">AMIN</span>
              <span className="font-pixel block text-2xl md:text-3xl">KAIBOV</span>
            </h2>
            <p className="mt-3 text-[10px] text-white/50">*</p>
            <p className="font-pixel mt-1 text-xs leading-relaxed text-white/60">
              Full-stack developer &amp;
              <br />
              UI/UX designer based in
              <br />
              Almaty, Kazakhstan -
              <br />
              "design &amp; code as one"
            </p>
          </div>

          <div className="text-right lg:text-left">
            <h2 className="text-lg leading-tight tracking-wide md:text-xl">
              <span className="block font-normal">DESIGN &amp;</span>
              <span className="font-pixel block text-2xl md:text-3xl">ENGINEERING</span>
            </h2>
          </div>

          <div>
            <p className="font-pixel mb-3 text-base uppercase tracking-widest text-white/50">What I Do</p>
            <p className="max-w-[220px] text-xs leading-relaxed text-white/90 sm:text-sm">
              I build AI-driven products and cinematic web experiences — from sensor hardware to the pixel
            </p>
          </div>

          <div className="text-right lg:text-left">
            <p className="font-pixel mb-3 text-base uppercase tracking-widest text-white/50">Services</p>
            <ul className="space-y-0.5 text-xs leading-relaxed text-white/90 sm:text-sm">
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. FLEX SPACER */}
        <div className="flex-1" />

        {/* 4. BOTTOM SECTION */}
        <div className="pb-4">
          <div className="grid grid-cols-1 items-end gap-4 sm:gap-6 lg:grid-cols-2">
            <h1
              className="text-3xl font-normal uppercase tracking-wide sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.25rem]"
              style={{ lineHeight: 0.72 }}
            >
              I BUILD THE
              <br />
              <span className={pixelWord}>UNEXPECTED</span> IN
              <br />
              AI &amp; DIGITAL
              <br />
              <span className={pixelWord}>EXPERIENCES</span>
            </h1>

            <div className="flex flex-col justify-end gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setPanel('projects')}
                className="flex items-center gap-3 self-start border border-white/30 bg-white/5 px-6 py-3 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <Play size={14} fill="white" />
                <span className="text-sm tracking-wider">VIEW PROJECTS</span>
              </button>

              <button
                type="button"
                onClick={() => setPanel('awards')}
                aria-label="View all awards"
                className="flex flex-wrap items-stretch gap-2 self-start text-left text-sm text-white/80 sm:gap-3 lg:self-end"
              >
                {AWARDS.slice(0, 3).map((a, i) => (
                  <span key={a.short} className="flex items-center gap-2 bg-[#0B0B0B] px-3 py-2 sm:px-4">
                    <span
                      className={
                        i === 1
                          ? 'text-lg font-bold sm:text-xl'
                          : i === 2
                            ? 'text-[10px] font-bold tracking-tight sm:text-xs'
                            : 'text-sm font-bold tracking-tight sm:text-base'
                      }
                    >
                      {a.short}
                    </span>
                    <span className="text-xs text-white/50">{a.count}</span>
                  </span>
                ))}
                <span className="flex items-center gap-2 bg-[#0B0B0B] px-3 py-2 sm:px-4">
                  <span className="text-xs text-white/50">+{AWARDS.length - 3}</span>
                </span>
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 pt-2 sm:mt-5 sm:pt-4 sm:grid-cols-2 sm:gap-4">
            <p className="text-xs text-white/60">
              Applying to AI Engineering &amp; Cybersecurity programs in Korea.{' '}
              <a href={`mailto:${EMAIL}`} className="text-red-500 transition-colors hover:text-red-400">
                Get in touch
              </a>
            </p>
            <p className="hidden text-xs text-white/60 sm:block sm:text-right">
              2 full cases &bull; {AWARDS.length} awards &amp; certificates &bull; 1 sensor network
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <Overlay open={menuOpen} onClose={closeMenu} label="Menu" centered>
        {NAV_LINKS.map((link, i) => {
          const s = stagger(menuOpen, i)
          return (
            <a key={link.label} {...linkProps(link, closeMenu)} {...s} className={`${s.className} text-2xl tracking-widest`}>
              {link.label}
            </a>
          )
        })}
      </Overlay>

      {/* CONTENT PANELS */}
      <Overlay open={panel === 'projects'} onClose={closePanel} label="Projects">
        <ProjectsPanel open={panel === 'projects'} />
      </Overlay>
      <Overlay open={panel === 'awards'} onClose={closePanel} label="Awards">
        <AwardsPanel open={panel === 'awards'} />
      </Overlay>
      <Overlay open={panel === 'about'} onClose={closePanel} label="About">
        <AboutPanel open={panel === 'about'} />
      </Overlay>
      <Overlay open={panel === 'talk'} onClose={closePanel} label="Talk">
        <TalkPanel open={panel === 'talk'} />
      </Overlay>
    </div>
  )
}
