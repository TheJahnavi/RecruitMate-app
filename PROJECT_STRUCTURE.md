# SmartHire Project Structure

This document explains the organized structure of the SmartHire application.

## Directory Structure

```
SmartHire/
├── SmartHire/                 # Main application directory
│   ├── client/                # Frontend React application
│   │   ├── src/               # Source code
│   │   ├── index.html         # HTML entry point
│   │   ├── package.json       # Client dependencies
│   │   ├── vite.config.ts     # Vite configuration for client
│   │   ├── tailwind.config.ts # Tailwind configuration for client
│   │   └── ...                # Other client files
│   ├── server/                # Backend Express server
│   │   ├── index.ts           # Server entry point
│   │   ├── routes.ts          # API routes
│   │   └── ...                # Other server files
│   ├── shared/                # Shared code between client and server
│   │   └── schema.ts          # Database schema
│   ├── start-demo.ps1         # Demo start script
│   ├── setup-database.ps1     # Database setup script
│   └── ...                    # Other project files
├── package.json               # Root package.json with build scripts
├── vercel.json               # Vercel deployment configuration
├── vite.config.ts            # Vite configuration for monorepo
├── tailwind.config.ts        # Tailwind configuration for monorepo
├── drizzle.config.ts         # Drizzle ORM configuration
├── postcss.config.js         # PostCSS configuration
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
└── ...                       # Documentation and test files
```

## Key Directories and Files

### Root Directory
- **package.json**: Contains scripts for building and running the entire application
- **vercel.json**: Configuration for Vercel deployment
- **vite.config.ts**: Vite configuration for the monorepo setup
- **tailwind.config.ts**: Tailwind configuration for the monorepo
- **drizzle.config.ts**: Drizzle ORM configuration
- **postcss.config.js**: PostCSS configuration

### SmartHire/client/
Contains the React frontend application with its own build configuration.

### SmartHire/server/
Contains the Express backend server with API routes and database operations.

### SmartHire/shared/
Contains shared code between client and server, primarily the database schema.

## Deployment

The application is configured for deployment on Vercel with the following setup:
- Build command: `cd client && npm install && npm run build`
- Output directory: `client/dist`
- The vercel.json in the root directory configures the deployment to use the client directory for builds.

## Development

To run the application locally:
1. Navigate to the root directory
2. Run `npm run dev` to start both frontend and backend
3. Or run `npm run dev:demo` for demo mode