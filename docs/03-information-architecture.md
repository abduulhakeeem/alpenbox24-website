# 03 — Information architecture, navigation, page templates

## 1. Sitemap

```
/                      Start
├─ /sortiment/         Sortiment
├─ /regional/          Regional (Erzeuger aus dem Oberland)
├─ /so-gehts/          So geht's (Bezahlen, Altersprüfung, Störung, Sicherheit)
├─ /galerie/           Galerie
├─ /ueber-uns/         Über uns
├─ /kontakt/           Kontakt & Anfahrt  (#route, #stoerung, #formular)
│  └─ /kontakt/danke/  Danke (noindex)
├─ /faq/               Fragen & Antworten
├─ /en/                English (single page)
├─ /impressum/
├─ /datenschutz/       (#videoueberwachung anchor)
├─ /barrierefreiheit/
└─ /404                (noindex)
```

## 2. Navigation

**Header (desktop ≥ 960 px):** logo lockup (mark + wordmark, links to `/`) · Sortiment · Regional · So geht's ·
Galerie · Über uns · **[Route planen]** signpost button (→ `/kontakt/#route`). Language link "EN" at the far right.

**Header (mobile):** mark + wordmark small · open-state pill "24/7 offen" · menu button.
Menu = `<details>`/`<summary>` disclosure (works without JS), full-height panel, items in the same order + Kontakt + FAQ + EN.

**Sticky mobile action bar** (bottom, < 960 px, appears after the hero): three equal targets —
`Route` (Google Maps link) · `Anrufen` (`tel:`) · `Störung` (`/kontakt/#stoerung`). 56 px tall, safe-area aware.

**Footer:** NAP block (from `site.ts`) · "Täglich 0–24 Uhr" · payment summary · nav columns (Laden / Infos / Rechtliches)
· Instagram (if exists) · "© {year} AlpenBox24" · Impressum · Datenschutz · Barrierefreiheit. The ridge line (signature
element) runs across the top edge of the footer.

**Breadcrumbs:** on all sub-pages except legal pages, visually small, above H1; mirrored in `BreadcrumbList` JSON-LD.

## 3. Page templates (wireframes, mobile-first; desktop notes in brackets)

### 3.1 Start `/`
```
┌──────────────────────────────────────────┐
│ HEADER                                   │
├──────────────────────────────────────────┤
│ HERO  full-bleed night photo of the shop │
│  ridge line stroke draws across once     │
│  H1  Dein Minimarkt in Miesbach.         │
│      Rund um die Uhr offen.              │
│  Lead (1 sentence)                       │
│  [Route planen ▶]  (signpost)  Anrufen   │
│  OpenNow chip: "Jetzt geöffnet · 03:14"  │
├──────────────────────────────────────────┤
│ FACT STRIP (3 facts, not cards):         │
│  24/7 · auch sonntags | B 472, Miesbach  │
│  | kontaktlos bezahlen [TBC]             │
├──────────────────────────────────────────┤
│ SORTIMENT TEASER                         │
│  4 category tiles w/ photos (Getränke,   │
│  Snacks, Regionales, Alltag & Notfall)   │
│  link: Ganzes Sortiment                  │
├──────────────────────────────────────────┤
│ REGIONAL STORY  split: photo | text      │
│  producer names/villages (only if real)  │
├──────────────────────────────────────────┤
│ SO GEHT'S in 3 steps (real sequence →    │
│  numbered is correct here)               │
├──────────────────────────────────────────┤
│ GALLERY STRIP  6 photos, horizontal      │
│  scroll-snap on mobile, link Galerie     │
├──────────────────────────────────────────┤
│ LOCATION  static map + address + hours   │
│  + Google Maps / Apple Maps buttons      │
├──────────────────────────────────────────┤
│ FOOTER                                   │
└──────────────────────────────────────────┘
```
[Desktop: hero text bottom-left over photo, 60 % width; fact strip as one horizontal band; sortiment 4-up grid; regional split 6/6.]

### 3.2 Sortiment `/sortiment/`
H1 → intro → category sections (anchor nav chips at top): Getränke · Snacks & Süßes · Brotzeit & Regionales
(links to `/regional/`) · Frühstück & Grundbedarf [TBC] · Alltag & Notfall (e.g. hygiene items, charging cables —
only what the client confirms; never list medicines: § 52 AMG generally prohibits selling medicinal products through
vending machines, so treat any "Kopfschmerztabletten" idea as a legal question for the client, not copy) · Altersbeschränkte Produkte
(one factual paragraph, no image, see copy doc). Each category: photo + short text + example list from client data.
Note "Sortiment wechselt; Preise am Automaten."

