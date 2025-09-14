# Fix Vite configuration to remove top-level await
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Add the updated vite.config.ts file
git add vite.config.ts

# Commit changes
git commit -m "Fix Vite configuration to remove top-level await that was causing build issues"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should now work without Vite configuration issues."