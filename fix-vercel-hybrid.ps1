# Fix Vercel configuration with hybrid approach
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add the updated vercel.json file
git add vercel.json

# Commit changes
git commit -m "Fix Vercel configuration with hybrid approach for SPA routing"

# Push to GitHub
git push origin master

Write-Host "Hybrid vercel.json configuration pushed to GitHub. This should fix the login and signup 404 errors."