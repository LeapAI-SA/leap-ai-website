param(
  [string]$WebBase = "http://localhost:3000/leap-ai",
  [string]$ApiBase = "http://localhost:4000",
  [string]$Email = "admin@leapai.ai",
  [string]$Password = "admin123"
)

$ErrorActionPreference = "Continue"
$results = @()
$token = $null
$testId = $null
$testSlug = "admin-test-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

function Add-Result($name, $status, $detail = "") {
  $script:results += [pscustomobject]@{ Test = $name; Status = $status; Detail = $detail }
  if ($status -eq "PASS") { Write-Host "[PASS] $name" -ForegroundColor Green }
  else { Write-Host "[FAIL] $name - $detail" -ForegroundColor Red }
}

function Test-Page($path, $expectPattern = $null, [switch]$ClientRendered) {
  $url = "$WebBase$path"
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    if ($r.StatusCode -ne 200) { throw "HTTP $($r.StatusCode)" }
    if ($ClientRendered) {
      if ($r.Content -notmatch "dash-theme|Checking access") {
        throw "missing dashboard shell markup"
      }
    } elseif ($expectPattern -and $r.Content -notmatch $expectPattern) {
      throw "missing pattern: $expectPattern"
    }
    Add-Result "Page: $path" "PASS"
    return $true
  } catch {
    Add-Result "Page: $path" "FAIL" $_.Exception.Message
    return $false
  }
}

Write-Host "`n=== Admin pages & API test ===" -ForegroundColor Cyan
Write-Host "Web: $WebBase" -ForegroundColor Gray
Write-Host "API: $ApiBase`n" -ForegroundColor Gray

try {
  $login = Invoke-RestMethod -Uri "$ApiBase/api/auth/login" -Method POST -ContentType "application/json" -Body (@{ email = $Email; password = $Password } | ConvertTo-Json)
  if (-not $login.token) { throw "No token returned" }
  $token = $login.token
  Add-Result "API: login" "PASS"
} catch {
  Add-Result "API: login" "FAIL" $_.Exception.Message
}

$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

$adminPages = @(
  @{ path = "/dashboard/login"; expect = "Sign in|Login|admin"; client = $false },
  @{ path = "/dashboard"; client = $true },
  @{ path = "/dashboard/settings"; client = $true },
  @{ path = "/dashboard/geo"; client = $true },
  @{ path = "/dashboard/contact"; client = $true },
  @{ path = "/dashboard/content"; client = $true },
  @{ path = "/dashboard/content/new"; client = $true }
)

foreach ($page in $adminPages) {
  if ($page.client) {
    Test-Page $page.path -ClientRendered | Out-Null
  } else {
    Test-Page $page.path $page.expect | Out-Null
  }
}

try {
  $items = Invoke-RestMethod -Uri "$ApiBase/api/admin/content" -Headers $headers
  if ($items.Count -lt 1) { throw "no content items" }
  Add-Result "API: GET /admin/content ($($items.Count) items)" "PASS"
  $editId = $items[0].id
  Test-Page "/dashboard/content/$editId" -ClientRendered | Out-Null
} catch {
  Add-Result "API: GET /admin/content" "FAIL" $_.Exception.Message
  Add-Result "Page: /dashboard/content/[id]" "FAIL" "skipped (no content id)"
}

foreach ($endpoint in @(
  @{ name = "GET /admin/settings"; url = "$ApiBase/api/admin/settings"; method = "GET" },
  @{ name = "GET /admin/contact-messages"; url = "$ApiBase/api/admin/contact-messages"; method = "GET" }
)) {
  try {
    Invoke-RestMethod -Uri $endpoint.url -Method $endpoint.method -Headers $headers | Out-Null
    Add-Result "API: $($endpoint.name)" "PASS"
  } catch {
    Add-Result "API: $($endpoint.name)" "FAIL" $_.Exception.Message
  }
}

try {
  $body = @{
    type = "product"
    slug = $testSlug
    title = @{ ar = "Test AR"; en = "Admin Test Page" }
    excerpt = @{ ar = "Excerpt AR"; en = "Summary" }
    description = @{ ar = "Desc AR"; en = "Description" }
    features = @{ ar = @("Feature AR"); en = @("Feature EN") }
    image = ""
    published = $true
    sortOrder = 999
  } | ConvertTo-Json -Depth 6 -Compress
  $created = Invoke-RestMethod -Uri "$ApiBase/api/admin/content" -Method POST -Headers $headers -Body $body
  $testId = $created.id
  Add-Result "API: POST /admin/content (create)" "PASS"
} catch {
  Add-Result "API: POST /admin/content (create)" "FAIL" $_.Exception.Message
}

if ($testId) {
  try {
    Invoke-RestMethod -Uri "$ApiBase/api/admin/content/$testId" -Method GET -Headers $headers | Out-Null
    Add-Result "API: GET /admin/content/:id" "PASS"
  } catch {
    Add-Result "API: GET /admin/content/:id" "FAIL" $_.Exception.Message
  }

  try {
    $body = '{"title":{"ar":"Updated AR","en":"Updated EN"}}'
    Invoke-RestMethod -Uri "$ApiBase/api/admin/content/$testId" -Method PUT -Headers $headers -Body $body | Out-Null
    Add-Result "API: PUT /admin/content/:id" "PASS"
  } catch {
    Add-Result "API: PUT /admin/content/:id" "FAIL" $_.Exception.Message
  }

  Test-Page "/dashboard/content/$testId" -ClientRendered | Out-Null
}

try {
  $proxy = Invoke-RestMethod -Uri "$WebBase/backend/api/admin/settings" -Headers $headers
  if (-not $proxy.hero) { throw "proxy settings missing hero" }
  Add-Result "Proxy: /leap-ai/backend/api/admin/settings" "PASS"
} catch {
  Add-Result "Proxy: /leap-ai/backend/api/admin/settings" "FAIL" $_.Exception.Message
}

if ($testId) {
  try {
    Invoke-RestMethod -Uri "$ApiBase/api/admin/content/$testId" -Method DELETE -Headers $headers | Out-Null
    Add-Result "API: DELETE /admin/content/:id (cleanup)" "PASS"
  } catch {
    Add-Result "API: DELETE /admin/content/:id (cleanup)" "FAIL" $_.Exception.Message
  }
}

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize -Wrap
$pass = @($results | Where-Object Status -eq "PASS").Count
$fail = @($results | Where-Object Status -eq "FAIL").Count
Write-Host "Passed: $pass  Failed: $fail  Total: $($results.Count)" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
if ($fail -gt 0) { exit 1 }
exit 0
