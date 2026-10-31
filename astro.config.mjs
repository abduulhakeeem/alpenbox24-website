// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Production: https://alpenbox24.de (Hostinger, static files + public/api/kontakt.php).
 * Staging/preview (GitHub Pages): STAGING=1 SITE_URL=https://<user>.github.io BASE_PATH=/<repo>
 * Staging builds render missing client facts as visible "folgt" markers and set noindex.
 */
const STAGING = process.env.STAGING === '1';
const SITE = STAGING ? process.env.SITE_URL || 'http://localhost:4321' : 'https://alpenbox24.de';
const BASE = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static', // R1: static only. Never add an adapter.
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' }, // CSS inline: no render-blocking request
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/kontakt/danke/') && !page.includes('/contact/thanks/') && !page.endsWith('/404/') && !/\/(automaten|galerie)\/$/.test(page),
      lastmod: new Date(),
      changefreq: 'monthly',
    }),
  ],
  prefetch: false,
  devToolbar: { enabled: false },
});
