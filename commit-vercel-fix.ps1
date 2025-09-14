# Commit and push the Vercel SPA fix changes
git add SmartHire/client/vite.config.ts
git add SmartHire/client/public/_redirects
git add VERCEL_SPA_FIX.md
git commit -m "Fix Vercel SPA deployment: Update build output directory and add _redirects for proper routing"
git push origin master