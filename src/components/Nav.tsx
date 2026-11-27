'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { NAV } from '@/content'
import { gsap, useGSAP } from '@/lib/gsap'
import Logo from './Logo'
import { getLenis, scrollToTarget } from '@/lib/lenis'
import { useAlmatyTime } from './useAlmatyTime'

export default function Nav() {
  const pathname = usePathname()
  const time = useAlmatyTime()
  const [open, setOpen] = useState(false)
  const [onLight, setOnLight] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false)
    if (pathname !== '/') return
    e.preventDefault()
    history.replaceState(null, '', href)
    scrollToTarget(href)
  }

  // The header flips to dark text while a light section ([data-nav-light]) sits under it.
  // A colour switch instead of mix-blend-mode: Safari re-blends a fixed layer against the whole page every frame.
  useEffect(() => {
    const targets = document.querySelectorAll('[data-nav-light]')
    const under = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)))
        setOnLight(under.size > 0)
      },
      { rootMargin: '-3% 0px -96% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [pathname])

  useEffect(() => {
    const lenis = getLenis()
    if (open) lenis?.stop()
    else lenis?.start()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useGSAP(
    () => {
      const el = menuRef.current
      if (!el) return
      if (open) {
        gsap.set(el, { display: 'flex' })
        gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
        gsap.fromTo(el.querySelectorAll('[data-item]'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.35 })
      } else {
        gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'expo.inOut', onComplete: () => void gsap.set(el, { display: 'none' }) })
      }
    },
    { dependencies: [open] },
  )

  return (
    <>
      <header className={`gutter fixed inset-x-0 top-0 z-50 flex items-center justify-between py-5 transition-colors duration-500 ${open || onLight ? 'text-ink' : 'text-paper'}`}>
        <Link href="/" aria-label="Amin Kaibov — home" className="flex items-center gap-3" onClick={(e) => pathname === '/' && go(e, '#top')}>
          <Logo size={22} />
          <span className="hidden text-xs font-medium tracking-[0.18em] sm:inline">AMIN KAIBOV</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1 text-xs font-medium tracking-[0.14em] uppercase">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={`/${item.href}`} onClick={(e) => go(e, item.href)} className="group relative block overflow-hidden px-3 py-1">
                  <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{item.label}</span>
                  <span aria-hidden className="font-pixel absolute inset-x-3 top-full block text-[0.95rem] leading-none transition-transform duration-500 ease-expo group-hover:-translate-y-[calc(100%+0.1rem)]">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          <p className="font-pixel hidden items-center gap-2 text-sm lg:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-current" />
            </span>
            ALMATY {time}
          </p>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="text-xs font-medium tracking-[0.14em] uppercase md:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        inert={!open}
        className="gutter fixed inset-0 z-40 hidden flex-col justify-end bg-paper pb-10 text-ink md:hidden"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        <nav aria-label="Mobile">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.href} className="line-mask border-b border-ink/15">
                <Link href={`/${item.href}`} onClick={(e) => go(e, item.href)} data-item className="display flex items-baseline justify-between py-3 text-[15vw]">
                  {item.label}
                  <span className="font-pixel text-base tracking-normal normal-case">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-pixel mt-8 text-sm">ALMATY {time} — UTC+5</p>
      </div>
    </>
  )
}
