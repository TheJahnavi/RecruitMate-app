# Vercel Deployment Troubleshooting Guide

## Current Issue

You're seeing this error:
```
npm error code ENOENT
npm error syscall open
npm error path /vercel/path0/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/vercel/path0/package.json'
```

## Analysis

This error means Vercel is looking for a `package.json` file in the root directory but cannot find it. This happens when:

1. The Root Directory setting in Vercel is not correctly configured
2. The `vercel.json` configuration doesn't match the project structure
3. The build command is not properly set up for the project structure

## Solution Steps

### Step 1: Update Vercel Project Settings

1. Go to your Vercel Dashboard
2. Select your `recruit-mate-app` project
3. Click on the "Settings" tab
4. In the sidebar, click on "Build & Development Settings"
5. Set these exact values:

   - **Framework Preset**: Other
   - **Root Directory**: Leave this EMPTY (don't set it to anything)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: Leave as default

### Step 2: Verify Repository Structure

Make sure your GitHub repository has this exact structure:
```
recruit-mate-app/
├── client/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       └── ... (other source files)
├── server/
│   ├── index.ts
│   └── ... (other server files)
├── vercel.json
├── package.json
└── ... (other root files)
```

### Step 3: Check vercel.json Configuration

We've updated the `vercel.json` file to work with the project structure. Make sure it looks like this:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["client/dist/**"]
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
      "dest": "/client/dist/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist"
}
```

### Step 4: Add Environment Variables

In the same Settings tab, go to "Environment Variables" and add:
- `NODE_ENV`: `production`
- `DATABASE_URL`: your_production_database_url
- `SESSION_SECRET`: your_production_session_secret

### Step 5: Redeploy

After making these changes:

1. Go to the "Deployments" tab
2. Click on "Redeploy" or make a small change and push to GitHub to trigger a new deployment

## Alternative Approach: Set Root Directory to Client

If the above doesn't work, try this alternative configuration:

1. In Vercel Settings → Build & Development Settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`

2. Update `vercel.json` to:
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

## Common Issues and Solutions

### Issue: "Could not read package.json"
**Solution**: Ensure the Root Directory is either empty or correctly set to `client`, and the build command matches the project structure.

### Issue: "Command exited with 254"
**Solution**: Check that the build command is correct and all required files exist in the repository.

### Issue: Blank page after deployment
**Solution**: Verify that the routes in `vercel.json` point to the correct locations and that the build output directory is correct.

## Need More Help?

If you continue to experience issues:

1. Share the full deployment logs from Vercel
2. Verify that your GitHub repository structure matches the expected structure
3. Double-check that all required files are committed and pushed to GitHub
4. Try creating a new Vercel project and importing your GitHub repository again