import { useEffect, type ReactNode } from 'react'
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

type OverlayProps = {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  /** Center content vertically (mobile menu) vs. top-aligned scrollable panel. */
  centered?: boolean
}

export default function Overlay({ open, onClose, label, children, centered }: OverlayProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md transition-all duration-500 ${EASE} ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-6 md:px-10 lg:px-14">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-2 transition-opacity hover:opacity-70"
        >
          <X size={24} />
        </button>
      </div>
      <div
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
