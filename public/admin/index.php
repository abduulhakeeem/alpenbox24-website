<?php
declare(strict_types=1);

/**
 * AlpenBox24 — Verwaltung (admin panel)
 *
 * Lets the owner edit company details, contact data, social links, locations, directions, products (with origin),
 * the "Produkt der Woche/des Monats", logo and favicon.
 * Saving commits src/data/settings.json (and uploaded images under public/uploads/) to GitHub in one
 * commit. GitHub Actions then rebuilds the static site and Hostinger deploys it (≈ 2–3 minutes).
 *
 * Needs <domain root>/config/alpenbox-admin.php (one level above public_html, never in Git):
 *   return [
 *     'password_hash' => '$2y$…',              // password_hash('…', PASSWORD_DEFAULT)  (or 'password' => '…')
 *     'github_token'  => 'github_pat_…',       // fine-grained token: this repo only, Contents: Read and write
 *     'repo'          => 'abduulhakeeem/alpenbox24-website',
 *     'branch'        => 'main',
 *   ];
 * See docs/13-admin-panel.md.
 */

const SETTINGS_PATH = 'src/data/settings.json';
const UPLOAD_DIR = 'public/uploads';
const MAX_UPLOAD = 1024 * 1024; // 1 MB
const MAX_LOCATIONS = 8;
const MAX_PRODUCTS = 30;
const PRODUCT_CATS = ['getraenke' => 'Getränke', 'snacks' => 'Snacks & Süßes', 'regional' => 'Regionales', 'brotzeit' => 'Brotzeit'];
const IDLE_TIMEOUT = 1800;     // 30 min without activity → log out
const MAX_SESSION  = 28800;    // 8 h absolute session lifetime

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

$configPath = dirname(__DIR__, 2) . '/config/alpenbox-admin.php';
if (!is_file($configPath)) {
    http_response_code(503);
    page('Einrichtung fehlt', '<p class="msg err">Die Datei <code>config/alpenbox-admin.php</code> fehlt auf dem Server. Anleitung: docs/13-admin-panel.md im Repository.</p>');
    exit;
}
$cfg = require $configPath;

ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name('ab24admin');
session_set_cookie_params(['lifetime' => 0, 'path' => '/admin/', 'secure' => !empty($_SERVER['HTTPS']) || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https', 'httponly' => true, 'samesite' => 'Strict']);
session_start();

// Expire idle or too-old sessions and bind the session to the browser that logged in.
$fingerprint = hash('sha256', $_SERVER['HTTP_USER_AGENT'] ?? '');
if (!empty($_SESSION['auth'])) {
    $now = time();
    if ($now - ($_SESSION['seen'] ?? 0) > IDLE_TIMEOUT || $now - ($_SESSION['since'] ?? 0) > MAX_SESSION
        || !hash_equals($_SESSION['fp'] ?? '', $fingerprint)) {
        $_SESSION = [];
        session_regenerate_id(true);
    } else {
        $_SESSION['seen'] = $now;
    }
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

/* ───────── Login / logout ───────── */
if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: ./', true, 303);
    exit;
}

if (empty($_SESSION['auth'])) {
    $error = '';
    if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        if (throttled()) {
            $error = 'Zu viele Fehlversuche. Bitte warte 15 Minuten.';
        } elseif (password_ok((string) ($_POST['password'] ?? ''), $cfg)) {
            session_regenerate_id(true);
            $_SESSION['auth'] = true;
            $_SESSION['since'] = $_SESSION['seen'] = time();
            $_SESSION['fp'] = $fingerprint;
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
            throttle_reset();
            header('Location: ./', true, 303);
            exit;
        } else {
            throttle_fail();
            sleep(1);
            $error = 'Passwort falsch.';
        }
    }
    page('Anmelden', login_form($error));
    exit;
}

/* ───────── Save ───────── */
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);

if ($action === 'save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['csrf'] ?? ''))) {
        $_SESSION['flash'] = ['err', 'Sitzung abgelaufen. Bitte noch einmal speichern.'];
        header('Location: ./', true, 303);
        exit;
    }
    try {
        [$current] = gh_get_settings($cfg);
        [$next, $files, $errors] = build_settings($current, $_POST, $_FILES);
        if ($errors) {
            $_SESSION['flash'] = ['err', implode(' ', $errors)];
        } else {
            $files[SETTINGS_PATH] = json_encode($next, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
            gh_commit($cfg, $files, 'Admin: Einstellungen aktualisiert');
            $_SESSION['flash'] = ['ok', 'Gespeichert. Die Website wird jetzt neu gebaut und ist in etwa 2–3 Minuten aktualisiert.'];
        }
    } catch (Throwable $e) {
        error_log('AlpenBox24 admin: ' . $e->getMessage());
        $_SESSION['flash'] = ['err', 'Speichern fehlgeschlagen: ' . $e->getMessage()];
    }
    header('Location: ./', true, 303);
    exit;
}

