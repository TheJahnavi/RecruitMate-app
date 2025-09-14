# Deployment Fixes for SmartHire Application

## Issue Identified

The Vercel deployment was failing with the error:
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/vercel/path0/package.json'
```

This was happening because Vercel was trying to run `cd client && npm install && npm run build` but couldn't find the package.json file in the expected location.

## Changes Made

### 1. Updated vercel.json Configuration

Modified the [vercel.json](file:///c:/Users/deepa/Downloads/SmartHire/SmartHire/vercel.json) file to properly handle the monorepo structure:

- Changed the build configuration to reference `client/package.json` directly
- Kept separate builds for client and server
- Updated routes to properly serve static files from `client/dist`

### 2. Enhanced Root package.json

Added a `vercel-build` script to the root [package.json](file:///c:/Users/deepa/Downloads/SmartHire/SmartHire/package.json) to ensure Vercel can properly execute the build process.

## Next Steps

1. Commit and push these changes to GitHub
2. Trigger a new deployment on Vercel
3. Monitor the build logs to ensure the package.json error is resolved

## Vercel Project Settings (Important)

In your Vercel project settings, make sure to configure:

- **Build & Development Settings**:
  - Framework Preset: `Other`
  - Build Command: Leave empty (will use the vercel-build script from package.json)
  - Output Directory: Leave empty (will be determined by vercel.json)
  - Install Command: Leave as default

- **Root Directory**: `/` (project root)

## Troubleshooting

If you still encounter issues:

1. Check that both `package.json` files exist in their respective directories
2. Verify that the client directory contains all necessary frontend dependencies
3. Ensure the build script in package.json matches the project structure
4. Check Vercel environment variables are properly set

## Update - September 13, 2025

This file has been updated to trigger a new deployment with the fixed configuration. The changes made should resolve the package.json reading error that was preventing successful deployment.