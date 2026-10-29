# AlpenBox24 — Website Build (Claude Code master instructions)

You are building the public website for **AlpenBox24**, which **operates its own vending machines at several locations**
(it sets up, stocks and runs them itself). Its flagship is the staffless 24/7 minimarket at **Bayrischzeller Straße 2-8,
83714 Miesbach**. The site is a photo-led showcase of that business (`/standorte/` lists the locations). **Read `docs/14-refocus-vending-sales.md` first: it overrides
shop-customer assumptions in docs 00–13.**
Range on the client's own signage: Snacks, Getränke, Vapes, Regionales.

Read this file fully before writing code. Then read the docs in `docs/` in numeric order.
The project skills in `.claude/skills/` encode the rules below; load the matching skill
before you touch that area (brand, copy, legal, SEO, stack, images, QA).

---

## 1. What the site must achieve (in priority order)

1. **Get people to the shop.** Address, "24/7 geöffnet", route links and a clear map
   are never more than one tap away on a phone at night.
2. **Build trust in a shop with no staff.** Explain payment, age verification, what to do
   if a machine fails, and who is responsible (named contact, phone, Impressum).
3. **Win local search.** Feed the Google Business Profile with a fast, consistent,
   structured website (NAP, hours, schema). Rank for Miesbach + 24/7 / Automatenshop /
   Kiosk / regionale Produkte terms.
4. **Make the brand feel like a place.** Photo-led, night-first, alpine. The shop is a
   light on the B 472 at 3 a.m.; the site should feel like that.

## 2. Non-negotiable rules

| # | Rule | Why |
|---|------|-----|
| R1 | **Static output only.** Astro `output: 'static'`. No SSR, no Node server, no client framework (React/Vue/Svelte). Hostinger serves plain HTML/CSS/assets + one PHP file for the contact form. | Client requirement: must not be a "JS web app" on Hostinger. |
| R2 | **Everything works with JavaScript disabled.** JS is progressive enhancement only: one vanilla module `src/scripts/app.ts` (≈ 4 KB gz) + `public/js/boot.js`. No inline executable scripts (CSP). | Robustness, speed, R1. |
| R3 | **No third-party requests at page load.** Self-host fonts. No Google Maps/YouTube/reCAPTCHA embeds, no CDN scripts, no analytics at launch. Maps = static image + outbound links. | DSGVO/TDDDG: no consent banner needed. LG München I, 20.01.2022, 3 O 17493/20 (Google Fonts). |
| R4 | **Vapes/tobacco: facts only, never promotion.** No vape photos, no flavour talk, no "neu", no lifestyle imagery, no vape keywords in titles/meta/headings/alt, no vape landing pages. One factual line in the Sortiment list is the maximum. | § 19 TabakerzG; OLG Bamberg 21.01.2026 (3 UKl 30/25 e); OLG Karlsruhe 08.04.2026 (6 U 1/26). See `docs/06-legal-pages.md`. |
| R5 | **One source of truth for business data.** Name, address, phone, email, hours, payment methods, geo, social links live only in `src/data/site.ts` (editable parts in `src/data/settings.json`). Templates, schema, footer, Impressum read from it. | NAP consistency (local SEO) and hours may change (municipal ordinance, see research). |
| R6 | **German first, du-Form, plain language, short.** One headline + one line per block; photos carry the page. `/en/` is a single compact page for tourists. | Audience: 92.6 % of regional overnight guests are German. |
| R7 | **WCAG 2.2 AA as quality floor.** Contrast tokens are pre-checked in `docs/04-design-system.md`. | Night use on phones; voluntary since BFSG very likely does not apply. |
| R8 | **No invented facts.** Anything marked `[TBC]` in docs or `site.ts` must stay visibly flagged (build fails on `[TBC]` in production — see `docs/08-tech-spec.md`) until the client confirms it. Never invent prices, producers, machine counts, payment methods, opening dates or reviews. | Truthfulness; UWG; trust. |
| R9 | **Don't use the generic "AI landing page" kit.** No uppercase eyebrow labels, no identical rounded shadow cards, no gradient washes, no "→" glued to links. Motion is allowed and wanted (client asked for it) but must be *signature* motion — hero horizon, day cycle, vending machine, map route, marquee — and every effect must honour `prefers-reduced-motion` and degrade to static content. See `docs/11` §3. | Brand distinctiveness. |