/* ───────── Dashboard ───────── */
try {
    [$s] = gh_get_settings($cfg);
    page('Verwaltung', dashboard($s, $flash, $_SESSION['csrf']));
} catch (Throwable $e) {
    page('Verwaltung', ($flash ? '<p class="msg ' . ($flash[0] === 'ok' ? 'ok' : 'err') . '">' . h($flash[1]) . '</p>' : '')
        . '<p class="msg err">Die Einstellungen konnten nicht von GitHub geladen werden: ' . h($e->getMessage()) . '</p><p><a href="?action=logout">Abmelden</a></p>');
}
exit;

/* =================================================================== */

function h(?string $v): string { return htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8'); }

function password_ok(string $pw, array $cfg): bool
{
    if ($pw === '') return false;
    if (!empty($cfg['password_hash'])) return password_verify($pw, $cfg['password_hash']);
    if (!empty($cfg['password'])) return hash_equals(hash('sha256', (string) $cfg['password']), hash('sha256', $pw));
    return false;
}

function throttle_file(): string { return dirname(__DIR__, 2) . '/config/.admin-throttle.json'; }
function throttle_key(): string { return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . 'ab24'); }
function throttle_read(): array { $f = throttle_file(); return is_file($f) ? (json_decode((string) file_get_contents($f), true) ?: []) : []; }
function throttled(): bool { $t = throttle_read()[throttle_key()] ?? null; return $t && $t['n'] >= 8 && time() - $t['t'] < 900; }
function throttle_fail(): void
{
    $all = throttle_read();
    $k = throttle_key();
    $prev = $all[$k] ?? ['n' => 0, 't' => time()];
    $all[$k] = ['n' => (time() - $prev['t'] > 900 ? 0 : $prev['n']) + 1, 't' => time()];
    @file_put_contents(throttle_file(), json_encode($all), LOCK_EX);
}
function throttle_reset(): void { $all = throttle_read(); unset($all[throttle_key()]); @file_put_contents(throttle_file(), json_encode($all), LOCK_EX); }

/* ───────── Validation ───────── */

function clean_text(string $v, int $max): string
{
    $v = trim(str_replace(["\0", "\r"], '', $v));
    $v = preg_replace('/\s+/u', ' ', $v) ?? '';
    return mb_substr($v, 0, $max);
}

