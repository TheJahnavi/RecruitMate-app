# Add vercel.json to client directory
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add the new vercel.json file in client directory
git add SmartHire/client/vercel.json

# Commit changes
git commit -m "Add vercel.json to client directory for SPA routing"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should now work with client directory configuration."