# 14 — Business model & site focus (client corrections, 29.10.2026)

**What AlpenBox24 is:** the *operator* of its own vending machines at several locations. AlpenBox24 sets up,
stocks and runs the machines itself. It does **not** sell or install machines for other businesses.
The 24/7 minimarket at Bayrischzeller Straße 2-8, 83714 Miesbach is its flagship location.

**What the website is:** a photo-led showcase of that business: what's in the machines, where they stand,
and that they never close. Where docs 00–13 assume a shop-customer service site (payment, age checks,
refunds, fault reports) or a machine-sales site, this file wins.

## Structure

| Route | Purpose |
|---|---|
| `/` | Hero, machine photo grid, 24-hour scroll story, gallery strip, locations teaser, "Standort anbieten" |
| `/automaten/` | Machine types as large photos + one line each, interactive machine |
| `/standorte/` | All locations from `settings.json` (editable in `/admin/`); first = Miesbach with OSM map |
| `/galerie/` | Machines first, then farm/regional machines, then Oberland |
| `/ueber-uns/`, `/kontakt/` (Frage / Produktwunsch / Standort anbieten / Sonstiges), `/en/`, legal pages |

Removed and redirected (301 in `.htaccess`): `/sortiment/`, `/regional/`, `/so-gehts/`, `/faq/` → `/automaten/` or
`/kontakt/`; `/miesbach/` → `/standorte/`.

## Content rules
- Very short copy: one headline + one line per block. Photos carry the page.
- No payment walkthrough, age-check/KYC detail, refund or fault-report process.
- Machine photos are licensed examples (Wikimedia Commons) and are captioned/credited as such. Replace them with
  photos of AlpenBox24's own machines as soon as they exist.
- Don't claim machine types, counts, products or locations the client hasn't confirmed. The machine-type grid is
  generic; confirm with the client which types they actually run.
- "Standort anbieten" (offer a location) is a soft, common operator CTA. Remove it if the client doesn't want it.

## Structured data
`LocalBusiness` "AlpenBox24" (operator) with one `ConvenienceStore` `department` per location; the first carries
geo, map link and 24/7 opening hours.

## Open points for the client
- Further locations (enter them in `/admin/` → Standorte).
- Photos of their own machines and the Miesbach box.
- Operator's legal name for the Impressum (§ 5 DDG).

## Technical SEO & performance (verified 29.10.2026, production build)

| Check | Result |
|---|---|
| Lighthouse mobile (slow 4G, local server without gzip) | Performance 94–99 · Accessibility 100 · Best Practices 96–100 · SEO 100 on /, /automaten/, /standorte/, /kontakt/, /galerie/, /ueber-uns/ |
| CLS / TBT | 0 / ≤ 110 ms |
| HTML validation (`npx html-validate`, `.htmlvalidate.json`) | 0 errors on all pages |
| Links (`npm run qa:links`) | 462 links, 0 broken |
| Canonical / H1 / meta / sitemap / hreflang | one absolute canonical and one H1 per page; titles ≤ 60, descriptions 120–160; sitemap = 11 indexable pages with lastmod; DE↔EN hreflang reciprocal + x-default |
| Structured data | valid JSON-LD: LocalBusiness + ConvenienceStore department(s) + BreadcrumbList |
| Weight | HTML+CSS+JS 18–24 KB gz per page; JS 2.9 KB gz; hero AVIF 25 KB (phone) – 125 KB (1920 px) |

Speed measures in place: CSS inlined (no render-blocking request), one-line boot script inlined with its sha256 in the
CSP, both fonts preloaded and self-hosted, LCP images eager + `fetchpriority="high"`, everything else lazy,
pre-cropped responsive images, lazy SVG map (47 KB gz), long-cache headers for fingerprinted assets and gzip in
`.htaccess`. Re-run: `npm run build`, `npx astro preview`, then Lighthouse against it.
