/**
 * AlpenBox24 — single source of truth (CLAUDE.md rule R5).
 * Every template, the footer, JSON-LD, Impressum and FAQ read from here.
 *
 * Values marked TBC must be confirmed by the client (docs/00-brief.md §5).
 * - Staging builds (STAGING=1) render them as a visible "folgt" marker.
 * - Production builds render "[TBC]" and scripts/guard.mjs rejects the build.
 * Never replace a TBC with a plausible guess.
 */

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
  googleMapsPlaceUrl: TBC as string,

  phone: { display: TBC as string, e164: TBC as string }, // e.g. '0151 234 567 89' / '+4915123456789'
  whatsapp: { enabled: false, e164: TBC as string }, // enable only if WhatsApp Business is used
  email: TBC as string, // e.g. 'info@alpenbox24.de'

  /** Opening hours as data — the Stadt Miesbach may restrict Sunday/holiday hours (Art. 2 BayLadSchlG). */
  hours: {
    is24_7: true,
    labelDe: 'Täglich 0–24 Uhr, auch an Sonn- und Feiertagen',
    labelShortDe: 'Täglich 0–24 Uhr',
    labelEn: 'Open 24 hours, every day of the year',
    weekly: [] as { days: string[]; opens: string; closes: string }[],
  },

  payment: {
    methods: [TBC] as string[], // e.g. ['girocard', 'Visa', 'Mastercard', 'Apple Pay', 'Google Pay']
    shortDe: TBC as string, // e.g. 'Karte oder Handy'
    howtoDe: TBC as string, // e.g. 'Karte oder Handy ans Terminal halten.'
    howtoEn: TBC as string,
    cash: TBC as boolean | Tbc,
  },

  ageCheck: {
    howtoDe: TBC as string, // e.g. 'Personalausweis mit Chip an das Lesegerät halten.'
    howtoEn: TBC as string,
    storesNoIdData: TBC as boolean | Tbc, // true only with written confirmation from the device vendor
  },

  sellsAlcohol: TBC as boolean | Tbc,

  refund: {
    responseTimeDe: TBC as string, // e.g. 'innerhalb von 24 Stunden'
    methodDe: TBC as string, // e.g. 'per Überweisung'
  },

  directions: {
    /** Verified: OSRM foot route on OSM data, Bahnhof Miesbach → shop, 767 m, ≈10 min (Oct 2026). */
    walkMetersFromStation: 770,
    walkMinutesFromStation: 10,
    /** Verified on OSM: bus stop "Miesbach, Landratsamt" ≈170 m away. */
    nearestBusStop: 'Miesbach, Landratsamt',
    parkingDe: TBC as string,
    bikeParkingDe: TBC as string,
    accessibilityDe: TBC as string,
  },

  cctv: { enabled: TBC as boolean | Tbc, retentionDe: TBC as string },

  legal: {
    name: TBC as string,
    form: TBC as string, // 'Einzelunternehmen' | 'GbR' | 'UG (haftungsbeschränkt)' | 'GmbH'
    street: TBC as string,
    zip: TBC as string,
    city: TBC as string,
    managingDirectors: [] as string[],
    registerCourt: '',
    registerNumber: '',
    vatId: '',
  },

  hosting: {
    name: 'Hostinger', // exact legal entity + address from the Hostinger DPA in hPanel
    address: TBC as string,
  },

  social: { instagram: '', facebook: '' },

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

export const fullAddress = `${site.address.street}, ${site.address.zip} ${site.address.city}`;

export const googleDirectionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(`AlpenBox24, ${fullAddress}`);

export const appleDirectionsUrl =
  'https://maps.apple.com/?daddr=' + encodeURIComponent(fullAddress) + '&dirflg=d';

export const osmUrl = `https://www.openstreetmap.org/?mlat=${site.geo.lat}&mlon=${site.geo.lng}#map=17/${site.geo.lat}/${site.geo.lng}`;

export const telHref = isTbc(site.phone.e164) ? undefined : `tel:${site.phone.e164}`;
export const mailHref = isTbc(site.email) ? undefined : `mailto:${site.email}`;
export const whatsappHref =
  site.whatsapp.enabled && !isTbc(site.whatsapp.e164)
    ? `https://wa.me/${site.whatsapp.e164.replace('+', '')}`
    : undefined;
