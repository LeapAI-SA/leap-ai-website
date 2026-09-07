$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$base = "http://localhost:4000"
$web = "http://localhost:3000"

$login = Invoke-RestMethod -Uri "$base/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@leapai.ai","password":"admin123"}'
$h = @{ Authorization = "Bearer $($login.token)" }

function Upsert-CampaignFromFile($path) {
  $payload = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json
  $slug = $payload.slug
  $existing = Invoke-RestMethod -Uri "$base/api/admin/content?type=campaign" -Headers $h | Where-Object { $_.slug -eq $slug } | Select-Object -First 1
  $body = Get-Content $path -Raw -Encoding UTF8
  if ($existing) {
    return Invoke-RestMethod -Uri "$base/api/admin/content/$($existing.id)" -Method PUT -Headers $h -ContentType "application/json; charset=utf-8" -Body $body
  }
  return Invoke-RestMethod -Uri "$base/api/admin/content" -Method POST -Headers $h -ContentType "application/json; charset=utf-8" -Body $body
}

$whatsapp = Upsert-CampaignFromFile (Join-Path $PSScriptRoot "campaign-test-whatsapp.json")
$lead = Upsert-CampaignFromFile (Join-Path $PSScriptRoot "campaign-test-lead.json")
Write-Host "CMS upserted: whatsapp=$($whatsapp.slug) lead=$($lead.slug)"

$results = @()

function Add-Result($name, $pass, $status, $details) {
  $script:results += [pscustomobject]@{ Test = $name; Pass = $pass; Status = $status; Details = $details }
}

foreach ($t in @(
  @{ Name = "WhatsApp LP AR"; Url = "$web/lp/whatsapp-business-sa"; Must = @("WhatsApp Business with LeapAI", "+966 53 553 3627", "info@leapai.ai", "leapai.ai", "Chat on WhatsApp") },
  @{ Name = "WhatsApp LP EN"; Url = "$web/en/lp/whatsapp-business-sa"; Must = @("WhatsApp Business with LeapAI", "PDPL-ready", "Get started") },
  @{ Name = "Lead LP AR"; Url = "$web/lp/leap-space-demo"; Must = @("Leap Space", "f4f7fb", "Request demo") },
  @{ Name = "Lead LP EN"; Url = "$web/en/lp/leap-space-demo"; Must = @("Book a Leap Space Demo", "Request demo", "Get started") }
)) {
  try {
    $r = Invoke-WebRequest -Uri $t.Url -UseBasicParsing -TimeoutSec 30
    $miss = @($t.Must | Where-Object { -not $r.Content.Contains($_) })
    $ok = ($r.StatusCode -eq 200) -and ($miss.Count -eq 0)
    Add-Result $t.Name $ok $r.StatusCode $(if ($ok) { "OK" } else { "missing: $($miss -join ', ')" })
  } catch {
    Add-Result $t.Name $false "ERR" $_.Exception.Message
  }
}

$testEmail = "campaign.test.$(Get-Date -Format 'HHmmss')@gmail.com"
$testPhone = "+96655" + (Get-Random -Minimum 1000000 -Maximum 9999999)

try {
  $sub = Invoke-RestMethod -Uri "$base/api/public/campaign-lead" -Method POST -ContentType "application/json" -Body (@{
    campaignSlug = "leap-space-demo"
    name = "Ahmed Al-Rashid"
    email = $testEmail
    phone = $testPhone
  } | ConvertTo-Json)
  Add-Result "Lead submit (gmail)" $true 201 "id=$($sub.id) email=$testEmail phone=$testPhone"
} catch {
  Add-Result "Lead submit (gmail)" $false "ERR" $_.ErrorDetails.Message
}

try {
  Invoke-RestMethod -Uri "$base/api/public/campaign-lead" -Method POST -ContentType "application/json" -Body (@{
    campaignSlug = "leap-space-demo"
    name = "Duplicate Test"
    email = $testEmail
    phone = "+9665099999999"
  } | ConvertTo-Json) | Out-Null
  Add-Result "Duplicate block" $false "ERR" "should have been 409"
} catch {
  $dup = $_.ErrorDetails.Message -match "duplicate_lead"
  Add-Result "Duplicate block" $dup 409 "duplicate_lead"
}

$msgs = Invoke-RestMethod -Uri "$base/api/admin/contact-messages" -Headers $h
$found = $msgs | Where-Object { $_.email -eq $testEmail } | Select-Object -First 1
$inboxOk = ($null -ne $found) -and ($found.source -eq "campaign") -and ($found.campaignSlug -eq "leap-space-demo")
Add-Result "Dashboard inbox" $inboxOk "" $(if ($inboxOk) { "name=$($found.name) slug=$($found.campaignSlug)" } else { "lead not found" })

$results | Format-Table -AutoSize
$fail = ($results | Where-Object { -not $_.Pass }).Count
Write-Host ""
Write-Host "OVERALL: $(if ($fail -eq 0) { 'ALL PASSED' } else { "$fail FAILED" })"
Write-Host ""
Write-Host "Live URLs:"
Write-Host "  $web/lp/whatsapp-business-sa"
Write-Host "  $web/en/lp/whatsapp-business-sa"
Write-Host "  $web/lp/leap-space-demo"
Write-Host "  $web/en/lp/leap-space-demo"
Write-Host "  $web/dashboard/contact"
