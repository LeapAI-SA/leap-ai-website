$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "Starting LeapAI CMS backend (in-memory MongoDB, no Docker required)..." -ForegroundColor Cyan
Set-Location (Join-Path $root "backend")
npm run dev:local
