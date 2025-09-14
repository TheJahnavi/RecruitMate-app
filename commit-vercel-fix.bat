@echo off
echo Adding Vercel SPA fix files to git...
git add SmartHire/client/vite.config.ts
git add SmartHire/client/public/_redirects
git add VERCEL_SPA_FIX.md
git commit -m "Fix Vercel SPA deployment: Update build output directory and add _redirects for proper routing"
git push origin master
echo Changes committed and pushed to GitHub.
pause