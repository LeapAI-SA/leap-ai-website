# Verify apex TLS + www->apex redirect (Windows / PowerShell).
#   powershell -ExecutionPolicy Bypass -File deploy/verify-www-ssl.ps1
$ErrorActionPreference = "Continue"
$Apex = if ($env:DOMAIN_APEX) { $env:DOMAIN_APEX } else { "leapai.ai" }
$Www = if ($env:DOMAIN_WWW) { $env:DOMAIN_WWW } else { "www.leapai.ai" }
$fail = 0

Write-Host "Verifying TLS / redirects for $Apex and $Www"
Write-Host ""

$apexOut = & curl.exe -sI "https://$Apex/" 2>&1 | Out-String
$apexCode = $LASTEXITCODE
if ($apexCode -eq 0 -and $apexOut -match "HTTP/\S+\s+200") {
  Write-Host "OK apex https://$Apex/ -> HTTP 200"
} else {
  Write-Host "FAIL apex https://$Apex/ (curl exit $apexCode):"
  Write-Host $apexOut
  $fail = 1
}

Write-Host ""
$curlOut = & curl.exe -sI "https://$Www/" 2>&1 | Out-String
$curlCode = $LASTEXITCODE
if ($curlCode -ne 0 -or $curlOut -match "SSL|certificate|WRONG_PRINCIPAL|CERT_COMMON_NAME|schannel") {
  Write-Host "FAIL www TLS / certificate error (curl exit $curlCode)"
  if ($curlOut.Trim().Length -gt 0) { Write-Host $curlOut }
  $fail = 1
} else {
  Write-Host $curlOut
  if ($curlOut -match "HTTP/\S+\s+30[12378]" -and $curlOut -match [regex]::Escape("https://$Apex")) {
    Write-Host "OK www redirects to apex"
  } elseif ($curlOut -match "HTTP/\S+\s+200") {
    Write-Host "FAIL www returned 200 without redirect - apply www server block from nginx-root-hosting.conf"
    $fail = 1
  } else {
    Write-Host "FAIL expected 301/302 to https://$Apex/..."
    $fail = 1
  }
}

Write-Host ""
if ($fail -eq 0) {
  Write-Host "All www SSL checks passed."
  exit 0
}
Write-Host "Checks failed. On the Ubuntu TLS host run: sudo bash deploy/fix-www-ssl.sh"
Write-Host "If Via: google and cert still wrong, expand the Google LB managed certificate too."
exit 1
