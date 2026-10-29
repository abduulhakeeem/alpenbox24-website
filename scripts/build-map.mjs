/**
 * Generates the self-hosted dark map of the shop surroundings from OpenStreetMap data (ODbL).
 * Input: .research/osm.json (Overpass "out geom") + .research/route.json (OSRM foot route).
 * Output: src/assets/map/karte-miesbach.svg (dark base map, cropped to station → shop, lazy-loaded)
 *       + src/data/map-overlay.json (route, pins, labels, crop).
 * Run once: node scripts/build-map.mjs  — re-run only if the map area changes.
 */
import fs from 'node:fs';
const [S, W, N, E] = [47.7815, 11.8205, 47.7955, 11.8475];
const VW = 1600;
const kx = Math.cos(((S + N) / 2) * Math.PI / 180);
const sx = VW / ((E - W) * kx);
const VH = Math.round((N - S) * sx);
const P = (lon, lat) => [((lon - W) * kx * sx), ((N - lat) * sx)];
const f = (n) => Math.round(n * 10) / 10;
const pathOf = (pts, close) => pts.map(([x, y], i) => (i ? 'L' : 'M') + f(x) + ' ' + f(y)).join('') + (close ? 'Z' : '');

const osm = JSON.parse(fs.readFileSync('.research/osm.json', 'utf8'));
const L = { green: [], water: [], bld: [], minor: [], mid: [], major: [], path: [], rail: [], b472: [] };
const named = {};
for (const w of osm.elements) {
  if (!w.geometry) continue;
  const t = w.tags || {};
  const pts = w.geometry.map((g) => P(g.lon, g.lat));
  if (t.name) (named[t.name] ||= []).push(...pts);
  if (t.building) L.bld.push(pathOf(pts, true));
  else if (t.landuse || t.natural) L.green.push(pathOf(pts, true));
  else if (t.waterway) L.water.push(pathOf(pts));
  else if (t.railway) L.rail.push(pathOf(pts));
  else if (t.highway) {
    const h = t.highway;
    if (t.ref === 'B 472' || t.name === 'Bayrischzeller Straße') L.b472.push(pathOf(pts));
    else if (/primary|secondary|trunk/.test(h)) L.major.push(pathOf(pts));
    else if (/tertiary|residential|unclassified|living_street/.test(h)) L.mid.push(pathOf(pts));
    else if (/footway|path|cycleway|pedestrian|steps|track/.test(h)) L.path.push(pathOf(pts));
    else L.minor.push(pathOf(pts));
  }
}
const g = (cls, arr, extra = '') => `<path class="${cls}" ${extra} d="${arr.join('')}"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid slice">
<style>.gr{fill:#121a12}.bd{fill:#1f1d1a;stroke:#262320;stroke-width:.6}.wa{fill:none;stroke:#1d3340;stroke-width:7;stroke-linecap:round}.pa{fill:none;stroke:#24211e;stroke-width:1.4;stroke-dasharray:3 4}.mi{fill:none;stroke:#2b2825;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.md{fill:none;stroke:#36322e;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.ma{fill:none;stroke:#4a4540;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}.b4{fill:none;stroke:#6b4a2a;stroke-width:11;stroke-linecap:round;stroke-linejoin:round}.ra{fill:none;stroke:#5a5650;stroke-width:3;stroke-dasharray:14 8}</style>
<rect width="100%" height="100%" fill="#0d0c0b"/>
${g('gr', L.green)}${g('wa', L.water)}${g('pa', L.path)}${g('mi', L.minor)}${g('md', L.mid)}${g('ma', L.major)}${g('b4', L.b472)}${g('ra', L.rail)}${g('bd', L.bld)}
</svg>`;
// Base map is written after the crop is known (end of file).

const route = JSON.parse(fs.readFileSync('.research/route.json', 'utf8')).routes[0];
const centroid = (name) => { const a = named[name]; if (!a) return null; const x = a.reduce((s, p) => s + p[0], 0) / a.length, y = a.reduce((s, p) => s + p[1], 0) / a.length; return [f(x), f(y)]; };
const overlay = {
  viewBox: `0 0 ${VW} ${VH}`, width: VW, height: VH,
  route: pathOf(route.geometry.coordinates.map(([lon, lat]) => P(lon, lat))),
  routeMeters: Math.round(route.distance), routeMinutes: Math.round(route.duration / 60),
  shop: P(11.8379, 47.7882).map(f),
  station: P(11.8307819, 47.7907904).map(f),
  labels: { stadtplatz: centroid('Stadtplatz'), b472: centroid('Bayrischzeller Straße'), schlierach: centroid('Schlierach') },
};
fs.writeFileSync('src/data/map-overlay.json', JSON.stringify(overlay, null, 1));
console.log('map', VW + 'x' + VH, (svg.length / 1024).toFixed(0) + ' KB', overlay.labels, overlay.routeMinutes + ' min');

// Crop around station → shop (same formula as MapBlock.astro) and drop paths outside the crop.
{
  const [sx, sy] = overlay.shop, [tx, ty] = overlay.station;
  const x0 = Math.min(sx, tx) - 200, x1 = Math.max(sx, tx) + 260, w = x1 - x0, h = Math.round(w * 0.75), y0 = Math.round((sy + ty) / 2 - h / 2);
  const inBox = (d) => { const n = d.match(/-?d+(.d+)?/g).map(Number); for (let i = 0; i < n.length; i += 2) if (n[i] >= x0 - 40 && n[i] <= x1 + 40 && n[i + 1] >= y0 - 40 && n[i + 1] <= y0 + h + 40) return true; return false; };
  const cropped = svg
    .replace(/viewBox="[^"]+"/, `viewBox="${Math.round(x0)} ${y0} ${Math.round(w)} ${h}" width="${Math.round(w)}" height="${h}"`)
    .replace('<rect width="100%" height="100%" fill="#0d0c0b"/>', `<rect x="${Math.round(x0)}" y="${y0}" width="${Math.round(w)}" height="${h}" fill="#0d0c0b"/>`)
    .replace(/d="([^"]+)"/g, (_m, d) => `d="${d.split(/(?=M)/).filter(inBox).join('')}"`);
  fs.writeFileSync('src/assets/map/karte-miesbach.svg', cropped);
  overlay.crop = `${Math.round(x0)} ${y0} ${Math.round(w)} ${h}`;
  fs.writeFileSync('src/data/map-overlay.json', JSON.stringify(overlay, null, 1));
}
