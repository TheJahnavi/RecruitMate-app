# Vercel Deployment Guide for SmartHire Application

## Current Configuration Summary

### Project Structure
```
SmartHire/
├── client/                 # Frontend React application
│   ├── package.json        # Client dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── postcss.config.js   # PostCSS configuration
│   ├── tailwind.config.ts  # Tailwind CSS configuration
│   └── dist/               # Build output directory
├── server/                 # Backend Node.js server
│   └── index.ts            # Server entry point
├── package.json            # Root package.json with build scripts
└── vercel.json             # Vercel deployment configuration
```

### Key Configuration Files

#### 1. Root package.json
- Contains the `vercel-build` script: `cd client && npm install && npm run build`
- Defines all backend dependencies
- Specifies Node.js engine requirements

#### 2. client/package.json
- Contains frontend dependencies
- Defines client build scripts (`vite build`)

#### 3. vercel.json
- Configured for monorepo structure
- Uses `@vercel/static-build` for client and `@vercel/node` for server
- Proper routing for API endpoints and static files

#### 4. client/vite.config.ts
- Configured with proper base path for Vercel deployment
- Output directory set to `client/dist`

## Deployment Steps

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Fix Vercel deployment configuration for static file serving"
git push origin master
```

### 2. Trigger Deployment on Vercel
- Push to GitHub will automatically trigger a new deployment
- Or manually deploy through Vercel dashboard

### 3. Monitor Build Process
- Check Vercel logs for successful build
- Look for successful completion of client build process

## Vercel Project Settings

### Build & Development Settings
- **Framework Preset**: `Other`
- **Build Command**: Leave empty (will use vercel-build script)
- **Output Directory**: Leave empty (configured in vercel.json)
- **Install Command**: Leave as default

### Root Directory
- Set to `/` (project root)

### Environment Variables
Ensure these environment variables are set in Vercel project settings:
```
NODE_ENV=production
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_production_session_secret
```

## Expected Build Process

1. Vercel clones the repository
2. Runs the `vercel-build` script from root package.json
3. Navigates to client directory and installs dependencies
4. Builds the React frontend with Vite
5. Outputs static files to `client/dist`
6. Configures routing for API endpoints to server
7. Serves static files from `client/dist`

## Troubleshooting

### If Build Still Fails
1. Verify all package.json files exist and are valid JSON
2. Check that client directory contains all necessary files
3. Ensure Vercel project settings match the configuration above
4. Check Vercel logs for specific error messages

### If Application Shows Blank Page or 404 Error
1. Check browser console for JavaScript errors
2. Verify `client/dist` contains `index.html` and static assets
3. Confirm routing in vercel.json is correct
4. Ensure vite.config.ts has correct base path
5. Check that the routes in vercel.json properly map to the built files

### Common Issues and Solutions
- **Missing dependencies**: Ensure all dependencies are in package.json
- **Path issues**: Check that all file paths in configs are correct
- **Environment variables**: Verify all required env vars are set in Vercel
- **Build script errors**: Test build locally with `npm run build`

## Local Testing

Before deploying, test the build process locally:
```bash
# Test client build
cd client
npm install
npm run build

# Check output
ls -la dist/

# Return to root
cd ..
```

This should complete without errors and create the dist directory with built assets.

## Recent Changes (September 13, 2025)

Updated vercel.json to use `@vercel/static-build` for the client build process instead of `@vercel/node`. This change should resolve the 404 NOT_FOUND error by properly serving static files from the client/dist directory.