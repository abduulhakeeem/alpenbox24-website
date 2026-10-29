# 04 — Design system

## 1. Concept: "Das Licht an der B 472"

The shop is a lit box on a dark mountain road. Everything on the site follows from that image:
night-first darkness, one warm light (the sun = alpenglow), one cold signal colour (lime = the "open" light),
and the white ridge line from the logo as the horizon that ties every page together.

**What makes it unmistakably AlpenBox24 (spend boldness here, keep the rest quiet):**
1. **The ridge line.** The logo's white mountain stroke (round caps, round joins) becomes the site's
   horizon: drawn across the hero once on load, reused as section divider and footer edge. Nobody else has it.
2. **Signpost CTAs.** Alpine trail signs are arrow-shaped plates pointing to a destination. The primary
   action ("Route planen") is literally a signpost plate. The site's main job is directions; the shape says so.
3. **Night photography with real light.** Long exposures of the lit shop, headlight trails on the B 472,
   snow, the mountains at blue hour. Product shots are secondary.
4. **"Es ist 03:14 — wir haben offen."** The open-now chip shows the current local time when JS is available.
   A tiny moment of delight that proves the proposition.

**Avoid (the generic kit):** uppercase tracked eyebrows over headings, identical rounded shadow cards, a
fade-up on every section, gradient blobs, "→" appended to links, numbered markers where there is no sequence
(only `Steps` is numbered), stock photos of vending machines from other countries.

## 2. Colour tokens

Canonical values come from the print master (`brand/source/Alpen_Box_24_Flyer_A6_Druckdatei_Orange_Sonne_Gruen.pdf`).

| Token | Hex | Name / role |
|---|---|---|
| `--c-nacht` | `#0D0C0B` | Night. Page background (exact flyer black). |
| `--c-fels` | `#1A1816` | Rock. Raised surfaces, header on scroll, form fields. |
| `--c-grat` | `#2B2825` | Ridge. Borders, dividers, chip backgrounds. |
| `--c-schnee` | `#F7F7F7` | Snow. Primary text, ridge line, logo white. |
| `--c-stein` | `#B5AFA6` | Stone. Secondary text, captions, meta. |
| `--c-sonne` | `#F68A2B` | Sun. Warm accent: highlights, focus ring, map pin, sun in logo. |
| `--c-laerche` | `#C7E222` | Larch (spring larch needles). "Open/go" signal: primary CTA fill, open chip, "24". |
| `--c-leuchte` | `#D7FF00` | Glow (neon from the window banner). Screen-only glow/hover on CTA. Never for body text, never in print. |

**Verified contrast (WCAG 2.x):**

| Pair | Ratio | Use |
|---|---|---|
| Schnee on Nacht | 18.24 | body text ✔ |
| Schnee on Fels | 16.53 | ✔ |
| Stein on Nacht | 8.98 | secondary text ✔ (AAA) |
| Stein on Grat | 6.73 | chip text ✔ |
| Lärche on Nacht | 13.34 | links, "24", small text ✔ |
| Sonne on Nacht | 7.99 | accent text ✔ |
| Sonne on Grat | 5.99 | ✔ |
| Nacht on Lärche | 13.34 | CTA label on lime button ✔ |
| Nacht on Sonne | 7.99 | label on orange ✔ |
| **Schnee on Sonne** | **2.28** | **✘ never put white text on orange** |
| **Lärche on Schnee** | **1.37** | **✘ never lime on white** |

There is no light theme. Legal pages use the same dark palette with a comfortable measure.
`color-scheme: dark;` on `:root`. Respect `forced-colors: active` (system colours, keep focus visible).

## 3. Typography

| Role | Family | Settings | Licence / source |
|---|---|---|---|
| Display (H1, H2, signpost labels, big numerals) | **Archivo** (variable) | wght 800, wdth 112–125 (expanded) for H1/H2; wdth 100 for H3 | SIL OFL, self-host woff2 |
| Text (body, UI, forms) | **Atkinson Hyperlegible Next** (variable) | wght 400/600/700 | SIL OFL, self-host woff2 |

Why: Archivo Expanded echoes the wide, bold signage letters of the logo without copying its system font,
and has the "trail sign / road sign" sturdiness. Atkinson Hyperlegible Next was designed by the Braille
Institute for character distinction — ideal for reading on a phone at night, on a dark background.

Download woff2 from the official Google Fonts families (or Fontsource packages) and put them in
`public/fonts/`; subset to Latin + Latin-1 Supplement + € + typographic quotes („“ ‚‘) + en dash.
**Verify the variable axes when downloading** (Archivo must include `wdth`; if your source lacks it, use the
static "Archivo ExtraBold Expanded" cut). `font-display: swap`; preload only the display font file used above the fold.

**Scale** (fluid, `clamp`, 1.25 minor-third at mobile → 1.333 at desktop):

| Token | Mobile → Desktop | Use |
|---|---|---|
| `--fs-hero` | 2.6rem → 5.2rem | H1 on Start |
| `--fs-1` | 2.1rem → 3.4rem | H1 sub-pages |
| `--fs-2` | 1.6rem → 2.3rem | H2 |
| `--fs-3` | 1.25rem → 1.5rem | H3 |
| `--fs-body` | 1.0625rem → 1.125rem | body (17–18 px) |
| `--fs-small` | 0.9375rem | captions, meta |

Line-height: display 1.02–1.1, body 1.6. Measure: 62–70 ch for text blocks. Headings in sentence case
(no all-caps labels; the logo is the only all-caps element besides the "24/7" numeral treatment).
German typography: `hyphens: auto` with `lang="de"`, real quotes „…“, en dash with spaces for ranges in prose
("0 – 24 Uhr" may also be written "0–24 Uhr"), non-breaking space between number and unit (`24 h`, `150 m²`).

