# Clean up Vercel configuration by removing redundant _redirects file
# Set Git configuration
git config --global user.name "Chandana Konduru"
git config --global user.email "chandanasree000@gmail.com"

# Remove the _redirects file
git rm SmartHire/client/public/_redirects

# Commit changes
git commit -m "Clean up Vercel configuration by removing redundant _redirects file"

# Push to GitHub
git push origin master

Write-Host "Changes pushed to GitHub. Vercel deployment should now work correctly with the vercel.json configuration."