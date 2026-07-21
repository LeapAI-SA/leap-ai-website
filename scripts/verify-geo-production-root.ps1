# Verify GEO crawler files at DOMAIN ROOT (after nginx redirects are configured).
# Requires deploy/nginx-crawler-root.conf on the server.
& "$PSScriptRoot\verify-geo.ps1" `
  -BaseUrl "https://leapai-webhook.bab.solutions" `
  -BasePath ""
