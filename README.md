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
npm run frames -- media/your-clip.mp4            # landscape 1280w + portrait 9:16 crop, source fps
npm run frames -- media/your-clip.mp4 --fps=30
```

This rewrites `public/frames/{landscape,portrait}/` and `src/lib/frames.ts`. Aim for 80–150 frames; the
captions in `HERO_CHAPTERS` (`src/content.ts`) appear at roughly the first, middle and last third of the
clip. Every 4th frame gates the preloader; the rest stream in afterwards.

## Award certificates

Put files in `media/certificates/`, named after the award's `id` in `src/content.ts`, then run
`npm run certificates` (the first time, `npm run scan:setup` installs the scanner's Python env):

- `techvision-2026.jpg` / `.heic` / `.png` — a photo of a certificate. It is straightened, cropped to the
  sheet (snapped to A4 when close), shadows and colour cast are removed and the paper goes white, then it is
  saved as a web preview and an A4 PDF.
- `techvision-2026-2.jpg` — another page for the same award.
- `techvision-2026.pdf` — an existing PDF, copied as is.
- `techvision-2026-photo.jpg` — shown as a plain photo (e.g. the ceremony), no scanning.

If the sheet's outline is detected wrongly, give its four corners (photo pixels) in
`media/certificates/corners.json`: `{ "techvision-2026.jpg": [[x, y], [x, y], [x, y], [x, y]] }`.

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
