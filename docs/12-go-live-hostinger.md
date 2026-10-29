# 12 — Go-live on Hostinger (step by step)

The site is plain static files plus one PHP file. Hostinger serves them from `public_html`; nothing runs Node
on the server. GitHub Actions builds the site and pushes the result to the branch `deploy`; Hostinger pulls
that branch.

## 0. Status of the content (29.10.2026)

Confirmed by the client and in `src/data/settings.json` / `site.ts`: email info@alpenbox24.de, payment by cash
and bank transfer, support via phone call or the contact form. Everything else the client did not provide is
hidden on the site. The production build (`npm run build`) passes.

**Still recommended:** § 5 DDG expects the operator's legal name (owner or company) in the Impressum. It currently
shows "AlpenBox24 Minimarkt" with the shop address. Enter the real name and legal form in the admin panel
(`/admin/` → Firma) as soon as possible, and add a phone number if customers should be able to call.

## 1. GitHub → Hostinger (one-time, ~5 minutes)

**DNS is already done:** `alpenbox24.de` uses Hostinger's nameservers (`hyperion.dns-parking.com`, `atlas.dns-parking.com`)
and points at a Hostinger server, so no nameserver change is needed. Hostinger only has to be told to serve this repo.

Every push to `main` (including saves from the admin panel) runs **"Build & publish static site to deploy
branch"** and updates the branch `deploy` with the finished site.

1. hPanel → **Websites → alpenbox24.de → Advanced → Git**:
   - Repository: `https://github.com/abduulhakeeem/alpenbox24-website.git` (public repo, no key needed)
   - Branch: `deploy` · Directory: leave empty (= `public_html`)
   - Create, then **Deploy**.
2. Turn on **Auto Deployment**, copy the webhook URL hPanel shows, and add it in GitHub → repo → Settings →
   Webhooks → Add webhook (Payload URL = that URL, content type `application/json`, "Just the push event").
3. If `public_html` already contains a Hostinger default page, back it up and delete it before the first deploy.
4. hPanel → **Security → SSL** → install the free certificate. `.htaccess` forces HTTPS and redirects `www` → apex.
5. Admin panel: see `docs/13-admin-panel.md` (config file with password + GitHub token).

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
