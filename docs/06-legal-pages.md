# 06 — Legal pages and compliance rules

> **Disclaimer.** These are carefully researched templates, not legal advice. Before launch the client should
> have Impressum and Datenschutzerklärung checked by a lawyer or regenerate them with a maintained German
> generator (e.g. eRecht24, IT-Recht Kanzlei, Händlerbund) using the facts in `site.ts`. Keep the section
> structure below so the build and the QA checks still match.

---

## A. Compliance rules for the whole site (enforced by the `de-legal-compliance` skill)

### A1. Tobacco & e-cigarettes (§ 19 TabakerzG) — strict
Allowed:
- One factual sentence in `/sortiment/#ab-18`, `/so-gehts/`, `/faq/` (approved wording in `05`), naming the
  product groups and the age check.
Forbidden everywhere (pages, alt text, titles, meta, OG images, schema, file names, URLs, GBP posts, social):
- Images showing vapes, e-cigarettes, liquids, tobacco packs, vaping or smoking.
- Brand names, flavours, "neu", "Auswahl", "große Vielfalt", "für Einsteiger", "günstig", price comparisons with smoking.
- Health or harm-reduction claims ("weniger schädlich").
- Visual emphasis (colour, badges, banners, icons) on these product groups.
- Keyword targeting (vape, e-zigarette, liquid, shisha, tabak) in any SEO field.
Basis: OLG Bamberg 21.01.2026 (3 UKl 30/25 e) — sales phrasing like suitability for beginners/experienced users,
flavour variety, quality, ease of use = advertising; OLG Karlsruhe 08.04.2026 (6 U 1/26) — colourful banner and
"3 NEUE FLAVOURS" beyond neutral information. See `10-sources.md` S20–S22.

### A2. Youth protection (JuSchG §§ 9, 10)
State that 18+ goods are released only after an age check. Never imply exceptions. Never show minors near these goods.

### A3. No consent-requiring tech
No cookies beyond strictly necessary (there are none planned), no localStorage for tracking, no third-party
fonts/scripts/embeds/iframes, no social media pixels. WhatsApp/Instagram/Maps are **plain outbound links**.
If the client later wants analytics or embeds, a consent solution must be added first (§ 25 TDDDG).

### A4. Impressum reachability
Linked in footer of every page, max. two clicks, label "Impressum".

### A5. No ODR link
Do not add the EU OS-Plattform link (platform discontinued 20.07.2025). Only add a § 36 VSBG statement if the
client has ≥ 10 employees or uses consumer T&Cs (not planned). A voluntary "nicht bereit und nicht verpflichtet"
sentence is common practice and harmless; included below.

### A6. Images of people
Identifiable people only with signed model release (KUG §§ 22/23, Art. 6 DSGVO). Blur licence plates.

---

## B. Impressum template (`/impressum/`)

```markdown
# Impressum

## Angaben gemäß § 5 DDG
{legal.name}                          [TBC: z. B. „Max Mustermann, AlpenBox24“ oder „AlpenBox24 GmbH“]
{legal.street}
{legal.zip} {legal.city}

[nur bei GmbH/UG:]
Vertreten durch die Geschäftsführung: {legal.managingDirectors}
Registergericht: Amtsgericht {legal.registerCourt}
Registernummer: {legal.registerNumber}

## Kontakt
Telefon: {phone}
E-Mail: {email}

## Umsatzsteuer-ID
[nur falls vorhanden:] Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {legal.vatId}

## Ladenadresse
AlpenBox24 Minimarkt, Bayrischzeller Straße 2-8, 83714 Miesbach

## Verbraucherstreitbeilegung
Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

## Bildnachweise
Fotos: {photo.credits} [TBC]. Kartendaten: © OpenStreetMap-Mitwirkende (ODbL).

[optional, nur bei redaktionellen Inhalten wie einem News-/Blogbereich:]
## Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
{name}, {Anschrift}
```

Notes: § 5 DDG requires name/legal form, address for service, quick electronic contact (email + a second fast channel,
usually phone), register data and VAT ID if they exist. A P.O. box is not sufficient as address.

---

## C. Datenschutzerklärung template (`/datenschutz/`)

