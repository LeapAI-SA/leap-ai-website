param(
  [string]$BaseUrl = "",
  [string]$BasePath = ""
)

$ErrorActionPreference = "Stop"

if (-not $BasePath) {
  $BasePath = if ($env:NEXT_PUBLIC_BASE_PATH) { $env:NEXT_PUBLIC_BASE_PATH.TrimEnd("/") } else { "" }
}

if (-not $BaseUrl) {
  if ($env:GEO_TEST_URL) {
    $BaseUrl = $env:GEO_TEST_URL.TrimEnd("/")
  } else {
    $BaseUrl = "http://localhost:3002$BasePath"
  }
}

function Test-Url($path, $expectContent = $null, [switch]$RejectLocalhost) {
  $url = "$BaseUrl$path"
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $ok = $r.StatusCode -eq 200
    if ($expectContent -and $r.Content -notmatch $expectContent) {
      Write-Host "FAIL $url (missing: $expectContent)" -ForegroundColor Red
      return $false
    }
    if ($RejectLocalhost -and $r.Content -match "localhost|127\.0\.0\.1") {
      Write-Host "FAIL $url (contains localhost URLs - set NEXT_PUBLIC_SITE_URL on server)" -ForegroundColor Red
      return $false
    }
    Write-Host "OK   $url ($($r.StatusCode))" -ForegroundColor Green
    return $true
  } catch {
    Write-Host "FAIL $url" -ForegroundColor Red
    return $false
  }
}

Write-Host "`n=== GEO verification ===" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl`n" -ForegroundColor Gray

$rejectLocalhost = $BaseUrl -notmatch "localhost|127\.0\.0\.1"
if ($rejectLocalhost) {
  Write-Host "Checking URLs do not contain localhost...`n" -ForegroundColor Gray
}

$passed = 0
$total = 0

$checks = @(
  @{ path = "/llms.txt"; expect = "AI-native" },
  @{ path = "/llms-full.txt"; expect = "Frequently asked questions" },
  @{ path = "/llms-small.txt"; expect = "AI-native" },
  @{ path = "/robots.txt"; expect = "GPTBot" },
  @{ path = "/robots.txt"; expect = "Google-CloudVertexBot" },
  @{ path = "/robots.txt"; expect = "Bingbot" },
  @{ path = "/sitemap.xml"; expect = "news/2026/08/09/leap-ai-saudi-ai-native-cx-platform" },
  @{ path = "/.well-known/ai.txt"; expect = "LLMs-Txt" }
)

foreach ($c in $checks) {
  $total++
  if (Test-Url $c.path $c.expect -RejectLocalhost:$rejectLocalhost) { $passed++ }
}

Write-Host "`n$passed / $total GEO crawler checks passed`n" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
if ($passed -ne $total) { exit 1 }
exit 0
