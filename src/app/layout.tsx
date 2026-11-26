import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { connection } from 'next/server'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import SmoothScroll from '@/components/SmoothScroll'
import { SITE_URL } from '@/content'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const basis33 = localFont({ src: '../fonts/basis33.woff2', variable: '--font-basis33', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Amin Kaibov — AI & Security Engineering Portfolio',
    template: '%s — Amin Kaibov',
  },
  description:
    'Amin Kaibov — full-stack developer and UI/UX designer from Almaty, Kazakhstan, building secure and intelligent products. AUA, BASHIR&CO, hackathon wins.',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Amin Kaibov — Building secure and intelligent products',
    description: 'Full-stack developer & UI/UX designer from Almaty. AI & Security engineering portfolio.',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = { themeColor: '#050505' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Every page is rendered per request so the proxy's CSP nonce reaches Next's scripts.
  await connection()
  return (
    <html lang="en" className={`${inter.variable} ${basis33.variable}`}>
      <body className="grain font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        {children}
        <Cursor />
      </body>
    </html>
  )
}
