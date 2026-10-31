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
Page flow (each page ends with a "Als Nächstes" link to the next one): Start → Produkte → Standort → Über uns → Kontakt.

| Route | Purpose |
|---|---|
| `/` | Hero, product tiles, Produkt der Woche, 24-hour scroll story, location + car-first map, about teaser, "Standort anbieten" |
| `/produkte/` | Produkt der Woche/des Monats, categories (Getränke, Snacks & Süßes, Regionales, Brotzeit) with the owner's products and their origin, approved tobacco sentence |
| `/standorte/` | Nav label "Standort" while there is one location. Car-first directions, OSM map centred on the box, more locations from `settings.json` |
| `/ueber-uns/` | Who we are, "Woher unsere regionalen Sachen kommen" (product → farm → place from the admin panel), logo |
| `/kontakt/` | Problem am Automaten / Produktwunsch / Standort anbieten / Etwas anderes |
| `/en/…` | English mirror of all five pages; the language switch keeps you on the same page. Legal pages stay German. |

Removed and redirected (301 in `.htaccess`): `/automaten/`, `/galerie/`, `/sortiment/`, `/so-gehts/` → `/produkte/`;
`/regional/` → `/produkte/#regional`; `/faq/` → `/kontakt/`; `/miesbach/`, `/standort/` → `/standorte/`.

## Content rules
- Very short copy: one headline + one line per block. Photos carry the page.
- No payment walkthrough, age-check/KYC detail, refund or fault-report process.
- Machine photos are licensed examples (Wikimedia Commons) and are captioned/credited as such. Replace them with
  photos of AlpenBox24's own machines as soon as they exist.
- Don't claim products, producers, counts or locations the client hasn't confirmed. Category photos are licensed
  examples; individual products, their farm/producer and place come only from the admin panel. Confirm with the
  client that the "Brotzeit" category (Leberkässemmel, Brezn) is really sold, otherwise remove it in `src/data/products.ts`.
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
| Lighthouse mobile (slow 4G, local server without gzip) | Performance 94–99 · Accessibility 100 · Best Practices 96–100 · SEO 100 on /, /produkte/, /standorte/, /kontakt/, /ueber-uns/ (Nov 2026: / 96, /produkte/ 94, /en/about/ 99, all others 100) |
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

## Security (verified 29.10.2026)

| Area | Measures |
|---|---|
| Dependencies | Astro 7.4.1, sharp 0.35.5: `npm audit --omit=dev` → 0 vulnerabilities |
| Server (`public/.htaccess`) | HTTPS + HSTS, CSP (no inline scripts except the hashed boot line), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP, X-Powered-By removed, dotfiles/configs/backups/vendor blocked, `/.well-known/security.txt` |
| Uploads (`public/uploads/.htaccess`) | only png/svg/webp/ico served, no PHP/CGI execution, sandboxing CSP so an SVG can never run script |
| Contact form (`public/api/kontakt.php`) | same-origin (Origin/Referer), honeypot, 3-s time trap, 5 msgs/15 min per hashed IP, 20 KB cap, CR/LF stripped from header fields, card/IBAN numbers removed, SMTP timeout, no data stored or logged |
| Admin (`public/admin/index.php`) | bcrypt (or constant-time) password check, 8-attempt lock-out, strict session (HttpOnly, SameSite=Strict, Secure, strict mode, 30-min idle / 8-h max, browser-bound), CSRF token, own strict CSP, upload signature check + strict SVG filter, secrets only in `<root>/config/` |
| Front end | no third-party requests, no `innerHTML` with external data, 3.7 KB JS |
| CI gate | `scripts/test-php.sh` runs 26 functional checks against both PHP endpoints on every push; nothing deploys if one fails |
