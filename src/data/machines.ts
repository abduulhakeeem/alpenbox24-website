/**
 * Machine types shown on Start, /automaten/ and in the interactive machine.
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
  { id: 'snack', code: 'A1', name: 'Snackautomat', line: 'Spiralfächer für Riegel, Chips und Süßes. Der Klassiker für Firma, Schule, Verein.', photo: 'snackautomat-spiralen', alt: 'Blick durch die Scheibe eines Snackautomaten auf Spiralfächer mit Chips und Schokoriegeln', icon: 'cookie', tone: '#f2c14e' },
  { id: 'getraenke', code: 'A2', name: 'Getränkeautomat', line: 'Gekühlt, beleuchtet, rund um die Uhr. Für Flaschen und Dosen.', photo: 'automat-drei-nacht', alt: 'Drei beleuchtete Getränkeautomaten nebeneinander an einer Hauswand bei Nacht', icon: 'bottle', tone: '#7fc4e8' },
  { id: 'regional', code: 'A3', name: 'Regionalautomat', line: 'Für Hofläden: Eier, Käse, Wurst, Honig. Gekühlt und direkt ab Hof.', photo: 'regiomat-nacht', alt: 'Beleuchteter Regionalautomat in einer offenen Holzhütte bei Nacht', icon: 'cheese', tone: '#f7e3a0' },
  { id: 'faecher', code: 'B1', name: 'Fächerautomat', line: 'Viele Türen, viele Produkte. Ideal für Backwaren, Kartoffeln oder Abholfächer.', photo: 'faecherautomat', alt: 'Großer orangefarbener Fächerautomat mit vielen kleinen Türen in einem hellen Raum', icon: 'hand', tone: '#f68a2b' },
  { id: 'brot', code: 'B2', name: 'Brotautomat', line: 'Frische Semmeln und Brot, auch wenn die Bäckerei zu hat.', photo: 'brotautomat', alt: 'Schwarzer Warenautomat mit Brotlaiben in beleuchteten Fächern neben einer Eingangstür', icon: 'pretzel', tone: '#c98a4b' },
  { id: 'shop', code: 'B3', name: '24/7-Automatenshop', line: 'Mehrere Automaten in einem Raum: dein eigener Laden ohne Personal.', photo: 'automatenshop-laden', alt: 'Eingang eines kleinen Automatenshops mit mehreren Warenautomaten hinter einer offenen Tür', icon: 'moon', tone: '#c7e222' },
  { id: 'outdoor', code: 'C1', name: 'Outdoor-Automat', line: 'Wetterfest für draußen: am Parkplatz, am Wanderweg, am Sportplatz.', photo: 'automat-outdoor-nacht', alt: 'Freistehender Warenautomat im Freien bei Nacht, beleuchtet vor einer gelben Hauswand', icon: 'sparkle', tone: '#d7ff00' },
  { id: 'frische', code: 'C2', name: 'Frische & Food', line: 'Pizza, Snacks, Fertiggerichte. Gekühlt oder warm, je nach Konzept.', photo: 'automat-pizza-nacht', alt: 'Beleuchteter Pizza-Automat in einem kleinen Ladenlokal mit 24/24-Schild bei Nacht', icon: 'leaf', tone: '#e86a8a' },
  { id: 'wunsch', code: 'C3', name: 'Deine Idee', line: 'Du hast ein eigenes Konzept? Sag uns, was du verkaufen willst. Wir finden den passenden Automaten.', photo: 'automat-tokio-nacht', alt: 'Lange Reihe beleuchteter Getränkeautomaten in einer dunklen Straße', icon: 'battery', tone: '#b5afa6' },
];
