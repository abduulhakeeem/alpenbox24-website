/**
 * Product categories shown on /produkte/ and the home page. The categories follow the client's signage
 * (Snacks, Getränke, Regionales) plus Brotzeit. Photos are licensed examples from Wikimedia Commons
 * (photo-credits.json), not photos of AlpenBox24 stock. Individual products come from the admin panel
 * (site.products), never from this file.
 * Tobacco/e-cigarettes: no category, no photo, only the approved sentence on /produkte/ (§ 19 TabakerzG).
 */
export type CatId = 'getraenke' | 'snacks' | 'regional' | 'brotzeit';

export const productCats: {
  id: CatId;
  de: { name: string; line: string };
  en: { name: string; line: string };
  photos: { name: string; altDe: string; altEn: string }[];
}[] = [
  {
    id: 'getraenke',
    de: { name: 'Getränke', line: 'Wasser, Limo, Saft und Energydrinks. Immer kalt.' },
    en: { name: 'Drinks', line: 'Water, soft drinks, juice and energy drinks. Always cold.' },
    photos: [{ name: 'produkt-getraenke', altDe: 'Zwei Gläser mit grüner und oranger Limonade neben den passenden Glasflaschen', altEn: 'Two glasses of green and orange soft drink next to their glass bottles' }],
  },
  {
    id: 'snacks',
    de: { name: 'Snacks & Süßes', line: 'Chips, Schokolade und was zum Naschen für zwischendurch.' },
    en: { name: 'Snacks & sweets', line: 'Crisps, chocolate and something sweet in between.' },
    photos: [
      { name: 'produkt-chips', altDe: 'Glasschüssel voll goldgelber Kartoffelchips', altEn: 'Glass bowl full of golden potato crisps' },
      { name: 'produkt-schokolade', altDe: 'Tafel dunkle Schokolade auf weißem Untergrund', altEn: 'Bar of dark chocolate on a white surface' },
    ],
  },
  {
    id: 'regional',
    de: { name: 'Regionales', line: 'Eier, Käse, Honig und mehr aus der Region. Woher was kommt, steht dabei.' },
    en: { name: 'Local produce', line: 'Eggs, cheese, honey and more from the region, with where it comes from.' },
    photos: [
      { name: 'produkt-eier', altDe: 'Braune Eier in einem grauen Eierkarton', altEn: 'Brown eggs in a grey egg carton' },
      { name: 'produkt-bergkaese', altDe: 'Ein Stück Bergkäse mit dunkler Rinde auf einem Holzbrett', altEn: 'A piece of mountain cheese with a dark rind on a wooden board' },
      { name: 'produkt-honig', altDe: 'Mehrere Gläser Honig mit Etikett nebeneinander', altEn: 'Several labelled jars of honey side by side' },
    ],
  },
  {
    id: 'brotzeit',
    de: { name: 'Brotzeit', line: 'Leberkässemmel, Brezn und was Herzhaftes für unterwegs.' },
    en: { name: 'Bavarian snacks', line: 'Leberkäse rolls, pretzels and something hearty for the road.' },
    photos: [
      { name: 'produkt-leberkaessemmel', altDe: 'Leberkässemmel: dicke Scheibe Leberkäse in einer Semmel auf Papier', altEn: 'Leberkäse roll: a thick slice of Bavarian meat loaf in a bread roll' },
      { name: 'produkt-brezn', altDe: 'Brezn hängen an einem Holzständer auf einem Tisch', altEn: 'Pretzels hanging on a wooden stand on a table' },
    ],
  },
];

export const catName = (id: string, lang: 'de' | 'en') => productCats.find((c) => c.id === id)?.[lang].name ?? id;
