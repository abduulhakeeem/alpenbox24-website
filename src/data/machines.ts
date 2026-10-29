/**
 * Machine types AlpenBox24 operates (shown on Start, /automaten/ and in the interactive machine).
 * Photos are licensed examples from Wikimedia Commons (see photo-credits.json) — captions must say
 * "Beispiel", never claim a pictured machine is an AlpenBox24 product or installation.
 */
export type Machine = {
  id: string;
  code: string;
  name: string;
  line: string;
  photo: string;
  alt: string;
  icon: 'bottle' | 'cookie' | 'cheese' | 'leaf' | 'pretzel' | 'sparkle' | 'moon' | 'hand' | 'battery';
  tone: string;
};

export const machines: Machine[] = [
  { id: 'snack', code: 'A1', name: 'Snackautomat', line: 'Riegel, Chips und Süßes für den kleinen Hunger.', photo: 'snackautomat-spiralen', alt: 'Blick durch die Scheibe eines Snackautomaten auf Spiralfächer mit Chips und Schokoriegeln', icon: 'cookie', tone: '#f2c14e' },
  { id: 'getraenke', code: 'A2', name: 'Getränkeautomat', line: 'Gekühlt, beleuchtet, rund um die Uhr.', photo: 'automat-drei-nacht', alt: 'Drei beleuchtete Getränkeautomaten nebeneinander an einer Hauswand bei Nacht', icon: 'bottle', tone: '#7fc4e8' },
  { id: 'regional', code: 'A3', name: 'Regionalautomat', line: 'Eier, Käse, Wurst, Honig. Aus der Region, direkt aus dem Fach.', photo: 'regiomat-nacht', alt: 'Beleuchteter Regionalautomat in einer offenen Holzhütte bei Nacht', icon: 'cheese', tone: '#f7e3a0' },
  { id: 'faecher', code: 'B1', name: 'Fächerautomat', line: 'Viele Türen, viele Produkte. Fach auf, mitnehmen.', photo: 'faecherautomat', alt: 'Großer orangefarbener Fächerautomat mit vielen kleinen Türen in einem hellen Raum', icon: 'hand', tone: '#f68a2b' },
  { id: 'brot', code: 'B2', name: 'Brotautomat', line: 'Frische Semmeln, auch wenn die Bäckerei zu hat.', photo: 'brotautomat', alt: 'Schwarzer Warenautomat mit Brotlaiben in beleuchteten Fächern neben einer Eingangstür', icon: 'pretzel', tone: '#c98a4b' },
  { id: 'shop', code: 'B3', name: '24/7-Automatenshop', line: 'Mehrere Automaten in einem Raum. Ein Laden, der nie schließt.', photo: 'automatenshop-laden', alt: 'Eingang eines kleinen Automatenshops mit mehreren Warenautomaten hinter einer offenen Tür', icon: 'moon', tone: '#c7e222' },
  { id: 'outdoor', code: 'C1', name: 'Outdoor-Automat', line: 'Wetterfest, draußen, immer erreichbar.', photo: 'automat-outdoor-nacht', alt: 'Freistehender Warenautomat im Freien bei Nacht, beleuchtet vor einer gelben Hauswand', icon: 'sparkle', tone: '#d7ff00' },
  { id: 'frische', code: 'C2', name: 'Frische & Food', line: 'Pizza, Snacks, Fertiggerichte. Gekühlt oder warm.', photo: 'automat-pizza-nacht', alt: 'Beleuchteter Pizza-Automat in einem kleinen Ladenlokal mit 24/24-Schild bei Nacht', icon: 'leaf', tone: '#e86a8a' },
  { id: 'standort', code: 'C3', name: 'Dein Standort?', line: 'Du hast Platz für einen Automaten? Sprich uns an.', photo: 'automat-tokio-nacht', alt: 'Lange Reihe beleuchteter Getränkeautomaten in einer dunklen Straße', icon: 'battery', tone: '#b5afa6' },
];
