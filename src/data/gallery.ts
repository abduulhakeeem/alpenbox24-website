/**
 * Gallery entries. Every image has a recorded licence in photo-credits.json.
 * Categories: nacht · oberland · miesbach · regional. A "laden" category is added once the
 * shop shoot exists (docs/07-photo-gallery-brief.md) — never show other shops as AlpenBox24.
 */
export type Cat = 'nacht' | 'oberland' | 'miesbach' | 'regional';
export const cats: { id: Cat; label: string }[] = [
  { id: 'nacht', label: 'Abend & Nacht' },
  { id: 'oberland', label: 'Oberland' },
  { id: 'miesbach', label: 'Miesbach' },
  { id: 'regional', label: 'Regional' },
];

export const gallery: { name: string; cat: Cat; caption: string; alt: string }[] = [
  { name: 'tegernsee-nacht', cat: 'nacht', caption: 'Das Tegernseer Tal bei Nacht', alt: 'Blick von oben auf das nächtliche Tegernseer Tal mit den Lichtern der Orte rund um den See' },
  { name: 'wendelstein-sonne', cat: 'nacht', caption: 'Wendelstein bei Sonnenuntergang', alt: 'Die Sonne geht neben dem Wendelstein unter, der Gipfel steht als dunkle Silhouette vor orangem Himmel' },
  { name: 'schliersee-abend', cat: 'nacht', caption: 'Schliersee am Abend', alt: 'Abendstimmung am Schliersee mit Bergen, die sich im ruhigen Wasser spiegeln' },
  { name: 'tegernsee-abend', cat: 'nacht', caption: 'Abendsonne über dem Tegernsee', alt: 'Die tief stehende Sonne über dem Tegernsee, die Berge liegen schon im Schatten' },
  { name: 'rotwand-abend', cat: 'nacht', caption: 'Abendstimmung an der Rotwand', alt: 'Letztes Sonnenlicht hinter einem Grat bei der Rotwand, im Vordergrund Schneereste' },
  { name: 'tegernsee-panorama-nacht', cat: 'nacht', caption: 'Panorama über dem Tegernsee nach Sonnenuntergang', alt: 'Breites Panorama über Berge und den Tegernsee kurz nach Sonnenuntergang' },
  { name: 'brecherspitz-winter', cat: 'oberland', caption: 'Brecherspitz im Dezember', alt: 'Verschneiter Grat der Brecherspitz mit verschneiten Bäumen unter grauem Winterhimmel' },
  { name: 'wendelstein-winter', cat: 'oberland', caption: 'Blick vom Wendelstein im Winter', alt: 'Weiter Blick vom Wendelstein über verschneite Täler und Bergketten unter Wolken' },
  { name: 'schliersee-luftbild', cat: 'oberland', caption: 'Der Schliersee von oben', alt: 'Luftbild des Schliersees mit der Insel Wörth, dem Ort Schliersee und grünen Wiesen' },
  { name: 'spitzingsee', cat: 'oberland', caption: 'Spitzingsee vom Rosskopf', alt: 'Der Spitzingsee mit dem Ort Spitzingsee im Tal, umgeben von bewaldeten Bergen' },
  { name: 'spitzingsee-alm', cat: 'oberland', caption: 'Almwiesen über dem Spitzingsee', alt: 'Grüne Almwiesen und Bergwald, darüber felsige Gipfel des Mangfallgebirges' },
  { name: 'bayrischzell-panorama', cat: 'oberland', caption: 'Bayrischzell und der Wendelstein', alt: 'Panorama über das Tal von Bayrischzell mit dem Wendelstein im Hintergrund' },
  { name: 'winter-miesbach', cat: 'oberland', caption: 'Winter bei Miesbach', alt: 'Verschneite Hügellandschaft bei Miesbach mit einem Weidezaun und einem einzelnen Baum' },
  { name: 'leitzach', cat: 'oberland', caption: 'Die Leitzach', alt: 'Die Leitzach fließt flach über Kiesbänke, gesäumt von Laubbäumen' },
  { name: 'miesbach-stadtplatz', cat: 'miesbach', caption: 'Stadtplatz Miesbach', alt: 'Häuserzeile mit Holzbalkonen am Stadtplatz in Miesbach, dahinter der Kirchturm' },
  { name: 'miesbach-stadtansicht', cat: 'miesbach', caption: 'Blick über Miesbach', alt: 'Blick über die Dächer von Miesbach bei blauem Himmel, im Hintergrund Hügel' },
  { name: 'schliersee-ufer', cat: 'miesbach', caption: 'Seepromenade in Schliersee', alt: 'Seepromenade in Schliersee mit Laterne, Ufermauer und Biergarten am Wasser' },
  { name: 'brotzeit', cat: 'regional', caption: 'Brotzeit mit Bergkäse', alt: 'Brotzeitbrettl mit Bergkäse, Gurke, Tomate und Salat auf einer rot karierten Tischdecke' },
  { name: 'kaeselager', cat: 'regional', caption: 'Käse beim Reifen', alt: 'Lange Holzregale voller reifender Käselaibe in einem gewölbten Keller' },
  { name: 'obatzda', cat: 'regional', caption: 'Obatzda', alt: 'Teller mit Obatzda, garniert mit Zwiebelringen und Schnittlauch' },
  { name: 'hofautomat-eier', cat: 'regional', caption: 'Hofautomat für Eier und Honig', alt: 'Holzhütte mit zwei Warenautomaten und Schildern für Honig aus eigener Imkerei und frische Eier' },
  { name: 'milchautomat', cat: 'regional', caption: 'Milch- und Käseautomat am Hof', alt: 'Milch- und Käseautomat eines Hofes vor einer Fachwerkwand' },
];
