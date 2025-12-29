# PowerShell script to set up .env file with Redis credentials

$envFile = ".env"
$envLocalFile = ".env.local"

Write-Host "=== Setting up environment variables ===" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (Test-Path $envFile) {
    Write-Host "Found .env file" -ForegroundColor Yellow
    $content = Get-Content $envFile -Raw
    Write-Host "Current content:" -ForegroundColor Cyan
    Write-Host $content
    Write-Host ""
}

# Set the environment variables
$envContent = @"
UPSTASH_REDIS_REST_URL=https://smart-gannet-18751.upstash.io
UPSTASH_REDIS_REST_TOKEN=AUk_AAIncDE5YTU5MmMwNWRmYjE0NTQxYTBlMDU4MGIyYjhjMTA3OHAxMTg3NTE
"@

# Write to .env.local (Next.js prefers this for local development)
Write-Host "Creating .env.local file..." -ForegroundColor Yellow
$envContent | Out-File -FilePath $envLocalFile -Encoding utf8 -NoNewline
Write-Host "✓ Created .env.local" -ForegroundColor Green

# Also update .env
Write-Host "Updating .env file..." -ForegroundColor Yellow
$envContent | Out-File -FilePath $envFile -Encoding utf8 -NoNewline
Write-Host "✓ Updated .env" -ForegroundColor Green

Write-Host ""
Write-Host "=== Verification ===" -ForegroundColor Green
Write-Host ""

# Verify the files
if (Test-Path $envLocalFile) {
    Write-Host ".env.local contents:" -ForegroundColor Cyan
    Get-Content $envLocalFile
    Write-Host ""
}

if (Test-Path $envFile) {
    Write-Host ".env contents:" -ForegroundColor Cyan
    Get-Content $envFile
    Write-Host ""
}

Write-Host "=== Next Steps ===" -ForegroundColor Green
Write-Host "1. Restart your dev server (stop with Ctrl+C, then run: npm run dev)" -ForegroundColor Yellow
Write-Host "2. Test the connection: Invoke-RestMethod -Uri 'http://localhost:3000/api/healthz'" -ForegroundColor Yellow
Write-Host ""

