# Git Commit and Push Instructions

This document provides instructions on how to commit and push the changes to your GitHub repository.

## Prerequisites

1. Make sure you have Git installed on your system
2. Make sure you have the correct permissions to push to the repository

## Commit and Push Using Scripts

I've created two scripts to help you commit and push the changes:

1. **commit-and-push.bat** - Windows batch script
2. **commit-and-push.ps1** - PowerShell script

### Using the Batch Script (Windows)

1. Navigate to the SmartHire directory:
   ```
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```

2. Run the batch script:
   ```
   commit-and-push.bat
   ```

### Using the PowerShell Script (Windows)

1. Open PowerShell as Administrator
2. Navigate to the SmartHire directory:
   ```
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```

3. Run the PowerShell script:
   ```
   .\commit-and-push.ps1
   ```

## Manual Commit and Push

If you prefer to commit and push manually, follow these steps:

1. Open a terminal/command prompt
2. Navigate to the project directory:
   ```
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```

3. Check the git status:
   ```
   git status
   ```

4. Add all files:
   ```
   git add .
   ```

5. Commit the changes:
   ```
   git commit -m "Fix Vercel deployment issues: Update vercel.json configuration, fix vite.config.ts base path, add health check endpoint, and add comprehensive deployment documentation"
   ```

6. Push to GitHub:
   ```
   git push origin master
   ```

## After Commit and Push

After successfully committing and pushing the changes:

1. Go to your Vercel dashboard
2. Trigger a new deployment for your project
3. The application should now load correctly without showing a blank page

## Troubleshooting

If you encounter any issues:

1. **Permission denied**: Make sure you have the correct permissions to push to the repository
2. **Authentication failed**: Make sure you're authenticated with GitHub
3. **Branch not found**: Make sure you're on the correct branch (master/main)

For any other issues, please check the Git documentation or contact GitHub support.