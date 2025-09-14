# Vercel Size Limit Fix

## Issue
The previous deployment was failing with the error:
```
Error: A Serverless Function has exceeded the unzipped maximum size of 250 MB.
```

## Root Cause
The configuration was trying to build the entire application as a Serverless Function, which included all dependencies and exceeded Vercel's 250MB limit.

## Solution
Updated the vercel.json file in the client directory to use `@vercel/static-build` instead of `@vercel/node`:

```json
{
  "version": 2,
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
      "dest": "/dist/$1"
    }
  ]
}
```

This configuration:
1. Uses `@vercel/static-build` which is designed for static sites and doesn't have the 250MB limit
2. Properly builds the React frontend application
3. Serves static files from the dist directory
4. Routes all requests to the built static files

## Backend API
Note that with this configuration, the backend API endpoints will need to be hosted separately. For a complete solution, you would need to:

1. Deploy the backend API separately (e.g., to a different Vercel project or another hosting service)
2. Update the frontend API calls to point to the separate backend URL
3. Configure CORS appropriately

## Next Steps
1. Commit and push these changes
2. Update Vercel project settings to ensure Root Directory is set to "client"
3. Monitor the deployment
4. Verify that the frontend loads correctly