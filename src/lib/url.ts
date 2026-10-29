/** Internal link that respects the configured `base` (GitHub Pages preview lives under /<repo>/). */
export const u = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path.startsWith('/')) return path;
  return base + path;
};

/** Absolute URL on the production/staging origin (canonical, OG, JSON-LD). */
export const abs = (path: string, site: URL | undefined): string =>
  new URL(u(path), site ?? 'https://alpenbox24.de').href;

/** Build-time only (frontmatter). Set by `npm run build:preview`. */
export const STAGING = process.env.STAGING === '1' || import.meta.env.DEV;

/** Strip the base from a pathname so templates can compare against '/sortiment/' etc. */
export const route = (pathname: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return p.endsWith('/') ? p : p + '/';
};
