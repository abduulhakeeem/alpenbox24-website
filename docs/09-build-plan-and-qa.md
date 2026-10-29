# 09 — Build plan, acceptance criteria, QA & launch

## Phase 0 — Setup (½ day)
1. `npm create astro@latest alpenbox24 -- --template minimal --typescript strict` (Node ≥ 22.12).
2. `npx astro add sitemap`. Copy starter files per `08-tech-spec.md` §3. Merge npm scripts. Create `.nvmrc` (`22`).
3. Install dev tools: `npm i -D @astrojs/check typescript html-validate linkinator pa11y-ci @lhci/cli`.
4. Fonts → `public/fonts/` (Archivo variable incl. `wdth`, Atkinson Hyperlegible Next variable), `@font-face` in `base.css`.
5. Logos from `brand/logo/` → `src/brand/` (SVG used inline/as components) and `public/` (favicons, icons, manifest).
6. `git init`, push to GitHub `main`.

**Done when:** `npm run build:staging` produces `dist/` and `guard.mjs` runs.

## Phase 1 — Foundation (1 day)
`Base.astro` (SeoHead, JsonLd, skip link, header, footer, mobile action bar), `Legal.astro`, `RidgeLine`, `SignpostButton`,
`OpenNow`, `AddressBlock`, `HoursBlock`, `Breadcrumbs`, 404.
**Done when:** every component renders from `site.ts`, keyboard-only navigation works, no layout shift on font load.

## Phase 2 — Money pages (1–1.5 days)
Start + Kontakt (incl. static map, route links, Störung section, form markup + `form.ts`).
**Done when:** Lighthouse mobile ≥ 95/100/100/100 on both; JSON-LD validates in the Schema.org validator; form posts to PHP locally (`php -S localhost:8000 -t dist` after build) with a test SMTP config.

## Phase 3 — Content pages (1 day)
Sortiment, Regional (with "im Aufbau" fallback), So geht's, FAQ (collection), Über uns.

## Phase 4 — Gallery & EN (1 day)
Gallery collection, masonry, lightbox, category anchors/filter; `/en/`.

## Phase 5 — Legal, hardening, deploy (½–1 day)
Impressum, Datenschutz, Barrierefreiheit from `06`; `.htaccess`, robots, sitemap, OG images, manifest; GitHub Action; Hostinger Git connection; SSL; SPF/DKIM/DMARC.

**Staging before client data is complete:** deploy `build:staging` output to a password-protected subdomain
(hPanel → Password protect directories) or keep the production domain on a "Bald geöffnet" page.
Production `npm run build` intentionally fails while `[TBC]` remains.

---

## QA checklist (skill `launch-qa` runs this)

**Content & legal**
- [ ] `guard.mjs` passes with no errors (no `[TBC]`, no tobacco terms in SEO fields, no third-party requests).
- [ ] Impressum complete per § 5 DDG, reachable from every page footer.
- [ ] Datenschutz matches reality (hosting entity, logs retention, WhatsApp only if used, CCTV section only if CCTV exists).
- [ ] No EU-ODR link anywhere.
- [ ] Vape/tobacco: only the approved factual sentence, no images, no emphasis.
- [ ] Every photo has a recorded licence and, for people, a model release.

**SEO**
- [ ] Titles/descriptions exactly as `02` §3 (or improved with data), lengths within limits.
- [ ] One H1 per page; canonical; hreflang `/` ↔ `/en/`; OG image renders (test with a social preview tool).
- [ ] `sitemap-index.xml` excludes danke/404; robots references it.
- [ ] JSON-LD: `ConvenienceStore` + `BreadcrumbList` valid; NAP identical to GBP.

**Accessibility (WCAG 2.2 AA)**
- [ ] pa11y-ci / axe: 0 errors. Manual: keyboard through header, menu, gallery lightbox (focus trap + restore), FAQ, form.
- [ ] Screen reader smoke test (VoiceOver iOS or NVDA): landmarks, headings, form errors announced.
- [ ] 200 % zoom, 320 px width, `prefers-reduced-motion`, `forced-colors`.

**Performance**
- [ ] Budgets in `08` §10 met on Start, Galerie, Kontakt.
- [ ] Hero image `fetchpriority="high"`, everything else lazy; no CLS from fonts/images.

**Function**
- [ ] Without JS: menu, gallery links, FAQ, form submission all work.
- [ ] Form: success → danke; validation errors; honeypot; < 3 s submit silently dropped; card-number scrubbing; email arrives with Reply-To.
- [ ] `tel:`, WhatsApp, Google/Apple Maps links open correctly on iOS and Android.
- [ ] Redirects in `.htaccess` (http→https, www→apex, guessed URLs, trailing slash).
- [ ] Security headers present (securityheaders.com grade A); CSP produces no console errors.

**Browsers**
Safari iOS (latest 2), Chrome Android, Chrome/Edge/Firefox/Safari desktop latest.

---

## Launch checklist (owner: Ahad)
1. Domain DNS → Hostinger; SSL active; `https://alpenbox24.de` resolves; `www` redirects.
2. Email: `info@` + `formular@` mailboxes; SPF, DKIM, DMARC (`p=quarantine` after 2 weeks of clean reports).
3. Google Search Console (Domain property via DNS) + sitemap; Bing Webmaster Tools (import from GSC).
4. Google Business Profile: website URL, hours 24 h, phone, photos, first post. Apple Business Connect, Bing Places.
5. OpenStreetMap entry (`shop=vending_machine`, `opening_hours=24/7`).
6. QR stickers in the shop → `/so-gehts/` and `/kontakt/#stoerung`; GBP review QR.
7. Ask Ökomodellregion Miesbach to list the shop once regional products are in.
8. 30-day review: GSC queries, GBP actions; update FAQ and titles from real data (`02` §7).
