# 14 — Refocus: vending-machine sales & installation (29.10.2026)

**Client correction:** AlpenBox24's business is *selling and setting up vending machines* for customers,
wherever they need them. The 24/7 minimarket at Bayrischzeller Straße 2-8 in Miesbach is AlpenBox24's own
box and now serves as a live showcase. Docs 00–13 were written for a shop-customer site; where they conflict,
this file wins.

## What changed

| Before | Now |
|---|---|
| Audience: shop customers at night | Audience: buyers of vending machines (farm shops, companies, hotels, clubs, municipalities, 24/7-shop founders) |
| Pages: Sortiment, Regional, So geht's, FAQ | Removed; 301 → `/automaten/`, `/kontakt/` (see `.htaccess`) |
| — | New: `/automaten/` (machine types + interactive machine), `/miesbach/` (the 24/7 box: address, hours, map) |
| Payment, age check, refunds, fault reports | Removed (not relevant for buyers) |
| Long copy | Short: one headline + one line per block |
| Region photos | 19 licensed vending-machine photos (Wikimedia Commons) lead; region photos only as accents |
| JSON-LD `ConvenienceStore` | `LocalBusiness` (sales + setup) with the box as `department` (`ConvenienceStore`, 24/7) |
| Form: Störung / Wunsch / Erzeuger | Form: Automat kaufen / aufstellen lassen / 24/7-Shop planen / Sonstiges; optional Standort |

## Machine types (src/data/machines.ts)
Snackautomat · Getränkeautomat · Regionalautomat · Fächerautomat · Brotautomat · 24/7-Automatenshop ·
Outdoor-Automat · Frische & Food · "Deine Idee". These are generic categories, not a product catalogue — no brands,
models or prices are claimed. Replace photos with real AlpenBox24 installations as soon as they exist
(new gallery category "projekte"), and confirm with the client which types they actually offer.

## Keywords (new primary set, volumes not verified)
Verkaufsautomat kaufen · Automaten aufstellen lassen · Snackautomat kaufen · Getränkeautomat kaufen ·
Regionalautomat / Hofladen Automat · 24/7 Automatenshop eröffnen · Automaten Miesbach / Oberbayern.

## Open points for the client
- Which machine types, brands and services (delivery area, maintenance, financing, rental) they really offer.
- Photos of their own installations and of the Miesbach box.
- Operator's legal name for the Impressum (§ 5 DDG).
