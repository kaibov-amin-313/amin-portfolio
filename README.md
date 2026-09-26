# Amin Kaibov — Design & Engineering

Single-viewport portfolio landing page. React + TypeScript + Tailwind CSS v4 + Vite, lucide-react icons.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

Deploy: `npx vercel` (framework preset: Vite, output: `dist`).

## Structure

- `src/content.ts` — all copy: services, projects (AUA, BASHIR&CO), awards (all 5), links, video URL. Edit here.
- `src/App.tsx` — the locked full-screen landing (video, nav, 4-column meta grid, headline, awards chips, footer strip, mobile menu).
- `src/components/Overlay.tsx` — shared fullscreen overlay (same 500ms cubic-bezier(0.16,1,0.3,1) fade + 60ms stagger as the mobile menu).
- `src/components/Panels.tsx` — ABOUT / PROJECTS / AWARDS / TALK panels that open over the landing, so the page itself never scrolls.
- `src/components/Logo.tsx` — geometric "AK" monogram.

## Notes

- Fonts: Inter (Google Fonts) + basis33 pixel font (`.font-pixel`), loaded in `index.html`.
- On very short phones (under 760px tall) the page is allowed to scroll so nothing is cut off; everywhere else it stays one locked viewport.
- BASHIR&CO has no public link yet — add it to `links` in `src/content.ts` once it's deployed.
