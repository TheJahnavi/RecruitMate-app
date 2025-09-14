# Vercel Configuration Update

This document outlines the changes made to fix the Vercel deployment issues.

## Problem
The Vercel deployment was failing with PostCSS configuration errors and the application was showing 404 errors. The issues were:
1. PostCSS plugin loading failures
2. Incorrect routing configuration
3. Potential conflicts with the _redirects file

## Solution Implemented

### 1. Verified Dependencies
Confirmed that both `autoprefixer` and `postcss` are already listed in the client package.json devDependencies:
```json
"devDependencies": {
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.47",
  // ... other dependencies
}
```

### 2. Removed _redirects File
Deleted the `SmartHire/client/public/_redirects` file as it can sometimes conflict with vercel.json routing rules.

### 3. Updated vercel.json Configuration
Modified `vercel.json` to use the standard Vercel approach:

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
      "dest": "/index.html"
    }
  ]
}
```

Changes made:
- Removed the `config` object with `distDir` as it's not needed with this approach
- Updated the route destination to `/index.html` instead of the full path
- Kept the explicit reference to the client package.json

## How It Works
1. Vercel uses the vercel.json configuration to identify the correct build source
2. The build process navigates to the client directory where all dependencies are defined
3. PostCSS and Tailwind CSS plugins are properly loaded from the client directory
4. The build output is generated in the default location
5. All routes are properly redirected to the SPA's index.html file using Vercel's standard routing

## Next Steps
1. The changes have been committed and pushed to GitHub
2. A new deployment should be triggered automatically
3. The PostCSS error and 404 issues should now be resolved