## 2b. Current state (29.10.2026)

All 15 routes are built (`docs/11-build-log-and-verification.md`). Photos are licensed Wikimedia Commons images of the region until the shop shoot exists. Editable company data lives in `src/data/settings.json` and is changed by the owner through the PHP admin panel `/admin/` (`public/admin/index.php`, docs/13) — saving commits to GitHub and triggers the deploy. Facts the client has not provided are empty and hidden (`has()` in `site.ts`); never invent them. Go-live steps: `docs/12-go-live-hostinger.md`.

## 3. Stack (decided — do not re-debate)

- **Astro 6.x** (6.4.8), static build. Node **22.12.0+** at build time only (`.nvmrc`).
- Plain CSS with custom properties and `@layer` (no Tailwind). Tokens in `src/styles/tokens.css` (starter provided).
- `astro:assets` `<Picture>` for every raster image → AVIF + WebP, responsive widths.
- `@astrojs/sitemap`. Content collections (Content Layer API, `src/content.config.ts`, `glob()`/`file()` loaders) for gallery items and FAQ.
- Contact form → `public/api/kontakt.php` (PHP 8.x on Hostinger), PHPMailer over authenticated SMTP, honeypot + time trap, no captcha, no storage.
- Deploy: GitHub `main` (source) → GitHub Action builds → pushes `dist/` to branch `deploy` → Hostinger hPanel Git integration auto-deploys `deploy` into `public_html`.

Full detail: `docs/08-tech-spec.md`.

## 4. Pages

`/` · `/automaten/` · `/galerie/` · `/standorte/` · `/ueber-uns/` · `/kontakt/` (+ `/kontakt/danke/`) · `/en/`
· `/impressum/` · `/datenschutz/` · `/barrierefreiheit/` · `/bildnachweise/` · `404` · admin: `/admin/` (PHP)

Sitemap, wireframes, components: `docs/03-information-architecture.md`. Final copy: `docs/05-content-copy-de.md`.

## 5. Build order

Follow `docs/09-build-plan-and-qa.md`. Short version:
1. Scaffold (Astro, tokens, fonts, layout, `site.ts`, header/footer, 404).
2. Home + Kontakt (the two money pages) — get them to "done" including schema and images.
3. Sortiment, Regional, So geht's, FAQ.
4. Galerie (collection + lightbox), Über uns, EN.
5. Legal pages, contact PHP, `.htaccess`, sitemap/robots, OG images, favicons.
6. QA gate (skill `launch-qa`), then deploy pipeline.

## 6. Repo layout you will create

```
/
├─ CLAUDE.md, docs/, brand/, .claude/skills/   (this kit — keep it in the repo; copy starter/ files per docs/08 §3)
├─ astro.config.mjs  package.json  .nvmrc  tsconfig.json
├─ public/
│  ├─ .htaccess  robots.txt  favicon.svg  icons/  og/
│  ├─ fonts/            (self-hosted woff2)
│  └─ api/kontakt.php  api/vendor/phpmailer/   (SMTP secrets live OUTSIDE the repo: <domain root>/config/)
├─ src/
│  ├─ data/site.ts      (single source of truth — starter provided)
│  ├─ content.config.ts
│  ├─ content/gallery/*.json   content/faq/*.md
│  ├─ assets/photos/   assets/gallery/   brand/ (logo SVGs)
│  ├─ styles/tokens.css  base.css  components.css
│  ├─ components/       (see IA doc)
│  ├─ layouts/Base.astro  Legal.astro
│  └─ pages/            (routes above)
└─ .github/workflows/deploy.yml
```

## 7. Commands

`npm run dev` · `npm run build` (runs `astro check` + build + TBC guard) · `npm run preview`
· `npm run qa` (html-validate, link check, Lighthouse CI, axe — see QA skill).

## 8. Things only the client can supply

Listed in `docs/00-brief.md` §5 ("Client inputs"). Until supplied, use the `[TBC]` markers;
never fill them with plausible-sounding guesses.
