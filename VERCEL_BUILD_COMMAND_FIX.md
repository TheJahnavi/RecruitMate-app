# Vercel Build Command Fix

This document outlines the changes made to fix the Vercel deployment issues related to missing dependencies.

## Problem
The Vercel deployment was failing with the following error:
```
Failed to load PostCSS config: Failed to load PostCSS config (searchPath: /vercel/path0/SmartHire/client): [Error] Loading PostCSS Plugin failed: Cannot find module 'autoprefixer'
```

This error indicates that Vercel was not properly installing the dependencies required for the build process.

## Solution Implemented

### Updated vercel.json Configuration
Modified `vercel.json` to include an explicit build command that ensures dependencies are installed:

```json
{
  "builds": [
    {
      "src": "SmartHire/client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm install && npm run build",
        "outputDirectory": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

Key changes:
- Added `buildCommand` configuration to explicitly run `npm install && npm run build`
- Added `outputDirectory` configuration to specify the dist directory

## How It Works
1. Vercel uses the vercel.json configuration to identify the correct build source
2. The explicit build command ensures that `npm install` is run before the build
3. This guarantees that all dependencies, including autoprefixer and postcss, are installed
4. The build process then runs successfully
5. All routes are properly redirected to the SPA's index.html file

## Next Steps
1. The changes have been committed and pushed to GitHub
2. A new deployment should be triggered automatically
3. The PostCSS error should now be resolved