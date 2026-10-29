# 08 — Technical specification

## 1. Why this stack satisfies "not a JS web app on Hostinger"

Hostinger distinguishes static/PHP websites (any web hosting plan, deployed into `public_html`) from Node.js
applications (separate deployment flow, Business/Cloud plans) [S38, S39]. This site is the former:
Astro runs **only on the developer's machine / GitHub Actions** to generate HTML files. Hostinger receives
plain `.html`, `.css`, images, fonts, ≤ 4 KB of optional JS and one PHP file. No Node process runs on the server.

## 2. Versions and tooling

| Tool | Version | Note |
|---|---|---|
| Node | ≥ 22.12.0 (`.nvmrc` = `22`) | Astro 6 requires 22.12+; Node 18/20 dropped [S40] |
| Astro | 6.x latest (`npm create astro@latest`) | `output: 'static'` (default) |
| @astrojs/sitemap | latest major compatible with Astro 6 | |
| sharp | bundled with Astro image service | AVIF/WebP generation |
| PHP on Hostinger | 8.2+ (select in hPanel) | contact form only |
| PHPMailer | 6.10.0, bundled in `starter/public/api/vendor/phpmailer/` (3 source files + LGPL-2.1 licence, no Composer) | SMTP auth |

Astro 6 specifics to respect: content config at `src/content.config.ts` with loaders; `import.meta.glob` instead of
`Astro.glob`; Zod 4 imported from `astro/zod` (`z.email()`, `z.url()`); `<script>`/`<style>` render in source order [S40].

## 3. Starter files provided in `starter/` (copy into the repo root as indicated)

| Starter file | Copy to | Purpose |
|---|---|---|
| `starter/src/data/site.ts` | `src/data/site.ts` | Single source of truth (R5) |
| `starter/src/styles/tokens.css` | `src/styles/tokens.css` | Design tokens |
| `starter/astro.config.mjs` | `astro.config.mjs` | Static config, i18n, sitemap (verified building on Astro 6.4.8) |
| `starter/src/content.config.ts` | `src/content.config.ts` | Gallery + FAQ collections |
| `starter/scripts/guard.mjs` | `scripts/guard.mjs` | Post-build: fails on `[TBC]` and on forbidden tobacco terms in SEO-relevant places |
| `starter/public/.htaccess` | `public/.htaccess` | HTTPS, redirects, caching, security headers |
| `starter/public/robots.txt` | `public/robots.txt` | |
| `starter/public/api/kontakt.php` | `public/api/kontakt.php` | Contact form handler (tested: 405 on GET, validation → error redirect, honeypot/time-trap → silent success, foreign Origin rejected, SMTP send with Reply-To, card numbers scrubbed) |
| `starter/public/api/vendor/phpmailer/` | `public/api/vendor/phpmailer/` | PHPMailer 6.10.0 |
| `starter/config/alpenbox-mail.sample.php` | server: `<domain root>/config/alpenbox-mail.php`, i.e. sibling of `public_html` (kontakt.php resolves `dirname(__DIR__, 2)`) | SMTP secrets, never in Git |
| `starter/.github/workflows/deploy.yml` | `.github/workflows/deploy.yml` | Build + publish `dist/` to `deploy` branch |
| `starter/package.json.scripts.json` | merge into `package.json` | npm scripts |

## 4. Project structure

See CLAUDE.md §6. Component names from `03-information-architecture.md` §4.

## 5. Rendering rules

- All pages `.astro`. No `client:*` directives (no UI framework installed).
- JS files (vanilla, ES modules, `type="module"`):
  - `open-now.ts` — clock in OpenNow chip.
  - `lightbox.ts` — gallery dialog.
  - `gallery-filter.ts` — optional.
  - `form.ts` — sets the timestamp hidden field and adds inline validation messages (native validation still works without it).
  Total ≤ 4 KB gzipped. Load each only on pages that use it.
- After build, inspect `dist/**/*.html` for inline executable `<script>` tags. If any exist, either move them to files
  or add their `sha256-…` hash to the CSP in `.htaccess`. (`application/ld+json` blocks are not executed and are fine.)
- Fonts: `@font-face` in `base.css`, `font-display: swap`, preload `archivo-*.woff2` in `<head>`.
- CSS: `@layer reset, tokens, base, components, utilities;` Keep total CSS < 30 KB uncompressed.

## 6. Images

- Source photos in `src/assets/photos/` (page images) and `src/assets/gallery/`.
- `<Picture formats={['avif','webp']} widths={[...]} sizes="...">` everywhere; hero uses art-directed sources
  (`<picture>` with `media` queries, 4:5 mobile crop, 16:9 desktop) and `fetchpriority="high"`, `loading="eager"`.
