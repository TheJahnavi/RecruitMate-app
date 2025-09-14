// Test script to verify upload functionality
import fs from 'fs';

// Create a simple test resume
const testResume = `John Doe
Software Engineer

Email: john.doe@example.com

Summary:
Experienced software engineer with 5 years of experience in web development.
Skilled in JavaScript, React, Node.js, and Python.

Experience:
Senior Developer at Tech Corp (2020-Present)
- Developed web applications using React and Node.js
- Led a team of 3 developers
- Implemented CI/CD pipelines

Projects:
E-commerce Platform (2021)
- Built with React, Node.js, and MongoDB
- Implemented payment processing
- Skills: React, Node.js, MongoDB, Payment APIs

Education:
B.S. Computer Science, University of Technology (2015-2019)
`;

// Write test resume to file
fs.writeFileSync('test-resume.txt', testResume);
console.log('Created test-resume.txt');

console.log('To test the upload functionality:');
console.log('1. Start both servers (backend on port 3001, frontend on port 5175)');
console.log('2. Navigate to http://localhost:5175');
console.log('3. Log in as HR user');
console.log('4. Go to Upload & Add page (/hr/upload)');
console.log('5. Upload the test-resume.txt file');
console.log('6. Select a job from the dropdown');
console.log('7. Click "Analyze and Match"');
console.log('8. Verify that match results are displayed');
console.log('9. Click "Add Selected Candidates"');
console.log('10. Verify redirection to Candidates page with new candidate');