# Verify GEO crawler files on production (subpath hosting).
# Site: https://leapai-webhook.bab.solutions/leap-ai/...
& "$PSScriptRoot\verify-geo.ps1" `
  -BaseUrl "https://leapai-webhook.bab.solutions/leap-ai" `
  -BasePath "/leap-ai"
