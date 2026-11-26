'use client'

import { useRef } from 'react'
import { useReveals } from '@/lib/useReveals'

export default function RevealScope({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null)
  useReveals(ref)
  return (
    <main ref={ref} id={id} className={className}>
      {children}
    </main>
  )
}
