# SmartHire - Commit and Push Script
Write-Host "SmartHire - Commit and Push Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

Write-Host "Changing to project directory..." -ForegroundColor Yellow
Set-Location -Path "c:\Users\deepa\Downloads\SmartHire\SmartHire"

Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Fix Vercel deployment issues: Update vercel.json configuration, fix vite.config.ts base path, add health check endpoint, and add comprehensive deployment documentation"

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin master

Write-Host "Deployment files have been committed and pushed to GitHub." -ForegroundColor Green
Write-Host "You can now redeploy your application on Vercel." -ForegroundColor Green