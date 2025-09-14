# Vercel Deployment Guide - Client Root Directory

This guide provides specific instructions for deploying the SmartHire application to Vercel when the root directory is set to "client".

## Important Note

When you set the root directory to "client" in Vercel, the entire build process changes:
- Vercel will look for configuration files (vercel.json, package.json) inside the client directory
- All paths in vercel.json must be relative to the client directory
- The build command should not include "cd client" since we're already in the client directory

## Updated Configuration

### vercel.json (in project root)
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
    },
    {
      "src": "../server/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["dist/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/health",
      "dest": "/server/index.ts"
    },
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist"
}
```

### Vercel Project Settings
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`

### Environment Variables
Add these environment variables in your Vercel project settings:
```
NODE_ENV=production
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_production_session_secret
```

## Common Issues and Solutions

### Blank Page Issues
1. **Check vercel.json paths**: When root directory is "client", all paths in vercel.json should be relative to the client directory
2. **Verify build output**: Ensure the build creates a `dist` directory with `index.html` inside
3. **Check routing configuration**: The routes should point to `/dist/index.html` for static files
4. **Verify API routes**: API routes should point to `/server/index.ts` (relative to project root)

### API Issues
1. **Check server path**: The server path in vercel.json should be `../server/index.ts` to go up one directory
2. **Verify environment variables**: Ensure all required environment variables are set in Vercel

## Testing Locally

To test the client root configuration locally:

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Check that the `dist` directory is created with all necessary files

## Redeployment Steps

1. Commit the updated vercel.json file
2. Push to GitHub
3. In Vercel:
   - Ensure Root Directory is set to `client`
   - The build should automatically use the updated vercel.json
   - Check the deployment logs for any errors

## Support

If you continue to experience issues:
1. Check Vercel build logs for specific error messages
2. Verify that the vercel.json configuration matches the one above
3. Ensure all environment variables are properly configured
4. Contact support with detailed information about the issue