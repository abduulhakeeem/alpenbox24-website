# 02 — SEO & local search strategy

## 1. Search intent model

| Intent | Typical query shape | Where it is won | Page |
|---|---|---|---|
| Find an open shop *now* | "24/7 shop in der Nähe", "Automatenshop offen", "Kiosk Miesbach" | Google Maps / local pack (Business Profile), then the website for trust | GBP → `/kontakt/`, `/` |
| Sunday / holiday / night shopping | "Sonntag einkaufen Miesbach", "nachts Getränke kaufen Miesbach" | Organic + local pack | `/` , `/faq/` |
| What do they sell | "Automatenshop Miesbach Sortiment", "Snacks Getränke Miesbach 24 h" | Organic | `/sortiment/` |
| Regional food | "regionale Produkte Miesbach", "Brotzeit Miesbach", "Hofladen Automat Landkreis Miesbach" | Organic + regional directories | `/regional/` |
| How does it work / trust | "Automatenshop Altersprüfung", "Automat Geld zurück" | Organic long tail | `/so-gehts/`, `/faq/` |
| Brand / navigational | "AlpenBox24", "Alpen Box 24 Miesbach" | Organic + GBP | `/` |
| Tourist (EN) | "24 hour shop Miesbach", "late night shop Schliersee" | Organic | `/en/` |

**Explicitly not targeted:** any vape/e-cigarette/tobacco query (legal, § 19 TabakerzG; also Google Ads policy
does not allow promoting these products). Do not optimise headings, titles, alt text or URLs for them.

## 2. Keyword map (primary per page, secondary in body/subheads)

No volumes are claimed (see research §2). Priority is by intent value × winnability.

| Page | Primary | Secondary / semantic | Priority |
|---|---|---|---|
| `/` | Automatenshop Miesbach | 24/7 Shop Miesbach · Minimarkt Miesbach · rund um die Uhr geöffnet · Automatenkiosk · Snacks und Getränke Miesbach · Sonntag einkaufen Miesbach | A |
| `/sortiment/` | Snacks und Getränke Miesbach 24 h | Snackautomat Miesbach · Getränkeautomat · kalte Getränke nachts · Alltagsbedarf · Brotzeit | A |
| `/regional/` | Regionale Produkte Miesbach | regionale Lebensmittel Landkreis Miesbach · Erzeuger aus dem Oberland · Brotzeit aus der Region · Käse, Eier, Honig [only what is stocked] | A |
| `/so-gehts/` | Automatenshop: so funktioniert's | kontaktlos bezahlen · Altersprüfung am Automaten · Geld zurück bei Störung | B |
| `/kontakt/` | AlpenBox24 Miesbach Anfahrt | Bayrischzeller Straße Miesbach · Parken · Bahnhof Miesbach · Störung melden | A |
| `/faq/` | Sonntags einkaufen in Miesbach | Feiertag einkaufen Miesbach · nachts einkaufen · Automatenshop Fragen | B |
| `/galerie/` | AlpenBox24 Bilder | Automatenshop Miesbach Fotos | C |
| `/ueber-uns/` | Über AlpenBox24 | Miesbacher Minimarkt · Team | C |
| `/en/` | 24 hour shop Miesbach | late-night shop near Schliersee and Tegernsee · open Sundays · snacks drinks local products Bavaria | B |

**Geo modifiers to use naturally (no doorway pages):** Miesbach, Landkreis Miesbach, Oberland, B 472,
Hausham, Schliersee, Tegernsee, Irschenberg, Bahnhof Miesbach. Mention them where they are true (e.g.
"auf dem Weg von der A8 an den Schliersee"). Never create one page per town.

## 3. Titles and meta descriptions (final — use as written)

Titles ≤ 60 characters; descriptions 140–158 characters. `siteName` appended only where it fits.

