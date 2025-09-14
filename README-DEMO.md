# SmartHire Application - Demo Mode

This guide explains how to run the SmartHire application in demo mode with pre-populated dummy data.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Running the Application in Demo Mode

### Option 1: Using the PowerShell Script (Recommended for Windows)

1. Open PowerShell as Administrator
2. Navigate to the project directory:
   ```powershell
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```
3. Run the demo script:
   ```powershell
   .\start-demo.ps1
   ```

### Option 2: Using the Batch File

1. Navigate to the project directory:
   ```cmd
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```
2. Run the demo batch file:
   ```cmd
   start-demo.bat
   ```

### Option 3: Using npm Scripts

1. Open a terminal/command prompt and navigate to the project directory:
   ```cmd
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```

2. Run the demo script:
   ```cmd
   npm run dev
   ```

### Option 4: Manual Start

1. Open a terminal/command prompt and navigate to the project directory:
   ```cmd
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```

2. Start the backend server:
   ```cmd
   set NODE_ENV=development
   npx tsx server/index.ts
   ```

3. Open another terminal/command prompt and navigate to the client directory:
   ```cmd
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire\client
   ```

4. Start the frontend:
   ```cmd
   npx vite --host
   ```

## Accessing the Application

Once both the backend and frontend are running:

1. Open your web browser
2. Navigate to: http://localhost:5175
3. Note: The frontend server will automatically find an available port starting from 5173. Check the terminal output to confirm the exact port being used.

Use the following demo credentials to log in:

### Demo Credentials

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

## Demo Data

The application comes with pre-populated demo data including:

- 4 Job postings
- 5 Candidate profiles
- Notifications and To-Dos
- Chart data for dashboard visualization

All data is stored in the browser's localStorage when running in demo mode, so no database connection is required.

## Testing Upload & Add Functionality

To test the Upload & Add page functionality:

1. Log in as an HR user
2. Navigate to the Upload & Add page (`/hr/upload`)
3. Use the provided test-resume.txt file for testing
4. Follow the three-step process:
   - Upload resume files
   - Select job and analyze match
   - Add selected candidates
5. Refer to UPLOAD_TEST_PLAN.md for detailed test cases

## Troubleshooting

### Blank Page After Login

If you see a blank page after logging in:

1. Open browser developer tools (F12)
2. Check the Console tab for any error messages
3. Refresh the page (Ctrl+R or F5)
4. Clear browser cache and try again

### Port Conflicts

If you see port conflict errors:

1. The backend server runs on port 3001 by default
2. The frontend runs on port 5173 by default (may use alternative ports if needed)
3. If these ports are in use, the application will automatically try alternative ports

### Database Connection Issues

In demo mode, no database connection is required. All data is stored in the browser's localStorage.

### Database Setup

If you want to use the application with a real database instead of demo mode:

1. Run the database setup script:
   ```powershell
   .\setup-database.ps1
   ```

This will populate the database with initial data including users, jobs, candidates, notifications, and todos.