/** Builds src/assets/og/og-default.jpg (1200×630): night photo + logo on a Nacht scrim. Run once. */
import sharp from 'sharp';
const bg = await sharp('src/assets/photos/tegernsee-nacht.jpg').resize(1200, 630, { fit: 'cover', position: 'centre' }).modulate({ brightness: 0.7 }).toBuffer();
const logo = await sharp('brand/logo/alpenbox24-logo-full.png').resize({ width: 520 }).toBuffer();
const lm = await sharp(logo).metadata();
const scrim = Buffer.from(`<svg width="1200" height="630"><defs><radialGradient id="g" cx="50%" cy="50%" r="55%"><stop offset="0" stop-color="#0D0C0B" stop-opacity=".88"/><stop offset="1" stop-color="#0D0C0B" stop-opacity=".25"/></radialGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="0" y="600" width="1200" height="30" fill="#C7E222"/></svg>`);
await sharp(bg).composite([{ input: scrim }, { input: logo, left: Math.round((1200 - lm.width) / 2), top: Math.round((600 - lm.height) / 2) }]).jpeg({ quality: 82, mozjpeg: true }).toFile('src/assets/og/og-default.jpg');
console.log('og ok');
