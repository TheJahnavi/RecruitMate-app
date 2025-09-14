# SmartHire - Commit Client Root Fix
Write-Host "SmartHire - Commit Client Root Fix" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

Write-Host "Changing to project directory..." -ForegroundColor Yellow
Set-Location -Path "c:\Users\deepa\Downloads\SmartHire\SmartHire"

Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Fix Vercel deployment with client root directory: Update vercel.json configuration for client root deployment and add deployment guide"

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin master

Write-Host "Changes have been committed and pushed to GitHub." -ForegroundColor Green
Write-Host "You can now redeploy your application on Vercel with root directory set to 'client'." -ForegroundColor Green