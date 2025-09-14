# Vercel Routing Fix for SPA

## Issue
The deployment was building successfully, but accessing the page resulted in a 404 error. This was because the routing configuration was not properly set up for a Single Page Application (SPA).

## Root Cause
The previous vercel.json configurations were using:
```json
{
  "src": "/(.*)",
  "dest": "/client/dist/$1"
}
```

This configuration tries to serve specific files based on the URL path, but for a SPA, all routes should be redirected to index.html so that the React Router can handle client-side routing.

## Fix Applied
Updated both vercel.json files to redirect all routes to index.html:

### Root vercel.json (c:\Users\deepa\Downloads\SmartHire\vercel.json):
```json
{
  "builds": [
    {
      "src": "SmartHire/client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
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

### Project vercel.json (c:\Users\deepa\Downloads\SmartHire\SmartHire\vercel.json):
```json
{
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/client/dist/index.html"
    }
  ]
}
```

## Key Change
Changed `"dest": "/client/dist/$1"` to `"dest": "/client/dist/index.html"` in both files.

This ensures that:
1. All routes are redirected to index.html
2. React Router can handle client-side routing
3. No 404 errors occur when accessing specific pages
4. The SPA works correctly on Vercel

## Next Steps
1. Commit and push these changes
2. Monitor the deployment
3. Verify that the application loads correctly without 404 errors
4. Test navigation between different pages