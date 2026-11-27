'use client'

import { useEffect, useRef, useState } from 'react'
import type { AwardDoc } from '@/lib/awardDocs'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { getLenis } from '@/lib/lenis'

export default function AwardDocs({ title, docs, label }: { title: string; docs: AwardDoc[]; label?: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const doc = docs[index]
  const hasPdf = docs.some((d) => d.kind !== 'image')
  const link = doc.kind === 'scan' ? { href: doc.pdf, label: 'Open PDF ↗' } : { href: doc.src, label: doc.kind === 'pdf' ? 'Open PDF ↗' : 'Open original ↗' }

  const open = () => {
    setIndex(0)
    dialog.current?.showModal()
    getLenis()?.stop()
    if (!prefersReducedMotion())
      gsap.fromTo(panel.current, { autoAlpha: 0, y: 24, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'expo.out' })
  }

  useEffect(() => {
    const el = dialog.current
    const onClose = () => getLenis()?.start()
    el?.addEventListener('close', onClose)
    return () => el?.removeEventListener('close', onClose)
  }, [])

  useEffect(() => {
    const el = dialog.current
    if (!el || docs.length < 2) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % docs.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + docs.length) % docs.length)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [docs.length])

  return (
    <>
      <button
        type="button"
        onClick={open}
        data-cursor="View"
        className="relative z-10 inline-flex items-center gap-2 rounded-full border border-current/30 px-3.5 py-1.5 text-[0.68rem] font-medium tracking-[0.14em] uppercase transition-colors hover:border-signal hover:bg-signal hover:text-ink"
      >
        {label ?? (hasPdf ? 'View PDF' : 'View')}
        <span aria-hidden>↗</span>
      </button>

      <dialog
        ref={dialog}
        aria-label={`${title} — certificate`}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-0 size-full max-h-none max-w-none bg-transparent p-0 text-paper backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        <div ref={panel} className="gutter pointer-events-none flex size-full flex-col py-5">
          <div className="pointer-events-auto flex items-center justify-between gap-4 pb-4">
            <p className="font-pixel truncate text-sm">
              {title}
              {docs.length > 1 && (
                <span className="text-dim">
                  {' '}
                  — {index + 1}/{docs.length}
                </span>
              )}
            </p>
            <div className="flex shrink-0 items-center gap-5 text-xs font-medium tracking-[0.14em] uppercase">
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-signal">
                {link.label}
              </a>
              <button type="button" onClick={() => dialog.current?.close()} className="uppercase hover:text-signal" autoFocus>
                Close
              </button>
            </div>
          </div>

          <div className="pointer-events-auto relative min-h-0 flex-1 overflow-hidden rounded-xl border border-line bg-[#0b0b0a]">
            {doc.kind === 'pdf' ? (
              <iframe key={doc.src} src={`${doc.src}#view=FitH`} title={`${title} — PDF`} className="size-full bg-paper" />
            ) : (
              <div className="flex size-full items-center justify-center p-4 md:p-8">
                <img
                  key={doc.src}
                  src={doc.src}
                  width={doc.width}
                  height={doc.height}
                  alt={`${title} — certificate`}
                  className={`h-auto max-h-full w-auto max-w-full ${doc.kind === 'scan' ? 'bg-white shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]' : ''}`}
                />
              </div>
            )}
          </div>

          {docs.length > 1 && (
            <div className="pointer-events-auto flex justify-center gap-2 pt-4">
              {docs.map((d, i) => (
                <button
                  key={d.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Document ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1 w-8 rounded-full transition-colors ${i === index ? 'bg-signal' : 'bg-paper/25 hover:bg-paper/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
