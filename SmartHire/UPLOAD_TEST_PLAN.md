# SmartHire Upload & Add Page Functionality Test Plan

## Overview
This test plan verifies the complete functionality of the Upload & Add page (`/hr/upload`) including the three-step process:
1. Upload Resume Files
2. Extracted Candidates (analyze & match)
3. Add Selected Candidates

## Test Cases

### Step 1: Upload Resume Files

**Test Case 1.1: Multi-file Upload**
- [ ] Navigate to `/hr/upload`
- [ ] Select multiple resume files (PDF, DOCX, TXT)
- [ ] Click "Upload and Extract Data"
- [ ] Verify files are uploaded successfully
- [ ] Verify extracted candidate data is displayed in table

**Test Case 1.2: File Type Validation**
- [ ] Attempt to upload unsupported file types (e.g., .jpg, .png)
- [ ] Verify error message is displayed
- [ ] Verify only supported files are processed

**Test Case 1.3: File Size Validation**
- [ ] Attempt to upload files larger than 10MB
- [ ] Verify error message is displayed
- [ ] Verify large files are rejected

### Step 2: Extracted Candidates

**Test Case 2.1: Job Role Dropdown**
- [ ] Verify job role dropdown is populated
- [ ] Verify only jobs handled by logged-in HR user are listed
- [ ] Select a job role from the dropdown

**Test Case 2.2: Analyze and Match**
- [ ] Click "Analyze and Match" button
- [ ] Verify Agent 2 is triggered
- [ ] Verify match results are displayed in table
- [ ] Verify match_percentage is a single numerical score
- [ ] Verify Strengths and Areas for Improvement are displayed as bulleted lists

**Test Case 2.3: Match Analysis Verification**
- [ ] Verify match_percentage is calculated correctly
- [ ] Verify skillMatchBreakdown shows individual skill matches
- [ ] Verify strengthsBehindReasons shows positive points
- [ ] Verify lagBehindReasons shows areas for improvement

**Test Case 2.4: Interview Questions**
- [ ] Click "Interview Questions" button for a candidate
- [ ] Verify Agent 3 is triggered
- [ ] Verify popup displays with three sections:
  - [ ] Technical Questions
  - [ ] Behavioral Questions
  - [ ] Job-Specific Questions
- [ ] Verify questions are relevant to candidate experience and job description

### Step 3: Add Selected Candidates

**Test Case 3.1: Candidate Selection**
- [ ] Verify checkboxes are available for each candidate
- [ ] Select one or more candidates
- [ ] Verify "Add Selected Candidates" button becomes enabled
- [ ] Unselect all candidates
- [ ] Verify "Add Selected Candidates" button becomes disabled

**Test Case 3.2: Add Candidates to Database**
- [ ] Select one or more candidates
- [ ] Click "Add Selected Candidates" button
- [ ] Verify candidates are added to database
- [ ] Verify candidates have status "Resume Reviewed"
- [ ] Verify redirection to `/hr/candidates` page
- [ ] Verify newly added candidates appear in candidates table

### Error Handling

**Test Case 4.1: Backend API Errors**
- [ ] Simulate backend API failure during upload
- [ ] Verify appropriate error message is displayed
- [ ] Verify UI remains functional

**Test Case 4.2: Network Errors**
- [ ] Simulate network disconnection during upload
- [ ] Verify appropriate error message is displayed
- [ ] Verify retry mechanism works

## Expected Results

1. Resume files upload successfully
2. Candidate data is extracted accurately
3. Job matching works correctly with percentage scores
4. Interview questions are generated appropriately
5. Selected candidates are added to database with correct status
6. Page redirects to candidates list after adding candidates
7. All error conditions are handled gracefully

## Manual Testing Steps

1. Access the application at http://localhost:5175
2. Log in as HR user
3. Navigate to Upload & Add page
4. Use the test-resume.txt file for testing
5. Follow the three-step process:
   - Upload resume files
   - Select job and analyze match
   - Add selected candidates
6. Verify all functionality works as expected

# Upload & Matching Flow Test Plan

This document outlines the test plan for verifying the complete upload and matching flow in the Upload & Add page.

## Test Scenarios

### Step 1: Upload Resume Files
- [ ] Upload 2 resume files successfully
- [ ] Extract data from uploaded resumes
- [ ] Display extracted candidate data in table

### Step 2: Extracted Candidates
- [ ] Select job role from dropdown
- [ ] Click "Analyze & Percentage Match" button
- [ ] Verify Agent 2 is triggered
- [ ] New table correctly shows:
  - [ ] match_percentage
  - [ ] Strengths
  - [ ] Areas for Improvement

### Step 3: Add Selected Candidates
- [ ] Confirm "Add Selected Candidates" button is initially disabled
- [ ] Select at least one candidate
- [ ] Confirm "Add Selected Candidates" button becomes enabled
- [ ] Click "Add Selected Candidates" button
- [ ] Verify new records are created in Candidates collection
- [ ] Verify status is set to "Resume Reviewed"
- [ ] Confirm page redirects to /hr/candidates

## Verification Points

### Match Analysis Backend Verification
- [ ] match_percentage is a single numerical score
- [ ] Strengths are bulleted lists of qualitative points
- [ ] Areas for Improvement are bulleted lists of qualitative points
- [ ] Points in Strengths and Areas for Improvement do not need to sum up to match_percentage

### Interview Questions
- [ ] Clicking "Interview Questions" button triggers Agent 3
- [ ] Displays popup with three sections:
  - [ ] Technical Questions
  - [ ] Behavioral Questions
  - [ ] Job-Specific Questions
- [ ] Content is relevant to candidate's experience and job description

### Candidate Selection
- [ ] Checkbox option to select/unselect each candidate record
- [ ] Selected candidates are properly tracked
