# Amin Kaibov — Portfolio

Next.js (App Router) + TypeScript + Tailwind CSS v4 + GSAP (ScrollTrigger, SplitText) + Lenis.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint     # oxlint + tsc
```

Deploys to Vercel as a Next.js app (`vercel.json` pins the framework preset).

## Hero clip → scroll frames

The hero is a frame sequence drawn on a canvas and scrubbed by scroll. To use a new clip:

```bash
npm run frames -- media/your-clip.mp4            # defaults: 1440px wide, source fps, WebP q72
npm run frames -- media/your-clip.mp4 --fps=30 --width=1600
```

This rewrites `public/frames/` and `src/lib/frames.ts`. Aim for 80–150 frames; the captions in
`HERO_CHAPTERS` (`src/content.ts`) appear at roughly the first, middle and last third of the clip.

## Structure

- `src/content.ts` — all copy: projects, awards, security notes, about, links.
- `src/app/page.tsx` — home: preloader, hero, manifesto, work, awards, security, about, contact.
- `src/app/projects/[slug]/page.tsx` — case-study pages.
- `src/components/Hero.tsx` — canvas frame scrubbing + scroll choreography.
- `src/lib/useReveals.ts` — `data-reveal="lines | fade | rule | scrub"` scroll reveals.
- `src/proxy.ts` — per-request CSP nonce; other security headers live in `next.config.ts`.

## Notes

- Fonts are self-hosted (Inter via `next/font`, basis33 from `src/fonts`, MIT) — no third-party requests.
- `prefers-reduced-motion` disables smooth scroll, the pinned hero and all reveals.
