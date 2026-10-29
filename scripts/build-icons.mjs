/**
 * If a favicon was uploaded in the admin panel (settings.json → branding.favicon), render the
 * app icons (32/180/192/512 px) from it. Without an upload the committed brand icons stay as they are.
 */
import fs from 'node:fs';
import sharp from 'sharp';

const settings = JSON.parse(fs.readFileSync('src/data/settings.json', 'utf8'));
const fav = settings.branding?.favicon?.trim();
if (!fav) { console.log('icons: using built-in brand icons'); process.exit(0); }

const src = `public/${fav}`;
if (!fs.existsSync(src)) { console.error(`icons: ${src} not found`); process.exit(1); }

for (const size of [32, 180, 192, 512]) {
  const pad = size >= 180 ? Math.round(size * 0.12) : 0;
  await sharp(src, { density: 384 })
    .resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: '#0D0C0B' })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#0D0C0B' })
    .png()
    .toFile(`public/icons/icon-${size}.png`);
}
console.log(`icons: generated from ${fav}`);
