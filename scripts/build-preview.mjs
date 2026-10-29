/** Staging/preview build (GitHub Pages or local): visible "folgt" markers instead of [TBC], noindex everywhere. */
import { execSync } from 'node:child_process';
process.env.STAGING = '1';
execSync('npx astro build', { stdio: 'inherit', env: process.env });
execSync('node scripts/guard.mjs dist', { stdio: 'inherit', env: { ...process.env, GUARD_ALLOW_TBC: '1' } });
