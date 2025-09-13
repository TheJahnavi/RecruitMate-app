# SmartHire Enhanced AI Agents Documentation

## Overview

The SmartHire application now features three powerful AI agents powered by Google Gemini 2.5 Flash that revolutionize the hiring process through intelligent resume analysis, candidate matching, and interview preparation.

## AI Agent Architecture

### Agent 1: Data Extraction Agent
**Purpose**: Extract comprehensive candidate information from resumes (PDF, DOCX, TXT)

**Enhanced Features**:
- **Portfolio Link Detection**: Automatically finds GitHub, LinkedIn, personal websites
- **Detailed Experience Analysis**: Separates work experience from project experience
- **Advanced Skill Extraction**: Identifies technical skills, frameworks, tools, and languages
- **Project Timeline Analysis**: Calculates experience duration accurately

**Input**: Resume file content (text)
**Output**: Structured candidate profile with enhanced data fields

```typescript
interface ExtractedCandidate {
  name: string;
  email: string;
  skills: string[];
  experience: ExperienceData;
  summary: string;
  portfolioLink?: string;          // NEW: Portfolio/GitHub links
  workExperience: string;          // NEW: Work experience description
  projectExperience: string;       // NEW: Project experience description
}
```

### Agent 2: Percentage Match & Analysis Agent
**Purpose**: Perform detailed candidate-to-job matching with skill-level analysis

**Enhanced Features**:
- **Skill-Level Breakdown**: Individual skill matching with percentages
- **Consistent Scoring**: Deterministic matching for reproducible results
- **Detailed Reasoning**: Comprehensive strengths and improvement areas
- **Match Report Generation**: HTML reports with visual skill analysis

**Input**: Candidate data + Job requirements
**Output**: Detailed match analysis with skill breakdown

```typescript
interface JobMatchResult {
  name: string;
  email: string;
  matchPercentage: number;
  "percentage match summary": string;
  skillMatchBreakdown: {                    // NEW: Individual skill analysis
    skill: string;
    matchLevel: "Strong" | "Moderate" | "Weak" | "Missing";
    percentage: number;
    explanation: string;
  }[];
  strengthsBehindReasons: StrengthReason[];
  lagBehindReasons: LagReason[];
  reportUrl?: string;                       // NEW: Generated report URL
}
```

### Agent 3: Interview Questions Generation Agent
**Purpose**: Generate tailored interview questions based on candidate profile and job requirements

**Enhanced Features**:
- **Context-Aware Questions**: Questions reference specific candidate projects and experience
- **Three Question Categories**: Technical, Behavioral, and Job-Specific
- **Experience Integration**: Questions incorporate candidate's work and project history
- **Role-Specific Customization**: Questions tailored to the specific job position

**Input**: Candidate profile + Job details
**Output**: Categorized interview questions

```typescript
interface InterviewQuestions {
  technical: string[];     // 5-6 technical questions based on required skills
  behavioral: string[];    // 4-5 behavioral questions
  jobSpecific: string[];   // 3-4 questions specific to role and candidate
}
```

## Implementation Guide

### 1. AI Agent Functions

#### Data Extraction
```typescript
import { extractResumeData } from './server/gemini';

const candidate = await extractResumeData(resumeText);
```

#### Percentage Matching
```typescript
import { calculateJobMatch } from './server/gemini';

const matchResult = await calculateJobMatch(
  candidate,
  jobTitle,
  requiredSkills,
  jobDescription,
  experienceRequired,
  additionalNotes
);
```

#### Interview Questions
```typescript
import { generateInterviewQuestions } from './server/gemini';

const questions = await generateInterviewQuestions(
  candidate,
  jobTitle,
  jobDescription,
  requiredSkills
);
```

#### Match Report Generation
```typescript
import { generateMatchReport } from './server/gemini';

const reportHTML = await generateMatchReport(
  candidate,
  jobTitle,
  jobDescription,
  matchResult
);
```

### 2. Frontend Integration

The Upload.tsx component implements a four-step workflow:

