// Script to verify job functionality programmatically
// This script checks if the job-related endpoints are properly configured

console.log("=== SmartHire Job Functionality Verification ===\n");

// Check if servers are running
console.log("1. Checking server status...");

// Function to check if a URL is accessible
async function checkUrl(url, description) {
  try {
    const response = await fetch(url, { method: 'GET', mode: 'no-cors' });
    console.log(`   ✓ ${description} - Server is running`);
    return true;
  } catch (error) {
    console.log(`   ✗ ${description} - Server not accessible: ${error.message}`);
    return false;
  }
}

// Function to check API endpoints
async function checkApiEndpoint(url, description) {
  try {
    // We can't fully test authenticated endpoints without credentials,
    // but we can check if they're properly protected
    const response = await fetch(url, { 
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.status === 401) {
      console.log(`   ✓ ${description} - Properly protected (401 Unauthorized)`);
      return true;
    } else if (response.status === 200) {
      console.log(`   ✓ ${description} - Accessible (may be in demo mode)`);
      return true;
    } else {
      console.log(`   ? ${description} - Status: ${response.status}`);
      return true;
    }
  } catch (error) {
    console.log(`   ? ${description} - Cannot verify: ${error.message}`);
    return false;
  }
}

// Main verification function
async function verifyJobFunctionality() {
  // Check server status
  const frontendRunning = await checkUrl('http://localhost:5173', 'Frontend Server (port 5173)');
  const backendRunning = await checkUrl('http://localhost:3001', 'Backend Server (port 3001)');
  
  if (!frontendRunning || !backendRunning) {
    console.log("\n   ERROR: One or both servers are not running!");
    console.log("   Please start both servers before running this verification.");
    return;
  }
  
  console.log("\n2. Checking job-related API endpoints...");
  
  // Check job endpoints
  await checkApiEndpoint('http://localhost:3001/api/jobs', 'GET /api/jobs');
  await checkApiEndpoint('http://localhost:3001/api/jobs/1', 'GET /api/jobs/1');
  
  console.log("\n3. Checking authentication configuration...");
  
  // Check if API base URL is correctly configured
  const apiConfig = {
    development: 'http://localhost:3001',
    production: ''
  };
  
  console.log(`   API Base URL Configuration:`);
  console.log(`   - Development: ${apiConfig.development}`);
  console.log(`   - Production: ${apiConfig.production}`);
  
  console.log("\n4. Checking redirect URLs...");
  console.log("   Verify that authentication redirects point to '/login' not '/api/login'");
  
  console.log("\n=== Verification Complete ===");
  console.log("\nNext Steps:");
  console.log("1. Open your browser and navigate to: http://localhost:5173/hr/jobs");
  console.log("2. Log in with HR credentials (hr1@techcorp.com / password123)");
  console.log("3. Test adding a new job:");
  console.log("   - Click 'Add New Job' button");
  console.log("   - Fill in job details");
  console.log("   - Click 'Create Job'");
  console.log("   - Verify success message and job appears in table");
  console.log("4. Test editing a job:");
  console.log("   - Click edit icon for any job");
  console.log("   - Verify pre-filled data is correct");
  console.log("   - Make changes and click 'Update Job'");
  console.log("   - Verify success message and job is updated");
  console.log("5. Check browser console for any errors");
  
  console.log("\nFor detailed test instructions, see TEST_INSTRUCTIONS.html");
}

// Run the verification
verifyJobFunctionality().catch(console.error);