| Route | `<title>` | `<meta name="description">` |
|---|---|---|
| `/` | AlpenBox24 – 24/7 Automatenshop in Miesbach | Snacks, Getränke und Regionales rund um die Uhr: der Minimarkt an der Bayrischzeller Straße in Miesbach. Täglich 24 Stunden geöffnet, auch sonntags. |
| `/sortiment/` | Sortiment: Snacks, Getränke & mehr – AlpenBox24 | Was es bei AlpenBox24 in Miesbach gibt: kalte Getränke, Snacks, Brotzeit, Regionales und Dinge für den Notfall – 24/7 aus dem Automaten. |
| `/regional/` | Regionale Produkte aus dem Oberland – AlpenBox24 | Käse, Eier, Brotzeit und mehr von Erzeugern aus dem Landkreis Miesbach – rund um die Uhr im AlpenBox24 Minimarkt an der Bayrischzeller Straße. |
| `/so-gehts/` | So funktioniert der Automatenshop – AlpenBox24 | Bezahlen, Altersprüfung, Geld zurück bei Störungen: Alles, was du über den Einkauf bei AlpenBox24 in Miesbach wissen musst. Einfach und rund um die Uhr. |
| `/galerie/` | Galerie – AlpenBox24 Minimarkt Miesbach | Bilder vom AlpenBox24 Minimarkt in Miesbach: der Laden bei Tag und Nacht, die Automaten, regionale Produkte und das Oberland drumherum. |
| `/ueber-uns/` | Über uns – AlpenBox24 aus Miesbach | Wer hinter AlpenBox24 steckt und warum es in Miesbach einen Minimarkt gibt, der nie zumacht. Regional verwurzelt, rund um die Uhr für dich da. |
| `/kontakt/` | Kontakt & Anfahrt – AlpenBox24 Miesbach | Bayrischzeller Straße 2-8, 83714 Miesbach. Route, Parken, Anreise mit der Bahn, Störung melden und Kontakt zum AlpenBox24 Team. |
| `/faq/` | Häufige Fragen – AlpenBox24 Miesbach | Sonntags offen? Wie bezahle ich? Was passiert bei einer Störung? Antworten zu Öffnungszeiten, Bezahlung, Altersprüfung und Sortiment. |
| `/en/` | AlpenBox24 – 24/7 Shop in Miesbach, Bavaria | Snacks, drinks and local Bavarian products, open 24 hours a day, every day of the year, on the main road through Miesbach towards Schliersee. |
| `/impressum/` | Impressum – AlpenBox24 | (noindex not needed; keep a plain description) Anbieterkennzeichnung der AlpenBox24 gemäß § 5 DDG. |
| `/datenschutz/` | Datenschutzerklärung – AlpenBox24 | Informationen zur Verarbeitung personenbezogener Daten auf alpenbox24.de und im AlpenBox24 Minimarkt in Miesbach. |
| `/barrierefreiheit/` | Barrierefreiheit – AlpenBox24 | Wie wir die Website von AlpenBox24 zugänglich gestalten und wie du uns Barrieren melden kannst. |
| `404` | Seite nicht gefunden – AlpenBox24 | (`noindex`) |

> Check character counts in the build (QA skill has a script). If the domain differs from `alpenbox24.de`, update the Datenschutz description.

## 4. On-page rules

- One `<h1>` per page containing the primary keyword in natural German (see copy doc).
- H2/H3 hierarchy reflects content, not decoration.
- First 100 words of each page name what, where, when (AlpenBox24, Miesbach, 24/7).
- Descriptive German `alt` on every content image (rules in `07-photo-gallery-brief.md`). Decorative images `alt=""`.
- Internal links: every page links to `/kontakt/` (route) and at least one sibling; footer carries NAP + hours.
- Canonical on every page; trailing-slash URLs (`/sortiment/`); lowercase ASCII slugs; umlauts transliterated (`ueber-uns`).
- `hreflang`: `/` ↔ `/en/` only (de, en, x-default → `/`).
- Open Graph + Twitter card per page; default OG image `public/og/og-default.jpg` 1200×630.

## 5. Structured data (JSON-LD, generated from `site.ts`)

On every page: `ConvenienceStore` (schema.org LocalBusiness subtype) in the layout; `BreadcrumbList` on
sub-pages. Example output (values from `site.ts`; `[TBC]` fields must be filled before launch):

