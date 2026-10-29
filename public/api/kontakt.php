<?php
declare(strict_types=1);

/**
 * AlpenBox24 contact form handler (static site + this single PHP endpoint).
 * - No database, no logging of message content, no cookies.
 * - Bot protection: honeypot field "website" + minimum fill time via "_ts" (if JS set it).
 * - Sends one email via authenticated SMTP (PHPMailer), then 303-redirects.
 *
 * Requires:
 *   public/api/vendor/phpmailer/src/{Exception.php,PHPMailer.php,SMTP.php}  (PHPMailer 6.x, LGPL-2.1)
 *   <domain root>/config/alpenbox-mail.php   (one level above public_html; see config/alpenbox-mail.sample.php)
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

require __DIR__ . '/vendor/phpmailer/src/Exception.php';
require __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/src/SMTP.php';

const OK_URL    = '/kontakt/danke/';
const ERROR_URL = '/kontakt/?fehler=1#formular';

function go(string $url): never {
    header('Location: ' . $url, true, 303);
    exit;
}

function field(string $key, int $max): string {
    $v = isset($_POST[$key]) && is_string($_POST[$key]) ? trim($_POST[$key]) : '';
    $v = str_replace("\0", '', $v);
    return mb_substr($v, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST', true, 405);
    exit;
}

// Same-origin check (form-action 'self' in CSP already limits this; belt and braces).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$configPath = dirname(__DIR__, 2) . '/config/alpenbox-mail.php';
if (!is_file($configPath)) {
    error_log('AlpenBox24 kontakt.php: mail config missing at ' . $configPath);
    go(ERROR_URL);
}
$cfg = require $configPath;
if ($origin !== '' && rtrim($origin, '/') !== rtrim($cfg['site_url'], '/')) {
    go(ERROR_URL);
}

// Bot traps — pretend success so bots learn nothing.
if (field('website', 200) !== '') go(OK_URL);
$ts = field('_ts', 20);
if ($ts !== '' && ctype_digit($ts)) {
    $elapsedMs = (int) round(microtime(true) * 1000) - (int) $ts;
    if ($elapsedMs >= 0 && $elapsedMs < 3000) go(OK_URL);
}

$anliegenMap = [
    'stoerung' => 'Störung / Erstattung',
    'wunsch'   => 'Sortimentswunsch',
    'erzeuger' => 'Erzeuger werden',
    'sonstiges'=> 'Sonstiges',
];
$prefixMap = ['stoerung' => '[Störung]', 'wunsch' => '[Wunsch]', 'erzeuger' => '[Erzeuger]', 'sonstiges' => '[Kontakt]'];

$anliegen = field('anliegen', 20);
$name     = field('name', 120);
$email    = field('email', 200);
$telefon  = field('telefon', 40);
$automat  = field('automat', 20);
$message  = field('nachricht', 5000);

if (!isset($anliegenMap[$anliegen]) || $name === '' || $message === ''
    || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    go(ERROR_URL);
}

// Never accept full card numbers in free text (13–19 digits, optionally spaced).
$message = preg_replace('/\b\d(?:[ -]?\d){12,18}\b/', '[Kartennummer entfernt]', $message) ?? $message;

$body = "Anliegen: {$anliegenMap[$anliegen]}\n"
      . "Name: {$name}\n"
      . "E-Mail: {$email}\n"
      . ($telefon !== '' ? "Telefon: {$telefon}\n" : '')
      . ($automat !== '' ? "Automat-Nr.: {$automat}\n" : '')
      . "Gesendet: " . (new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin')))->format('d.m.Y H:i') . " Uhr\n"
      . "\n{$message}\n";

$mail = new PHPMailer(true);
try {
    $mail->CharSet  = 'UTF-8';
    $mail->isSMTP();
    $mail->Host       = $cfg['smtp_host'];
    $mail->Port       = (int) $cfg['smtp_port'];
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = $cfg['smtp_secure'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Username   = $cfg['smtp_user'];
    $mail->Password   = $cfg['smtp_pass'];

    $mail->setFrom($cfg['from_email'], $cfg['from_name']);
    $mail->addAddress($cfg['to_email']);
    $mail->addReplyTo($email, $name);
    $mail->Subject = $prefixMap[$anliegen] . ' ' . mb_substr($name, 0, 60);
    $mail->Body    = $body;
    $mail->isHTML(false);
    $mail->send();
} catch (MailException $e) {
    error_log('AlpenBox24 kontakt.php: mail failed: ' . $mail->ErrorInfo); // no user data logged
    go(ERROR_URL);
}

go(OK_URL);
