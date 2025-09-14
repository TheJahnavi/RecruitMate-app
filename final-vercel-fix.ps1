# Final Vercel configuration fix
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add the updated vercel.json file
git add vercel.json

# Commit changes
git commit -m "Final Vercel configuration fix for proper SPA routing"

# Push to GitHub
git push origin master

Write-Host "Final fix pushed to GitHub. Vercel deployment should now work correctly."