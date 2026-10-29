<?php
/**
 * Copy to the domain root on Hostinger as:  <domain root>/config/alpenbox-mail.php
 * e.g. /home/u123456789/domains/alpenbox24.de/config/alpenbox-mail.php
 * (one level ABOVE public_html, so Git redeploys never overwrite it and it is never web-reachable).
 * Never commit the real file.
 */
return [
    'smtp_host'   => 'smtp.hostinger.com',   // verify in hPanel → Emails → Configuration
    'smtp_port'   => 465,                    // 465 = SMTPS (ssl); 587 = STARTTLS (tls)
    'smtp_secure' => 'ssl',
    'smtp_user'   => 'formular@alpenbox24.de',
    'smtp_pass'   => 'CHANGE-ME',
    'from_email'  => 'formular@alpenbox24.de',
    'from_name'   => 'AlpenBox24 Website',
    'to_email'    => 'info@alpenbox24.de',   // inbox that receives enquiries
    'site_url'    => 'https://alpenbox24.de',
];
