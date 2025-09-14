# Fix Vercel routing configuration
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add the updated vercel.json file
git add vercel.json

# Commit changes
git commit -m "Fix Vercel routing configuration to serve index.html from root path"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should now properly route all requests to index.html."