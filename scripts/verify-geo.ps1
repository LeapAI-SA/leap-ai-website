$ErrorActionPreference = "Stop"
$base = "http://localhost:3000"

function Test-Url($path, $expectContent = $null) {
  $url = "$base$path"
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $ok = $r.StatusCode -eq 200
    if ($expectContent -and $r.Content -notmatch $expectContent) {
      Write-Host "FAIL $path (missing: $expectContent)" -ForegroundColor Red
      return $false
    }
    Write-Host "OK   $path ($($r.StatusCode))" -ForegroundColor Green
    return $true
  } catch {
    Write-Host "FAIL $path ($_)" -ForegroundColor Red
    return $false
  }
}

Write-Host "`n=== GEO verification ===`n" -ForegroundColor Cyan

$passed = 0
$total = 0

$checks = @(
  @{ path = "/llms.txt"; expect = "LeapAI" },
  @{ path = "/llms-full.txt"; expect = "Frequently asked questions" },
  @{ path = "/robots.txt"; expect = "GPTBot" },
  @{ path = "/sitemap.xml"; expect = "llms.txt" },
  @{ path = "/"; expect = "FAQPage" },
  @{ path = "/"; expect = 'id="faq"' },
  @{ path = "/solutions/nlu-chatbot"; expect = "Question" }
)

foreach ($c in $checks) {
  $total++
  if (Test-Url $c.path $c.expect) { $passed++ }
}

Write-Host "`n$passed / $total GEO checks passed`n" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
if ($passed -ne $total) { exit 1 }