```markdown
# Datenschutzerklärung
Stand: {date}

## 1. Verantwortlicher
{legal.name}, {legal.street}, {legal.zip} {legal.city}
Telefon {phone}, E-Mail {email}
[Datenschutzbeauftragter: nur falls benannt — bei < 20 Personen, die ständig mit der Verarbeitung personenbezogener
Daten beschäftigt sind, in der Regel nicht erforderlich (§ 38 BDSG).]

## 2. Überblick
Diese Website kommt ohne Cookies, ohne Tracking und ohne eingebettete Inhalte von Drittanbietern aus. Schriften werden
von unserem eigenen Server geladen. Personenbezogene Daten verarbeiten wir nur, wenn du die Website aufrufst (technische
Server-Logs) und wenn du uns kontaktierst.

## 3. Hosting und Server-Logfiles
Unsere Website wird bei {hosting.name}, {hosting.address} gehostet. [TBC: exakte Firmierung und Anschrift aus dem
Auftragsverarbeitungsvertrag (AVV/DPA) im Hostinger-Konto übernehmen.] Mit dem Hoster besteht ein Vertrag zur
Auftragsverarbeitung nach Art. 28 DSGVO.
Beim Aufruf der Website verarbeitet der Server automatisch: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite,
übertragene Datenmenge, Referrer-URL, Browser und Betriebssystem. Das ist technisch notwendig, um die Website
auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
an einem sicheren und stabilen Betrieb). Die Logfiles werden nach {log.retention} Tagen gelöscht. [TBC: im hPanel prüfen]
[Falls der Server in einem Drittland steht: Angabe des Standorts und der Garantien, z. B. Standardvertragsklauseln.]

## 4. SSL/TLS-Verschlüsselung
Die Verbindung zu dieser Website ist verschlüsselt (https).

## 5. Kontaktformular, E-Mail, Telefon  {#kontakt}
Wenn du uns über das Formular, per E-Mail oder telefonisch kontaktierst, verarbeiten wir deine Angaben (Name,
E-Mail-Adresse, ggf. Telefonnummer, Automatennummer und deine Nachricht), um dein Anliegen zu bearbeiten.
Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um eine Erstattung oder ein Vertragsverhältnis geht,
ansonsten Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
Die Formulardaten werden nicht in einer Datenbank gespeichert, sondern als E-Mail an uns übermittelt. Wir löschen
Anfragen, sobald sie erledigt sind, spätestens nach {contact.retention} [TBC, z. B. 6 Monate], sofern keine
gesetzlichen Aufbewahrungspflichten (z. B. bei Erstattungen nach Handels- und Steuerrecht) entgegenstehen.
Bitte übermittle keine vollständigen Kartennummern.

## 6. WhatsApp
Auf der Website verlinken wir auf WhatsApp. Erst wenn du den Link anklickst und uns schreibst, werden Daten an WhatsApp
Ireland Ltd. bzw. Meta übermittelt; dabei gelten deren Datenschutzbestimmungen. Wir nutzen deine Nachricht nur zur
Bearbeitung deines Anliegens (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Wenn du das nicht möchtest, nutze Telefon, E-Mail
oder das Formular. [Nur aufnehmen, wenn WhatsApp tatsächlich angeboten wird; idealerweise WhatsApp Business.]

## 7. Links zu Kartendiensten und sozialen Netzwerken
Wir binden keine Karten oder Social-Media-Inhalte ein. Die Karte auf unserer Kontaktseite ist ein Bild auf Basis von
OpenStreetMap-Daten, das von unserem Server geladen wird. Erst wenn du auf „Route mit Google Maps“, „Route mit Apple Maps“
oder ein Social-Media-Symbol klickst, verlässt du unsere Website; dann gelten die Datenschutzbestimmungen des jeweiligen Anbieters.

## 8. Schriftarten
Wir verwenden die Schriften „Archivo“ und „Atkinson Hyperlegible Next“. Sie sind lokal auf unserem Server gespeichert;
beim Laden wird keine Verbindung zu Google oder anderen Dritten aufgebaut.

## 9. Videoüberwachung im Laden  {#videoueberwachung}
[Nur falls zutreffend — Kunde liefert Fakten. Vor Ort zusätzlich ein gut sichtbares Hinweisschild mit den wichtigsten
Angaben (Verantwortlicher, Zweck, Kontakt, Verweis auf diese Seite) anbringen.]
Verantwortlicher: siehe Ziffer 1.
Zwecke: Schutz vor Vandalismus, Diebstahl und Einbruch, Aufklärung von Straftaten, Klärung von Störungen und Erstattungen.
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse besteht im Schutz unseres Eigentums und unserer
Kundinnen und Kunden in einem Laden ohne Personal.
Erfasst werden: {Bereiche} [TBC]. Keine Tonaufnahmen. [TBC]
Speicherdauer: {cctv.retention} Stunden/Tage [TBC; üblich sind wenige Tage], danach automatische Löschung, es sei denn,
Aufnahmen werden zur Aufklärung eines konkreten Vorfalls benötigt.
Empfänger: im Einzelfall Strafverfolgungsbehörden; ggf. Dienstleister {Name} als Auftragsverarbeiter [TBC].

## 10. Deine Rechte
Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung
(Art. 18), Datenübertragbarkeit (Art. 20) und **Widerspruch** gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f
DSGVO (Art. 21). Wende dich dafür an {email}.
Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren. Für uns zuständig ist das Bayerische Landesamt
für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach.

## 11. Änderungen
Wir passen diese Datenschutzerklärung an, wenn sich unsere Website oder die Rechtslage ändert.
```

---

## D. Contact form — data-protection implementation details
- No database, no logs of message content; PHP sends one email and discards the data.
- Do not log IP addresses in the app. (Server access logs exist anyway — covered in §3.)
- The checkbox is informational (acknowledging the privacy notice), not consent; legal basis is lit. b/f.
- Honeypot field + minimum fill time (≥ 3 s) instead of a captcha.
- `Reply-To` = user email; `From` = own domain mailbox (SPF/DKIM aligned).
- Data minimisation: Telefon and Automatennummer optional.
