---
name: de-legal-compliance
description: German legal compliance for the AlpenBox24 site — Impressum (§ 5 DDG), Datenschutzerklärung (DSGVO), cookies/third-party requests (§ 25 TDDDG), tobacco/e-cigarette advertising ban (§ 19 TabakerzG), youth protection (JuSchG), video-surveillance notice, contact-form data handling. Use before editing legal pages, adding any embed/script/font/analytics, touching age-restricted product content, or adding images of people.
---

# German legal compliance (AlpenBox24)

Templates and reasoning: `docs/06-legal-pages.md`. Sources: `docs/10-sources.md` S20–S35.
You are not a lawyer; flag anything uncertain to the user and keep `[TBC]` where facts are missing.

## Gate questions — answer before any change
1. **Does it load anything from another domain at page load?** (font, script, iframe, map tiles, video, pixel, CDN)
   → Not allowed (R3). Self-host or use a plain outbound link. If the client insists, a consent manager is required
   first (§ 25 TDDDG) — stop and ask the user.
2. **Does it store or read anything on the visitor's device?** (cookies, localStorage, sessionStorage)
   → Only if strictly necessary for a function the user requested. None are planned.
3. **Does it mention or depict tobacco, e-cigarettes, liquids, shishas, nicotine?**
   → Only the approved factual sentence (see `alpenbox-copy-de`). No images, emphasis, keywords, brands, flavours.
   OLG Bamberg 21.01.2026 (3 UKl 30/25 e) and OLG Karlsruhe 08.04.2026 (6 U 1/26) treat everyday sales phrasing and
   attractive banners as prohibited advertising.
4. **Age-restricted goods?** Always pair with "nur nach Altersprüfung"; never imply exceptions (JuSchG §§ 9, 10).
5. **Identifiable people or licence plates in images?** Need a signed release / blur plates.
6. **New personal data processing?** Update the Datenschutzerklärung section and the "Stand" date in the same change.

## Impressum must contain (§ 5 DDG)
Name + legal form, ladungsfähige Anschrift (no P.O. box), email + phone, register court/number (UG/GmbH),
USt-IdNr. (if any), managing directors (UG/GmbH). Linked from every page footer as "Impressum".
Do **not** add the EU OS-Plattform link (platform shut down 20 Jul 2025).

## Datenschutzerklärung must reflect reality
Controller · hosting + server logs (Art. 6(1)(f)) · contact form/email/phone (Art. 6(1)(b)/(f), no database) ·
WhatsApp only if offered · outbound map/social links (no embeds) · self-hosted fonts · CCTV section only if CCTV exists
(Art. 13 notice + on-site sign) · rights incl. Art. 21 objection · complaint authority: BayLDA, Promenade 18, 91522 Ansbach.

## Contact form rules
No storage, no IP logging in app code, informational privacy checkbox (not consent), honeypot + time trap, scrub
card numbers, Reply-To user, From own domain.

## When in doubt
Do the conservative thing, leave a `[TBC]` note, and tell the user exactly which fact or legal check is needed.
