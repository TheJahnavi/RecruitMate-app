# SmartHire Application - Running Instructions

This document provides detailed instructions on how to run the SmartHire application with demo data.

## Overview

The SmartHire application is designed to work with a PostgreSQL database. It can run in two modes:
1. **Database Mode**: Connects to a real PostgreSQL database (default)
2. **Demo Mode**: Uses browser localStorage instead of a database connection

For the best experience, we recommend using the database mode with the provided database credentials.

## Prerequisites

1. Node.js (version 16 or higher)
2. npm or yarn package manager
3. Windows PowerShell (for PowerShell scripts)

## Available Run Options

### 1. Using npm Scripts (Recommended)

Open a terminal in the project root directory (`c:\Users\deepa\Downloads\SmartHire\SmartHire`) and run:

```bash
npm run dev
```

This command will:
- Start both the backend server and frontend client concurrently
- Use the database credentials from the .env file
- Connect to the real PostgreSQL database

### 2. Using PowerShell Script

1. Navigate to the project directory:
   ```powershell
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```

2. Run the PowerShell script:
   ```powershell
   .\start-demo.ps1
   ```

### 3. Using Batch File

1. Navigate to the project directory:
   ```cmd
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   ```

2. Run the batch file:
   ```cmd
   start-demo.bat
   ```

### 4. Manual Start

1. Open a terminal and start the backend server:
   ```cmd
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire
   set NODE_ENV=development
   npx tsx server/index.ts
   ```

2. Open another terminal and start the frontend:
   ```cmd
   cd c:\Users\deepa\Downloads\SmartHire\SmartHire\client
   npx vite --host
   ```

## Accessing the Application

Once both the backend and frontend are running:

1. Open your web browser
2. Navigate to: http://localhost:5175

Note: The frontend server will automatically find an available port starting from 5173. Check the terminal output to confirm the exact port being used.

## Login Credentials

Use these credentials to log in as an HR user:

- **Email**: hr1@techcorp.com
- **Password**: password123
- **Role**: HR
- **Company**: TechCorp Inc

Other available accounts:
- **Super Admin**: superadmin@smarthire.com / password123
- **Company Admin**: admin@techcorp.com / password123

## Demo Data Included

The application comes with pre-populated demo data:

### Jobs (4 records)
1. Frontend Developer
2. Backend Engineer
3. UX Designer
4. Data Scientist

### Candidates (5 records)
1. John Smith
2. Sarah Johnson
3. Michael Brown
4. Emily Davis
5. David Wilson

### Notifications (5 records)
- New candidate matches
- Interview schedules
- Hiring updates

### To-Dos (4 records)
- Resume reviews
- Interview scheduling
- Onboarding tasks

### Chart Data
- Monthly job openings vs. filled positions
- Candidate status distribution

## HR User Flow Verification

After logging in as an HR user, the application should:

1. **Redirect to HR Dashboard**: Automatically navigate to `/hr/dashboard`
2. **Display Dashboard Cards**:
   - Total Candidates: 5
   - Total Job Positions: 4
   - Candidates in Process: 3 (not hired or not selected)
3. **Show Charts**:
   - Jobs Opened vs. Filled (Stacked Column Chart)
   - Hiring Pipeline (Funnel Chart)
   - Candidate Status Distribution (Bar Chart)
4. **Navigation Bar**:
   - Fixed top navigation bar
   - Links to Jobs, Candidates, Upload & Add, and Profile pages
   - Theme toggle (light/dark mode)
   - Notifications and To-Dos icons
   - User profile section

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

In demo mode, no database connection is required. All data is stored in the browser's localStorage. If you see database connection errors, make sure you're running in demo mode.

## Testing Job Functionality

To test the job management features:

1. Log in as HR user (hr1@techcorp.com / password123)
2. Navigate to the Jobs page (`/hr/jobs`)
3. Test adding a new job:
   - Click "Add New Job" button
   - Fill in job details in the modal:
     * Job Title: "Frontend Developer"
     * Job Description: "Develop responsive web applications"
     * Experience Required: "2-4 years"
     * Skills: Add "React", "JavaScript", "CSS"
     * Number of Positions: 2
     * Status: Active
     * Additional Notes: "Urgent hiring"
   - Click "Create Job" to save
   - Verify success message appears and job shows in table
4. Test editing an existing job:
   - Click the edit icon (pencil) next to any job
   - Verify the modal is pre-filled with existing data
   - Make changes to job details
   - Click "Update Job" to save
   - Verify success message appears and job is updated in table
5. Test deleting a job:
   - Click the delete icon (trash) next to any job
   - Confirm deletion in the prompt
   - Verify success message appears and job is removed from table
6. Refer to JOB_FUNCTIONALITY_TEST_PLAN.md for detailed test cases

## Verifying Demo Mode

To confirm the application is running in demo mode:

1. Open browser developer tools (F12)
2. Go to the Application tab
3. Check Local Storage - you should see keys like:
   - `demoMode`: should be "true"
   - `demoJobs`: JSON array of jobs
   - `demoCandidates`: JSON array of candidates
   - `demoNotifications`: JSON array of notifications
   - `demoTodos`: JSON array of todos

## Stopping the Application

To stop the application:

1. In each terminal window, press `Ctrl+C`
2. Close all terminal windows

## Database Setup

To set up the database with initial data:

1. Run the database setup script:
   ```powershell
   .\setup-database.ps1
   ```

This will create the necessary tables and populate them with initial data.

## Additional Notes

- All data in demo mode is stored in your browser's localStorage
- Clearing browser data will remove all demo data
- Changes made in demo mode will persist between sessions
- The application works completely offline in demo mode