import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import Logo from './Logo'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'

/** Shared stagger helper — same timing as the mobile menu (start 100ms, 60ms steps). */
export function stagger(open: boolean, i: number) {
  return {
    className: `transition-all duration-500 ${EASE} ${
      open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`,
    style: { transitionDelay: open ? `${100 + i * 60}ms` : '0ms' },
  }
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

type OverlayProps = {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  /** Center content vertically (mobile menu) vs. top-aligned scrollable panel. */
  centered?: boolean
}

export default function Overlay({ open, onClose, label, children, centered }: OverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Focus management: move focus in on open, trap Tab inside, restore it on close.
  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialog) return
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      // Only restore if focus is still inside this dialog (e.g. not moved to another overlay).
      // (Once the dialog turns inert the browser may already have dropped focus to <body>.)
      const active = document.activeElement
      if (!active || active === document.body || dialog?.contains(active)) {
        previouslyFocused?.focus({ preventScroll: true })
      }
    }
  }, [open, onClose])

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md transition-all duration-500 ${EASE} ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="flex items-center justify-between px-5 py-6 sm:px-6 md:px-10 lg:px-14">
        <Logo />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={`Close ${label.toLowerCase()}`}
          className="p-2 transition-opacity hover:opacity-70"
        >
          <X size={24} />
        </button>
      </div>
      <div
        // Scrollable panel must be reachable by keyboard so it can be scrolled with arrow keys.
        tabIndex={centered ? undefined : 0}
        className={
          centered
            ? 'flex flex-1 flex-col items-center justify-center gap-8'
            : 'flex-1 overflow-y-auto px-5 pb-10 sm:px-6 md:px-10 lg:px-14'
        }
      >
        {children}
      </div>
    </div>
  )
}
