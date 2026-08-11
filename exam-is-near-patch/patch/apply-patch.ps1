# ─────────────────────────────────────────────────────────────────
# Applies the GCP-billing-independence patch to your two projects.
#
# USAGE (run from inside this extracted "patch" folder, in PowerShell):
#   .\apply-patch.ps1 -EinRoot "D:\Exam is Near" -WorkerRoot "D:\cloudflare-worker"
#
# What it does:
#   - Copies 4 files into your Firebase project (public/js/core + features)
#   - Copies 2 files into your Cloudflare Worker project (src/ + wrangler.toml)
#   - Backs up every file it overwrites first (adds .bak-<timestamp> next
#     to the original), so nothing is ever lost.
#   - Does NOT run wrangler deploy or firebase deploy — you still do that
#     yourself afterward.
# ─────────────────────────────────────────────────────────────────

param(
    [Parameter(Mandatory=$true)][string]$EinRoot,
    [Parameter(Mandatory=$true)][string]$WorkerRoot
)

if (-not (Test-Path "$EinRoot\public\js")) {
    Write-Host "This doesn't look like your Exam Is Near project (no public\js folder found in '$EinRoot')." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "$WorkerRoot\wrangler.toml")) {
    Write-Host "This doesn't look like your Worker project (no wrangler.toml found in '$WorkerRoot')." -ForegroundColor Red
    exit 1
}

$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Backup-And-Copy($Src, $Dest) {
    if (Test-Path $Dest) {
        Copy-Item $Dest "$Dest.bak-$Stamp"
        Write-Host "  -> backed up existing file to $(Split-Path -Leaf $Dest).bak-$Stamp"
    }
    $DestDir = Split-Path -Parent $Dest
    if (-not (Test-Path $DestDir)) { New-Item -ItemType Directory -Path $DestDir -Force | Out-Null }
    Copy-Item $Src $Dest -Force
    Write-Host "  OK wrote $Dest" -ForegroundColor Green
}

Write-Host "-- Patching Exam Is Near frontend --"
Backup-And-Copy "$ScriptDir\exam-is-near\public\js\core\app-state.js"            "$EinRoot\public\js\core\app-state.js"
Backup-And-Copy "$ScriptDir\exam-is-near\public\js\core\firebase-sync.js"        "$EinRoot\public\js\core\firebase-sync.js"
Backup-And-Copy "$ScriptDir\exam-is-near\public\js\features\payments-pro.js"     "$EinRoot\public\js\features\payments-pro.js"
Backup-And-Copy "$ScriptDir\exam-is-near\public\js\features\files-materials.js"  "$EinRoot\public\js\features\files-materials.js"

Write-Host ""
Write-Host "-- Patching Cloudflare Worker --"
Backup-And-Copy "$ScriptDir\cloudflare-worker\src\index.js"    "$WorkerRoot\src\index.js"
Backup-And-Copy "$ScriptDir\cloudflare-worker\wrangler.toml"   "$WorkerRoot\wrangler.toml"

Write-Host ""
Write-Host "All 6 files patched. Nothing was deployed yet -- still to do:" -ForegroundColor Yellow
Write-Host "   1. cd `"$WorkerRoot`""
Write-Host "      npx wrangler r2 bucket create exam-is-near-files"
Write-Host "   2. npx wrangler secret put RZP_KEY_ID"
Write-Host "   3. npx wrangler secret put RZP_KEY_SECRET"
Write-Host "   4. npx wrangler deploy"
Write-Host "   5. cd `"$EinRoot`""
Write-Host "      firebase deploy --only hosting"