function build_settings(array $cur, array $post, array $files): array
{
    $errors = [];
    $in = fn(string $k, int $max = 160) => clean_text((string) ($post[$k] ?? ''), $max);

    $s = $cur;
    foreach (['legalName', 'legalForm', 'street', 'zip', 'city', 'managingDirectors', 'registerCourt', 'registerNumber', 'vatId'] as $k) {
        $s['company'][$k] = $in('company_' . $k);
    }
    if ($s['company']['legalName'] === '' || $s['company']['street'] === '' || $s['company']['city'] === '') {
        $errors[] = 'Name und Anschrift sind für das Impressum Pflicht.';
    }

    $email = $in('contact_email', 200);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Bitte gib eine gültige E-Mail-Adresse an.';
    $s['contact']['email'] = $email;
    foreach (['phone', 'whatsapp'] as $k) {
        $v = $in('contact_' . $k, 40);
        if ($v !== '' && !preg_match('/^\+?[0-9 ()\/-]{6,30}$/', $v)) $errors[] = 'Telefon/WhatsApp: nur Ziffern, Leerzeichen, +, -, / und Klammern.';
        $s['contact'][$k] = $v;
    }

    $hosts = ['instagram' => 'instagram.com', 'facebook' => 'facebook.com', 'tiktok' => 'tiktok.com', 'googleBusiness' => ''];
    foreach ($hosts as $k => $host) {
        $v = $in('social_' . $k, 300);
        if ($v !== '') {
            $ok = filter_var($v, FILTER_VALIDATE_URL) && str_starts_with($v, 'https://');
            $vh = strtolower((string) parse_url($v, PHP_URL_HOST));
            if ($ok && $host !== '' && !str_ends_with($vh, $host)) $ok = false;
            if ($ok && $k === 'googleBusiness' && !preg_match('/(^|\.)(google\.[a-z.]+|goo\.gl|g\.page|maps\.app\.goo\.gl)$/', $vh)) $ok = false;
            if (!$ok) $errors[] = "Link „{$k}“ muss eine https-Adresse" . ($host ? " von {$host}" : ' von Google Maps') . ' sein.';
        }
        $s['social'][$k] = $v;
    }

    foreach (['parking', 'bikeParking', 'accessibility'] as $k) $s['directions'][$k] = $in('directions_' . $k, 300);

    $locs = [];
    for ($i = 0; $i < MAX_LOCATIONS; $i++) {
        $l = [];
        foreach (['name' => 80, 'street' => 120, 'zip' => 10, 'city' => 80, 'hours' => 80, 'note' => 200] as $k => $max) $l[$k] = $in("loc_{$i}_{$k}", $max);
        if ($l['name'] === '' && $l['city'] === '') continue;
        if ($l['name'] === '' || $l['city'] === '') { $errors[] = 'Jeder Standort braucht mindestens Name und Ort.'; continue; }
        $locs[] = $l;
    }
    if (!$locs) $errors[] = 'Mindestens ein Standort ist nötig.';
    $s['locations'] = $locs;

    $products = [];
    for ($i = 0; $i < MAX_PRODUCTS; $i++) {
        $p = [];
        foreach (['name' => 80, 'note' => 120, 'from' => 100, 'place' => 80] as $k => $max) $p[$k] = $in("prod_{$i}_{$k}", $max);
        $cat = (string) ($post["prod_{$i}_cat"] ?? '');
        if ($p['name'] === '') continue;
        $products[] = ['name' => $p['name'], 'cat' => isset(PRODUCT_CATS[$cat]) ? $cat : 'snacks', 'note' => $p['note'], 'from' => $p['from'], 'place' => $p['place']];
    }
    $s['products'] = $products;

    $hl = is_array($s['highlight'] ?? null) ? $s['highlight'] : [];
    $hl['period'] = (($post['hl_period'] ?? '') === 'Monat') ? 'Monat' : 'Woche';
    $hl['name'] = $in('hl_name', 80);
    $hl['text'] = $in('hl_text', 240);
    $hl['image'] = !empty($post['remove_hl_image']) ? '' : (string) ($hl['image'] ?? '');
    $s['highlight'] = $hl;

    $out = [];
    foreach (['logo' => ['png', 'svg', 'webp'], 'favicon' => ['png', 'svg', 'ico'], 'hl_image' => ['jpg', 'png', 'webp']] as $k => $exts) {
        if ($k !== 'hl_image' && !empty($post['remove_' . $k])) $s['branding'][$k] = '';
        $f = $files[$k] ?? null;
        if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
        if ($f['error'] !== UPLOAD_ERR_OK) { $errors[] = "Upload {$k} fehlgeschlagen."; continue; }
        if ($f['size'] > MAX_UPLOAD) { $errors[] = "{$k}: Datei ist größer als 1 MB."; continue; }
        $data = (string) file_get_contents($f['tmp_name']);
        $ext = detect_image($data);
        if (!$ext || !in_array($ext, $exts, true)) { $errors[] = "{$k}: erlaubt sind " . strtoupper(implode(', ', $exts)) . '.'; continue; }
        if ($ext === 'svg' && !svg_safe($data)) { $errors[] = "{$k}: Die SVG-Datei enthält Skripte oder externe Verweise."; continue; }
        $path = UPLOAD_DIR . '/' . ($k === 'hl_image' ? 'produkt' : $k) . '-' . date('Ymd-His') . ".{$ext}";
        $out[$path] = $data;
        if ($k === 'hl_image') $s['highlight']['image'] = substr($path, strlen('public/'));
        else $s['branding'][$k] = substr($path, strlen('public/'));
    }

    $s['updatedAt'] = gmdate('c');
    return [$s, $out, $errors];
}

