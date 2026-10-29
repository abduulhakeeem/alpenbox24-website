/**
 * Gallery entries. Every image has a recorded licence in photo-credits.json.
 * Machine photos are licensed examples (Wikimedia Commons), captioned as such — never presented as
 * AlpenBox24 installations. Add a "projekte" category once real customer installations are photographed.
 */
export type Cat = 'automaten' | 'nacht' | 'hof' | 'oberland';
export const cats: { id: Cat; label: string }[] = [
  { id: 'automaten', label: 'Automaten' },
  { id: 'nacht', label: 'Bei Nacht' },
  { id: 'hof', label: 'Hof & Region' },
  { id: 'oberland', label: 'Oberland' },
];

export const gallery: { name: string; cat: Cat; caption: string; alt: string }[] = [
  { name: 'automat-grabgo', cat: 'automaten', caption: 'Snack- und Getränkeautomat im Automatenshop', alt: 'Zwei moderne Snackautomaten mit Glasfront und bunten Snacks in einem Automatenshop' },
  { name: 'snackautomat-spiralen', cat: 'automaten', caption: 'Spiralfächer im Snackautomaten', alt: 'Blick durch die Scheibe eines Snackautomaten auf Spiralfächer mit Chips und Schokoriegeln' },
  { name: 'automatenshop-laden', cat: 'automaten', caption: '24/7-Automatenshop', alt: 'Eingang eines kleinen Automatenshops mit mehreren Warenautomaten hinter einer offenen Tür' },
  { name: 'brotautomat', cat: 'automaten', caption: 'Brotautomat', alt: 'Schwarzer Warenautomat mit Brot in beleuchteten Fächern neben einer Eingangstür' },
  { name: 'faecherautomat', cat: 'automaten', caption: 'Fächerautomat', alt: 'Großer orangefarbener Fächerautomat mit vielen kleinen Türen in einem hellen Raum' },
  { name: 'automat-metro', cat: 'automaten', caption: 'Snackautomat in der Metro', alt: 'Grün beleuchteter Snackautomat in einer gefliesten U-Bahn-Station' },
  { name: 'automat-befuellen', cat: 'automaten', caption: 'Ein Automat wird befüllt', alt: 'Mann füllt einen geöffneten Snackautomaten an einem Bahnsteig nach, von hinten fotografiert' },
  { name: 'automat-reihe-akita', cat: 'automaten', caption: 'Bunte Getränkeautomaten in Reihe', alt: 'Vier bunte Getränkeautomaten nebeneinander auf einem Parkplatz bei Tag' },
  { name: 'automat-tokio-nacht', cat: 'nacht', caption: 'Getränkeautomaten bei Nacht', alt: 'Lange Reihe beleuchteter Getränkeautomaten in einer dunklen Straße' },
  { name: 'automat-drei-nacht', cat: 'nacht', caption: 'Drei Automaten, eine Hauswand', alt: 'Drei beleuchtete Getränkeautomaten nebeneinander an einer gefliesten Hauswand bei Nacht' },
  { name: 'automat-outdoor-nacht', cat: 'nacht', caption: 'Outdoor-Automat bei Nacht', alt: 'Freistehender Warenautomat im Freien bei Nacht, beleuchtet vor einer gelben Hauswand' },
  { name: 'automat-pizza-nacht', cat: 'nacht', caption: 'Pizza-Automat, 24/24', alt: 'Beleuchteter Pizza-Automat in einem kleinen Ladenlokal mit 24/24-Schild bei Nacht' },
  { name: 'automat-bunt-nah', cat: 'nacht', caption: 'Licht, Farbe, Auswahl', alt: 'Nahaufnahme mehrerer hell beleuchteter Getränkeautomaten mit vielen bunten Flaschen' },
  { name: 'automat-reihe-strasse', cat: 'nacht', caption: 'Automaten entlang der Straße', alt: 'Reihe von Getränkeautomaten entlang einer Straße mit Fahrbahnmarkierung' },
  { name: 'automat-reihe-gruen', cat: 'nacht', caption: 'Automaten im Grünen', alt: 'Reihe grüner Getränkeautomaten auf einem Kiesplatz vor dichtem Wald' },
  { name: 'regiomat-nacht', cat: 'hof', caption: 'Regionalautomat in der Holzhütte', alt: 'Beleuchteter Regionalautomat in einer offenen Holzhütte bei Nacht' },
  { name: 'regiomat-holz', cat: 'hof', caption: 'Regionalautomat mit Holzverkleidung', alt: 'Regionalautomat mit Holzverkleidung und kleinem Dach vor einer Hauswand' },
  { name: 'regiomat-landau', cat: 'hof', caption: 'Regionalautomat unter dem Vordach', alt: 'Blauer Regionalautomat unter einem Wellblech-Vordach vor einem Zaun' },
  { name: 'kartoffelautomat', cat: 'hof', caption: 'Fächerautomat für Eier und Kartoffeln', alt: 'Kleines Automatenhäuschen am Feldrand mit Fächern für Eier und Kartoffeln' },
  { name: 'hofautomat-eier', cat: 'hof', caption: 'Hofautomat für Eier und Honig', alt: 'Holzhütte mit zwei Warenautomaten und Schildern für Honig und frische Eier' },
  { name: 'milchautomat', cat: 'hof', caption: 'Milch- und Käseautomat', alt: 'Milch- und Käseautomat eines Hofes vor einer Fachwerkwand' },
  { name: 'tegernsee-nacht', cat: 'oberland', caption: 'Das Tegernseer Tal bei Nacht', alt: 'Blick von oben auf das nächtliche Tegernseer Tal mit den Lichtern der Orte rund um den See' },
  { name: 'wendelstein-sonne', cat: 'oberland', caption: 'Wendelstein bei Sonnenuntergang', alt: 'Die Sonne geht neben dem Wendelstein unter, der Gipfel steht als dunkle Silhouette vor orangem Himmel' },
  { name: 'schliersee-abend', cat: 'oberland', caption: 'Schliersee am Abend', alt: 'Abendstimmung am Schliersee mit Bergen, die sich im ruhigen Wasser spiegeln' },
  { name: 'miesbach-stadtplatz', cat: 'oberland', caption: 'Stadtplatz Miesbach', alt: 'Häuserzeile mit Holzbalkonen am Stadtplatz in Miesbach, dahinter der Kirchturm' },
];
