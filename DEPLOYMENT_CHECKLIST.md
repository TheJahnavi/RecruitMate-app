# Deployment Checklist for SmartHire Application

## Pre-deployment Checklist

### 1. Environment Configuration
- [ ] Verify `.env.production` file exists with correct values
- [ ] Check that `DATABASE_URL` is set correctly for production
- [ ] Verify `SESSION_SECRET` is set to a strong secret
- [ ] Confirm `NODE_ENV` is set to "production"

### 2. Vercel Configuration
- [ ] `vercel.json` file exists and is properly configured
- [ ] Build command is correct: `cd client && npm install && npm run build`
- [ ] Output directory is set to `client/dist`
- [ ] API routes are properly configured to point to `/server/index.ts`
- [ ] Root directory is set to `/` (project root) in Vercel settings

### 3. Client Configuration
- [ ] `client/package.json` exists with correct dependencies
- [ ] `client/vite.config.ts` is properly configured with base path `/`
- [ ] `client/postcss.config.js` exists
- [ ] Build output directory is `client/dist`

### 4. Server Configuration
- [ ] Server listens on process.env.PORT or defaults to 3001
- [ ] CORS is properly configured for production domain
- [ ] Session configuration is appropriate for production

### 5. API Configuration
- [ ] Frontend API calls use correct base URL for production (empty string for same-origin)
- [ ] Authentication redirects point to `/login` not `/api/login`

## Deployment Steps

### 1. Local Testing
- [ ] Run `npm run build` locally to verify build process
- [ ] Test production build locally if possible
- [ ] Verify all environment variables are correctly set

### 2. Vercel Deployment
- [ ] Push all changes to GitHub repository
- [ ] Trigger deployment on Vercel
- [ ] Monitor build logs for errors
- [ ] Verify deployment completes successfully

### 3. Post-deployment Verification
- [ ] Visit deployed application URL
- [ ] Test login functionality
- [ ] Verify navigation between pages works
- [ ] Test API endpoints return correct data
- [ ] Check browser console for errors

## Common Issues and Solutions

### Blank Page Issues
1. **Check build output**: Ensure `client/dist` contains `index.html` and static assets
2. **Verify routing**: Check that `vercel.json` routes are correctly configured
3. **Check console errors**: Open browser dev tools and check for JavaScript errors
4. **Verify root element**: Ensure `index.html` contains `<div id="root"></div>`
5. **Check base path**: Ensure `vite.config.ts` has base path set to `/`

### API Connection Issues
1. **Check environment variables**: Verify `DATABASE_URL` and other env vars are set
2. **Verify CORS configuration**: Ensure server allows requests from deployed domain
3. **Test API endpoints**: Use tools like Postman to verify API routes work

### Authentication Issues
1. **Check session configuration**: Verify session secret and cookie settings
2. **Verify redirect URLs**: Ensure authentication redirects point to correct paths
3. **Test login flow**: Verify login process works end-to-end

## Troubleshooting Commands

### Local Build Testing
```bash
# Test client build
cd client
npm run build

# Check build output
ls -la dist

# Test server build
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

### Environment Verification
```bash
# Check environment variables
echo $NODE_ENV
echo $DATABASE_URL
```

### Vercel CLI Commands
```bash
# Deploy with Vercel CLI
vercel --prod

# Check deployment logs
vercel logs <deployment-url>
```

## Post-deployment Tasks

- [ ] Update application URLs in documentation
- [ ] Test all user roles (Super Admin, Company Admin, HR)
- [ ] Verify all functionality works as expected
- [ ] Monitor application performance
- [ ] Set up error monitoring if not already configured

## Vercel-Specific Configuration

### Project Settings in Vercel
- **Build & Development Settings**:
  - Framework Preset: `Other`
  - Build Command: `cd client && npm install && npm run build`
  - Output Directory: `client/dist`
  - Install Command: Leave as default or set to `npm install`

- **Root Directory**: `/` (project root)

### Environment Variables in Vercel
Add these environment variables in your Vercel project settings:
```
NODE_ENV=production
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_production_session_secret
```

### Vercel Routing Configuration
Ensure `vercel.json` has the correct routing:
```json
{
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
  ]
}
```