#!/usr/bin/env bash
# Ensure WordPress / PHP cannot serve /en* on the LeapAI host.
# Next.js owns all public paths (including legacy /en → canonical redirects).
#
# Run on the Ubuntu TLS host:
#   sudo bash deploy/kill-wordpress-en.sh
set -euo pipefail

echo "==> Checking nginx for PHP / WordPress under /en or document roots"
fail=0

if [[ ! -d /etc/nginx ]]; then
  echo "No /etc/nginx on this machine — run on the production Ubuntu host." >&2
  exit 1
fi

# Flag dangerous configs
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  if grep -nE 'wp-content|wp-includes|wordpress|php[0-9]?-fpm|fastcgi_pass|location\s+\^~\s+/en' "$f" 2>/dev/null | grep -viE '^\s*#' >/tmp/wp-en-hits.$$ 2>/dev/null; then
    if [[ -s /tmp/wp-en-hits.$$ ]]; then
      echo "WARN: $f may still reference PHP/WordPress or /en:"
      cat /tmp/wp-en-hits.$$
      fail=1
    fi
  fi
  rm -f /tmp/wp-en-hits.$$
done < <(find /etc/nginx -type f \( -name '*.conf' -o -path '*/sites-enabled/*' -o -path '*/sites-available/*' \) 2>/dev/null)

for d in /var/www/html /var/www/leapai /var/www/wordpress /var/www/leapai.ai; do
  if [[ -f "$d/wp-config.php" ]] || [[ -d "$d/wp-content" ]]; then
    echo "WARN: WordPress tree still present at $d — disable the vhost and move/rename this tree offline."
    fail=1
  fi
done

TARGET="${NGINX_SITE_CONF:-/etc/nginx/sites-available/leapai.ai}"
CONF_SRC="$(cd "$(dirname "$0")" && pwd)/nginx-root-hosting.conf"

if [[ -f "$CONF_SRC" ]]; then
  echo "==> Ensuring site config proxies everything to Next (:3000), never PHP"
  if [[ -f "$TARGET" ]]; then
    cp -a "$TARGET" "${TARGET}.bak.$(date +%Y%m%d%H%M%S)"
  fi
  cp "$CONF_SRC" "$TARGET"
  ln -sfn "$TARGET" /etc/nginx/sites-enabled/leapai.ai
  # Disable common alternate WP sites if enabled
  for alt in default wordpress leapai-wp html; do
    if [[ -L "/etc/nginx/sites-enabled/$alt" ]] || [[ -f "/etc/nginx/sites-enabled/$alt" ]]; then
      echo "Disabling sites-enabled/$alt (may have been WordPress)"
      rm -f "/etc/nginx/sites-enabled/$alt"
    fi
  done
  nginx -t
  systemctl reload nginx
fi

echo "==> Smoke: /en must not return WordPress HTML"
body=$(curl -sL --max-redirs 5 "https://leapai.ai/en/leap-ticketing/" | head -c 8000 || true)
if echo "$body" | grep -qiE 'wp-content|wp-includes|generator" content="WordPress'; then
  echo "FAIL: WordPress HTML still visible via /en/leap-ticketing/"
  exit 1
fi
echo "OK: no WordPress markers in /en/leap-ticketing/ response body"

if [[ "$fail" -ne 0 ]]; then
  echo
  echo "Review WARN lines above. After disabling WP, re-run this script."
  echo "Legacy slug maps live in the Next app (frontend/lib/legacy-redirects.mjs)."
  exit 1
fi

echo "Done. WordPress should not serve public /en traffic."