## 4. Layout

- Mobile-first. Breakpoints: 600, 960, 1280 px.
- Container: `min(100% - 2rem, 76rem)`; text column `min(100% - 2rem, 42rem)`.
- Spacing scale (rem): 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8. Section padding block: 4 → 8.
- Grid: 4 cols mobile / 8 tablet / 12 desktop; gutters 1rem → 1.5rem.
- Left-aligned text everywhere except the 404 and the short fact strip.
- Radius: 6 px on images and inputs, 999 px on chips; signpost buttons use their own shape. Not one radius for everything.
- Elevation: none. Separation through value (Nacht → Fels → Grat) and the ridge line, never drop shadows.

## 5. Signature components — specs

**RidgeLine.** Inline SVG using the logo's ridge polyline (extract from `brand/logo/alpenbox24-mark.svg`,
the stroked path), `stroke: var(--c-schnee)`, `stroke-width` 3–6 px depending on size, `stroke-linecap/linejoin: round`,
`vector-effect: non-scaling-stroke`, `preserveAspectRatio="none"` when stretched as a divider. Hero version draws once
(`stroke-dasharray` animation, 1.4 s, ease-out) after the H1 is painted; `prefers-reduced-motion: reduce` → no animation.

**SignpostButton.** Lärche fill, Nacht label, Archivo 800 wdth 112, 1.0625rem, padding 0.9rem 2.6rem 0.9rem 1.2rem,
`clip-path: polygon(0 0, calc(100% - 1.1rem) 0, 100% 50%, calc(100% - 1.1rem) 100%, 0 100%)`. Hover/focus: glow
`box-shadow` is clipped, so use a `filter: drop-shadow(0 0 .6rem var(--c-leuchte))` on a wrapper instead. Focus ring:
2px Sonne outline offset 3px on the wrapper. Secondary button: Fels fill, Schnee label, 1px Grat border, rectangle.

**OpenNow chip.** Pill, Grat background, 8 px Lärche dot with a slow 2.4 s pulse (disabled under reduced motion),
text "24/7 geöffnet". With JS: "Jetzt geöffnet · 03:14" using `Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit'})`,
updated every 30 s. Logic reads the hours config, so it can say "Gerade geschlossen – wieder ab …" if hours ever change.

**FactStrip.** Three facts in a single row on desktop, stacked on mobile, divided by short ridge "ticks", Archivo for
the fact, Atkinson for the qualifier. Not cards.

**StaticMap.** Pre-rendered PNG/AVIF (1200×800 and 600×600) generated once from OpenStreetMap data — e.g. export
via a static map tool or screenshot of an OSM tile layer **with visible "© OpenStreetMap-Mitwirkende" attribution**
(ODbL) — darkened to match the palette, Sonne pin on the shop. The whole map is a link to Google Maps directions.
Do not hotlink tiles at runtime.

## 6. Imagery

- Photography leads; illustration only for the ridge line and icons.
- Colour grade: deep neutral shadows (not crushed), warm practical light (shop interior ≈ sun), cool ambient (blue hour).
  Keep highlights on the lime signage clean.
- Aspect ratios: hero 16:9 desktop / 4:5 mobile (art-directed `<picture>` sources), tiles 4:5, gallery mixed.
- Never show vape products, vaping, or people under 25-looking near age-restricted goods. Never show readable licence
  plates or identifiable people without a signed release.
- Full brief: `07-photo-gallery-brief.md`.

## 7. Icons

Custom-drawn or Lucide (ISC licence) line icons, inlined as SVG, `stroke-width: 2`, round caps/joins to match the
ridge line; 24 px grid; `aria-hidden="true"` when next to text. Needed: route, phone, whatsapp (brand mark from
official asset), clock, card/contactless, id-card, alert, map-pin, train, car, bike, mail, chevron, close, arrow-left/right.

## 8. Motion

- One orchestrated moment: hero ridge draw + OpenNow dot. Nothing else animates on load.
- Interaction feedback: 120–180 ms colour/transform transitions on buttons, chips, gallery thumbnails (slight scale 1.02, no shadow).
- Lightbox open/close: 160 ms opacity + scale 0.98→1.
- `@media (prefers-reduced-motion: reduce)` disables all non-essential motion.

## 9. Accessibility floor
WCAG 2.2 AA: focus visible (2px Sonne ring), targets ≥ 44×44 px (we use 48), skip link, landmarks, `lang` attributes,
form labels + error text, `aria-live="polite"` for the clock only if updated text matters (it doesn't — keep it out of
the live region), accordions via native `<details>`, lightbox traps focus inside `<dialog>` and restores it on close,
alt text rules in the photo brief. Zoom to 200 % without loss; no horizontal scroll at 320 px.

## 10. Logo usage
Assets in `brand/logo/`:
- `alpenbox24-logo-full.svg` — stacked lockup. Contains a Nacht-coloured mask shape behind the ridge, so place **only on
  `--c-nacht`** (or use `alpenbox24-logo-full-tile.svg`, which includes its own background).
- `alpenbox24-mark.svg` — sun + ridge (header, favicon base). Same Nacht-background rule.
- `alpenbox24-wordmark.svg` — "ALPEN BOX 24" + lime underline (header lockup next to the mark on desktop).
- `favicon.svg`, `icon-32/180/192/512.png` — app icons.
Minimum sizes: mark 28 px tall, full lockup 120 px wide. Clear space: height of the "A" on all sides.
Never recolour, stretch, add effects or place on photos without a Nacht scrim of ≥ 60 % behind it.
