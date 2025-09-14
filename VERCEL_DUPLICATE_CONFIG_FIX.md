# Vercel Duplicate Configuration Fix

## Issue Identified
There were two vercel.json files in the repository causing conflicts:
1. One in the repository root (c:\Users\deepa\Downloads\SmartHire\vercel.json) - Had incorrect configuration
2. One in the project directory (c:\Users\deepa\Downloads\SmartHire\SmartHire\vercel.json) - Had correct configuration

The root directory vercel.json was using "@vercel/node" which was causing the 250MB size limit error.

## Fix Applied
Updated the root directory vercel.json file to use the correct configuration:

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
      "dest": "/SmartHire/client/dist/$1"
    }
  ]
}
```

## Key Changes
1. Changed "use" from "@vercel/node" to "@vercel/static-build" to avoid the 250MB size limit
2. Updated the src path to "SmartHire/client/package.json" to correctly point to the client folder
3. Simplified the configuration to match the working configuration in the SmartHire directory

## Vercel Project Settings
For proper deployment, ensure:
- Root Directory setting in Vercel should be empty (default)
- The vercel.json file should be in the repository root
- The configuration should point to the correct client folder

## Next Steps
1. Commit and push these changes
2. Monitor the deployment at https://vercel.com/thejahnavi/recruitmate-app
3. Verify that the application builds and deploys successfully without the size limit error