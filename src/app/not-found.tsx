import Link from 'next/link'

export const metadata = { title: 'Not found' }

export default function NotFound() {
  return (
    <main id="main" className="gutter flex min-h-svh flex-col justify-end pb-10">
      <p className="label">(404)</p>
      <h1 className="mt-6 text-[24vw] md:text-[17vw]">
        <span className="display block">Lost</span>
        <span className="font-pixel block leading-[0.85]">signal</span>
      </h1>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
        <p className="max-w-[40ch] text-paper/70">This page doesn&apos;t exist — or it moved while you were reading the address bar.</p>
        <Link href="/" className="rounded-full bg-paper px-6 py-3 text-sm font-medium tracking-[0.08em] text-ink uppercase transition-colors hover:bg-signal">
          Back home
        </Link>
      </div>
    </main>
  )
}
