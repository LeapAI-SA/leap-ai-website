#!/usr/bin/env bash
# Expand Let's Encrypt cert to cover leapai.ai + www.leapai.ai, then apply
# www→apex HTTPS redirect via deploy/nginx-root-hosting.conf.
#
# Run on the Ubuntu host that terminates TLS (behind Google LB if present):
#   sudo bash deploy/fix-www-ssl.sh
# Optional:
#   CERTBOT_EMAIL=ops@leapai.ai sudo -E bash deploy/fix-www-ssl.sh
#   NGINX_SITE_CONF=/etc/nginx/sites-available/leapai.ai sudo -E bash deploy/fix-www-ssl.sh
#
# If TLS is terminated on Google Cloud HTTPS LB instead of nginx, also update
# the Google-managed certificate to include www.leapai.ai (this script only
# fixes nginx + Certbot on the VM).
set -euo pipefail

DOMAIN_APEX="${DOMAIN_APEX:-leapai.ai}"
DOMAIN_WWW="${DOMAIN_WWW:-www.leapai.ai}"
CERT_NAME="${CERT_NAME:-leapai.ai}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-admin@leapai.ai}"
CONF_SRC="$(cd "$(dirname "$0")" && pwd)/nginx-root-hosting.conf"
TARGET="${NGINX_SITE_CONF:-/etc/nginx/sites-available/${DOMAIN_APEX}}"
ENABLED="/etc/nginx/sites-enabled/${DOMAIN_APEX}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/fix-www-ssl.sh" >&2
  exit 1
fi

if [[ ! -f "$CONF_SRC" ]]; then
  echo "Missing $CONF_SRC" >&2
  exit 1
fi

if ! command -v certbot >/dev/null 2>&1; then
  echo "certbot not found. Install: apt-get update && apt-get install -y certbot python3-certbot-nginx" >&2
  exit 1
fi

echo "==> Expanding / issuing cert for ${DOMAIN_APEX} + ${DOMAIN_WWW}"
certbot certonly \
  --nginx \
  --cert-name "$CERT_NAME" \
  -d "$DOMAIN_APEX" \
  -d "$DOMAIN_WWW" \
  --expand \
  --non-interactive \
  --agree-tos \
  -m "$CERTBOT_EMAIL" \
  || certbot certonly \
    --nginx \
    -d "$DOMAIN_APEX" \
    -d "$DOMAIN_WWW" \
    --non-interactive \
    --agree-tos \
    -m "$CERTBOT_EMAIL"

LIVE="/etc/letsencrypt/live/${CERT_NAME}"
if [[ ! -f "${LIVE}/fullchain.pem" || ! -f "${LIVE}/privkey.pem" ]]; then
  echo "Expected cert files missing under ${LIVE}" >&2
  ls -la /etc/letsencrypt/live || true
  exit 1
fi

echo "==> Certificate SANs (openssl):"
openssl x509 -in "${LIVE}/fullchain.pem" -noout -text 2>/dev/null \
  | grep -A1 'Subject Alternative Name' || true

echo "==> Installing nginx site config → ${TARGET}"
cp -a "$TARGET" "${TARGET}.bak.$(date +%Y%m%d%H%M%S)" 2>/dev/null || true
cp "$CONF_SRC" "$TARGET"

# Keep cert paths aligned with CERT_NAME if different from default leapai.ai
if [[ "$CERT_NAME" != "leapai.ai" ]]; then
  sed -i "s|/etc/letsencrypt/live/leapai.ai/|/etc/letsencrypt/live/${CERT_NAME}/|g" "$TARGET"
fi

mkdir -p /etc/nginx/sites-enabled
ln -sfn "$TARGET" "$ENABLED"

# Ensure SSL helper files exist (created by certbot --nginx on first run)
if [[ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]]; then
  echo "Missing /etc/letsencrypt/options-ssl-nginx.conf — reinstall certbot nginx plugin or comment those includes." >&2
fi

echo "==> nginx -t && reload"
nginx -t
systemctl reload nginx

echo "==> Local checks"
curl -sI "http://127.0.0.1:3000/" | head -n 5 || true
echo
echo "==> Public checks (must show valid TLS + www→apex 301)"
set +e
curl -sI "https://${DOMAIN_APEX}/" | head -n 10
echo
curl -sI "https://${DOMAIN_WWW}/" | head -n 15
set -e

echo
echo "Done. Expected:"
echo "  https://${DOMAIN_APEX}/  → HTTP 200"
echo "  https://${DOMAIN_WWW}/   → HTTP 301 Location: https://${DOMAIN_APEX}/..."
echo "If www still shows ERR_CERT_COMMON_NAME_INVALID, TLS is terminating on Google LB —"
echo "add ${DOMAIN_WWW} to the Google-managed cert attached to the HTTPS proxy."
