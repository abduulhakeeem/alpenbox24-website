---
name: static-astro-hostinger
description: Stack rules for the AlpenBox24 site — Astro 6 static output, zero-framework progressive-enhancement JS, CSS architecture, image pipeline, PHP contact endpoint, .htaccess, and the GitHub Actions → deploy branch → Hostinger Git deployment. Use when scaffolding, adding dependencies, writing scripts, configuring Astro, touching public/api, .htaccess or the deploy workflow.
---

# Static Astro on Hostinger

Spec: `docs/08-tech-spec.md`. Starter files: `starter/`.

## Hard constraints
- `output: 'static'` forever. **Never** install an adapter (`@astrojs/node`, etc.), never use `server:`/on-demand rendering,
  API routes in `src/pages/api/*`, Astro Actions, sessions, or middleware that needs a server. Server logic = only `public/api/kontakt.php`.
- **No UI frameworks** (React/Vue/Svelte/Solid/Preact/Alpine) and no `client:*` directives.
- JS = vanilla TS modules, progressive enhancement, total ≤ 4 KB gz. Every feature must work with JS disabled
  (`<details>` menu and FAQ, gallery links to full images, native form validation + POST).
- No runtime third-party requests (fonts self-hosted in `public/fonts/`, no CDNs, no embeds).
- Node ≥ 22.12 (`.nvmrc`). Astro 6: `src/content.config.ts` with loaders, `import.meta.glob`, Zod from `astro/zod`.

## CSS
`@layer reset, tokens, base, components, utilities;` Plain CSS, tokens from `tokens.css`. Component styles scoped in
`.astro` files or `components.css`. Avoid specificity wars: classes only, no IDs for styling, no `!important`.

## Images
Always `astro:assets` `<Picture formats={['avif','webp']}>` with explicit `widths` + `sizes`, `alt` required.
Hero: art-directed sources, `fetchpriority="high"`, `loading="eager"`. Everything else lazy.

## Adding a dependency
Ask: does it run only at build time? If it ships JS to the browser or needs a server, don't add it.

## Deploy
`npm run build` = `astro check` + `astro build` + `scripts/guard.mjs` (fails on `[TBC]`, tobacco terms in SEO fields,
third-party requests). Push to `main` → GitHub Action publishes `dist/` to branch `deploy` → Hostinger Git auto-deploys
into `public_html`. Mail secrets live in `<domain root>/config/alpenbox-mail.php` (never in Git).
Staging builds: `npm run build:staging` (TBC allowed as warning) to a password-protected subdomain.

## Local testing of the form
`npm run build && php -S localhost:8000 -t dist` with a test `config/alpenbox-mail.php` two levels above `dist/api/`
(i.e. create `../config/` relative to `dist/`), or point SMTP at a local catcher (e.g. Mailpit).
