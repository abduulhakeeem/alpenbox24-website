# 00 — Brief, scope and decisions

**Project:** Website for AlpenBox24 (24/7 automated minimarket)
**Location:** Bayrischzeller Straße 2-8, 83714 Miesbach (Landkreis Miesbach, Oberbayern) — from the client's A6 flyer
**Prepared for:** Ahad (Project Station) as build lead · **Builder:** Claude Code
**Research date:** 29 October 2026

---

## 1. What was asked (verbatim intent)

> Research SEO, keywords, market, demand, niche, relevance, design, writing, style, references,
> competition and everything for a vending machine business in Germany called AlpenBox24.
> Brand it and make the website look and feel cool. Pages: home, about, contact, plus the regular
> privacy policy/legal pages. Proper research, verified, no hallucination. Include all documentation
> and everything Claude Code needs to build it. Must not be built as a JS web app on Hostinger.
> Best, useful, well-researched, very good looking, full photo and gallery website, fully navigable.
> Include all skills.

## 2. Interpretation (what "done" means)

- A static, photo-led, multi-page site (13 routes) that out-informs every competitor we audited.
- Ships with legally sound German legal pages (templates to be confirmed by the client's adviser).
- Ranks locally and feeds the Google Business Profile.
- Runs on Hostinger shared hosting as static files + one PHP endpoint.
- Every rule needed to build and maintain it is encoded in this kit (docs + Claude Code skills).

## 3. Key decisions (made, with reasons)

| Decision | Choice | Reason |
|---|---|---|
| Framework | Astro 6 static | Zero client JS by default, best-in-class image pipeline for a gallery-heavy site, outputs plain HTML that Hostinger serves without Node. |
| Styling | Plain CSS + tokens | Small surface, no build-time utility debt, tokens map 1:1 to brand. |
| Theme | Dark only, night-first | The brand is black/sun/lime; the shop's moment of truth is night. A light theme would dilute the identity. Contrast is pre-verified. |
| Language | DE (default, no prefix) + one `/en/` page | Regional guests are 92.6 % German; the 7.4 % international share is growing, so one strong EN page is worth it. |
| Map | Static map image + Google/Apple Maps links | No consent banner, no third-party load, faster. |
| Analytics | None at launch; Google Search Console + GBP Insights | No cookies → no banner. Add cookieless analytics later only if needed. |
| Contact | PHP form + phone + WhatsApp link + email | Real need: machine faults/refunds, product wishes, producer enquiries. |
| Vapes | Factual mention only | Online advertising for e-cigarettes is prohibited under § 19 TabakerzG, and 2026 appellate rulings tightened the line. |

## 4. Out of scope (unless re-briefed)

Online shop, live stock levels, ordering/pre-reservation, loyalty, newsletter (newsletter for vapes
would be push advertising), CMS. The architecture leaves room for a "Sortiment" data file the client
can edit later, and for a headless CMS if they ever need one.

## 5. Client inputs required (blockers marked ●)

Put each answer into `src/data/site.ts` or the named doc. Until then the site shows `[TBC]` in dev
and the production build refuses to run.

| # | Input | Used on | Blocker |
|---|---|---|---|
| 1 | Legal entity & form (Einzelunternehmen / GbR / UG / GmbH), owner/managing director names | Impressum, Datenschutz | ● |
| 2 | Ladungsfähige Anschrift of the operator (may differ from shop address) | Impressum | ● |
| 3 | Phone (ideally a mobile that receives WhatsApp) and email (`info@` on own domain) | Kontakt, footer, schema, GBP | ● |
| 4 | USt-IdNr. (if any), Handelsregister + number (if UG/GmbH) | Impressum | ● |
| 5 | Domain (recommend `alpenbox24.de`; check availability at DENIC/registrar) | Everything | ● |
| 6 | Exact layout: indoor room vs. outdoor machine wall; sales area in m²; number of machines | So geht's, legal hours check | ● |
| 7 | Payment methods accepted (cash? girocard? Visa/Mastercard? Apple/Google Pay?) | So geht's, schema, FAQ | ● |
| 8 | Age-verification method for 18+ goods (ID card reader / girocard age check / camera) | So geht's, FAQ | ● |
| 9 | Whether alcohol is sold | Sortiment, FAQ, legal note | ● |
| 10 | Product list by category (no prices needed) | Sortiment | |
| 11 | Regional producers actually stocked + their consent to be named/photographed | Regional | |
| 12 | Refund/fault process (who answers, how fast, how refunded) | So geht's, Kontakt | ● |
| 13 | Video surveillance on site? (if yes: purpose, retention, controller) | Datenschutz (Art. 13 notice) | ● |
| 14 | Parking situation, e-bike/bike parking, accessibility (step-free?) | Kontakt, FAQ | |
| 15 | Opening date and founder story (who, why Miesbach) | Über uns | |
| 16 | Photos (see `docs/07-photo-gallery-brief.md`) or budget for a half-day shoot | Everywhere | ● |
| 17 | Social profiles (Instagram etc.), Google Business Profile access | Footer, schema `sameAs`, GBP | |
| 18 | Confirmation from Stadt Miesbach whether any Sunday/holiday ordinance under Art. 2 Abs. 2 S. 2 BayLadSchlG applies | Hours | |
| 19 | Mailbox credentials for SMTP (Hostinger email) | Contact form | ● |

## 6. Frank observations for the client

1. **The brand files are inconsistent.** The flyer uses orange `#F68A2B` and lime `#C7E222`; the window
   banner uses orange ≈`#FE8602` and a neon lime `#D7FF00`; the logo screenshot shows a softer orange
   ≈`#E99245`. Pick one set. This kit standardises on the flyer values (the file is literally named
   "Orange Sonne Grün" and is the print master) and keeps the neon only as a screen glow accent.
2. **The logotype is set in DejaVu Sans Bold**, a free system font (confirmed from the PDFs' embedded
   fonts). It works on signage but it is not a typographic choice. The website therefore uses the logo
   as a fixed vector and gives the site its own type system. A proper wordmark redraw is a worthwhile
   later investment.
3. **"VAPES" in the brand tagline is fine on the shop window, risky on the website.** See `docs/06`.
   The site uses "Snacks, Getränke, Regionales & mehr" in headlines; the factual assortment list names
   tobacco/e-cigarette products once, without emphasis.
4. **Regional is the moat.** Every competitor sells the same imported candy and energy drinks. Landkreis
   Miesbach is an Ökomodellregion with 40+ farm-gate machines and self-service shops listed by the
   region — AlpenBox24 can be the one place on the B 472 where you get Brotzeit from named local
   producers at 3 a.m. That story drives SEO, PR and repeat visits. It only works if the producers are real.