function detect_image(string $d): ?string
{
    if (str_starts_with($d, "\x89PNG\r\n\x1a\n")) return 'png';
    if (str_starts_with($d, "\xFF\xD8\xFF")) return 'jpg';
    if (str_starts_with($d, 'RIFF') && substr($d, 8, 4) === 'WEBP') return 'webp';
    if (str_starts_with($d, "\x00\x00\x01\x00")) return 'ico';
    if (preg_match('/^\s*(<\?xml[^>]*>\s*)?(<!--.*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/is', $d)) return 'svg';
    return null;
}

function svg_safe(string $d): bool
{
    // Strict for a logo/favicon: no scripting, links, embeds, entities or external references.
    // Internal styles and url(#gradient) are allowed (normal for exported logos, harmless in <img>).
    if (preg_match('/<!ENTITY|<!DOCTYPE[^>]*\[/i', $d)) return false;
    return !preg_match('/<\s*(script|foreignObject|iframe|embed|object|a|use|image|set|animate\w*|handler|listener)\b|\son[a-z]+\s*=|javascript\s*:|data\s*:|&#|\bhref\s*=|@import|url\s*\(\s*[\'"]?(?!#)/i', $d);
}

/* ───────── GitHub ───────── */

function gh(array $cfg, string $method, string $path, ?array $body = null, bool $raw = false)
{
    $ch = curl_init('https://api.github.com' . $path);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $cfg['github_token'],
            'Accept: ' . ($raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json'),
            'X-GitHub-Api-Version: 2022-11-28',
            'User-Agent: alpenbox24-admin',
            'Content-Type: application/json',
        ],
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    $res = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    if ($res === false) throw new RuntimeException('Keine Verbindung zu GitHub (' . $err . ').');
    if ($code >= 400) {
        $msg = json_decode((string) $res, true)['message'] ?? ('HTTP ' . $code);
        throw new RuntimeException('GitHub: ' . $msg);
    }
    return $raw ? $res : json_decode((string) $res, true);
}

function gh_get_settings(array $cfg): array
{
    $raw = gh($cfg, 'GET', "/repos/{$cfg['repo']}/contents/" . SETTINGS_PATH . '?ref=' . rawurlencode($cfg['branch']), null, true);
    $s = json_decode((string) $raw, true);
    if (!is_array($s)) throw new RuntimeException('settings.json ist kein gültiges JSON.');
    return [$s];
}

/** One commit with several files (Git Data API). */
function gh_commit(array $cfg, array $files, string $message): void
{
    $repo = $cfg['repo'];
    $ref = gh($cfg, 'GET', "/repos/{$repo}/git/ref/heads/" . rawurlencode($cfg['branch']));
    $parent = $ref['object']['sha'];
    $base = gh($cfg, 'GET', "/repos/{$repo}/git/commits/{$parent}");
    $tree = [];
    foreach ($files as $path => $content) {
        $blob = gh($cfg, 'POST', "/repos/{$repo}/git/blobs", ['content' => base64_encode($content), 'encoding' => 'base64']);
        $tree[] = ['path' => $path, 'mode' => '100644', 'type' => 'blob', 'sha' => $blob['sha']];
    }
    $newTree = gh($cfg, 'POST', "/repos/{$repo}/git/trees", ['base_tree' => $base['tree']['sha'], 'tree' => $tree]);
    $commit = gh($cfg, 'POST', "/repos/{$repo}/git/commits", ['message' => $message, 'tree' => $newTree['sha'], 'parents' => [$parent]]);
    gh($cfg, 'PATCH', "/repos/{$repo}/git/refs/heads/" . rawurlencode($cfg['branch']), ['sha' => $commit['sha']]);
}

/* ───────── Views ───────── */

function field(string $name, string $label, string $value, string $type = 'text', string $hint = '', bool $required = false): string
{
    return '<label class="f"><span>' . h($label) . ($required ? ' *' : '') . '</span><input type="' . $type . '" name="' . h($name) . '" value="' . h($value) . '"' . ($required ? ' required' : '') . '>' . ($hint ? '<small>' . h($hint) . '</small>' : '') . '</label>';
}

