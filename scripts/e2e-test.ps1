$ErrorActionPreference = "Continue"
$API = "http://localhost:4000"
$WEB = "http://localhost:3000"
$results = @()
$token = $null
$testId = $null
$testSlug = "e2e-test-page-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

function Add-Result($name, $status, $detail = "") {
  $script:results += [pscustomobject]@{ Test = $name; Status = $status; Detail = $detail }
  if ($status -eq "PASS") { Write-Host "[PASS] $name" -ForegroundColor Green }
  else { Write-Host "[FAIL] $name - $detail" -ForegroundColor Red }
}

try {
  $login = Invoke-RestMethod -Uri "$API/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@leapai.ai","password":"admin123"}'
  if (-not $login.token) { throw "No token" }
  $token = $login.token
  Add-Result "Admin login" "PASS"
} catch { Add-Result "Admin login" "FAIL" $_.Exception.Message }

$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

try {
  $h = Invoke-RestMethod -Uri "$API/api/public/health"
  if ($h.status -ne "ok") { throw "not ok" }
  Add-Result "Public health" "PASS"
} catch { Add-Result "Public health" "FAIL" $_.Exception.Message }

try {
  $s = Invoke-RestMethod -Uri "$API/api/public/settings"
  if (-not $s.hero) { throw "no hero" }
  if (-not $s.images) { throw "images field missing - rebuild docker backend" }
  Add-Result "Public settings (images field)" "PASS"
} catch { Add-Result "Public settings (images field)" "FAIL" $_.Exception.Message }

foreach ($type in @("solution", "product", "use-case")) {
  try {
    $items = Invoke-RestMethod -Uri "$API/api/public/content?type=$type"
    if ($items.Count -lt 1) { throw "empty" }
    Add-Result "Public content: $type ($($items.Count) items)" "PASS"
  } catch { Add-Result "Public content: $type" "FAIL" $_.Exception.Message }
}

try {
  $items = Invoke-RestMethod -Uri "$API/api/admin/content" -Headers $headers
  if ($items.Count -lt 1) { throw "empty" }
  Add-Result "Admin list content ($($items.Count) items)" "PASS"
} catch { Add-Result "Admin list content" "FAIL" $_.Exception.Message }

try {
  $body = '{"type":"product","slug":"' + $testSlug + '","title":{"ar":"Test AR","en":"E2E Test Page"},"excerpt":{"ar":"Excerpt AR","en":"Summary"},"description":{"ar":"Desc AR","en":"Description"},"features":{"ar":["Feature AR"],"en":["Feature"]},"image":"","published":true,"sortOrder":999}'
  $created = Invoke-RestMethod -Uri "$API/api/admin/content" -Method POST -Headers $headers -Body $body
  $testId = $created.id
  Add-Result "Create new content page" "PASS"
} catch { Add-Result "Create new content page" "FAIL" $_.Exception.Message }

try {
  Start-Sleep -Seconds 1
  $item = Invoke-RestMethod -Uri "$API/api/public/content/$testSlug"
  if ($item.slug -ne $testSlug) { throw "slug mismatch" }
  Add-Result "Public fetch new page by slug" "PASS"
} catch { Add-Result "Public fetch new page by slug" "FAIL" $_.Exception.Message }

try {
  $body = '{"image":"/hero-dashboard.png"}'
  $updated = Invoke-RestMethod -Uri "$API/api/admin/content/$testId" -Method PUT -Headers $headers -Body $body
  if ($updated.image -ne "/hero-dashboard.png") { throw "image not saved" }
  Add-Result "Update content image field" "PASS"
} catch { Add-Result "Update content image field" "FAIL" $_.Exception.Message }

try {
  $logoPath = Join-Path $PSScriptRoot "..\frontend\public\leapai-logo.png"
  if (-not (Test-Path $logoPath)) { throw "test file missing" }
  $uploadJson = curl.exe -s -X POST "$API/api/admin/upload" -H "Authorization: Bearer $token" -F "file=@$logoPath"
  $upload = $uploadJson | ConvertFrom-Json
  if (-not $upload.url) { throw "no url: $uploadJson" }
  $img = Invoke-WebRequest -Uri "$API$($upload.url)" -UseBasicParsing
  if ($img.StatusCode -ne 200) { throw "file not served" }
  Add-Result "Image upload + serve" "PASS"
} catch { Add-Result "Image upload + serve" "FAIL" $_.Exception.Message }

try {
  $body = '{"images":{"hero":"/hero-dashboard.png","ticketOverview":"/sections/ticket-overview.png","omniChannel":"/sections/omni-channel.png","logo":"/leapai-logo.png"}}'
  $updated = Invoke-RestMethod -Uri "$API/api/admin/settings" -Method PUT -Headers $headers -Body $body
  if (-not $updated.images) { throw "no images in response" }
  Add-Result "Update site settings images" "PASS"
} catch { Add-Result "Update site settings images" "FAIL" $_.Exception.Message }

$pages = @(
  "/",
  "/dashboard/login",
  "/dashboard/content",
  "/dashboard/content/new",
  "/dashboard/settings",
  "/solutions",
  "/products",
  "/use-cases",
  "/solutions/digital-channels",
  "/products/$testSlug"
)
foreach ($p in $pages) {
  try {
    $r = Invoke-WebRequest -Uri "$WEB$p" -UseBasicParsing -TimeoutSec 20
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
    Add-Result "Frontend: $p" "PASS"
  } catch { Add-Result "Frontend: $p" "FAIL" $_.Exception.Message }
}

try {
  Push-Location (Join-Path $PSScriptRoot "..\frontend")
  & npx tsc --noEmit 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "tsc failed" }
  Add-Result "Frontend TypeScript" "PASS"
  Pop-Location
} catch { Add-Result "Frontend TypeScript" "FAIL" $_.Exception.Message; Pop-Location -ErrorAction SilentlyContinue }

try {
  Push-Location (Join-Path $PSScriptRoot "..\backend")
  & npx tsc --noEmit 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "tsc failed" }
  Add-Result "Backend TypeScript" "PASS"
  Pop-Location
} catch { Add-Result "Backend TypeScript" "FAIL" $_.Exception.Message; Pop-Location -ErrorAction SilentlyContinue }

if ($testId) {
  try {
    Invoke-RestMethod -Uri "$API/api/admin/content/$testId" -Method DELETE -Headers $headers | Out-Null
    Add-Result "Cleanup test content" "PASS"
  } catch { Add-Result "Cleanup test content" "FAIL" $_.Exception.Message }
}

Write-Host ""
Write-Host "=== TEST SUMMARY ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize -Wrap
$pass = ($results | Where-Object Status -eq "PASS").Count
$fail = ($results | Where-Object Status -eq "FAIL").Count
Write-Host "Passed: $pass  Failed: $fail  Total: $($results.Count)"
if ($fail -gt 0) { exit 1 }
