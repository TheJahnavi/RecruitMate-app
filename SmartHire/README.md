# SmartHire - Intelligent Hiring Platform

SmartHire is a comprehensive hiring platform that streamlines the recruitment process with AI-powered features for resume parsing, candidate matching, and interview question generation.

## Features

- **Multi-role Access**: Super Admin, Company Admin, and HR dashboards
- **Job Management**: Create, edit, and manage job postings
- **Candidate Tracking**: Upload resumes and track candidate progress
- **AI-Powered Matching**: Automatic candidate-to-job matching with detailed reports
- **Interview Tools**: AI-generated interview questions based on job requirements
- **Dashboard Analytics**: Visualize hiring metrics and progress
- **Notification System**: Real-time updates on hiring activities
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- PostgreSQL database (for production deployment)

## Quick Start (Demo Mode)

### Using PowerShell (Windows)

```powershell
cd SmartHire
.\start-demo.ps1
```

### Using npm

```bash
cd SmartHire
npm run dev:demo
```

## Production Deployment

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   PORT=3001
   ```

3. Run the application:
   ```bash
   npm run dev
   ```

### Deployment to Vercel

There are two ways to deploy to Vercel depending on your project settings:

#### Option 1: Root Directory Set to Project Root (/)

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the project with these settings:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Root Directory: `/` (project root)
4. Add environment variables in Vercel project settings:
   ```
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   SESSION_SECRET=your_production_session_secret
   ```

#### Option 2: Root Directory Set to Client (/client)

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the project with these settings:
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
   - Root Directory: `client`
4. Add environment variables in Vercel project settings:
   ```
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   SESSION_SECRET=your_production_session_secret
   ```

For detailed Vercel deployment instructions, see:
- [VERCEL_DEPLOYMENT_README.md](VERCEL_DEPLOYMENT_README.md) for project root deployment
- [VERCEL_DEPLOYMENT_CLIENT_ROOT.md](VERCEL_DEPLOYMENT_CLIENT_ROOT.md) for client root deployment

## Project Structure

```
SmartHire/
├── client/              # Frontend React application
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   └── package.json     # Client dependencies
├── server/              # Backend Express server
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   └── storage.ts       # Database operations
├── shared/              # Shared code between client and server
├── uploads/             # Uploaded files directory
└── package.json         # Root dependencies and scripts
```

## Available Scripts

### Root Directory
- `npm run dev`: Start both frontend and backend in development mode
- `npm run dev:server`: Start only the backend server
- `npm run dev:client`: Start only the frontend client
- `npm run build`: Build both frontend and backend for production
- `npm start`: Start the production server

### Client Directory
- `npm run dev`: Start the frontend development server
- `npm run build`: Build the frontend for production
- `npm run preview`: Preview the production build locally

## Demo Credentials

- **Super Admin**: 
  - Email: superadmin@smarthire.com
  - Password: password123
  - Role: Super Admin

- **Company Admin**: 
  - Email: admin@techcorp.com
  - Password: password123
  - Role: Company Admin
  - Company: TechCorp Inc

- **HR User**: 
  - Email: hr1@techcorp.com
  - Password: password123
  - Role: HR
  - Company: TechCorp Inc

## Troubleshooting

### Blank Page Issues
1. Check browser console for JavaScript errors
2. Verify that all required files are present in the build output
3. Ensure environment variables are correctly configured
4. Check vercel.json configuration matches your deployment settings

### API Connection Issues
1. Verify database connection settings
2. Check that the backend server is running
3. Confirm CORS settings for production deployments

### Authentication Issues
1. Ensure SESSION_SECRET is properly configured
2. Check that session cookies are being set correctly
3. Verify redirect URLs in authentication flows

## Support

For issues with the application, please check:
1. Console logs in browser developer tools
2. Server logs for backend errors
3. Network tab for failed API requests
4. Environment variable configuration

For Vercel deployment issues, refer to:
- [VERCEL_DEPLOYMENT_README.md](VERCEL_DEPLOYMENT_README.md) for project root deployment
- [VERCEL_DEPLOYMENT_CLIENT_ROOT.md](VERCEL_DEPLOYMENT_CLIENT_ROOT.md) for client root deployment
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for general deployment checklist