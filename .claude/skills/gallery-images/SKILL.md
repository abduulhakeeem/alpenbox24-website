---
name: gallery-images
description: Add, replace or organise photos for the AlpenBox24 website — gallery entries, hero images, category tiles, producer photos, static map and OG images; file naming, licence/credit records, alt text and image optimisation. Use whenever a photo is added or changed.
---

# Photos & gallery

Brief and shot list: `docs/07-photo-gallery-brief.md`. Collection schema: `src/content.config.ts` (`gallery`).

## Add a gallery photo
1. Check the photo: no vapes/tobacco/vaping, no identifiable person without release, no readable licence plates,
   EXIF GPS removed. If unsure, stop and ask the user.
2. Name it `ab24-{category}-{subject}-{nn}.jpg` (lowercase ASCII) and put it in `src/assets/gallery/`.
   Long edge ≥ 3200 px, sRGB, JPEG q90. Astro generates AVIF/WebP.
3. Append an entry to `src/content/gallery/gallery.json` with `id`, `src` (`../../assets/gallery/…`), German `alt`
   (80–150 chars, what is visible), optional `caption` (≤ 120 chars), `category` (laden | nacht | regional | oberland),
   `featured`, `orientation`, `credit`, `license`, `date`.
4. `npm run build:staging` — the Zod schema rejects missing alt/credit/licence.

## Page images
`src/assets/photos/{page}/…`, used via `<Picture>`; hero needs a 4:5 mobile crop and a 16:9 desktop crop with the
subject in the right 60 % for the text overlay.

## Static map
Generate once from OpenStreetMap data, darken to the palette, Sonne pin on the shop, visible
"© OpenStreetMap-Mitwirkende" attribution; save as `src/assets/map/karte-miesbach-{1200|600}.png`. Never hotlink tiles.

## OG image
`public/og/og-default.jpg` 1200×630: hero crop, full logo on a Nacht scrim, no text beyond the logo, < 200 KB.

## Never
Stock photos of vending machines from elsewhere presented as AlpenBox24; AI-generated "photos" of the shop;
images without a recorded licence.
