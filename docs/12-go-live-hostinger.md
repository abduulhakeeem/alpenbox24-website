# 12 — Go-live on Hostinger (step by step)

The site is plain static files plus one PHP file. Hostinger serves them from `public_html`; nothing runs Node
on the server. GitHub Actions builds the site and pushes the result to the branch `deploy`; Hostinger pulls
that branch.

## 0. Before anything goes live (legal gate)

Fill these in `src/data/site.ts` (and remove the `TBC`), then push:

- [ ] `legal.name`, `legal.form`, `legal.street`, `legal.zip`, `legal.city` (+ register data / VAT ID if any)
- [ ] `phone.display` + `phone.e164`, `email`
- [ ] `payment.*`, `ageCheck.*`, `sellsAlcohol`, `refund.*`
- [ ] `cctv.enabled` (+ `retentionDe` if true)
- [ ] `directions.parkingDe`, `bikeParkingDe`, `accessibilityDe`
- [ ] `hosting.address` (from the Hostinger DPA in hPanel → Account → Data Processing Agreement)
- [ ] Über-uns founder story (`src/pages/ueber-uns.astro`, section "Wer wir sind")
- [ ] Have Impressum + Datenschutz checked (lawyer or maintained generator)

`npm run build` refuses to build while any `[TBC]` remains. That is intentional.

## 1. GitHub → Hostinger (one-time, ~10 minutes)

1. GitHub repo → **Settings → Actions → General → Workflow permissions** → "Read and write" (needed to push `deploy`).
2. GitHub → Actions → **"Build & publish static site to deploy branch"** → Run workflow. It creates the `deploy` branch. After launch, enable the `push` trigger in `.github/workflows/deploy.yml` so every push to `main` redeploys.
3. hPanel → **Websites → alpenbox24.de → Advanced → Git**:
   - Repository: `https://github.com/abduulhakeeem/alpenbox24-website.git`
     (private repo: add the SSH key hPanel shows as a **Deploy key** in GitHub → Settings → Deploy keys, and use the `git@github.com:…` URL)
   - Branch: `deploy` · Directory: leave empty (= `public_html`)
   - Create, then **Deploy**. Enable **Auto Deployment** and add the webhook URL hPanel shows to GitHub → Settings → Webhooks.
4. Back up and empty `public_html` before the first deploy if it contains a default Hostinger page.
5. hPanel → **Security → SSL** → install the free certificate. `.htaccess` forces HTTPS and redirects `www` → apex.

## 2. Contact form mail

1. hPanel → **Emails** → create `info@alpenbox24.de` (receives) and `formular@alpenbox24.de` (sends).
2. hPanel → **Files → File Manager** → create folder `config` **next to** `public_html` (not inside it).
3. Upload `config/alpenbox-mail.sample.php` from this repo as `config/alpenbox-mail.php` and fill in SMTP host/port
   (hPanel → Emails → Configuration, usually `smtp.hostinger.com`, 465 SSL), user, password, `site_url`.
4. hPanel → **PHP Configuration** → PHP 8.2 or newer.
5. DNS: SPF, DKIM and DMARC records (hPanel → Emails → Email deliverability).
6. Test: send the form once per Anliegen; check that a reply goes to the sender's address.

## 3. After launch (same day)

- Google Search Console (Domain property via DNS TXT) → submit `https://alpenbox24.de/sitemap-index.xml`.
- Google Business Profile: website URL, "24 Stunden geöffnet" all days, phone, 20+ photos once the shoot is done.
- Apple Business Connect, Bing Places — identical NAP: `AlpenBox24 · Bayrischzeller Straße 2-8 · 83714 Miesbach`.
- OpenStreetMap: add `shop=vending_machine`, `name=AlpenBox24`, `opening_hours=24/7` at the real pin.
- QR stickers on every machine → `/so-gehts/` and `/kontakt/#stoerung`.

## 4. Checks after deploy

```
curl -sI http://alpenbox24.de            → 301 to https
curl -sI https://www.alpenbox24.de       → 301 to https://alpenbox24.de
curl -sI https://alpenbox24.de/about     → 301 /ueber-uns/
curl -sI https://alpenbox24.de/          → CSP, HSTS, nosniff, Referrer-Policy present
```

## Fallback without Git

`npm run build`, then upload the contents of `dist/` into `public_html` via File Manager or FTP.
