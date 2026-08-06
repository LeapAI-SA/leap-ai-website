#!/usr/bin/env bash
# Verify apex TLS + www→apex redirect (run anywhere with curl).
#   bash deploy/verify-www-ssl.sh
set -euo pipefail

APEX="${DOMAIN_APEX:-leapai.ai}"
WWW="${DOMAIN_WWW:-www.leapai.ai}"
fail=0

check() {
  local label="$1"
  shift
  echo "==> $label"
  if "$@"; then
    echo "OK"
  else
    echo "FAIL"
    fail=1
  fi
  echo
}

echo "Verifying TLS / redirects for ${APEX} and ${WWW}"
echo

# Apex must be 200 with valid cert
apex_code=$(curl -sS -o /dev/null -w "%{http_code}" "https://${APEX}/" || echo "000")
if [[ "$apex_code" == "200" ]]; then
  echo "OK apex https://${APEX}/ → HTTP ${apex_code}"
else
  echo "FAIL apex https://${APEX}/ → HTTP ${apex_code} (want 200)"
  fail=1
fi

# www must succeed TLS (no cert error) and redirect to apex
www_headers=$(curl -sS -D - -o /dev/null "https://${WWW}/" 2>&1) || www_headers="CURL_ERROR"
if echo "$www_headers" | grep -qiE 'SSL|certificate|WRONG_PRINCIPAL|CERT_COMMON_NAME'; then
  echo "FAIL www TLS error:"
  echo "$www_headers" | head -n 20
  fail=1
else
  www_code=$(echo "$www_headers" | awk '/^HTTP/{code=$2} END{print code}')
  location=$(echo "$www_headers" | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r' | tail -n 1)
  echo "www https://${WWW}/ → HTTP ${www_code}"
  echo "Location: ${location:-"(none)"}"
  if [[ "$www_code" =~ ^30[12378]$ ]] && echo "${location}" | grep -q "https://${APEX}"; then
    echo "OK www redirects to apex"
  elif [[ "$www_code" == "200" ]]; then
    echo "FAIL www returned 200 without redirect — apply www server block from nginx-root-hosting.conf"
    fail=1
  else
    echo "FAIL expected 301/302 to https://${APEX}/..."
    fail=1
  fi
fi

echo
if [[ "$fail" -eq 0 ]]; then
  echo "All www SSL checks passed."
  exit 0
fi
echo "Checks failed. On the Ubuntu TLS host run: sudo bash deploy/fix-www-ssl.sh"
echo "If Via: google and cert still wrong, expand the Google LB managed certificate too."
exit 1
