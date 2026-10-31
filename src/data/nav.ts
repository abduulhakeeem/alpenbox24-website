import { site } from './site';

type Lang = 'de' | 'en';

/** German ↔ English page pairs. Pages without a pair switch to the other language's home page. */
export const pairs: [string, string][] = [
  ['/', '/en/'],
  ['/produkte/', '/en/products/'],
  ['/standorte/', '/en/location/'],
  ['/ueber-uns/', '/en/about/'],
  ['/kontakt/', '/en/contact/'],
  ['/kontakt/danke/', '/en/contact/thanks/'],
];

/** Counterpart of a route in the other language (or that language's home page). */
export const otherLang = (route: string, lang: Lang): string => {
  const p = pairs.find(([de, en]) => (lang === 'de' ? de : en) === route);
  return p ? (lang === 'de' ? p[1] : p[0]) : lang === 'de' ? '/en/' : '/';
};
export const pairOf = (route: string): [string, string] | undefined => pairs.find(([de, en]) => de === route || en === route);

const several = site.locations.length > 1;

export const navFor = (lang: Lang) =>
  lang === 'en'
    ? [
        { href: '/en/products/', label: 'Products', hint: 'What’s inside' },
        { href: '/en/location/', label: several ? 'Locations' : 'Location', hint: 'Where to find us' },
        { href: '/en/about/', label: 'About', hint: 'Who we are' },
        { href: '/en/contact/', label: 'Contact', hint: 'Write to us' },
      ]
    : [
        { href: '/produkte/', label: 'Produkte', hint: 'Was drin ist' },
        { href: '/standorte/', label: several ? 'Standorte' : 'Standort', hint: 'Wo du uns findest' },
        { href: '/ueber-uns/', label: 'Über uns', hint: 'Wer wir sind' },
        { href: '/kontakt/', label: 'Kontakt', hint: 'Schreib uns' },
      ];

export const footerFor = (lang: Lang) => ({
  main: navFor(lang).slice(0, 3),
  infos: lang === 'en' ? [{ href: '/en/contact/', label: 'Contact' }, { href: '/', label: 'Deutsch' }] : [{ href: '/kontakt/', label: 'Kontakt' }, { href: '/en/', label: 'English' }],
  legal:
    lang === 'en'
      ? [
          { href: '/impressum/', label: 'Legal notice (German)' },
          { href: '/datenschutz/', label: 'Privacy (German)' },
          { href: '/barrierefreiheit/', label: 'Accessibility (German)' },
          { href: '/bildnachweise/', label: 'Photo credits (German)' },
        ]
      : [
          { href: '/impressum/', label: 'Impressum' },
          { href: '/datenschutz/', label: 'Datenschutz' },
          { href: '/barrierefreiheit/', label: 'Barrierefreiheit' },
          { href: '/bildnachweise/', label: 'Bildnachweise' },
        ],
});
