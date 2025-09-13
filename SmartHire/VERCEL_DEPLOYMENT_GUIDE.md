# Vercel Deployment Guide for SmartHire

## Prerequisites
1. Ensure all code changes are committed to your repository
2. Verify that the following files exist and are properly configured:
   - `vercel.json` (in root directory)
   - `client/package.json` (with all dependencies)
   - `client/vite.config.ts` (with correct base path)
   - `client/.env.production` (with production environment variables)

## Vercel Project Configuration

### 1. Project Settings
- **Build & Development Settings**:
  - Framework Preset: `Other`
  - Build Command: `cd client && npm install && npm run build`
  - Output Directory: `client/dist`
  - Install Command: `npm install`

### 2. Environment Variables
Add these environment variables in your Vercel project settings:
```
NODE_ENV=production
```

### 3. Root Directory
Set the root directory to `/` (project root), NOT `/client`

## Common Issues and Solutions

### Blank Page Issues
1. **Check Console Errors**: Open browser dev tools and check for JavaScript errors
2. **Verify Build Output**: Ensure the build process completes successfully
3. **Check Routing**: Verify that `vercel.json` routes are correctly configured
4. **Verify Base Path**: Ensure `vite.config.ts` has the correct base path (`/`)

### API Not Working
1. **Check API Routes**: Ensure all API routes in `vercel.json` point to the correct server entry point
2. **Verify Server Build**: Ensure the server code builds correctly
3. **Check Environment Variables**: Ensure database and session variables are set

## Testing Deployment Locally

Before deploying to Vercel, test the build process locally:

```bash
# From project root
cd client
npm install
npm run build
```

Check that the `dist` folder is created with all necessary files.

## Post-Deployment Checklist

1. Visit the deployed URL and verify the application loads
2. Test login functionality with demo credentials
3. Test job creation and editing features
4. Test candidate management features
5. Test file upload functionality
6. Verify all API endpoints work correctly

## Troubleshooting

### If Still Getting Blank Page:
1. Check Vercel build logs for errors
2. Verify that `index.html` is in the correct location in the build output
3. Check browser console for JavaScript errors
4. Ensure all required environment variables are set in Vercel
5. Verify that the `vercel.json` configuration is correct

### If API Endpoints Return 404:
1. Check that server routes are correctly configured in `vercel.json`
2. Verify that the server entry point (`server/index.ts`) exists
3. Check Vercel function logs for server errors

## Support

If you continue to experience issues, please provide:
1. Vercel build logs
2. Browser console errors
3. Network tab information showing failed requests
4. Screenshots of the Vercel project settings