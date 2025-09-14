# Fix project structure and deploy to Vercel
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add all files
git add .

# Commit changes
git commit -m "Fix project structure and Vercel deployment configuration for SPA routing"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should start automatically."