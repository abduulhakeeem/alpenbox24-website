/**
 * Category model for the "Automat" on Start + Sortiment.
 * Categories follow the client's own signage (Snacks · Getränke · Regionales) — examples are generic
 * and the page says the range changes. Never add brands, prices or age-restricted goods here (R4).
 */
export type Slot = { code: string; name: string; icon: 'bottle' | 'sparkle' | 'cookie' | 'pretzel' | 'cheese' | 'leaf' | 'coffee' | 'battery' | 'hand'; tone: string; title: string; text: string; href: string; cta: string };

export const slots: Slot[] = [
  { code: 'A1', name: 'Wasser', icon: 'bottle', tone: '#7fc4e8', title: 'Kaltes Wasser', text: 'Still oder mit Sprudel, gekühlt und griffbereit. Für die Wanderung, die Autofahrt oder die Nacht, in der der Hahn einfach nicht reicht.', href: '/sortiment/#getraenke', cta: 'Alle Getränke' },
  { code: 'A2', name: 'Softdrinks', icon: 'bottle', tone: '#f68a2b', title: 'Limo, Schorle, Eistee', text: 'Das Kalte für die Rückbank, den Grillabend ohne Getränke-Nachschub oder den Sonntag, an dem alles zu hat.', href: '/sortiment/#getraenke', cta: 'Alle Getränke' },
  { code: 'A3', name: 'Energy', icon: 'sparkle', tone: '#d7ff00', title: 'Energydrinks', text: 'Für die Nachtschicht, die lange Heimfahrt oder den frühen Start.', href: '/sortiment/#getraenke', cta: 'Alle Getränke' },
  { code: 'B1', name: 'Chips', icon: 'cookie', tone: '#f2c14e', title: 'Chips & Knabberzeug', text: 'Salzig, knusprig, Filmabend-tauglich. Der Klassiker, wenn der Abend länger wird als geplant.', href: '/sortiment/#snacks', cta: 'Alle Snacks' },
  { code: 'B2', name: 'Süßes', icon: 'cookie', tone: '#e86a8a', title: 'Schokolade & Süßes', text: 'Riegel, Gummibärchen, Schokolade. Für die Pause zwischendurch und die Nerven nach dem Stau am Irschenberg.', href: '/sortiment/#snacks', cta: 'Alle Snacks' },
  { code: 'B3', name: 'Brezn-Zeit', icon: 'pretzel', tone: '#c98a4b', title: 'Herzhaftes für den kleinen Hunger', text: 'Was Herzhaftes für unterwegs. Welche Snacks genau im Fach liegen, wechselt – schau vorbei oder frag uns.', href: '/sortiment/#snacks', cta: 'Alle Snacks' },
  { code: 'C1', name: 'Regionales', icon: 'cheese', tone: '#f7e3a0', title: 'Aus dem Oberland', text: 'Brotzeit-Produkte von Erzeugern aus dem Landkreis Miesbach. Wir bauen das gerade auf und stellen dir die Höfe vor, sobald sie im Automaten sind.', href: '/regional/', cta: 'Regionales ansehen' },
  { code: 'C2', name: 'Alltag', icon: 'battery', tone: '#b5afa6', title: 'Alltag & Notfall', text: 'Die Kleinigkeiten, die genau dann fehlen, wenn alles zu hat. Was genau ins Fach kommt, stimmen wir gerade ab – sag uns, was du brauchst.', href: '/sortiment/#alltag', cta: 'Mehr dazu' },
  { code: 'C3', name: 'Dein Wunsch', icon: 'hand', tone: '#c7e222', title: 'Das Wunschfach', text: 'Dir fehlt was? Schreib uns, was du dir im Automaten wünschst. Wir lesen jede Nachricht und füllen nach, was gefragt ist.', href: '/kontakt/?anliegen=wunsch#formular', cta: 'Wunsch schicken' },
];
