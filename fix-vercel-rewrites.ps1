# Fix Vercel configuration with rewrites instead of routes
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add the updated vercel.json file
git add vercel.json

# Commit changes
git commit -m "Fix Vercel configuration with rewrites for SPA routing"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should now properly handle SPA routing with rewrites."