@echo off
echo SmartHire - Commit and Push Script
echo ==================================

echo Changing to project directory...
cd /d c:\Users\deepa\Downloads\SmartHire\SmartHire

echo.
echo Checking git status...
git status

echo.
echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Fix Vercel deployment issues: Update vercel.json configuration, fix vite.config.ts base path, add health check endpoint, and add comprehensive deployment documentation"

echo.
echo Pushing to GitHub...
git push origin master

echo.
echo Deployment files have been committed and pushed to GitHub.
echo You can now redeploy your application on Vercel.
pause