---
name: alpenbox-copy-de
description: Write or edit any German (or English) text for the AlpenBox24 website — headings, body copy, buttons, form errors, alt text, FAQ answers, meta descriptions. Use whenever words appear on the site, and before changing copy in docs/05-content-copy-de.md.
---

# AlpenBox24 voice (DE first)

Source copy: `docs/05-content-copy-de.md` — use it verbatim unless the user asks for changes.

## Voice
- du-Form, warm, direct, local. Short sentences. Concrete facts over adjectives.
- Bairisch only as seasoning ("Servus", "Brotzeit"), never dialect cosplay.
- Write from the visitor's situation: Sonntagabend, nach dem Skitag, Ferienwohnung ohne Frühstück, Nachtschicht.
- Buttons say exactly what happens: "Route planen", "Anrufen", "Störung melden", "Nachricht senden".
- Errors explain what went wrong and how to fix it, no apology theatre.

## Banned
- Superlatives and hype: "der beste", "ultimativ", "einzigartig", "revolutionär", "Erlebnis".
- Filler: "In der heutigen schnelllebigen Zeit", "Es ist wichtig zu beachten", "Tauche ein", "Entdecke die Welt von".
- Unverified claims: prices, product counts, producer names, payment methods, refund speeds, "datenschutzkonform",
  "stufenlos" — unless present in `src/data/site.ts` without `[TBC]`.
- English filler in German UI ("Shop now", "Drinks" as nav label). Exception: established words (Snacks, Energydrinks).
- Excessive dashes; prefer full sentences.

## Tobacco/e-cigarettes (hard rule, § 19 TabakerzG)
Only this approved sentence (or its FAQ/So-geht's variants in the copy doc) may mention them:
> Im Sortiment sind auch Tabakwaren und E-Zigaretten. Diese Produkte gibt der Automat nur nach erfolgreicher
> Altersprüfung aus. Eine Abgabe an Personen unter 18 Jahren ist ausgeschlossen.
Never: flavours, brands, "neu", variety, suitability, price, health comparisons, emphasis, headings, alt text, meta.

## German typography
„Anführungszeichen“, `0–24 Uhr`, non-breaking space in `24 h`, `150 m²`, `B 472`. Dates `29.10.2026`. Times `03:14 Uhr`.
Phone display in national format, links in E.164.

## Alt text
80–150 characters, what is visible + why it matters, place name at most once per page, no "Bild von".

## English page
Plain international English for tourists; same facts as DE; no idioms that don't translate.
