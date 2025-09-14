# Remove root vercel.json
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Remove the root vercel.json file
git rm vercel.json

# Commit changes
git commit -m "Remove root vercel.json to use client directory configuration"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should now use client directory configuration."