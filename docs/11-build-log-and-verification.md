# 11 — Build log, research verification and decisions (29.10.2026)

This file records what was built on top of the kit (docs 00–10), which research claims were re-checked
against primary sources, what was corrected, and where the build deliberately departs from the kit.

---

## 1. Research re-verification

| Claim in kit | Check | Result |
|---|---|---|
| District tourism 2025: 805,163 arrivals, 2,620,889 overnight stays, Schliersee most arrivals (171,995) | Fetched regionalentwicklung-oberland.de press release directly | **Confirmed** word for word. Also: Bad Wiessee leads overnight stays (570,438); 17,575 guest beds; hotels 39.2 % of stays, holiday flats 19.3 %. |
| BayLadSchlG since 1 Aug 2025 allows staffless shops ≤ 150 m² 24/7 incl. Sundays | infranken.de (21.01.2026), GVBl. 14/2025 listing | **Confirmed.** New: DGB, Verdi, KAB and others filed a *Popularklage* at the **Bayerischer Verfassungsgerichtshof** (Jan 2026), still pending at time of writing. Keep hours as data (`site.ts`). |
| OLG Karlsruhe 08.04.2026, 6 U 1/26 (banner, "3 NEUE FLAVOURS") | Fetched bohillebrand.de article | **Confirmed** (date, docket, splash backgrounds, "3 NEUE FLAVOURS"). |
| OLG Bamberg 21.01.2026, 3 UKl 30/25 e | gesetze-bayern.de, LTO, beck-aktuell | **Confirmed** (Netto, Pro Rauchfrei e.V.). |
| Südkäse cheese machine on Bayrischzeller Straße, 365 days | suedkaese.com + OSM | **Confirmed.** OSM places it at **Bayrischzeller Straße 15**. |
| "No direct competition in Miesbach for a general 24/7 snack/drinks shop" | OpenStreetMap Overpass query, 700 m radius | **Corrected.** See §2. |
| Walking time from Miesbach station `[TBC]` | OSRM foot routing on OSM data | **Resolved:** 767 m, ≈ 10 min. Now in `site.ts` and on the site. |
| Shop coordinates `[TBC]` | Nominatim geocoding of Nr. 2 and Nr. 8 | **Approximated:** 47.7882, 11.8379 (between both house numbers). Replace with the Google Business Profile pin. |
| Ökomodellregion list of self-service shops & machines | HTTP check of the PDF URL | **Confirmed** reachable (PDF, 194 KB). |
| AlpenBox24 online footprint | Web search "AlpenBox24 Miesbach" | **None found** — no site, no listings. Brand search is open; claim GBP, Apple, Bing, OSM early. |

## 2. Competitive landscape within 700 m (OpenStreetMap, Oct 2026)

| Place | Distance | Hours (OSM) | What it means |
|---|---|---|---|
| Shell petrol station + Shell Select shop | ~120 m | not tagged | Closest late-hours rival for drinks/snacks. Check hours on the ground. |
| Esso petrol station shop, Straß 2 | ~670 m | **Mo–Fr 05–23, Sa/Su 06–23** | Covers evenings and Sundays until 23:00. |
| Lidl | ~180 m | — | Closes 20:00 / Sundays closed (Bavarian law). |
| EDEKA E-Center | ~500 m | Mo–Sa 07–20 | Closes 20:00. |
| "Snacks and drinks Miesbach" vending machine | ~510 m | — | Single machine. |
| Lavli Coop. | ~330 m | — | Member-based store (cashless). |
| Südkäse cheese machine, Bayrischzeller Str. 15 (opposite Esso) | ~580 m | 365 days | Neighbour and potential partner, not a rival. |
| Bakeries (Gschwendtner etc.) | 270 m+ | Su 07–11 | Short Sunday morning hours only. |

**Positioning consequence:** "24/7" alone is not unique between 05:00 and 23:00 — the petrol stations cover that.
AlpenBox24 owns **23:00–05:00**, **regional food** (no petrol station does Oberland Brotzeit) and a
**calm, clean, transparent** experience. The copy leans on exactly those three things
(see the "Ein Tag an der B 472" moments: 05:40, 20:01, 23:30, 03:14, Sonntag).

## 3. Design & motion — deliberate departures from the kit

The client asked for "crazy" design and "really good animations". The kit's design system (04) stays the
foundation — palette, Archivo + Atkinson, ridge line, signpost CTA, night-first — but motion was expanded:

| Kit rule | Build | Why it is still safe |
|---|---|---|
| One orchestrated load moment only | Hero: letters rise, sun rises behind the logo ridge, ridge draws, Ken-Burns photo, film grain, pointer-following warm light | Every effect respects `prefers-reduced-motion`; content is visible without JS. |
| No scroll storytelling | **"Ein Tag an der B 472"**: 640 vh scroll-scrubbed section, sky colour, stars, sun/moon arc and a giant clock move from 05:40 to Sonntag | Without JS it renders as a plain ordered list of six moments (real SEO text). |
| Sortiment as photo tiles | **Interactive vending machine**: 9 lit compartments, keypad (type "B2" + OK), coil spin, item drops into the tray, info panel | Without JS each compartment is a normal link to its Sortiment section. Categories are generic and labelled as examples (R8). |
| Static map image | **Custom vector map** generated from OSM data; walking route from the station draws itself, a dot walks it, the shop pin pulses | Self-hosted, ODbL attribution, links out to Google/Apple Maps. |
| — | Lime/orange **marquee bands**, magnetic signpost buttons, sheen sweep, cross-page **View Transitions**, scroll progress bar | Pure CSS where possible; `@view-transition` is progressive. |
| JS ≤ 4 KB gz | One vanilla module (`src/scripts/app.ts`) ≈ 3–4 KB gz + 60-byte `boot.js` | No framework, no third-party code, static HTML. |

## 4. Photography

No photos of the real shop exist yet. The site therefore uses **22 real photographs from Wikimedia Commons**
(Tegernsee/Schliersee/Wendelstein/Spitzingsee/Miesbach, Brotzeit, cheese cellar, farm vending huts),
all under CC0 / CC BY / CC BY-SA / public domain:

- Licence, author and source page are stored in `src/data/photo-credits.json` (generated at download).
- Every photo shows a credit link; `/bildnachweise/` lists full attribution.
- EXIF/GPS stripped on re-encode. No vending machines from other shops are presented as AlpenBox24.
- Captions describe what is actually shown (e.g. "Das Tegernseer Tal bei Nacht"), never "unser Laden".
- The client's flyer and window banner were **not** used as images: both carry "VAPES" prominently (§ 19 TabakerzG).

**Next:** the half-day shoot from `docs/07`. When shop photos arrive, add a `laden` gallery category and swap
the hero to the lit shop at blue hour.

## 5. Staging vs. production

| | `npm run build:preview` (STAGING=1) | `npm run build` (production) |
|---|---|---|
| Missing client facts | Dashed orange "… folgt" marker | Literal `[TBC]` → `guard.mjs` **fails the build** |
| Robots | `noindex, nofollow` on every page | indexable (except 404/danke) |
| Contact form | Notice that it activates after go-live | Posts to `/api/kontakt.php` |

The live preview on GitHub Pages is a staging build. **The production domain must not go live until the
Impressum facts are filled** (§ 5 DDG requires name, address, fast contact). See `docs/12-go-live-hostinger.md`.
