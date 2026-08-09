# Verify GEO crawler files on production (domain root hosting).
& "$PSScriptRoot\verify-geo.ps1" `
  -BaseUrl "https://leapai.ai" `
  -BasePath ""