function locations_form(array $locs): string
{
    $out = '<section class="card"><h2>Standorte</h2><p class="muted">Der erste Standort ist die Box in Miesbach (mit Karte). Leere Zeilen werden ignoriert.</p>';
    for ($i = 0; $i < MAX_LOCATIONS; $i++) {
        $l = $locs[$i] ?? [];
        $v = fn(string $k) => (string) ($l[$k] ?? '');
        $out .= '<fieldset class="loc"><legend>Standort ' . ($i + 1) . '</legend><div class="grid">'
            . field("loc_{$i}_name", 'Name', $v('name'), 'text', $i === 0 ? 'z. B. AlpenBox24 Miesbach' : '')
            . field("loc_{$i}_street", 'Straße und Nr.', $v('street'))
            . field("loc_{$i}_zip", 'PLZ', $v('zip'))
            . field("loc_{$i}_city", 'Ort', $v('city'))
            . field("loc_{$i}_hours", 'Öffnungszeiten', $v('hours'), 'text', 'z. B. Täglich 0–24 Uhr')
            . field("loc_{$i}_note", 'Kurzbeschreibung', $v('note'), 'text', 'Ein Satz, z. B. was es dort gibt.')
            . '</div></fieldset>';
    }
    return $out . '</section>';
}

function products_form(array $items, array $hl): string
{
    $per = (string) ($hl['period'] ?? 'Woche');
    $out = '<section class="card"><h2>Produkt der Woche / des Monats</h2><p class="muted">Erscheint oben auf der Produktseite und auf der Startseite. Name leer lassen = ausgeblendet.</p><div class="grid">'
        . '<label class="f"><span>Zeitraum</span><select name="hl_period"><option value="Woche"' . ($per !== 'Monat' ? ' selected' : '') . '>Produkt der Woche</option><option value="Monat"' . ($per === 'Monat' ? ' selected' : '') . '>Produkt des Monats</option></select></label>'
        . field('hl_name', 'Produkt', (string) ($hl['name'] ?? ''), 'text', 'z. B. Bergkäse vom Hof Huber')
        . field('hl_text', 'Ein, zwei Sätze dazu', (string) ($hl['text'] ?? ''), 'text', 'Was ist besonders? Woher kommt es?')
        . '<div class="f"><span>Foto</span>' . (!empty($hl['image']) ? '<img src="/' . h((string) $hl['image']) . '" alt="" class="prev">' : '<span class="muted">Kein Foto</span>')
        . '<input type="file" name="hl_image" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"><small>JPG, PNG oder WebP, max. 1 MB, am besten quadratisch.</small>'
        . (!empty($hl['image']) ? '<label class="chk"><input type="checkbox" name="remove_hl_image" value="1"> Foto entfernen</label>' : '') . '</div>'
        . '</div></section>';
    $out .= '<section class="card"><h2>Produkte</h2><p class="muted">Was gerade im Automaten ist. Bei regionalen Produkten bitte Hof/Erzeuger und Ort eintragen, das erscheint auch unter „Über uns“. Leere Zeilen werden ignoriert.</p>';
    $rows = min(MAX_PRODUCTS, count($items) + 5);
    for ($i = 0; $i < $rows; $i++) {
        $p = $items[$i] ?? [];
        $v = fn(string $k) => (string) ($p[$k] ?? '');
        $opts = '';
        foreach (PRODUCT_CATS as $id => $label) $opts .= '<option value="' . $id . '"' . ($v('cat') === $id ? ' selected' : '') . '>' . h($label) . '</option>';
        $out .= '<fieldset class="loc"><legend>Produkt ' . ($i + 1) . '</legend><div class="grid">'
            . field("prod_{$i}_name", 'Name', $v('name'), 'text', $i === 0 ? 'z. B. Bergkäse' : '')
            . '<label class="f"><span>Kategorie</span><select name="prod_' . $i . '_cat">' . $opts . '</select></label>'
            . field("prod_{$i}_note", 'Kurz dazu', $v('note'), 'text', 'Optional, z. B. 200 g, mild')
            . field("prod_{$i}_from", 'Hof / Erzeuger', $v('from'), 'text', 'z. B. Hof Huber, Sennerei, Imkerei')
            . field("prod_{$i}_place", 'Ort / Region', $v('place'), 'text', 'z. B. Irschenberg')
            . '</div></fieldset>';
    }
    return $out . '<p class="muted">Mehr Zeilen? Erst speichern, dann kommen fünf neue dazu (max. ' . MAX_PRODUCTS . ').</p></section>';
}

function login_form(string $error): string
{
    return '<form method="post" class="card narrow"><h1>Verwaltung</h1><p class="muted">AlpenBox24 Website</p>'
        . ($error ? '<p class="msg err">' . h($error) . '</p>' : '')
        . '<input type="hidden" name="action" value="login"><label class="f"><span>Passwort</span><input type="password" name="password" autocomplete="current-password" required autofocus></label>'
        . '<button class="btn">Anmelden</button></form>';
}

