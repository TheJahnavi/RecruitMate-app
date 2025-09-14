# Vercel Deployment Fix for SmartHire Application

## Issue
The application was building successfully but showing a 404 error because Vercel wasn't properly serving the static files from the client/dist directory.

## Root Cause
The previous vercel.json configuration was too simplified and didn't account for the monorepo structure where:
- The client application is in the `client/` directory
- The build output goes to `client/dist/`
- Static files need to be served from that location

## Solution
Updated both vercel.json files to properly configure the build and routing:

1. **Root vercel.json** (in SmartHire/):
   - Uses `@vercel/node` builder for the client
   - Sets build command to `cd SmartHire/client && npm install && npm run build`
   - Specifies output directory as `SmartHire/client/dist`
   - Routes API requests to the server and static files to the client/dist directory

2. **Project vercel.json** (in SmartHire/SmartHire/):
   - Uses `@vercel/node` builder for the client
   - Sets build command to `cd client && npm install && npm run build`
   - Specifies output directory as `client/dist`
   - Routes API requests to the server and static files to the client/dist directory

## Next Steps
1. Commit and push these changes
2. Monitor the deployment on Vercel
3. Verify that the application loads correctly without 404 errors

This configuration should properly build the React client application and serve its static files while routing API requests to the Node.js server.