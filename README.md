# AlpenBox24 — Website

Website for **AlpenBox24**, the staffless 24/7 automated minimarket at
**Bayrischzeller Straße 2-8, 83714 Miesbach** (Oberbayern). German first, one English page for tourists.

Static Astro site → plain HTML/CSS + ~4 KB of vanilla JS + one PHP file for the contact form.
Runs on any Hostinger web hosting plan (no Node.js app).

## What's in here

| Path | What |
|---|---|
| `src/pages/` | 15 routes: Start, Sortiment, Regional, So geht's, Galerie, Über uns, Kontakt (+ Danke), FAQ, EN, Impressum, Datenschutz, Barrierefreiheit, Bildnachweise, 404 |
| `src/data/site.ts` | **Single source of truth** for name, address, hours, phone, payment, legal data. Fill the `TBC` values here. |
| `src/data/photo-credits.json` | Author + licence + source for every photo (Wikimedia Commons) |
| `src/components/` | Hero horizon, scroll-scrubbed "Ein Tag an der B 472", interactive vending machine, OSM map, marquee, … |
| `src/styles/` | Design system (`global.css`) and page sections (`pages.css`) |
| `src/scripts/app.ts` | All interaction (progressive enhancement; everything works without JS) |
| `public/api/kontakt.php` | Contact form → SMTP via PHPMailer. Secrets live outside `public_html`. |
| `scripts/guard.mjs` | Post-build guard: rejects `[TBC]`, tobacco terms in SEO fields, third-party requests |
| `scripts/build-map.mjs`, `build-og.mjs` | One-off generators for the OSM map and the OG image |
| `docs/` | Research, SEO strategy, IA, design system, copy, legal templates, tech spec, QA, sources, **build log (11)**, **go-live guide (12)** |
| `.claude/skills/` | Project skills for Claude Code (brand, copy, legal, SEO, stack, images, QA) |
| `CLAUDE.md` | Rules Claude Code follows when working on this repo |
| `brand/` | Logo SVG/PNG set and the client's original print files |

## Commands

```bash
npm install
npm run dev            # http://localhost:4321 (shows "folgt" markers for missing client facts)
npm run build:preview  # staging build: noindex, "folgt" markers, guard in warning mode
npm run build          # production: astro check + build + guard (fails while any [TBC] remains)
```

## Deploy

- **Preview (GitHub Pages, optional):** enable Pages (Settings → Pages → Source: GitHub Actions), then run `.github/workflows/preview.yml` from the Actions tab. Staging build, noindex.
- **Production (Hostinger):** `.github/workflows/deploy.yml` builds and pushes `dist/` to branch `deploy`;
  Hostinger's Git integration deploys it into `public_html`. Step-by-step: [`docs/12-go-live-hostinger.md`](docs/12-go-live-hostinger.md).
  The production workflow only runs once the client facts are filled in (it fails on `[TBC]` by design).

## Not legal advice
Impressum and Datenschutzerklärung are researched templates. Have them checked before the production launch.
