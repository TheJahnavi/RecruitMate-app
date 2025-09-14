@echo off
echo SmartHire - Commit Client Root Fix
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
git commit -m "Fix Vercel deployment with client root directory: Update vercel.json configuration for client root deployment and add deployment guide"

echo.
echo Pushing to GitHub...
git push origin master

echo.
echo Changes have been committed and pushed to GitHub.
echo You can now redeploy your application on Vercel with root directory set to 'client'.
pause