### 3.3 Regional `/regional/`
H1 → story → producer grid (ProducerCard: photo, name, village, distance, products, optional link) → "Erzeuger werden?"
CTA to `/kontakt/#formular` with subject preset. **If the client has no confirmed producers at launch,** this page
ships as "Regionales im Aufbau" with the story and the producer CTA, and no names.

### 3.4 So geht's `/so-gehts/`
H1 → 3-step HowTo (Auswählen · Bezahlen · Entnehmen) → Bezahlung (methods) → Altersprüfung (how, why) →
"Automat hat nicht ausgegeben?" (Störung process, refund) → Sicherheit & Sauberkeit (CCTV notice link, lighting,
cleaning schedule if true) → Rücksicht (night-time neighbour note) → CTA Kontakt.

### 3.5 Galerie `/galerie/`
H1 → filter chips (Alle · Laden · Nacht · Regional · Oberland) implemented as anchor sections (no JS) with
optional JS filter enhancement → masonry (CSS columns) of `<figure>` thumbnails → each thumb links to the full
image file; JS upgrades to `<dialog>` lightbox with keyboard nav, caption, counter, swipe.

### 3.6 Über uns `/ueber-uns/`
H1 → founder story (client input #15) → "Warum Miesbach" → values (Regional, Verlässlich, Verantwortungsvoll —
written as prose, not 3 icon cards) → people photo → CTA.

### 3.7 Kontakt `/kontakt/`
H1 → address card + hours + "Route mit Google Maps" / "Route mit Apple Maps" (`#route`) → static map image →
Anreise (Auto/A8, Parken [TBC], Bahn RB 55 Miesbach, Fahrrad) → `#stoerung` Störung melden (phone/WhatsApp first,
form second) → `#formular` contact form (Anliegen select: Störung / Sortimentswunsch / Erzeuger werden / Sonstiges) →
direct contacts.

### 3.8 FAQ `/faq/`
Grouped `<details>` accordions: Öffnungszeiten · Bezahlen · Altersprüfung · Sortiment · Störung & Erstattung ·
Anfahrt. Deep-linkable (`id` per question). Copy in `05`.

### 3.9 EN `/en/`
One page: hero, what/where/when, how to pay, age check, getting there, contact. `lang="en"`.

### 3.10 Legal
`Legal.astro` layout: narrow measure (68 ch), no hero, table of contents for Datenschutz, last-updated date from frontmatter.

## 4. Component inventory

| Component | Purpose | Notes |
|---|---|---|
| `Header`, `MobileMenu` | Nav | `<details>` based; `aria-current="page"` |
| `OpenNow` | "Jetzt geöffnet" chip + optional live clock | Static text by default; tiny script adds Europe/Berlin time. Reads `site.hours` so it says "geschlossen" if hours ever change. |
| `RidgeLine` | Signature SVG stroke (from logo path) | Used in hero (animated draw once, respects reduced motion), section dividers, footer top |
| `SignpostButton` | Primary CTA in trail-sign shape | `clip-path` arrow plate; min 48 px target |
| `FactStrip` | 3 key facts | One band, separated by ridge ticks, not cards |
| `CategoryTile` | Sortiment teasers | Photo + label, whole tile is the link |
| `ProducerCard` | Regional | Only rendered from real data |
| `Steps` | Numbered how-to | Only place numbered markers are used |
| `GalleryGrid`, `Lightbox` | Galerie | `<dialog>`; no-JS fallback = direct image link |
| `StaticMap` | Location | Pre-rendered image with OSM attribution, wrapped in a link to Google Maps |
| `AddressBlock`, `HoursBlock` | NAP | From `site.ts` |
| `MobileActionBar` | Route / Call / Störung | `position: sticky` bottom |
| `ContactForm` | PHP form | Native validation, honeypot, timestamp |
| `Faq` | Accordions | `<details name="faq-group">` exclusive groups |
| `Breadcrumbs`, `SeoHead`, `JsonLd` | SEO | From page props + `site.ts` |
| `TbcMark` | Dev-only highlight of `[TBC]` values | Build guard fails production build if any remain |

## 5. URL & redirect rules
- Trailing slash on all pages; `.htaccess` 301s non-slash → slash, `www` → apex, `http` → `https`.
- Common guesses 301: `/about/` → `/ueber-uns/`, `/contact/` → `/kontakt/`, `/impressum.html` → `/impressum/`, `/datenschutzerklaerung/` → `/datenschutz/`, `/gallery/` → `/galerie/`.
