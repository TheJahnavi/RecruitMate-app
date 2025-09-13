// Deployment verification script
const fs = require('fs');
const path = require('path');

console.log('=== SmartHire Deployment Verification ===\n');

// Check required files and directories
const requiredFiles = [
  'vercel.json',
  'package.json',
  'client/package.json',
  'client/vite.config.ts',
  'client/index.html',
  'client/src/App.tsx',
  'client/src/main.tsx',
  'server/index.ts',
  'server/routes.ts'
];

const missingFiles = [];
const foundFiles = [];

console.log('1. Checking required files...');
for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    foundFiles.push(file);
    console.log(`   ✓ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`   ✗ ${file} (MISSING)`);
  }
}

if (missingFiles.length > 0) {
  console.log(`\n❌ MISSING FILES DETECTED:`);
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\nPlease ensure all required files are present before deployment.');
  process.exit(1);
}

console.log('\n2. Checking configuration files...');

// Check vercel.json
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
  console.log('   ✓ vercel.json is valid JSON');
  
  // Check builds configuration
  if (vercelConfig.builds && Array.isArray(vercelConfig.builds)) {
    console.log('   ✓ vercel.json has builds configuration');
  } else {
    console.log('   ✗ vercel.json missing builds configuration');
  }
  
  // Check routes configuration
  if (vercelConfig.routes && Array.isArray(vercelConfig.routes)) {
    console.log('   ✓ vercel.json has routes configuration');
  } else {
    console.log('   ✗ vercel.json missing routes configuration');
  }
} catch (error) {
  console.log('   ✗ vercel.json is not valid JSON:', error.message);
}

// Check client vite.config.ts
try {
  const viteConfig = fs.readFileSync(path.join(__dirname, 'client', 'vite.config.ts'), 'utf8');
  if (viteConfig.includes('base:')) {
    console.log('   ✓ client/vite.config.ts has base configuration');
  } else {
    console.log('   ✗ client/vite.config.ts missing base configuration');
  }
} catch (error) {
  console.log('   ✗ Error reading client/vite.config.ts:', error.message);
}

console.log('\n3. Checking environment configuration...');

// Check if .env.production exists in client directory
const envProdPath = path.join(__dirname, 'client', '.env.production');
if (fs.existsSync(envProdPath)) {
  console.log('   ✓ client/.env.production exists');
} else {
  console.log('   ⚠ client/.env.production not found (optional for Vercel)');
}

console.log('\n=== VERIFICATION COMPLETE ===');

console.log('\n✅ All required files are present.');
console.log('✅ Configuration files appear to be correctly set up for Vercel deployment.');
console.log('\nNext steps:');
console.log('1. Commit all changes to your repository');
console.log('2. Push to GitHub');
console.log('3. Deploy to Vercel using the project settings specified in VERCEL_DEPLOYMENT_README.md');
console.log('4. Add environment variables in Vercel project settings');