```json
{
  "@context": "https://schema.org",
  "@type": "ConvenienceStore",
  "@id": "https://alpenbox24.de/#store",
  "name": "AlpenBox24",
  "alternateName": "Alpen Box 24 Minimarkt",
  "description": "24/7 Automaten-Minimarkt in Miesbach mit Snacks, Getränken und regionalen Produkten.",
  "url": "https://alpenbox24.de/",
  "image": ["https://alpenbox24.de/og/og-default.jpg"],
  "logo": "https://alpenbox24.de/icons/icon-512.png",
  "telephone": "[TBC]",
  "email": "[TBC]",
  "priceRange": "€",
  "paymentAccepted": "[TBC e.g. Bargeld, girocard, Kreditkarte, Apple Pay, Google Pay]",
  "currenciesAccepted": "EUR",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bayrischzeller Straße 2-8",
    "postalCode": "83714",
    "addressLocality": "Miesbach",
    "addressRegion": "Bayern",
    "addressCountry": "DE"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "[TBC]", "longitude": "[TBC]" },
  "hasMap": "[TBC Google Maps place URL]",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }],
  "areaServed": ["Miesbach", "Landkreis Miesbach"],
  "sameAs": []
}
```

- `00:00–23:59` on all seven days is the established convention for "open 24 hours" in schema markup.
- Take `geo` from the exact Google Maps pin of the shop entrance (6 decimals).
- Do **not** add `FAQPage` markup expecting rich results — Google restricted FAQ rich results to authoritative
  government/health sites in 2023. Visible FAQ content still helps users and long-tail ranking.
- Do not add `Product`/`Offer` markup for age-restricted goods. Do not add `AggregateRating` from self-collected reviews.

## 6. Local SEO operations (outside the codebase, owned by Ahad/client)

1. **Google Business Profile** — primary category: the closest available "Convenience store / Kiosk" type
   (choose in the GBP UI; check which German category names are offered). Hours: "24 Stunden geöffnet" all
   days. Add support phone, website `https://alpenbox24.de/`, attributes (contactless payment if true, wheelchair
   access only if true). 20+ photos from the shoot, refreshed seasonally. Post monthly (regional products, seasonal
   items, closures). Never post about vapes.
2. **NAP consistency** — exactly: `AlpenBox24 · Bayrischzeller Straße 2-8 · 83714 Miesbach · [phone]` everywhere.
3. **Apple Business Connect, Bing Places** — claim both; same NAP and hours.
4. **OpenStreetMap** — add the shop as `shop=vending_machine` (OSM's recommended tag for several vending
   machines in one room), with `name=AlpenBox24`, `opening_hours=24/7`, `payment:*`, `self_service=yes` [S37].
   OSM feeds many apps and car navigation.
5. **Regional listings** — ask the Ökomodellregion Miesbach to add AlpenBox24 to its list of self-service shops
   and machines once regional products are stocked [S17]; Alpenregion Tegernsee Schliersee tourism partners; Stadt
   Miesbach business directory; Das Örtliche / Gelbe Seiten.
6. **Reviews** — QR code at the shop to the GBP review form; reply to every review within 48 h. No incentives for reviews.
7. **On-site signage** — QR to `/so-gehts/` and `/kontakt/#stoerung` on every machine; this generates branded
   visits and helps Google associate site and place.

## 7. Measurement and validation plan

| When | Action |
|---|---|
| Before launch | Run each primary/secondary term through Google Keyword Planner (location: Landkreis Miesbach + Munich). Record volumes in this doc. Drop terms with zero signal from titles only if a better variant exists. |
| Launch day | Verify Google Search Console (DNS TXT) and Bing Webmaster Tools; submit `sitemap-index.xml`. |
| Week 2–12 | GSC: impressions/queries per page; GBP Insights: calls, direction requests, website clicks. |
| Month 3 | Rewrite titles for pages with high impressions and CTR < 2 %. Add FAQ entries from real query data and real customer questions. |
| Ongoing | KPI = direction requests + calls from GBP, organic clicks to `/kontakt/`, branded search growth. |