function dashboard(array $s, ?array $flash, string $csrf): string
{
    $c = $s['company'] ?? []; $k = $s['contact'] ?? []; $so = $s['social'] ?? []; $d = $s['directions'] ?? []; $b = $s['branding'] ?? [];
    $g = fn(array $a, string $key) => (string) ($a[$key] ?? '');
    $img = fn(string $p) => $p ? '<img src="/' . h($p) . '" alt="" class="prev">' : '<span class="muted">Standard (AlpenBox24-Logo)</span>';

    return '<header class="top"><strong>AlpenBox24 · Verwaltung</strong><nav><a href="/" target="_blank" rel="noopener">Website ansehen</a> <a href="?action=logout">Abmelden</a></nav></header>'
        . ($flash ? '<p class="msg ' . ($flash[0] === 'ok' ? 'ok' : 'err') . '">' . h($flash[1]) . '</p>' : '')
        . '<form method="post" enctype="multipart/form-data">'
        . '<input type="hidden" name="action" value="save"><input type="hidden" name="csrf" value="' . h($csrf) . '">'
        . '<section class="card"><h2>Firma (Impressum)</h2><div class="grid">'
        . field('company_legalName', 'Name / Firma', $g($c, 'legalName'), 'text', 'Inhaber oder Firmenname, so wie er im Impressum stehen muss.', true)
        . field('company_legalForm', 'Rechtsform', $g($c, 'legalForm'), 'text', 'z. B. Einzelunternehmen, GbR, UG (haftungsbeschränkt), GmbH')
        . field('company_street', 'Straße und Nr.', $g($c, 'street'), 'text', '', true)
        . field('company_zip', 'PLZ', $g($c, 'zip'), 'text', '', true)
        . field('company_city', 'Ort', $g($c, 'city'), 'text', '', true)
        . field('company_managingDirectors', 'Geschäftsführung', $g($c, 'managingDirectors'), 'text', 'Nur bei UG/GmbH. Mehrere Namen mit Komma trennen.')
        . field('company_registerCourt', 'Registergericht', $g($c, 'registerCourt'), 'text', 'z. B. München')
        . field('company_registerNumber', 'Registernummer', $g($c, 'registerNumber'), 'text', 'z. B. HRB 123456')
        . field('company_vatId', 'USt-IdNr.', $g($c, 'vatId'), 'text', 'Nur falls vorhanden.')
        . '</div></section>'
        . '<section class="card"><h2>Kontakt</h2><div class="grid">'
        . field('contact_email', 'E-Mail', $g($k, 'email'), 'email', 'Erscheint im Footer, im Impressum und auf der Kontaktseite.', true)
        . field('contact_phone', 'Telefon', $g($k, 'phone'), 'tel', 'z. B. 0151 234 567 89. Leer lassen = kein Telefon auf der Website.')
        . field('contact_whatsapp', 'WhatsApp-Nummer', $g($k, 'whatsapp'), 'tel', 'Leer lassen = kein WhatsApp-Button.')
        . '</div></section>'
        . '<section class="card"><h2>Social Media & Google</h2><div class="grid">'
        . field('social_instagram', 'Instagram', $g($so, 'instagram'), 'url', 'https://www.instagram.com/…')
        . field('social_facebook', 'Facebook', $g($so, 'facebook'), 'url', 'https://www.facebook.com/…')
        . field('social_tiktok', 'TikTok', $g($so, 'tiktok'), 'url', 'https://www.tiktok.com/@…')
        . field('social_googleBusiness', 'Google-Unternehmensprofil', $g($so, 'googleBusiness'), 'url', 'Teilen-Link aus Google Maps')
        . '</div></section>'
        . products_form($s['products'] ?? [], $s['highlight'] ?? [])
        . locations_form($s['locations'] ?? [])
        . '<section class="card"><h2>Anfahrt (Miesbach)</h2><div class="grid">'
        . field('directions_parking', 'Parken', $g($d, 'parking'), 'text', 'z. B. „Kostenlose Parkplätze direkt vor dem Laden.“ Leer = wird nicht angezeigt.')
        . field('directions_bikeParking', 'Fahrradstellplätze', $g($d, 'bikeParking'))
        . field('directions_accessibility', 'Barrierefreiheit', $g($d, 'accessibility'), 'text', 'Nur eintragen, was wirklich stimmt, z. B. „Stufenloser Zugang“.')
        . '</div></section>'
        . '<section class="card"><h2>Logo & Favicon</h2><div class="grid">'
        . '<div class="f"><span>Logo (Kopfzeile)</span>' . $img($g($b, 'logo')) . '<input type="file" name="logo" accept=".png,.svg,.webp,image/png,image/svg+xml,image/webp"><small>PNG, SVG oder WebP, max. 1 MB. Am besten quer und mit transparentem Hintergrund.</small>'
        . ($g($b, 'logo') ? '<label class="chk"><input type="checkbox" name="remove_logo" value="1"> Standard-Logo wiederherstellen</label>' : '') . '</div>'
        . '<div class="f"><span>Favicon (Browser-Tab, App-Icon)</span>' . $img($g($b, 'favicon')) . '<input type="file" name="favicon" accept=".png,.svg,.ico,image/png,image/svg+xml,image/x-icon"><small>Quadratisch, PNG oder SVG, mind. 512 × 512 px. Die App-Icons werden daraus automatisch erzeugt.</small>'
        . ($g($b, 'favicon') ? '<label class="chk"><input type="checkbox" name="remove_favicon" value="1"> Standard-Favicon wiederherstellen</label>' : '') . '</div>'
        . '</div></section>'
        . '<div class="bar"><button class="btn">Speichern & veröffentlichen</button><span class="muted">Zuletzt geändert: ' . h($s['updatedAt'] ?? '–') . '</span></div>'
        . '</form>';
}

