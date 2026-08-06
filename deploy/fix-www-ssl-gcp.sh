#!/usr/bin/env bash
# Expand / create a Google-managed SSL certificate that covers apex + www,
# then attach it to the global HTTPS target proxy (Google Cloud Load Balancer).
#
# Use when https://www.leapai.ai shows ERR_CERT_COMMON_NAME_INVALID and
# responses include "Via: 1.1 google". Certbot on the VM alone will NOT fix
# browser TLS if the LB terminates HTTPS.
#
# Prerequisites: gcloud auth with access to the production project.
#
#   gcloud config set project YOUR_PROD_PROJECT
#   bash deploy/fix-www-ssl-gcp.sh
#
# Optional env:
#   CERT_NAME=leapai-ai-cert-www
#   PROXY_NAME=...   (auto-detected if only one global HTTPS proxy exists)
#   DOMAINS="leapai.ai,www.leapai.ai"
set -euo pipefail

CERT_NAME="${CERT_NAME:-leapai-ai-cert-www}"
DOMAINS="${DOMAINS:-leapai.ai,www.leapai.ai}"
PROJECT="$(gcloud config get-value project 2>/dev/null || true)"

if [[ -z "$PROJECT" || "$PROJECT" == "(unset)" ]]; then
  echo "Set a project first: gcloud config set project YOUR_PROD_PROJECT" >&2
  exit 1
fi

echo "Project: $PROJECT"
echo "Domains: $DOMAINS"
echo "Cert:    $CERT_NAME"

existing=$(gcloud compute ssl-certificates describe "$CERT_NAME" --global --format='value(name)' 2>/dev/null || true)
if [[ -z "$existing" ]]; then
  echo "==> Creating Google-managed certificate $CERT_NAME"
  gcloud compute ssl-certificates create "$CERT_NAME" \
    --domains="$DOMAINS" \
    --global
else
  echo "==> Certificate $CERT_NAME already exists (Google-managed certs are immutable)."
  echo "    Creating a new name if domains differ, or wait until PROVISIONING → ACTIVE."
  gcloud compute ssl-certificates describe "$CERT_NAME" --global \
    --format='yaml(type,managed.status,managed.domains,managed.domainStatus)'
fi

if [[ -z "${PROXY_NAME:-}" ]]; then
  mapfile -t proxies < <(gcloud compute target-https-proxies list --global --format='value(name)')
  if [[ "${#proxies[@]}" -eq 1 ]]; then
    PROXY_NAME="${proxies[0]}"
  elif [[ "${#proxies[@]}" -eq 0 ]]; then
    echo "No global HTTPS target proxies found in $PROJECT." >&2
    echo "List projects you can access, then switch:" >&2
    echo "  gcloud projects list" >&2
    echo "  gcloud config set project CORRECT_PROJECT" >&2
    exit 1
  else
    echo "Multiple HTTPS proxies — set PROXY_NAME and re-run:" >&2
    printf '  %s\n' "${proxies[@]}" >&2
    exit 1
  fi
fi

echo "==> Attaching $CERT_NAME to target-https-proxy $PROXY_NAME"
# Preserve any other certs already on the proxy, append ours if missing
current=$(gcloud compute target-https-proxies describe "$PROXY_NAME" --global \
  --format='value(sslCertificates)' | tr ';' '\n' | sed 's|.*/||' | grep -v '^$' || true)
certs=()
while IFS= read -r c; do
  [[ -n "$c" ]] && certs+=("$c")
done <<< "$current"
if [[ ! " ${certs[*]} " =~ " ${CERT_NAME} " ]]; then
  certs+=("$CERT_NAME")
fi
cert_csv=$(IFS=,; echo "${certs[*]}")

gcloud compute target-https-proxies update "$PROXY_NAME" \
  --global \
  --ssl-certificates="$cert_csv"

echo "==> Certificate status (wait until ACTIVE — can take 15–60+ minutes):"
gcloud compute ssl-certificates describe "$CERT_NAME" --global \
  --format='yaml(managed.status,managed.domains,managed.domainStatus)'

echo
echo "Also apply nginx www→apex on the backend VM:"
echo "  sudo bash deploy/fix-www-ssl.sh"
echo "Then verify:"
echo "  bash deploy/verify-www-ssl.sh"
