# SmartHire Vercel Deployment Instructions

## Overview
This document provides step-by-step instructions for deploying the SmartHire application to Vercel.

## Prerequisites
1. A GitHub account with the SmartHire repository
2. A Vercel account
3. Proper environment variables configured (see below)

## Deployment Steps

### 1. Connect Repository to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your SmartHire GitHub repository
4. Configure the project settings as follows:

### 2. Project Configuration
- **Build & Development Settings**:
  - Framework Preset: `Other`
  - Build Command: `cd client && npm install && npm run build`
  - Output Directory: `client/dist`
  - Install Command: Leave as default

- **Root Directory**: `/` (project root, NOT `/client`)

### 3. Environment Variables
Add these environment variables in your Vercel project settings:
```
NODE_ENV=production
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_strong_session_secret
```

### 4. Deploy
1. Click "Deploy"
2. Wait for the build process to complete
3. Your application will be available at the provided URL

## Troubleshooting

### Blank Page Issues
If you see a blank page after deployment:

1. **Check the browser console** for JavaScript errors
2. **Verify the build output** contains `index.html` in the correct location
3. **Check that the root directory** is set to `/` (project root)
4. **Ensure the base path** in `client/vite.config.ts` is set to `/`

### API Issues
If API endpoints return 404 or other errors:

1. **Check the Vercel function logs** for server errors
2. **Verify that `vercel.json`** has the correct routing configuration
3. **Ensure all environment variables** are properly set in Vercel

## File Structure After Build
The build process should create the following structure in `client/dist`:
```
client/dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

## Support
If you continue to experience deployment issues, please:
1. Check the Vercel build logs for specific error messages
2. Verify all configuration files are correctly set up
3. Ensure environment variables are properly configured
4. Contact support with detailed information about the issue