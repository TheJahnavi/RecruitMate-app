# SmartHire Demo Start Script
Write-Host "Starting SmartHire Application in Demo Mode" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Set environment variables for demo mode
$env:NODE_ENV="development"

# Start the backend server in the background
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$(Get-Location)'; npx tsx server/index.ts" -WindowStyle Normal

# Wait a moment for the server to start
Start-Sleep -Seconds 3

# Start the frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow
Set-Location "$PWD\client"
npx vite --host