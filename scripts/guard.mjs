#!/usr/bin/env node
/**
 * Post-build guard for AlpenBox24 (run after `astro build`).
 *  1. Fails if any "[TBC]" placeholder reached dist/ (CLAUDE.md R8).
 *     Set GUARD_ALLOW_TBC=1 to downgrade to a warning for staging builds.
 *  2. Fails if tobacco/e-cigarette terms appear in SEO/promotional positions (R4, § 19 TabakerzG):
 *     <title>, meta description/og/twitter, h1–h3, img alt, figcaption, link/asset URLs.
 *     Body paragraphs are allowed (approved factual sentence), but are reported if they exceed 3 per page.
 *  3. Fails on third-party requests at load (R3): external <script src>, <link href> (stylesheet/font/preload), <iframe>.
 * Zero dependencies. Usage: node scripts/guard.mjs [distDir]
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = process.argv[2] || 'dist';
const ALLOW_TBC = process.env.GUARD_ALLOW_TBC === '1';
const SITE_HOST = 'alpenbox24.de';

const TOBACCO = /\b(vapes?|vaping|e-?zigarett\w*|e-?zig\b|liquids?\b|shishas?|e-?shishas?|tabak\w*|nikotin\w*|dampfer\w*|pods?\b|einweg-?vapes?)/i;

const errors = [];
const warnings = [];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const all = (re, s) => [...s.matchAll(re)].map((m) => m[1] ?? m[0]);

for await (const file of walk(DIST)) {
  const rel = file.slice(DIST.length + 1);

  if (TOBACCO.test(rel)) errors.push(`R4 file name contains tobacco term: ${rel}`);
  if (extname(file) !== '.html') continue;

  const html = await readFile(file, 'utf8');

  // 1. TBC
  if (html.includes('[TBC]')) {
    const n = html.split('[TBC]').length - 1;
    (ALLOW_TBC ? warnings : errors).push(`R8 ${n}× [TBC] in ${rel}`);
  }

  // 2. Tobacco terms in SEO / promotional positions
  const checks = [
    ['title', all(/<title>([\s\S]*?)<\/title>/gi, html)],
    ['meta', all(/<meta[^>]+(?:name|property)="(?:description|og:[^"]*|twitter:[^"]*)"[^>]*content="([^"]*)"/gi, html)],
    ['heading', all(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, html).map(strip)],
    ['alt', all(/\balt="([^"]*)"/gi, html)],
    ['figcaption', all(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, html).map(strip)],
    ['url', all(/\b(?:href|src|srcset)="([^"]*)"/gi, html)],
  ];
  for (const [where, values] of checks) {
    for (const v of values) if (TOBACCO.test(v)) errors.push(`R4 tobacco term in ${where} on ${rel}: "${v.slice(0, 90)}"`);
  }
  const paras = all(/<(?:p|li|dd)[^>]*>([\s\S]*?)<\/(?:p|li|dd)>/gi, html).map(strip).filter((t) => TOBACCO.test(t));
  if (paras.length > 3) warnings.push(`R4 ${paras.length} body blocks mention tobacco/e-cig on ${rel} — keep to the approved sentence`);

  // 3. Third-party requests at load
  const ext = (u) => /^(https?:)?\/\//i.test(u) && !u.includes(SITE_HOST);
  for (const src of all(/<script[^>]+src="([^"]+)"/gi, html)) if (ext(src)) errors.push(`R3 external script on ${rel}: ${src}`);
  for (const tag of all(/(<link[^>]+>)/gi, html)) {
    const href = (tag.match(/href="([^"]+)"/i) || [])[1] || '';
    const rels = (tag.match(/rel="([^"]+)"/i) || [])[1] || '';
    if (ext(href) && /stylesheet|preload|preconnect|dns-prefetch|modulepreload|icon/i.test(rels) && !/alternate|canonical/i.test(rels)) {
      errors.push(`R3 external <link rel="${rels}"> on ${rel}: ${href}`);
    }
  }
  if (/<iframe\b/i.test(html)) errors.push(`R3 <iframe> on ${rel}`);

  // Basic SEO sanity
  const h1s = all(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, html).length;
  if (h1s !== 1) warnings.push(`SEO ${h1s} <h1> elements on ${rel}`);
  const title = (all(/<title>([\s\S]*?)<\/title>/gi, html)[0] || '').trim();
  if (title.length > 60) warnings.push(`SEO title ${title.length} chars on ${rel}: "${title}"`);
  const desc = (html.match(/<meta[^>]+name="description"[^>]*content="([^"]*)"/i) || [])[1] || '';
  if (!/noindex/i.test(html) && (desc.length < 120 || desc.length > 160)) warnings.push(`SEO description ${desc.length} chars on ${rel}`);
  // The one-line no-js→js boot script is allowed: its sha256 is whitelisted in public/.htaccess (CSP).
  const BOOT = "document.documentElement.classList.replace('no-js','js')";
  const inlineExec = all(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi, html).filter((s) => s.trim() && s.trim() !== BOOT);
  if (inlineExec.length) warnings.push(`CSP ${inlineExec.length} inline executable <script> on ${rel} — move to file or hash in CSP`);
}

for (const w of warnings) console.warn('⚠︎ ' + w);
for (const e of errors) console.error('✖ ' + e);
if (errors.length) {
  console.error(`\nguard: ${errors.length} error(s). Build rejected.`);
  process.exit(1);
}
console.log(`guard: OK (${warnings.length} warning(s)).`);