1. **Upload & Extract**: File upload and AI data extraction
2. **Job Selection & Analysis**: Job role selection and percentage matching
3. **Review & Selection**: Candidate review with detailed match analysis
4. **Database Addition**: Add selected candidates to the system

**Key Features**:
- Enhanced candidate data display with portfolio links
- Skill-level breakdown visualization
- Interview question generation and display
- Match report generation and viewing
- Checkbox selection for multiple candidates

### 3. Database Schema Enhancements

Updated candidates table to support enhanced features:

```sql
ALTER TABLE candidates ADD COLUMN work_experience TEXT;
ALTER TABLE candidates ADD COLUMN project_experience TEXT;
ALTER TABLE candidates ADD COLUMN portfolio_link TEXT;
ALTER TABLE candidates ADD COLUMN interview_questions JSONB;
ALTER TABLE candidates ADD COLUMN skill_match_breakdown JSONB;
```

### 4. API Endpoints

#### Resume Upload and Extraction
```
POST /api/upload/resumes
Content-Type: multipart/form-data
Body: Form data with resume files
```

#### Candidate Matching
```
POST /api/ai/match-candidates
Body: { candidates: ExtractedCandidate[], jobId: string }
```

#### Interview Questions Generation
```
POST /api/ai/generate-questions
Body: { candidate: ExtractedCandidate, jobId: number }
```

#### Match Report Generation
```
POST /api/ai/generate-report
Body: { candidate: ExtractedCandidate, jobId: string, matchResult: JobMatchResult }
```

#### Report Viewing
```
GET /api/reports/:filename
Response: HTML report for viewing in browser
```

## Configuration

### Environment Variables Required
```bash
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
```

### Supported File Formats
- PDF (.pdf)
- Microsoft Word (.docx)
- Plain Text (.txt)

### File Size Limits
- Maximum file size: 10MB per resume
- Multiple file upload supported

## Features Summary

### Enhanced Data Extraction
✅ **Portfolio Link Detection**: GitHub, LinkedIn, personal websites  
✅ **Experience Separation**: Work vs. project experience  
✅ **Comprehensive Skill Analysis**: Technical skills, tools, frameworks  
✅ **Project Timeline Calculation**: Accurate experience duration  

### Advanced Matching
✅ **Skill-Level Breakdown**: Individual skill matching percentages  
✅ **Consistent Scoring**: Deterministic results for same inputs  
✅ **Visual Reports**: HTML reports with styling and charts  
✅ **Detailed Analysis**: Strengths, weaknesses, and recommendations  

### Smart Interview Preparation
✅ **Context-Aware Questions**: Reference specific candidate projects  
✅ **Multi-Category Questions**: Technical, behavioral, job-specific  
✅ **Experience Integration**: Questions based on actual experience  
✅ **Role Customization**: Tailored to specific job requirements  

### User Experience
✅ **Enhanced UI**: Better data visualization and interaction  
✅ **Batch Processing**: Multiple resume handling  
✅ **Selection Management**: Checkbox-based candidate selection  
✅ **Report Integration**: Generated reports accessible in UI  

## Testing

Use the provided test script to validate AI agent functionality:

```bash
# Set your Gemini API key
$env:GEMINI_API_KEY="your_api_key_here"

# Run the test
npx tsx test-ai-agents.ts
```

This will test all three AI agents with sample data and validate the enhanced features.

## Error Handling

The AI agents include comprehensive error handling:

- **Resume Parsing Errors**: Graceful handling of corrupted files
- **API Rate Limiting**: Proper error messages for API limits
- **Data Validation**: Schema validation for extracted data
- **Consistent Fallbacks**: Default values for missing information

## Performance Considerations

- **Batch Processing**: Multiple resumes processed efficiently
- **Deterministic Matching**: Consistent results reduce redundant API calls
- **Report Caching**: Generated reports stored for reuse
- **Async Processing**: Non-blocking operations for better UX

## Security Features

- **File Validation**: Only allowed file types processed
- **Content Sanitization**: Extracted data sanitized before storage
- **Temporary File Cleanup**: Uploaded files cleaned after processing
- **API Key Protection**: Secure handling of Gemini API credentials