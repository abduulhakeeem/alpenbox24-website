---
name: local-seo-schema
description: Local SEO for AlpenBox24 — page titles, meta descriptions, headings, keyword map, canonical/hreflang, Open Graph, JSON-LD (ConvenienceStore, BreadcrumbList), sitemap/robots and NAP consistency with the Google Business Profile. Use when creating a page, changing a title/description/H1, editing structured data, or adding a new route.
---

# Local SEO & structured data

Strategy and final titles/descriptions: `docs/02-seo-strategy.md`. Data: `src/data/site.ts`.

## Per-page checklist
- [ ] Title from `02` §3 (≤ 60 chars) and description (140–158 chars). Don't invent new ones without reason.
- [ ] Exactly one `<h1>` with the page's primary keyword in natural German.
- [ ] First 100 words say what (AlpenBox24 / Minimarkt / 24/7), where (Miesbach) and when (rund um die Uhr).
- [ ] Canonical absolute URL with trailing slash. `hreflang` only between `/` and `/en/` (+ x-default `/`).
- [ ] OG: title, description, `og:image` 1200×630, `og:locale` de_DE / en_US, `twitter:card` summary_large_image.
- [ ] Internal link to `/kontakt/` and at least one sibling page.
- [ ] Breadcrumbs (visible + `BreadcrumbList`) on sub-pages.
- [ ] New route added to nav/footer if user-facing; sitemap includes it automatically (check filters).

## JSON-LD
- `ConvenienceStore` built only from `site.ts` (template in `02` §5). Open 24 h = `opens "00:00"`, `closes "23:59"`, all seven days.
  If `site.hours.is24_7` is false, generate from `site.hours.weekly`.
- `geo` must be the real pin (6 decimals). `sameAs` only real profiles.
- No `FAQPage` (no rich results for this site type since 2023), no `Product`/`Offer` for age-restricted goods,
  no self-made `AggregateRating`.
- Validate with the Schema.org validator after changes.

## Never
- Target vape/e-cigarette/tobacco keywords anywhere (title, meta, H1–H3, alt, URL, file names) — § 19 TabakerzG; `guard.mjs` fails the build.
- Create doorway pages per town ("Automatenshop Schliersee"). Mention towns naturally where true.
- Change NAP formatting: `AlpenBox24 · Bayrischzeller Straße 2-8 · 83714 Miesbach` must match GBP, Apple, Bing, OSM.
