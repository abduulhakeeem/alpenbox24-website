# 13 — Admin panel ("Verwaltung") at `/admin/`

The owner can change the basic company details without touching code:

| Section | Fields | Where it shows up |
|---|---|---|
| Firma (Impressum) | Name/Firma, Rechtsform, Anschrift, Geschäftsführung, Registergericht/-nummer, USt-IdNr. | Impressum, Datenschutz (Verantwortlicher) |
| Kontakt | E-Mail, Telefon, WhatsApp | Footer, Kontakt, Impressum, FAQ, So geht's, mobile action bar, JSON-LD. Empty phone = no phone shown, "Kontakt" button instead of "Anrufen". |
| Social Media & Google | Instagram, Facebook, TikTok, Google Business Profile link | Footer icons, JSON-LD `sameAs` / `hasMap` |
| Standorte | Up to 8 locations: Name, Straße, PLZ, Ort, Öffnungszeiten, Kurzbeschreibung | /standorte/, home page, JSON-LD (first = Miesbach box with map) |
| Anfahrt (Miesbach) | Parken, Fahrradstellplätze, Barrierefreiheit | /standorte/ (each only shown when filled) |
| Produkt der Woche / des Monats | Period, product name, one or two sentences, optional photo (JPG/PNG/WebP ≤ 1 MB). Empty name = hidden | Top of /produkte/ and the home page (DE + EN) |
| Produkte | Up to 30 rows: Name, Kategorie, Kurz dazu, Hof / Erzeuger, Ort / Region (5 empty rows after the last one) | /produkte/ per category; regional products with farm/place also on /ueber-uns/ |
| Logo & Favicon | Upload PNG/SVG/WebP logo, PNG/SVG/ICO favicon (≤ 1 MB) | Header logo; favicon + generated app icons (32/180/192/512 px) |

## How it works (and why the site stays static)

```
/admin/ (PHP on Hostinger) ──save──▶ GitHub API: one commit to main
      src/data/settings.json  (+ public/uploads/logo-….png / favicon-….svg)
                                     │
                     GitHub Actions "deploy.yml": build → branch deploy
                                     │
                     Hostinger Git auto-deploy → public_html   (≈ 2–3 min)
```

The website itself remains plain HTML. `src/data/settings.json` is read by `src/data/site.ts` at build time
(single source of truth, rule R5). Every change is a Git commit, so it is versioned and can be rolled back.

## Security

- Password login, session cookie limited to `/admin/` (HttpOnly, SameSite=Strict, Secure on https).
- CSRF token on save; 8 failed logins per IP → 15 min lock; 1 s delay per failure.
- `noindex`, `no-store`, `X-Frame-Options: DENY`; `/admin/` disallowed in robots.txt.
- Uploads are checked by file signature (not by name); SVGs containing scripts, event handlers or external
  links are rejected. All inputs are length-limited; URLs must be https and on the expected domain.
- Secrets (password, GitHub token) live only in `config/alpenbox-admin.php` **outside** `public_html`.
- The GitHub token should be fine-grained, limited to this one repository, permission **Contents: Read and write**
  only, with an expiry date. If it leaks, revoke it in GitHub and create a new one.

## One-time setup (owner / Ahad, ~10 minutes)

1. **GitHub token:** github.com → Settings → Developer settings → Fine-grained tokens → Generate new token.
   Resource owner: `abduulhakeeem`, Repository access: *Only select repositories* → `alpenbox24-website`,
   Permissions → Repository → **Contents: Read and write**. Copy the token.
2. **Config file on Hostinger:** hPanel → Files → File Manager → open the domain folder (the one that contains
   `public_html`) → folder `config` (create it if missing, the contact form uses it too) → new file
   `alpenbox-admin.php` with:

   ```php
   <?php
   return [
       'password'     => 'EIN-LANGES-SICHERES-PASSWORT',   // or 'password_hash' => '$2y$…'
       'github_token' => 'github_pat_…',
       'repo'         => 'abduulhakeeem/alpenbox24-website',
       'branch'       => 'main',
   ];
   ```

   A bcrypt hash is preferable to a plain password: in hPanel → Advanced → PHP Configuration you can't run code,
   but any PHP 8 sandbox prints one with `echo password_hash('…', PASSWORD_DEFAULT);` — then use `'password_hash' => '…'`
   and delete the `'password'` line.
3. Open `https://alpenbox24.de/admin/`, log in, change something small, save. After 2–3 minutes the change is live.
   Progress is visible under GitHub → Actions.

## Troubleshooting

| Message | Cause |
|---|---|
| "Die Datei config/alpenbox-admin.php fehlt" | Step 2 not done, or file placed inside `public_html` |
| "GitHub: Bad credentials" | Token wrong or expired → new token in the config file |
| "GitHub: Resource not accessible by personal access token" | Token lacks Contents: Read and write on this repo |
| Saved, but nothing changes | GitHub → Actions → check the "Build & publish" run; Hostinger Git auto-deploy must be on |
