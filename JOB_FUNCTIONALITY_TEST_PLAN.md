# Job Functionality Test Plan

## Overview
This test plan verifies the complete functionality of job management in the SmartHire application, including adding new jobs and editing existing jobs. This plan specifically tests the fixes implemented for authentication redirects and edit job pre-filling issues.

## Test Environment
- Backend Server: http://localhost:3001
- Frontend Server: http://localhost:5173
- HR User Credentials:
  - Email: hr1@techcorp.com
  - Password: password123

## Recent Fixes Verified by This Test Plan
1. Fixed authentication redirects from "/api/login" to "/login"
2. Fixed edit job pre-filling to handle different property names (skillsRequired, experienceRequired)
3. Added authentication middleware to all job-related API endpoints
4. Corrected API base URL configuration

## Test Cases

### Test Case 1: Add New Job
**Objective**: Verify that HR users can successfully add new jobs to the system without authentication redirects.

**Pre-conditions**:
- Backend and frontend servers are running
- User is logged in as HR user

**Steps**:
1. Navigate to `/hr/jobs` page
2. Click "Add New Job" button
3. Verify the "Add New Job" modal appears
4. Fill in the following fields:
   - Job Title: "Frontend Developer"
   - Experience Required: "3-5 years"
   - Job Description: "Develop responsive web applications using React"
   - Skills: Add "React", "JavaScript", "CSS"
   - Number of Positions: 2
   - Status: Active
   - Additional Notes: "Experience with TypeScript preferred"
5. Click "Create Job" button
6. Verify success message is displayed ("Job created successfully")
7. Verify the modal closes
8. Verify the new job appears in the jobs table
9. Verify no redirects to "/api/login" occur during the process

**Expected Results**:
- Job is successfully created in the database
- Success message is displayed
- New job appears in the jobs table with correct information
- No errors or redirects to "/api/login" occur
- Network requests to `/api/jobs` return 200 status

### Test Case 2: Edit Existing Job
**Objective**: Verify that HR users can successfully edit existing jobs with proper pre-filling of data.

**Pre-conditions**:
- Backend and frontend servers are running
- User is logged in as HR user
- At least one job exists in the system

**Steps**:
1. Navigate to `/hr/jobs` page
2. Locate a job in the table (e.g., "Frontend Developer")
3. Click the edit icon (pencil) for that job
4. Verify the "Edit Job" modal appears
5. Verify all fields are pre-filled with existing job data:
   - Job Title shows correctly
   - Experience Required shows correctly (handles both "experience" and "experienceRequired" properties)
   - Skills show correctly (handles both "skills" and "skillsRequired" properties)
   - Other fields show correctly
6. Change the Job Title to "Senior Frontend Developer"
7. Add a new skill "TypeScript" to the skills list
8. Click "Update Job" button
9. Verify success message is displayed ("Job updated successfully")
10. Verify the modal closes
11. Verify the job title and skills are updated in the jobs table
12. Verify no redirects to "/api/login" occur during the process

**Expected Results**:
- Job is successfully updated in the database
- Success message is displayed
- Job information is updated in the jobs table
- All existing data (not changed) is preserved
- No errors or redirects to "/api/login" occur
- Network requests to `/api/jobs/{id}` return 200 status

### Test Case 3: Form Validation
**Objective**: Verify that form validation works correctly for required fields.

**Pre-conditions**:
- Backend and frontend servers are running
- User is logged in as HR user

**Steps**:
1. Navigate to `/hr/jobs` page
2. Click "Add New Job" button
3. Leave Job Title field empty
4. Fill in other fields with valid data
5. Click "Create Job" button
6. Verify validation error message is displayed ("Validation Error: Job title is required")
7. Fill in Job Title field with "Backend Developer"
8. Click "Create Job" button
9. Verify job is created successfully

**Expected Results**:
- Validation error is displayed for empty required fields
- Job is created only after validation passes
- No invalid data is saved to the database
- Proper error messages are shown to the user

### Test Case 4: Authentication Handling
**Objective**: Verify that authentication is properly handled throughout job operations.

**Pre-conditions**:
- Backend and frontend servers are running

**Steps**:
1. Navigate to `/hr/jobs` page without logging in
2. Verify redirect to login page occurs (not "/api/login")
3. Log in as HR user
4. Navigate to `/hr/jobs` page
5. Click "Add New Job" button
6. Verify the modal appears without authentication errors
7. Fill in job details
8. Click "Create Job" button
9. Verify job is created without authentication redirects
10. Click edit icon for the newly created job
11. Verify edit modal appears with pre-filled data
12. Make changes and click "Update Job"
13. Verify job is updated without authentication redirects

**Expected Results**:
- Unauthenticated users are redirected to "/login" (not "/api/login")
- Authenticated users can access job functionality
- No "/api/login" redirects occur during job operations
- All operations complete successfully
- Session remains active throughout the process

## Troubleshooting

### If Add Job Fails
1. Check browser console for error messages
2. Verify backend server is running on port 3001
3. Check network tab for failed API requests to `/api/jobs` (POST)
4. Verify user is properly authenticated
5. Check that API base URL is configured correctly (should be http://localhost:3001)

### If Edit Job Fails
1. Check browser console for error messages
2. Verify job data is properly loaded in the edit modal
3. Check network tab for failed API requests to `/api/jobs/{id}` (PUT)
4. Verify user is properly authenticated
5. Check that the job ID is correctly passed in the URL

### If Authentication Redirects to "/api/login" Occur
1. Verify user is logged in
2. Check that API endpoints have proper authentication middleware
3. Verify session is active
4. Clear browser cache and try again
5. Check that all redirect URLs point to "/login" not "/api/login"

## Success Criteria
- All test cases pass
- No errors or unexpected redirects
- Jobs are properly stored and updated in the database
- User interface behaves as expected
- Authentication redirects correctly point to "/login"
- Edit job forms properly pre-fill data from different property names
- All job-related API endpoints are protected by authentication middleware