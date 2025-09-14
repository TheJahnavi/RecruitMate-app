# Vercel Monorepo Fix

This document outlines the changes made to fix the Vercel deployment issues in a monorepo structure.

## Problem
The Vercel deployment was failing with the following error:
```
Failed to load PostCSS config: Failed to load PostCSS config (searchPath: /vercel/path0/SmartHire/client): [Error] Loading PostCSS Plugin failed: Cannot find module 'autoprefixer'
```

This error indicates that Vercel was not properly navigating to the client directory before attempting to build, causing it to fail when trying to load dependencies.

## Solution Implemented

### Updated vercel.json Configuration
Modified `vercel.json` to properly handle the monorepo structure:

```json
{
  "builds": [
    {
      "src": "SmartHire/client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "cd SmartHire/client && npm install && npm run build",
        "outputDirectory": "SmartHire/client/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/SmartHire/client/dist/index.html"
    }
  ]
}
```

Key changes:
- Updated `buildCommand` to explicitly navigate to the client directory before running npm install and build
- Updated `outputDirectory` to specify the correct output directory relative to the repository root
- Updated the route destination to point to the correct index.html file

## How It Works
1. Vercel uses the vercel.json configuration to identify the correct build source
2. The build command explicitly navigates to the client directory where all dependencies are defined
3. npm install is run in the client directory to ensure all dependencies are properly installed
4. The build process then runs successfully in the correct directory
5. All routes are properly redirected to the SPA's index.html file in the correct location

## Next Steps
1. The changes have been committed and pushed to GitHub
2. A new deployment should be triggered automatically
3. The PostCSS error should now be resolved