import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  if (lenis) {
    // After a client-side navigation Lenis may still hold the previous page's height and clamp to it.
    lenis.resize()
    lenis.scrollTo(target, { immediate, force: true, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
  }
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView()
  else if (typeof target === 'number') window.scrollTo(0, target)
  else target.scrollIntoView()
}