function page(string $title, string $body): void
{
    echo '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' . h($title) . ' – AlpenBox24</title>'
        . '<style>
:root{color-scheme:dark;--n:#0d0c0b;--f:#1a1816;--g:#2b2825;--g2:#3a3632;--s:#f7f7f7;--st:#b5afa6;--o:#f68a2b;--l:#c7e222}
*{box-sizing:border-box}body{margin:0;background:var(--n);color:var(--s);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:1rem}
main{max-width:60rem;margin:0 auto}h1,h2{margin:0 0 1rem;line-height:1.15}h2{font-size:1.25rem;color:var(--o)}
.top{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 0 1.25rem;border-bottom:1px solid var(--g);margin-bottom:1.25rem;flex-wrap:wrap}
.top nav a{color:var(--st);margin-left:1rem}a{color:var(--l)}
.card{background:var(--f);border:1px solid var(--g);border-radius:8px;padding:1.25rem;margin-bottom:1rem}.narrow{max-width:24rem;margin:10vh auto}
.grid{display:grid;gap:1rem}@media(min-width:720px){.grid{grid-template-columns:1fr 1fr}}
.f{display:grid;gap:.35rem}.f>span{font-weight:700}.f small{color:var(--st)}
input[type=text],input[type=email],input[type=tel],input[type=url],input[type=password]{width:100%;min-height:2.9rem;padding:.6rem .8rem;border:1px solid var(--g2);border-radius:6px;background:var(--n);color:var(--s);font:inherit}
input:focus{outline:2px solid var(--o);outline-offset:2px}input[type=file]{color:var(--st)}
.btn{min-height:3rem;padding:.7rem 1.4rem;border:0;border-radius:4px;background:var(--l);color:var(--n);font-weight:800;font-size:1rem;cursor:pointer}.btn:hover{background:#d7ff00}
.bar{position:sticky;bottom:0;display:flex;gap:1rem;align-items:center;flex-wrap:wrap;padding:1rem 0;background:var(--n);border-top:1px solid var(--g)}
.msg{padding:.8rem 1rem;border-radius:6px;border-left:4px solid}.ok{background:#1b2208;border-color:var(--l)}.err{background:#2a1608;border-color:var(--o)}
.muted{color:var(--st)}select{width:100%;padding:.6rem .7rem;border-radius:6px;border:1px solid var(--g2);background:var(--n);color:var(--s);font:inherit}fieldset.loc{border:1px solid var(--g);border-radius:6px;padding:1rem;margin:0 0 1rem}fieldset.loc legend{color:var(--o);font-weight:700;padding:0 .4rem}.prev{max-height:64px;max-width:220px;background:#000;padding:.4rem;border-radius:6px;border:1px solid var(--g2)}.chk{display:flex;gap:.5rem;align-items:center;color:var(--st)}
</style></head><body><main>' . $body . '</main></body></html>';
}
