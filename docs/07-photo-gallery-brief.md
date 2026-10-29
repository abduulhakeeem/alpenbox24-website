# 07 — Photography & gallery brief

The site is photo-led. Without real photos of the real shop it will look like every other template.
Budget recommendation: one half-day shoot split into **blue hour/night** (the hero material) and **daylight**
(products, producers), plus a seasonal top-up shoot in snow. Phone photos are acceptable only as placeholders.

## 1. Shot list

| # | Shot | Time | Use | Notes |
|---|---|---|---|---|
| H1 | Shop exterior from across the B 472, lit, long exposure (2–8 s) with headlight trails | Blue hour, 20–30 min after sunset | Home hero (16:9 + 4:5 crop) | Tripod. Shop lights on. Blur/avoid readable plates. Leave negative space top-left for text. |
| H2 | Same angle, full night | Night | Alt hero, OG image | Lime signage must not clip. |
| H3 | Exterior with mountains visible (if any sightline exists from the street) | Clear dawn | About, EN hero | Scout first. Do not fake mountains in. |
| H4 | Exterior in snow | Winter | Seasonal hero swap | Re-shoot in first snowfall. |
| I1 | Interior wide, all machines lit | Night | Sortiment hero, Gallery | Clean the glass first. Turn off flickering tubes. |
| I2 | Detail: payment terminal with a hand tapping a card/phone | Any | So geht's | Use a neutral card (no readable numbers). |
| I3 | Detail: age-check device (ID reader) — device only | Any | So geht's | No real ID visible. |
| I4 | Product fall/pick-up moment | Any | So geht's step 3 | |
| I5 | Machine number sticker close-up | Any | Störung section | Helps users find it. |
| P1–P6 | Category stills: drinks (condensation), snacks, Brotzeit board, breakfast items, everyday items | Daylight | Sortiment tiles | Shoot as styled groups on the shop shelf or slate; brands may appear incidentally but not as hero. **No tobacco/vape products, ever.** |
| R1–Rn | Each regional producer: portrait at farm/workshop + product in their hands + product in the AlpenBox machine | Daylight | Regional page | Model release + producer consent to be named. |
| O1–O6 | Oberland context: Miesbach Stadtplatz, Schliersee, road toward Bayrischzell, alpine meadow | Varied | Gallery "Oberland" | Only own photos or properly licensed ones; record licence in `src/content/gallery/*.json`. |
| U1 | Owners/team at the shop | Golden hour | Über uns | Real people beat stock. |

## 2. Technical specs (deliver to developer)

- Camera RAW → export **JPEG, sRGB, quality 90, long edge ≥ 3200 px** (hero ≥ 4000 px). Astro generates AVIF/WebP/sizes.
- File naming: `ab24-{section}-{subject}-{nn}.jpg`, lowercase, ASCII (`ab24-nacht-aussen-b472-01.jpg`).
- Remove GPS and camera serial EXIF on export (privacy). Keep copyright field = photographer.
- Hero: provide a version with the subject in the right 60 % (text overlay sits bottom-left).
- Grading per `04-design-system.md` §6. Consistent white balance across a set.

## 3. Gallery data model

Each image gets a JSON entry in `src/content/gallery/` (one file per image or one `gallery.json` via `file()` loader):

```json
{
  "id": "nacht-aussen-b472-01",
  "src": "../../assets/gallery/ab24-nacht-aussen-b472-01.jpg",
  "alt": "Der beleuchtete AlpenBox24 Minimarkt bei Nacht an der Bayrischzeller Straße, davor Lichtspuren vorbeifahrender Autos",
  "caption": "Kurz nach acht an der B 472.",
  "category": "nacht",          // laden | nacht | regional | oberland
  "featured": true,              // appears in home gallery strip
  "orientation": "landscape",   // landscape | portrait | square (layout hint)
  "credit": "Foto: {Name}",
  "license": "Auftragsarbeit, Nutzungsrechte AlpenBox24",
  "date": "2026-11-12"
}
```

Zod schema in `src/content.config.ts` must make `alt`, `category`, `credit`, `license` required.

## 4. Alt text rules (German)

- Describe what is visible and why it matters on this page; 80–150 characters; no "Bild von".
- Include place naturally where true ("in Miesbach", "an der Bayrischzeller Straße") — once per page is enough; do not keyword-stuff.
- Products: describe generically ("gekühlte Wasserflaschen im Automatenfach"), not brand-led.
- Decorative images (textures, the ridge line SVG) → `alt=""`.
- Never mention vapes/tobacco in alt text.

## 5. Gallery UX

- Masonry via CSS `columns` (2 cols mobile, 3 tablet, 4 desktop); `break-inside: avoid`.
- Thumbnails: `<Picture>` widths 400/800, `loading="lazy"`, explicit `width`/`height`, `decoding="async"`.
- Each `<figure>` wraps an `<a href="{full-size webp/jpg}">` so no-JS users get the full image.
- JS enhancement (`lightbox.js`, ≤ 2.5 KB gz): intercepts clicks, opens a single `<dialog>`, loads 1600 px AVIF/WebP,
  shows caption + credit + "Bild n von m", arrow keys, Esc, swipe (pointer events), focus trap, restores focus on close,
  preloads next image only.
- Category filter: anchor chips scroll to category sections by default; JS can switch to in-place filtering
  (`hidden` attribute), keeping URL hash in sync.
