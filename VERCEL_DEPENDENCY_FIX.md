# Vercel Dependency Fix

This document outlines the changes made to fix the Vercel deployment issues related to missing dependencies.

## Problem
The Vercel deployment was failing with the following error:
```
Failed to load PostCSS config: Failed to load PostCSS config (searchPath: /vercel/path0/SmartHire/client): [Error] Loading PostCSS Plugin failed: Cannot find module 'autoprefixer'
```

This error indicates that Vercel was not properly installing the autoprefixer and postcss dependencies during the build process.

## Solution Implemented

### Updated Client package.json
Moved `autoprefixer` and `postcss` from `devDependencies` to `dependencies` in the client package.json:

```json
{
  "dependencies": {
    // ... other dependencies
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    // ... other dependencies
  },
  "devDependencies": {
    // ... other dev dependencies (autoprefixer and postcss removed)
  }
}
```

### Updated vercel.json Configuration
Simplified the vercel.json configuration to follow Vercel's best practices:

```json
{
  "builds": [
    {
      "src": "SmartHire/client/package.json",
      "use": "@vercel/static-build"
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

## Why This Fixes the Issue
1. Moving autoprefixer and postcss to dependencies ensures they are installed during the production build process, not just during development
2. Vercel's build process only installs dependencies, not devDependencies, unless specifically configured to do so
3. The simplified vercel.json configuration follows Vercel's recommended approach for monorepo structures
4. The route configuration properly redirects all paths to the SPA's index.html file

## Next Steps
1. The changes have been committed and pushed to GitHub
2. A new deployment should be triggered automatically
3. The PostCSS error should now be resolved