---
name: alpenbox-brand
description: Apply the AlpenBox24 visual identity — colour tokens, typography, logo usage, ridge line, signpost buttons, motion and layout rules. Use before creating or restyling any component, page section, CSS, SVG, OG image or favicon for the AlpenBox24 website.
---

# AlpenBox24 brand

Full spec: `docs/04-design-system.md`. Tokens: `src/styles/tokens.css`. Logos: `brand/logo/`.

## Concept
"Das Licht an der B 472" — a lit box on a dark mountain road. Night-first, photo-led. One warm light (Sonne),
one cold signal (Lärche), the white ridge line as horizon.

## Relationship to the bundled `frontend-design` skill
Use `frontend-design` for general craft (type scale, restraint, self-critique with screenshots). It lists
"near-black background with one bright acid accent" as a generic default; here that palette is the client's existing
brand, so the brief wins. Distinctiveness comes from the ridge line, signpost CTAs, real night photography and the
OpenNow clock — not from changing the colours.

## Do
- Use tokens only; never hard-code hex values in components.
- Text colours: Schnee (body), Stein (secondary), Lärche (links, "24", open state), Sonne (accent/focus).
- Primary CTA = `SignpostButton` (Lärche fill, Nacht label, arrow-plate clip-path). Only one primary CTA per view.
- Headings: Archivo 800, expanded width (wdth ≈ 112–125), sentence case. Body: Atkinson Hyperlegible Next.
- Reuse the logo's ridge polyline for `RidgeLine` (hero draw once, dividers, footer edge). Round caps/joins.
- Separation by value (Nacht → Fels → Grat) and the ridge line — not shadows.
- Numbered markers only in `Steps` (real sequences).
- Motion: one hero moment; 140–180 ms feedback transitions; honour `prefers-reduced-motion`.
- Place `alpenbox24-logo-full.svg` / `alpenbox24-mark.svg` only on `--c-nacht` (they contain a Nacht mask); use the `-tile` variant elsewhere.

## Never
- White text on Sonne (2.28:1) or Lärche on light backgrounds (1.37:1).
- Leuchte (`#D7FF00`) for text — glow/hover only.
- Uppercase tracked eyebrows, middle-dot meta strings (except the brand's own tagline on signage imagery), identical
  rounded shadow cards, gradient blobs, fade-up on every section, "→" glued to link text.
- Recolouring, stretching or adding effects to the logo; logo directly on photos without ≥ 60 % Nacht scrim.
- A light theme.

## Checklist before finishing a UI change
1. Contrast still AA (see table in design doc). 2. Focus ring visible (2px Sonne, 3px offset). 3. Targets ≥ 48 px.
4. Works at 320 px and 200 % zoom. 5. Screenshot it and compare against the concept: does it feel like night on the B 472?