- Everything else `loading="lazy"`.
- Static map: `src/assets/map/karte-miesbach-1200.png` + `-600.png`, processed the same way.
- OG images: `public/og/og-default.jpg` (1200×630, hero crop + full logo on Nacht scrim), optional per-page variants.
- Favicons: copy `brand/logo/favicon.svg` and `icon-*.png` to `public/` and `public/icons/`; add `site.webmanifest`
  (name "AlpenBox24", `background_color` and `theme_color` `#0D0C0B`).

## 7. SEO plumbing

- `SeoHead.astro`: title, description, canonical (`new URL(Astro.url.pathname, site)`), `og:*`, `twitter:card=summary_large_image`,
  `hreflang` for `/` and `/en/`, `<meta name="theme-color" content="#0D0C0B">`.
- `JsonLd.astro`: builds the `ConvenienceStore` object from `site.ts` (template in `02-seo-strategy.md` §5) + `BreadcrumbList`.
- `@astrojs/sitemap` with `filter` excluding `/kontakt/danke/` and `/404`.
- `robots.txt` references `https://alpenbox24.de/sitemap-index.xml`.
- `noindex` meta on `/kontakt/danke/` and 404.

## 8. Contact form flow

1. `<form method="post" action="/api/kontakt.php">` with fields from `05` §Kontakt, plus hidden `_ts` (render time,
   set by `form.ts`; without JS it is empty and the server skips the timing check) and honeypot `website` (visually hidden,
   `tabindex="-1"`, `autocomplete="off"`).
2. `kontakt.php` validates, rejects bots (honeypot filled, or `_ts` present and < 3 s), sends via PHPMailer SMTP using
   credentials from `<domain root>/config/alpenbox-mail.php`, then `303` redirects to `/kontakt/danke/` or back to
   `/kontakt/?fehler=1#formular` (page shows the error text from `05`).
3. Subject prefix by Anliegen: `[Störung]`, `[Wunsch]`, `[Erzeuger]`, `[Kontakt]`.
4. Query param `?anliegen=wunsch|erzeuger|stoerung` preselects the dropdown (tiny JS; without JS the user picks).
5. Hostinger mailbox SMTP: host and port are shown in hPanel → Emails → Configuration (commonly `smtp.hostinger.com`, 465/SSL — verify).
   Set SPF, DKIM, DMARC for the domain in hPanel DNS.

## 9. Deployment

```
local / Claude Code ──push──▶ GitHub main
                               │  GitHub Action: npm ci → npm run build (astro check + build + guard)
                               ▼
                         branch "deploy" = contents of dist/ (+ api/kontakt.php, .htaccess)
                               │  Hostinger hPanel → Advanced → Git: repo, branch "deploy", directory public_html,
                               ▼  auto-deployment ON
                         public_html on Hostinger (LiteSpeed/Apache-compatible .htaccess)
```

- Hostinger's Git integration deploys repository files as-is to the chosen directory and redeploys on push to the
  selected branch [S39]; it does not run a build, which is why the build happens in GitHub Actions.
- First deploy: `public_html` must not contain conflicting files (back up and empty it).
- Create `<domain root>/config/alpenbox-mail.php` once via hPanel File Manager (sibling folder of `public_html`, survives redeploys, not web-reachable).
- Fallback without GitHub: `npm run build` locally and upload `dist/` contents via File Manager/FTP [S38].
- SSL: enable the free certificate in hPanel; `.htaccess` forces HTTPS.

## 10. Performance budgets (fail QA if exceeded)

| Metric | Budget (mobile, Lighthouse "Slow 4G") |
|---|---|
| LCP | ≤ 2.0 s |
| CLS | ≤ 0.05 |
| INP / TBT | TBT ≤ 100 ms |
| Home page transfer | ≤ 900 KB (hero AVIF ≤ 180 KB) |
| Gallery page initial transfer | ≤ 1.2 MB |
| JS total | ≤ 4 KB gz |
| Lighthouse | ≥ 95 Performance, 100 Accessibility, 100 Best Practices, 100 SEO |

## 11. Security headers (in `.htaccess`)

`Strict-Transport-Security: max-age=31536000` (add `includeSubDomains` once all subdomains are HTTPS),
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`,
`X-Frame-Options: DENY` + `frame-ancestors 'none'`,
`Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests`.

## 12. Maintenance hand-off

- Hours, phone, payment, producers: edit `src/data/site.ts` → push → auto-deploy.
- New gallery photo: add JPG to `src/assets/gallery/` + JSON entry → push (skill `gallery-images`).
- Legal page updates: edit Markdown in `src/content/legal/` (or the `.astro` pages), bump "Stand".
