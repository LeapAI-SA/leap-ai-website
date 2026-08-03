#!/usr/bin/env bash
# Ensure LeapAI nginx upstream is host port 3000 (Docker frontend).
# Run on the Ubuntu host that terminates TLS for leapai.ai:
#   sudo bash deploy/apply-nginx-3000.sh
set -euo pipefail

CONF_SRC="$(cd "$(dirname "$0")" && pwd)/nginx-root-hosting.conf"
TARGET="${NGINX_SITE_CONF:-/etc/nginx/sites-available/leapai.ai}"

if [[ ! -f "$CONF_SRC" ]]; then
  echo "Missing $CONF_SRC" >&2
  exit 1
fi

patch_file() {
  local f="$1"
  if grep -q 'proxy_pass http://127.0.0.1:3001;' "$f"; then
    echo "Patching $f :3001 → :3000"
    sudo sed -i 's|proxy_pass http://127.0.0.1:3001;|proxy_pass http://127.0.0.1:3000;|g' "$f"
  elif grep -q 'proxy_pass http://127.0.0.1:3000;' "$f"; then
    echo "$f already points to :3000"
  else
    echo "No matching proxy_pass in $f — review manually." >&2
    grep -n 'proxy_pass' "$f" || true
    return 1
  fi
}

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
    patch_file "$f"
  done <<< "$matches"
else
  patch_file "$TARGET"
fi

sudo nginx -t
sudo systemctl reload nginx
echo "nginx reloaded. Checking upstream..."
curl -sI "http://127.0.0.1:3000/" | head -n 5 || true
curl -sI "https://leapai.ai/" | head -n 8 || true
