# Vercel Root Configuration Fix

## Issue
The previous configuration was still causing the 250MB size limit error because:
1. The vercel.json file was in the client directory instead of the repository root
2. Vercel was still trying to include backend dependencies in the static build

## Solution
Moved the vercel.json file to the repository root with the correct configuration:

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
      "dest": "/client/dist/$1"
    }
  ]
}
```

## Key Changes

1. **Location**: vercel.json is now in the repository root, not in the client directory
2. **Source Path**: The src property points to "client/package.json" to tell Vercel to only use the client folder for the build
3. **Route Destination**: Updated to "/client/dist/$1" to correctly point to the output directory within the client folder

## Benefits

1. **Prevents Size Issues**: Vercel will only include frontend dependencies in the static build, avoiding the 250MB limit
2. **Correct Routing**: Routes are properly configured to serve files from the client/dist directory
3. **Proper Structure**: Configuration follows Vercel's best practices for monorepo setups

## Next Steps

1. Commit and push these changes
2. Ensure Vercel project settings have Root Directory set to "/" (repository root)
3. Monitor the deployment
4. Verify that the application builds and deploys successfully without the size limit error