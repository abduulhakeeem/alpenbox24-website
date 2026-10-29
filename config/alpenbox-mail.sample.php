<?php
/**
 * Copy to the domain root on Hostinger as:  <domain root>/config/alpenbox-mail.php
 * e.g. /home/u123456789/domains/alpenbox24.de/config/alpenbox-mail.php
 * (one level ABOVE public_html, so Git redeploys never overwrite it and it is never web-reachable).
 * Never commit the real file.
 *
 * Setup with the WEB.DE mailbox alpenbox24@web.de (no Hostinger mailbox needed):
 *  1. web.de → Einstellungen → POP3/IMAP Abruf → "POP3 und IMAP Zugriff erlauben" einschalten
 *     (without this, web.de refuses SMTP logins).
 *  2. Fill in the web.de password below. web.de only sends with its own address as sender,
 *     so from_email must be alpenbox24@web.de. The visitor's address is set as Reply-To.
 */
return [
    'smtp_host'   => 'smtp.web.de',
    'smtp_port'   => 587,                    // STARTTLS
    'smtp_secure' => 'tls',
    'smtp_user'   => 'alpenbox24@web.de',
    'smtp_pass'   => 'CHANGE-ME',            // web.de password
    'from_email'  => 'alpenbox24@web.de',
    'from_name'   => 'AlpenBox24 Website',
    'to_email'    => 'alpenbox24@web.de',    // inbox that receives enquiries
    'site_url'    => 'https://alpenbox24.de',
];
