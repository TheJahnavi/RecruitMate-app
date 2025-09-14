# Comprehensive Test Plan for SmartHire Application

## Overview
This comprehensive test plan verifies all the fixes implemented for the SmartHire application, including job management, authentication, and AI functionality.

## Test Environment
- Backend Server: http://localhost:3001
- Frontend Server: http://localhost:5173
- Test Credentials:
  - HR User: hr1@techcorp.com / password123
  - Company Admin: admin@techcorp.com / password123
  - Super Admin: superadmin@smarthire.com / password123

## Fixes Verified by This Test Plan

### 1. Authentication Redirect Fixes
- All components now redirect to "/login" instead of "/api/login"
- No more "Page Not Found" errors when authentication expires

### 2. Job Management Fixes
- Add New Job functionality works correctly
- Edit Job pre-filling handles different property names
- Job data is properly stored and updated in the database

### 3. AI and Upload Functionality Fixes
- All AI endpoints are properly protected by authentication
- Upload and extract functionality works without errors
- Match candidates, generate questions, and generate report work correctly

### 4. API Configuration Fixes
- API base URL correctly points to port 3001
- All API requests are properly formed and authenticated

## Test Cases

### Test Suite 1: Authentication and Login

#### Test Case 1.1: Login Redirect Verification
**Objective**: Verify unauthenticated users are redirected to "/login"

**Steps**:
1. Open an incognito/private browser window
2. Navigate directly to http://localhost:5173/hr/jobs
3. Verify redirect to login page (not "/api/login")
4. Log in with HR credentials
5. Verify successful navigation to jobs page

#### Test Case 1.2: Session Timeout Handling
**Objective**: Verify expired sessions are handled correctly

**Steps**:
1. Log in as HR user
2. Navigate to any page
3. Clear browser cookies or wait for session to expire
4. Perform any action that requires authentication
5. Verify redirect to "/login" (not "/api/login")

### Test Suite 2: Job Management Functionality

#### Test Case 2.1: Add New Job
**Objective**: Verify HR users can add new jobs

**Steps**:
1. Log in as HR user
2. Navigate to /hr/jobs
3. Click "Add New Job" button
4. Fill in job details:
   - Job Title: "Frontend Developer"
   - Experience Required: "3-5 years"
   - Job Description: "Develop responsive web applications"
   - Skills: React, JavaScript, CSS
   - Number of Positions: 2
   - Status: Active
5. Click "Create Job"
6. Verify success message
7. Verify job appears in table

#### Test Case 2.2: Edit Existing Job
**Objective**: Verify HR users can edit existing jobs with proper pre-filling

**Steps**:
1. Log in as HR user
2. Navigate to /hr/jobs
3. Click edit icon for any job
4. Verify all fields are pre-filled correctly:
   - Job Title shows correctly
   - Experience shows correctly (handles both "experience" and "experienceRequired")
   - Skills show correctly (handles both "skills" and "skillsRequired")
5. Change Job Title to "Senior Frontend Developer"
6. Add skill "TypeScript"
7. Click "Update Job"
8. Verify success message
9. Verify job is updated in table

#### Test Case 2.3: Delete Job
**Objective**: Verify HR users can delete jobs

**Steps**:
1. Log in as HR user
2. Navigate to /hr/jobs
3. Click delete icon for any job
4. Confirm deletion
5. Verify success message
6. Verify job is removed from table

### Test Suite 3: Candidate Management Functionality

#### Test Case 3.1: Add New Candidate
**Objective**: Verify HR users can add new candidates

**Steps**:
1. Log in as HR user
2. Navigate to /hr/candidates
3. Click "Add New Candidate" button
4. Fill in candidate details
5. Click "Add Candidate"
6. Verify success message
7. Verify candidate appears in table

#### Test Case 3.2: Edit Candidate
**Objective**: Verify HR users can edit candidate details

**Steps**:
1. Log in as HR user
2. Navigate to /hr/candidates
3. Click edit icon for any candidate
4. Verify form is pre-filled correctly
5. Make changes to candidate details
6. Click "Update Candidate"
7. Verify success message
8. Verify candidate is updated in table

### Test Suite 4: Upload and AI Functionality

