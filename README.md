# Amin Kaibov — Design & Engineering

Single-viewport portfolio landing page. React + TypeScript + Tailwind CSS v4 + Vite, lucide-react icons.
Live: https://amin-kaibov.vercel.app

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

Deploy: push to `main` — Vercel builds automatically (preset: Vite, output: `dist`).

## Structure

- `src/content.ts` — all copy: skills, projects (AUA, BASHIR&CO), awards, education, security notes, links. Edit here.
- `src/App.tsx` — the locked full-screen landing (video background, nav, meta grid, headline, award chips, footer).
- `src/components/Overlay.tsx` — shared fullscreen dialog: focus trap, focus restore, Escape to close.
- `src/components/Panels.tsx` — ABOUT / PROJECTS / AWARDS / SECURITY / TALK panels. Each is linkable by hash
  (`/#projects`, `/#security` …) and closes with the browser Back button.
- `src/components/Logo.tsx` — geometric "AK" monogram.

## Security

- `vercel.json` — security headers: strict CSP (self-only scripts/fonts/media), `frame-ancestors 'none'`,
  X-Frame-Options, HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP.
- No third-party requests: Inter comes from `@fontsource-variable/inter`, basis33 is compiled from
  github.com/Manchson/basis33 (MIT, license in `src/assets/fonts/`).
- `public/.well-known/security.txt` — contact for vulnerability reports (renew `Expires` yearly).

## Media

- `src/assets/hero-bg.webm` / `hero-bg.mp4` — background video (~250–300 KB), `hero-poster.jpg` shown while loading,
  when autoplay is blocked, or when the visitor prefers reduced motion. A Pause/Play control is in the footer and mobile menu.
- `public/og.jpg` — 1200×630 link-preview image; `public/apple-touch-icon.png` — iOS home-screen icon.
