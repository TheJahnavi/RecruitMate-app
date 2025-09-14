// Script to verify job routes are properly configured with authentication
import fs from 'fs';

// Read the routes file
const routesContent = fs.readFileSync('./SmartHire/server/routes.ts', 'utf8');

// Check for authentication middleware on job routes
const jobRoutes = [
  "app.get('/api/jobs'",
  "app.post('/api/jobs'",
  "app.put('/api/jobs/'",
  "app.delete('/api/jobs/'"
];

console.log('Verifying job routes authentication...');
console.log('=====================================');

let allRoutesAuthenticated = true;

jobRoutes.forEach(route => {
  if (routesContent.includes(route + ', isAuthenticated')) {
    console.log(`✓ ${route} - Properly authenticated`);
  } else if (routesContent.includes(route)) {
    console.log(`✗ ${route} - MISSING AUTHENTICATION`);
    allRoutesAuthenticated = false;
  } else {
    console.log(`? ${route} - Route not found`);
  }
});

console.log('\nVerifying AI routes authentication...');
console.log('===================================');

const aiRoutes = [
  "app.post('/api/upload/resumes'",
  "app.post('/api/ai/match-candidates'",
  "app.post('/api/ai/generate-questions'",
  "app.post('/api/ai/generate-report'",
  "app.get('/api/reports/'",
  "app.post('/api/candidates/add'"
];

aiRoutes.forEach(route => {
  if (routesContent.includes(route + ', isAuthenticated')) {
    console.log(`✓ ${route} - Properly authenticated`);
  } else if (routesContent.includes(route)) {
    console.log(`✗ ${route} - MISSING AUTHENTICATION`);
    allRoutesAuthenticated = false;
  } else {
    console.log(`? ${route} - Route not found`);
  }
});

console.log('\nSummary:');
console.log('========');
if (allRoutesAuthenticated) {
  console.log('✓ All job and AI routes are properly authenticated');
  console.log('✓ No authentication redirects to "/api/login" should occur');
} else {
  console.log('✗ Some routes are missing authentication middleware');
  console.log('✗ This may cause authentication redirects to "/api/login"');
}

console.log('\nTo test the functionality:');
console.log('1. Start both backend and frontend servers');
console.log('2. Log in as HR user');
console.log('3. Navigate to /hr/jobs');
console.log('4. Try adding and editing jobs');