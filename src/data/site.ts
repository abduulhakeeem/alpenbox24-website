/**
 * AlpenBox24 — single source of truth (CLAUDE.md rule R5).
 * Every template, the footer, JSON-LD, Impressum and FAQ read from here.
 *
 * Client-confirmed facts (29.10.2026): email info@alpenbox24.de, payment by cash and bank transfer,
 * support via phone call or the contact form. Everything the client did not provide is an empty
 * string / false and the templates hide it. Never fill an empty value with a plausible guess.
 * TBC is still supported: a value set to TBC renders "folgt" in staging and fails the production build.
 *
 * Company, contact, social, directions and branding values come from settings.json, which the
 * owner edits in the admin panel (/admin/, public/admin/index.php). Saving there commits the file
 * to GitHub, which rebuilds and redeploys the static site.
 */

import settings from './settings.json';

/** "0151 234 567 89" → "+4915123456789"; "+49 …" stays international. */
export const toE164 = (raw: string): string => {
  const t = raw.trim();
  if (!t) return '';
  const digits = t.replace(/[^d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  if (digits.startsWith('0')) return '+49' + digits.slice(1);
  return '+' + digits;
};
const c = settings.company;

export const TBC = '[TBC]' as const;
type Tbc = typeof TBC;

export const site = {
  name: 'AlpenBox24',
  alternateName: 'Alpen Box 24 Minimarkt',
  legalBrand: 'AlpenBox24 Minimarkt',
  domain: 'alpenbox24.de', // [client] confirm domain; also update astro.config.mjs + .htaccess
  locale: 'de-DE',
  timezone: 'Europe/Berlin',

  address: {
    street: 'Bayrischzeller Straße 2-8',
    zip: '83714',
    city: 'Miesbach',
    region: 'Bayern',
    country: 'DE',
  },

  /**
   * Geocoded from OpenStreetMap (Nominatim) between house numbers 2 and 8.
   * Replace with the exact Google Maps pin of the entrance once the Business Profile is verified.
   */
  geo: { lat: 47.7882, lng: 11.8379 },
  googleMapsPlaceUrl: settings.social.googleBusiness.trim(),

  phone: { display: settings.contact.phone.trim(), e164: toE164(settings.contact.phone) }, // empty = hidden
  whatsapp: { enabled: settings.contact.whatsapp.trim() !== '', e164: toE164(settings.contact.whatsapp) },
  email: settings.contact.email.trim(),

  /** Opening hours as data — the Stadt Miesbach may restrict Sunday/holiday hours (Art. 2 BayLadSchlG). */
  hours: {
    is24_7: true,
    labelDe: 'Täglich 0–24 Uhr, auch an Sonn- und Feiertagen',
    labelShortDe: 'Täglich 0–24 Uhr',
    labelEn: 'Open 24 hours, every day of the year',
    weekly: [] as { days: string[]; opens: string; closes: string }[],
  },

  payment: {
    methods: ['Bargeld', 'Überweisung'] as string[],
    methodsEn: ['cash', 'bank transfer'] as string[],
    shortDe: 'Bargeld oder Überweisung',
    howtoDe: 'Bar am Automaten bezahlen oder per Überweisung, ganz wie es dir passt.',
    howtoEn: 'cash at the machine or bank transfer',
    cash: true as boolean | Tbc,
  },

  ageCheck: {
    howtoDe: '', // e.g. 'Personalausweis mit Chip an das Lesegerät halten.' — empty = generic wording
    howtoEn: '',
    storesNoIdData: false as boolean | Tbc, // true only with written confirmation from the device vendor
  },

  sellsAlcohol: false as boolean | Tbc,

  refund: {
    responseTimeDe: 'so schnell wie möglich',
    methodDe: 'in bar oder per Überweisung',
  },

  directions: {
    /** Verified: OSRM foot route on OSM data, Bahnhof Miesbach → shop, 767 m, ≈10 min (Oct 2026). */
    walkMetersFromStation: 770,
    walkMinutesFromStation: 10,
    /** Verified on OSM: bus stop "Miesbach, Landratsamt" ≈170 m away. */
    nearestBusStop: 'Miesbach, Landratsamt',
    parkingDe: settings.directions.parking.trim(),
    bikeParkingDe: settings.directions.bikeParking.trim(),
    accessibilityDe: settings.directions.accessibility.trim(),
  },

  /** null = not stated by the client → no CCTV section. If cameras exist, set true + retention (Art. 13 DSGVO notice). */
  cctv: { enabled: null as boolean | null | Tbc, retentionDe: '' },

  legal: {
    /** § 5 DDG expects the operator's legal name (person or company). Replace the brand name once known. */
    name: c.legalName.trim(),
    form: c.legalForm.trim(), // 'Einzelunternehmen' | 'GbR' | 'UG (haftungsbeschränkt)' | 'GmbH'
    street: c.street.trim(),
    zip: c.zip.trim(),
    city: c.city.trim(),
    managingDirectors: c.managingDirectors.split(',').map((s) => s.trim()).filter(Boolean),
    registerCourt: c.registerCourt.trim(),
    registerNumber: c.registerNumber.trim(),
    vatId: c.vatId.trim(),
  },

  hosting: {
    name: 'Hostinger International Ltd.', // per Hostinger DPA (hostinger.de/DPA)
    address: '61 Lordou Vironos str., 6023 Larnaka, Zypern',
  },

  social: {
    instagram: settings.social.instagram.trim(),
    facebook: settings.social.facebook.trim(),
    tiktok: settings.social.tiktok.trim(),
  },

  /** Uploaded in the admin panel; paths are relative to public/. Empty = built-in logo/favicon. */
  branding: { logo: settings.branding.logo.trim(), favicon: settings.branding.favicon.trim() },

  /** Regional producers — only real, consenting partners. Empty → "im Aufbau" fallback. */
  producers: [] as {
    name: string;
    village: string;
    distanceKm: number;
    productsDe: string;
    blurbDe: string;
    url?: string;
  }[],
};

export const isTbc = (v: unknown): boolean =>
  v === TBC || (Array.isArray(v) && v.includes(TBC));

/** A fact is "given" when it is neither TBC nor empty. */
export const has = (v: unknown): boolean => !isTbc(v) && v !== '' && v !== null && v !== undefined;

export const fullAddress = `${site.address.street}, ${site.address.zip} ${site.address.city}`;

export const googleDirectionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(`AlpenBox24, ${fullAddress}`);

export const appleDirectionsUrl =
  'https://maps.apple.com/?daddr=' + encodeURIComponent(fullAddress) + '&dirflg=d';

export const osmUrl = `https://www.openstreetmap.org/?mlat=${site.geo.lat}&mlon=${site.geo.lng}#map=17/${site.geo.lat}/${site.geo.lng}`;

export const telHref = !has(site.phone.e164) ? undefined : `tel:${site.phone.e164}`;
export const mailHref = !has(site.email) ? undefined : `mailto:${site.email}`;
export const whatsappHref =
  site.whatsapp.enabled && has(site.whatsapp.e164)
    ? `https://wa.me/${site.whatsapp.e164.replace('+', '')}`
    : undefined;
