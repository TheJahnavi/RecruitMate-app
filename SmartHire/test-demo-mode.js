// Simple test script to verify demo mode is working
console.log('Testing SmartHire Demo Mode...');

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  console.log('Browser environment detected');
  
  // Set demo mode
  localStorage.setItem('demoMode', 'true');
  console.log('Demo mode enabled');
  
  // Import and initialize demo data
  import('./client/src/utils/demoData.ts').then((module) => {
    console.log('Demo data module loaded');
    
    // Initialize demo data
    module.initializeDemoData();
    console.log('Demo data initialized');
    
    // Test data retrieval
    const jobs = module.getDemoJobs();
    const candidates = module.getDemoCandidates();
    const notifications = module.getDemoNotifications('hr-001');
    const todos = module.getDemoTodos('hr-001');
    
    console.log('Demo Data Summary:');
    console.log('- Jobs:', jobs.length);
    console.log('- Candidates:', candidates.length);
    console.log('- Notifications:', notifications.length);
    console.log('- Todos:', todos.length);
    
    if (jobs.length >= 3 && candidates.length >= 3) {
      console.log('✅ Demo mode is working correctly with sufficient data');
    } else {
      console.log('❌ Demo mode may have insufficient data');
    }
  }).catch((error) => {
    console.error('Error loading demo data module:', error);
  });
} else {
  console.log('This script should be run in a browser environment');
}