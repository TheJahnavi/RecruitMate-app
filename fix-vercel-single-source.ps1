# Fix Vercel configuration to follow single source of truth principle
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Remove client vercel.json and add root vercel.json
git rm SmartHire/client/vercel.json
git add vercel.json

# Commit changes
git commit -m "Fix Vercel configuration to follow single source of truth principle"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should now work with proper single source configuration."