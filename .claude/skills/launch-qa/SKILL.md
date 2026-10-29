---
name: launch-qa
description: Quality gate for the AlpenBox24 website — runs build guard, HTML validation, link check, accessibility, Lighthouse budgets, no-JS checks, form and redirect tests, and the legal/SEO checklist. Use before any deploy to production, after large changes, or when the user asks "is it ready", "test it" or "QA".
---

# Launch QA

Checklist source: `docs/09-build-plan-and-qa.md`. Budgets: `docs/08-tech-spec.md` §10.

## Run in order (stop and report on first hard failure)
1. `npm run build` (production guard). If it fails only on `[TBC]`, report the list of missing client facts — do not fill them.
2. `npm run qa:html` → 0 errors.
3. `npm run qa:links` → 0 broken internal links.
4. `npm run preview` in background, then `npm run qa:a11y` → 0 errors; `npm run qa:lh` (mobile) → Perf ≥ 95, A11y 100,
   Best Practices 100, SEO 100 on `/`, `/kontakt/`, `/galerie/`.
5. No-JS pass: load each page with JS disabled (browser devtools or Playwright `javaScriptEnabled: false`); menu, FAQ,
   gallery links, form submit must work.
6. Visual pass: screenshots at 360×800, 768×1024, 1440×900 of every page; check against `docs/04-design-system.md`
   (night feel, ridge line, signpost CTA, no generic card kit, no text over busy photo without scrim).
7. Keyboard pass: Tab through header → menu → hero CTAs → gallery lightbox (Esc, arrows, focus restore) → form.
8. Form: run `php -S` against `dist/` with a test mail config; check success, validation error, honeypot, < 3 s drop,
   card-number scrubbing.
9. After deploy: curl checks
   - `curl -sI http://alpenbox24.de` → 301 to https
   - `curl -sI https://www.alpenbox24.de` → 301 to apex
   - `curl -sI https://alpenbox24.de/about` → 301 `/ueber-uns/`
   - `curl -sI https://alpenbox24.de/` → CSP, HSTS, nosniff, Referrer-Policy present
   - `curl -s https://alpenbox24.de/robots.txt` and `/sitemap-index.xml` → 200
10. Legal/SEO eyeball: Impressum complete, Datenschutz matches reality, JSON-LD validates, titles/descriptions as planned.

## Report format
Short table: check · result · fix needed. Then a single "Ready / Not ready" line with blockers.
