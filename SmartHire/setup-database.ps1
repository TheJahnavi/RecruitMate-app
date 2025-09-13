# PowerShell script to set up the database
Write-Host "Setting up SmartHire database..." -ForegroundColor Green

# Set environment variables
$env:NODE_ENV="development"

# Run the database setup script
node setup-database.js

Write-Host "Database setup completed!" -ForegroundColor Green