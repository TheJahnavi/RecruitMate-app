# Fix Vercel deployment by removing vercel.json and adding _redirects file
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add the new _redirects file
git add SmartHire/client/public/_redirects

# Remove the vercel.json file
git rm vercel.json

# Commit changes
git commit -m "Fix Vercel deployment by using _redirects file for SPA routing and removing vercel.json"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Please update Vercel project settings:"
Write-Host "1. Set Root Directory to: SmartHire/client"
Write-Host "2. Set Build Command to: npm run build"
Write-Host "3. Set Output Directory to: dist"