# Upload & Matching Functionality Test

This document outlines the test plan to verify that the upload and matching functionality works correctly after our fixes.

## Test Scenarios

### Prerequisites
1. Ensure both backend and frontend servers are running
2. Ensure database is properly set up with jobs
3. Have test resume files ready

### Step 1: Upload Resume Files
- [ ] Navigate to http://localhost:5173/hr/upload
- [ ] Login as HR user (hr1@techcorp.com / password123)
- [ ] Select test-resume.txt and test-resume2.txt files
- [ ] Click "Upload and Extract Data" button
- [ ] Verify that candidate data is extracted and displayed in the table

### Step 2: Extracted Candidates and Job Matching
- [ ] Select a job role from the dropdown (e.g., "Frontend Developer")
- [ ] Click "Analyze & Percentage Match" button
- [ ] Verify that Agent 2 is called (check backend logs)
- [ ] Verify that match results are displayed correctly:
  - [ ] match_percentage is shown as a numerical score
  - [ ] Strengths are displayed as bulleted lists
  - [ ] Areas for Improvement are displayed as bulleted lists

### Step 3: Interview Questions Generation
- [ ] Click "Interview Questions" button for a candidate
- [ ] Verify that Agent 3 is called (check backend logs)
- [ ] Verify that the popup displays three sections:
  - [ ] Technical Questions
  - [ ] Behavioral Questions
  - [ ] Job-Specific Questions

### Step 4: Add Selected Candidates
- [ ] Select one or more candidates using checkboxes
- [ ] Verify that "Add Selected Candidates" button becomes enabled
- [ ] Click "Add Selected Candidates" button
- [ ] Verify that candidates are added to the database:
  - [ ] Check backend logs for successful addition
  - [ ] Verify that status is set to "Resume Reviewed"
  - [ ] Confirm redirection to /hr/candidates page

## Expected Results

### Match Analysis Backend Verification
- [ ] match_percentage should be a single numerical score
- [ ] Strengths should be bulleted lists of qualitative points
- [ ] Areas for Improvement should be bulleted lists of qualitative points
- [ ] Points in Strengths and Areas for Improvement should sum to 100

### Interview Questions Verification
- [ ] Technical Questions should reference candidate's specific technologies
- [ ] Behavioral Questions should reference candidate's experience
- [ ] Job-Specific Questions should connect candidate's background to job requirements

### Candidate Selection Verification
- [ ] Checkboxes should allow selecting/unselecting candidates
- [ ] "Add Selected Candidates" button should be initially disabled
- [ ] Button should become enabled when at least one candidate is selected

## Troubleshooting

If any step fails:
1. Check browser console for JavaScript errors
2. Check backend server logs for error messages
3. Verify that database connection is working
4. Ensure all required environment variables are set
5. Confirm that test files are in the correct location