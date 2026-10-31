#!/usr/bin/env bash
# Functional tests for the two PHP endpoints (contact form + admin panel) against the built site.
# Runs in CI (.github/workflows/deploy.yml) before anything is published. Needs PHP 8.x and a built dist/.
set -uo pipefail

B=http://127.0.0.1:8099
PASS=0
FAIL=0
check() { # name, expected substring, actual
  if [[ "$3" == *"$2"* ]]; then echo "  ✓ $1"; PASS=$((PASS + 1)); else echo "  ✗ $1 — expected '$2', got '${3:0:160}'"; FAIL=$((FAIL + 1)); fi
}

# Test configs (outside dist/, exactly where the endpoints look on Hostinger: <root>/config/)
mkdir -p config
rm -f config/.kontakt-rate.json config/.admin-throttle.json
cat > config/alpenbox-mail.php <<'PHP'
<?php return ['smtp_host' => '127.0.0.1', 'smtp_port' => 2599, 'smtp_secure' => 'tls', 'smtp_user' => 'test', 'smtp_pass' => 'test',
  'from_email' => 'alpenbox24@web.de', 'from_name' => 'Test', 'to_email' => 'alpenbox24@web.de', 'site_url' => 'http://127.0.0.1:8099'];
PHP
HASH=$(php -r 'echo password_hash("test-passwort-123", PASSWORD_DEFAULT);')
printf "<?php return ['password_hash' => '%s', 'github_token' => 'invalid-test-token', 'repo' => 'abduulhakeeem/alpenbox24-website', 'branch' => 'main'];\n" "$HASH" > config/alpenbox-admin.php

LOG=$(mktemp)
php -S 127.0.0.1:8099 -t dist > "$LOG" 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null; rm -f config/alpenbox-mail.php config/alpenbox-admin.php config/.kontakt-rate.json config/.admin-throttle.json' EXIT
sleep 1

OLD=$((($(date +%s) - 60) * 1000))
NOW=$(($(date +%s) * 1000))
post() { curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -X POST "$B/api/kontakt.php" "$@"; }
VALID=(-d anliegen=frage -d name=Max -d email=max@example.com -d nachricht=Hallo -d dsgvo=on -d _ts=$OLD)

echo "Contact form (api/kontakt.php)"
check "GET is rejected (405)" "405" "$(curl -s -o /dev/null -w '%{http_code}' $B/api/kontakt.php)"
check "missing name → error page" "fehler=1" "$(post -d anliegen=frage -d email=max@example.com -d nachricht=x -d dsgvo=on -d _ts=$OLD)"
check "invalid email → error page" "fehler=1" "$(post -d anliegen=frage -d name=Max -d email=nope -d nachricht=x -d dsgvo=on -d _ts=$OLD)"
check "unknown reason → error page" "fehler=1" "$(post -d anliegen=hack -d name=Max -d email=max@example.com -d nachricht=x -d dsgvo=on -d _ts=$OLD)"
check "privacy checkbox missing → error page" "fehler=1" "$(post -d anliegen=frage -d name=Max -d email=max@example.com -d nachricht=x -d _ts=$OLD)"
check "honeypot filled → fake success" "/kontakt/danke/" "$(post "${VALID[@]}" -d website=spam)"
check "sent within 3 s → fake success" "/kontakt/danke/" "$(post -d anliegen=frage -d name=Max -d email=max@example.com -d nachricht=x -d dsgvo=on -d _ts=$NOW)"
check "foreign Origin → error page" "fehler=1" "$(post "${VALID[@]}" -H 'Origin: https://evil.example')"
check "foreign Referer → error page" "fehler=1" "$(post "${VALID[@]}" -H 'Referer: https://evil.example/form')"
check "English form → English error page" "/en/contact/?fehler=1" "$(post -d lang=en -d anliegen=hack -d name=Max -d email=max@example.com -d nachricht=x -d dsgvo=on -d _ts=$OLD)"
check "English honeypot → English thank-you page" "/en/contact/thanks/" "$(post "${VALID[@]}" -d lang=en -d website=spam)"
check "oversized request → error page" "fehler=1" "$(post "${VALID[@]}" --data-urlencode "nachricht=$(head -c 30000 /dev/zero | tr '\0' 'a')")"
for i in 1 2 3 4 5 6; do post "${VALID[@]}" -H "Origin: $B" > /dev/null; done
check "valid messages reach the mailer (5 attempts logged)" "5" "$(grep -c 'mail failed' "$LOG")"
check "6th message in 15 min is rate-limited (no 6th mail attempt)" "5" "$(grep -c 'mail failed' "$LOG")"
check "no message content in the server log" "0" "$(grep -c 'Hallo' "$LOG")"

echo "Admin panel (admin/index.php)"
J=$(mktemp)
check "login page" "Anmelden" "$(curl -s $B/admin/)"
check "noindex header" "noindex" "$(curl -sI $B/admin/ | tr -d '\r' | grep -i '^x-robots-tag')"
check "strict CSP header" "frame-ancestors 'none'" "$(curl -sI $B/admin/ | tr -d '\r' | grep -i '^content-security-policy')"
check "session cookie HttpOnly + SameSite=Strict" "SameSite=Strict" "$(curl -sI -c /dev/null $B/admin/ | tr -d '\r' | grep -i '^set-cookie' | grep -i httponly)"
check "wrong password rejected" "Passwort falsch" "$(curl -s -c "$J" -b "$J" -d action=login -d password=falsch $B/admin/)"
check "correct password → redirect" "303" "$(curl -s -o /dev/null -w '%{http_code}' -c "$J" -b "$J" -d action=login -d password=test-passwort-123 $B/admin/)"
check "dashboard reachable after login" "Abmelden" "$(curl -s -c "$J" -b "$J" $B/admin/)"
check "save without CSRF token rejected" "Sitzung abgelaufen" "$(curl -s -L -c "$J" -b "$J" -d action=save $B/admin/)"
check "logout ends the session" "Anmelden" "$(curl -s -L -c "$J" -b "$J" "$B/admin/?action=logout")"
check "after logout the dashboard is gone" "Anmelden" "$(curl -s -c "$J" -b "$J" $B/admin/)"
for i in 1 2 3 4 5 6 7 8; do curl -s -o /dev/null -d action=login -d password=falsch $B/admin/; done
check "lock-out after 8 failed logins" "Zu viele Fehlversuche" "$(curl -s -d action=login -d password=test-passwort-123 $B/admin/)"

echo "Build output"
check "no secrets or configs in dist/" "0" "$(grep -rlE 'smtp_pass|github_token|password_hash' dist --include='*.html' --include='*.js' | wc -l | tr -d ' ')"
check "only the two expected PHP entry points" "2" "$(find dist -name '*.php' -not -path '*/vendor/*' | wc -l | tr -d ' ')"

echo
echo "PHP tests: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