#### Test Case 4.1: Upload Resumes
**Objective**: Verify resume upload and extraction works correctly

**Steps**:
1. Log in as HR user
2. Navigate to /hr/upload
3. Click "Choose Files" and select test-resume.txt
4. Click "Upload Resumes"
5. Verify files are uploaded successfully
6. Verify candidate data is extracted correctly

#### Test Case 4.2: Match Candidates
**Objective**: Verify candidate matching functionality

**Steps**:
1. Log in as HR user
2. Navigate to /hr/upload
3. Upload resumes if not already done
4. Select a job position
5. Click "Analyze Match"
6. Verify match percentages are calculated
7. Verify match details are displayed

#### Test Case 4.3: Generate Interview Questions
**Objective**: Verify interview question generation

**Steps**:
1. Log in as HR user
2. Navigate to /hr/upload
3. Complete candidate matching if not already done
4. Select a candidate
5. Click "Generate Questions"
6. Verify questions are generated and displayed

#### Test Case 4.4: Generate Match Report
**Objective**: Verify match report generation

**Steps**:
1. Log in as HR user
2. Navigate to /hr/upload
3. Complete candidate matching if not already done
4. Select a candidate
5. Click "Generate Report"
6. Verify report is generated and can be viewed

### Test Suite 5: API and Security Verification

#### Test Case 5.1: API Endpoint Authentication
**Objective**: Verify all API endpoints are properly protected

**Steps**:
1. Attempt to access API endpoints without authentication:
   - GET /api/jobs
   - POST /api/jobs
   - POST /api/upload/resumes
   - POST /api/ai/match-candidates
2. Verify all requests return 401 Unauthorized
3. Log in and verify authenticated requests succeed

#### Test Case 5.2: API Base URL Configuration
**Objective**: Verify API requests are sent to correct URL

**Steps**:
1. Open browser developer tools
2. Navigate to any page that makes API requests
3. Check Network tab
4. Verify all API requests go to http://localhost:3001
5. Verify no requests go to incorrect ports

## Success Criteria

All test cases must pass with the following criteria:

1. **No Authentication Redirects to "/api/login"**:
   - All authentication redirects point to "/login"
   - No "Page Not Found" errors occur

2. **Job Management Functionality**:
   - Add New Job creates records in database
   - Edit Job pre-fills data correctly
   - Edit Job handles different property names (skillsRequired, experienceRequired)
   - Delete Job removes records from database

3. **Candidate Management Functionality**:
   - Add and edit candidates work correctly
   - Form validation works properly

4. **Upload and AI Functionality**:
   - Resume upload and extraction work without errors
   - Candidate matching calculates percentages correctly
   - Interview questions are generated appropriately
   - Match reports are created and accessible

5. **API and Security**:
   - All endpoints are properly protected by authentication
   - API requests are sent to correct URLs
   - No unauthorized access is possible

## Troubleshooting Guide

### If Authentication Issues Occur
1. Verify all redirect URLs point to "/login" not "/api/login"
2. Check that all API endpoints have authentication middleware
3. Verify session is active and cookies are enabled
4. Clear browser cache and try again

### If Job Management Issues Occur
1. Check browser console for JavaScript errors
2. Verify API requests to job endpoints are successful
3. Check that edit forms handle different property names
4. Verify form validation is working correctly

### If Upload/AI Issues Occur
1. Check browser console for errors
2. Verify all AI endpoints are authenticated
3. Check network tab for failed API requests
4. Verify file uploads are processed correctly

### If API Configuration Issues Occur
1. Verify API base URL is set to http://localhost:3001
2. Check that all API requests go to correct port
3. Verify environment variables are set correctly

## Files Modified for These Fixes

| Category | Files Modified |
|----------|----------------|
| Authentication Redirects | Jobs.tsx, Candidates.tsx, AddJobModal.tsx, EditCandidateModal.tsx, AddCandidateModal.tsx, Notifications.tsx |
| Job Management | AddJobModal.tsx |
| API Security | routes.ts |
| API Configuration | apiConfig.ts |
| Test Documentation | Multiple test plans and instructions |

This comprehensive test plan ensures all fixes are working correctly and the application functions as expected.