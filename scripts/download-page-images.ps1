$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "frontend\public\pages"
$mapPath = Join-Path $PSScriptRoot "page-image-map.json"
$map = Get-Content $mapPath -Raw | ConvertFrom-Json

if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

function Get-OgImageUrl([string]$pageUrl) {
  $html = (Invoke-WebRequest -Uri $pageUrl -UseBasicParsing -TimeoutSec 30).Content
  if ($html -match 'property="og:image" content="([^"]+)"') {
    return $Matches[1]
  }
  return $null
}

function Normalize-WpImageUrl([string]$url) {
  return $url -replace '-\d+x\d+(\.(png|jpe?g|webp))$', '$1'
}

$results = @{}
$map.PSObject.Properties | ForEach-Object {
  $slug = $_.Name
  $pageUrl = $_.Value
  $outFile = Join-Path $outDir "$slug.png"

  if (Test-Path $outFile) {
    Write-Host "skip $slug (exists)"
    $results[$slug] = "/pages/$slug.png"
    return
  }

  try {
    $imgUrl = Get-OgImageUrl $pageUrl
    if (-not $imgUrl) {
      Write-Warning "no og:image for $slug"
      return
    }
    $imgUrl = Normalize-WpImageUrl $imgUrl
    Invoke-WebRequest -Uri $imgUrl -OutFile $outFile -UseBasicParsing -TimeoutSec 60
    Write-Host "ok $slug"
    $results[$slug] = "/pages/$slug.png"
  } catch {
    Write-Warning "fail $slug : $_"
  }
}

# About page hero
$aboutFile = Join-Path $outDir "about-us.png"
if (-not (Test-Path $aboutFile)) {
  try {
    $aboutImg = Get-OgImageUrl "https://leapai.ai/en/about-us/"
    if ($aboutImg) {
      Invoke-WebRequest -Uri (Normalize-WpImageUrl $aboutImg) -OutFile $aboutFile -UseBasicParsing -TimeoutSec 60
      Write-Host "ok about-us"
    }
  } catch {
    Write-Warning "fail about-us : $_"
  }
}

Write-Host "Done. Downloaded $($results.Count) page images to $outDir"
