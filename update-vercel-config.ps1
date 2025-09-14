# Update Vercel configuration to properly handle SPA routing
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add the vercel.json file
git add vercel.json

# Commit changes
git commit -m "Update Vercel configuration to properly handle SPA routing with correct client directory"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should now use the correct configuration."