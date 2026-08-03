#!/usr/bin/env bash
# Apply LeapAI nginx upstream to host port 3001 (Docker frontend).
# Run on the Ubuntu host that terminates TLS for leapai.ai:
#   sudo bash deploy/apply-nginx-3001.sh
set -euo pipefail

CONF_SRC="$(cd "$(dirname "$0")" && pwd)/nginx-root-hosting.conf"
TARGET="${NGINX_SITE_CONF:-/etc/nginx/sites-available/leapai.ai}"

if [[ ! -f "$CONF_SRC" ]]; then
  echo "Missing $CONF_SRC" >&2
  exit 1
fi

if [[ ! -f "$TARGET" ]]; then
  echo "Target $TARGET not found."
  echo "Searching for proxy_pass to update in /etc/nginx ..."
  matches=$(grep -RIl 'proxy_pass http://127.0.0.1:300[01]' /etc/nginx 2>/dev/null || true)
  if [[ -z "$matches" ]]; then
    echo "No nginx site with 127.0.0.1:3000/3001 found. Copy manually:"
    echo "  sudo cp $CONF_SRC $TARGET"
    echo "  sudo ln -sf $TARGET /etc/nginx/sites-enabled/leapai.ai"
    exit 1
  fi
  while IFS= read -r f; do
    echo "Updating $f"
    sudo sed -i 's|proxy_pass http://127.0.0.1:3000;|proxy_pass http://127.0.0.1:3001;|g' "$f"
  done <<< "$matches"
else
  # Prefer in-place upstream fix so existing SSL paths stay intact
  if grep -q 'proxy_pass http://127.0.0.1:3000;' "$TARGET"; then
    echo "Patching $TARGET :3000 → :3001"
    sudo sed -i 's|proxy_pass http://127.0.0.1:3000;|proxy_pass http://127.0.0.1:3001;|g' "$TARGET"
  elif grep -q 'proxy_pass http://127.0.0.1:3001;' "$TARGET"; then
    echo "$TARGET already points to :3001"
  else
    echo "No matching proxy_pass in $TARGET — review manually." >&2
    grep -n 'proxy_pass' "$TARGET" || true
    exit 1
  fi
fi

sudo nginx -t
sudo systemctl reload nginx
echo "nginx reloaded. Checking upstream..."
curl -sI "http://127.0.0.1:3001/" | head -n 5 || true
curl -sI "https://leapai.ai/" | head -n 8 || true
