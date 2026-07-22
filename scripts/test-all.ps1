param(
  [string]$WebBase = "http://localhost:3000/leap-ai",
  [string]$ApiBase = "http://localhost:4000"
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LeapAI full test suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Web: $WebBase" -ForegroundColor Gray
Write-Host "API: $ApiBase" -ForegroundColor Gray

$failed = 0

Write-Host "`n--- Admin pages and API ---" -ForegroundColor Yellow
& (Join-Path $root "test-admin-pages.ps1") -WebBase $WebBase -ApiBase $ApiBase
if ($LASTEXITCODE -ne 0) { $failed++ }

Write-Host "`n--- GEO crawler files ---" -ForegroundColor Yellow
& (Join-Path $root "verify-geo.ps1") -BaseUrl $WebBase -BasePath "/leap-ai"
if ($LASTEXITCODE -ne 0) { $failed++ }

Write-Host "`n--- End-to-end (API + public pages) ---" -ForegroundColor Yellow
& (Join-Path $root "e2e-test.ps1") -WebBase $WebBase -ApiBase $ApiBase
if ($LASTEXITCODE -ne 0) { $failed++ }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($failed -eq 0) {
  Write-Host "  ALL SUITES PASSED" -ForegroundColor Green
} else {
  Write-Host "  $failed SUITE(S) FAILED" -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($failed -gt 0) { exit 1 }
