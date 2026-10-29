<?php
declare(strict_types=1);

/**
 * AlpenBox24 contact form handler (static site + this single PHP endpoint).
 * - No database, no logging of message content, no cookies.
 * - Abuse protection: same-origin check, honeypot "website", minimum fill time via "_ts" (if JS set it),
 *   per-IP rate limit (hashed IP, no raw IPs stored), request size cap.
 * - Sends one plain-text email via authenticated SMTP (PHPMailer), then 303-redirects.
 *
 * Requires:
 *   public/api/vendor/phpmailer/src/{Exception.php,PHPMailer.php,SMTP.php}  (PHPMailer 6.x, LGPL-2.1)
 *   <domain root>/config/alpenbox-mail.php   (one level above public_html; see config/alpenbox-mail.sample.php)
 * Tested in CI: scripts/test-php.sh
 */

use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/phpmailer/src/Exception.php';
require __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/src/SMTP.php';

const OK_URL      = '/kontakt/danke/';
const ERROR_URL   = '/kontakt/?fehler=1#formular';
const MAX_BODY    = 20000;   // bytes
const RATE_MAX    = 5;       // messages …
const RATE_WINDOW = 900;     // … per 15 minutes and IP

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

function go(string $url): never
{
    header('Location: ' . $url, true, 303);
    exit;
}

/** One trimmed POST string, NUL-free, length-capped. $singleLine also strips CR/LF (header safety). */
function field(string $key, int $max, bool $singleLine = true): string
{
    $v = isset($_POST[$key]) && is_string($_POST[$key]) ? $_POST[$key] : '';
    $v = str_replace("\0", '', $v);
    if ($singleLine) $v = preg_replace('/[\r\n\t]+/', ' ', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

/** Per-IP rate limit. Stores only salted hashes and timestamps, pruned on every call. */
function rate_limited(string $dir): bool
{
    $file = $dir . '/.kontakt-rate.json';
    $key = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|ab24-kontakt');
    $now = time();
    $fh = @fopen($file, 'c+');
    if (!$fh) return false; // fail open: never block real customers because of a file problem
    flock($fh, LOCK_EX);
    $all = json_decode((string) stream_get_contents($fh), true) ?: [];
    foreach ($all as $k => $hits) {
        $all[$k] = array_values(array_filter((array) $hits, fn($t) => $now - (int) $t < RATE_WINDOW));
        if (!$all[$k]) unset($all[$k]);
    }
    $limited = count($all[$key] ?? []) >= RATE_MAX;
    if (!$limited) $all[$key][] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($all));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $limited;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST', true, 405);
    exit;
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY) go(ERROR_URL);

$configDir = dirname(__DIR__, 2) . '/config';
$configPath = $configDir . '/alpenbox-mail.php';
if (!is_file($configPath)) {
    error_log('AlpenBox24 kontakt.php: mail config missing at ' . $configPath);
    go(ERROR_URL);
}
$cfg = require $configPath;

// Same-origin check (CSP form-action 'self' already limits this; belt and braces).
$site = rtrim((string) $cfg['site_url'], '/');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
if ($origin !== '' && rtrim($origin, '/') !== $site) go(ERROR_URL);
if ($origin === '' && $referer !== '' && !str_starts_with($referer, $site . '/')) go(ERROR_URL);

// Bot traps: pretend success so bots learn nothing.
if (field('website', 200) !== '') go(OK_URL);
$ts = field('_ts', 20);
if ($ts !== '' && ctype_digit($ts)) {
    $elapsedMs = (int) round(microtime(true) * 1000) - (int) $ts;
    if ($elapsedMs >= 0 && $elapsedMs < 3000) go(OK_URL);
}

$anliegenMap = [
    'frage'     => 'Frage zu einem Automaten',
    'wunsch'    => 'Produktwunsch',
    'standort'  => 'Standort anbieten',
    'sonstiges' => 'Sonstiges',
];
$prefixMap = ['frage' => '[Frage]', 'wunsch' => '[Wunsch]', 'standort' => '[Standort]', 'sonstiges' => '[Kontakt]'];

$anliegen = field('anliegen', 20);
$name     = field('name', 120);
$email    = field('email', 200);
$telefon  = field('telefon', 40);
$ort      = field('ort', 120);
$message  = field('nachricht', 4000, false);

if (!isset($anliegenMap[$anliegen]) || $name === '' || $message === ''
    || !filter_var($email, FILTER_VALIDATE_EMAIL) || !isset($_POST['dsgvo'])) {
    go(ERROR_URL);
}
if ($telefon !== '' && !preg_match('/^\+?[0-9 ()\/-]{4,40}$/', $telefon)) $telefon = '';

if (rate_limited($configDir)) go(ERROR_URL);

// Never forward full card or account numbers in free text.
$message = preg_replace('/\b\d(?:[ -]?\d){12,18}\b/', '[Nummer entfernt]', $message) ?? $message;
$message = preg_replace('/\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]{4}){3,7}(?:[ ]?[A-Z0-9]{1,3})?\b/i', '[IBAN entfernt]', $message) ?? $message;

$body = "Anliegen: {$anliegenMap[$anliegen]}\n"
      . "Name: {$name}\n"
      . "E-Mail: {$email}\n"
      . ($telefon !== '' ? "Telefon: {$telefon}\n" : '')
      . ($ort !== '' ? "Standort: {$ort}\n" : '')
      . 'Gesendet: ' . (new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin')))->format('d.m.Y H:i') . " Uhr\n"
      . "\n{$message}\n";

$mail = new PHPMailer(true);
try {
    $mail->CharSet    = 'UTF-8';
    $mail->isSMTP();
    $mail->Host       = (string) $cfg['smtp_host'];
    $mail->Port       = (int) $cfg['smtp_port'];
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = $cfg['smtp_secure'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Username   = (string) $cfg['smtp_user'];
    $mail->Password   = (string) $cfg['smtp_pass'];
    $mail->Timeout    = 15;

    $mail->setFrom((string) $cfg['from_email'], (string) $cfg['from_name']);
    $mail->addAddress((string) $cfg['to_email']);
    $mail->addReplyTo($email, $name);
    $mail->Subject = $prefixMap[$anliegen] . ' ' . mb_substr($name, 0, 60);
    $mail->Body    = $body;
    $mail->isHTML(false);
    $mail->send();
} catch (Throwable $e) {
    error_log('AlpenBox24 kontakt.php: mail failed: ' . $mail->ErrorInfo); // no user data logged
    go(ERROR_URL);
}

go(OK_URL);
