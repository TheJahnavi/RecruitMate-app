# Vercel Root Build Fix

This document outlines the changes made to fix the persistent Vercel deployment issues related to the autoprefixer module not being found.

## Problem
The Vercel deployment was consistently failing with the following error:
```
Failed to load PostCSS config: Failed to load PostCSS config (searchPath: /vercel/path0/SmartHire/client): [Error] Loading PostCSS Plugin failed: Cannot find module 'autoprefixer'
```

Despite multiple attempts to fix the issue by modifying dependencies and vercel.json configurations, the error persisted. This indicated that the problem was not with the configuration but with how Vercel was handling the build process.

## Solution Implemented

### 1. Restored Root package.json
The root package.json file was restored from package.json.bak, which contains the correct build script:
```json
{
  "scripts": {
    "build": "cd SmartHire/client && npm install && npm run build"
  }
}
```

### 2. Updated vercel.json Configuration
Modified `vercel.json` to use the root package.json for building instead of the client package.json:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
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
- Changed `src` from `SmartHire/client/package.json` to `package.json` to use the root package.json
- Added `config` with `distDir` set to `dist`
- Simplified the route destination to `/index.html`

## How It Works
1. Vercel uses the vercel.json configuration to identify the root package.json as the build source
2. The build process runs the build script defined in the root package.json
3. The build script explicitly navigates to the client directory and runs `npm install` followed by `npm run build`
4. This ensures that all dependencies, including autoprefixer and postcss, are properly installed in the correct directory
5. The build output is placed in the dist directory
6. All routes are properly redirected to the SPA's index.html file

## Why This Fixes the Issue
1. By using the root package.json, we ensure that Vercel runs the explicit build command that includes `npm install`
2. The explicit `npm install` command ensures that all dependencies are installed in the correct directory
3. This approach bypasses any potential issues with Vercel's default