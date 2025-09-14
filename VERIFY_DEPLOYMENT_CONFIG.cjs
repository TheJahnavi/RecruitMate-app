// Deployment Configuration Verification Script
const fs = require('fs');
const path = require('path');

console.log('=== SmartHire Deployment Configuration Verification ===\n');

// Check required files and directories
const projectRoot = __dirname;
console.log('Project Root:', projectRoot);

// Check if we're in the correct directory structure
const clientDir = path.join(projectRoot, 'client');
console.log('Client Directory:', clientDir);

if (!fs.existsSync(clientDir)) {
  console.log('❌ ERROR: Client directory not found!');
  process.exit(1);
}

console.log('\n1. Checking project structure...');
const requiredProjectFiles = [
  'vercel.json',
  'package.json'
];

const missingProjectFiles = [];
for (const file of requiredProjectFiles) {
  const fullPath = path.join(projectRoot, file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✓ ${file}`);
  } else {
    missingProjectFiles.push(file);
    console.log(`   ✗ ${file} (MISSING)`);
  }
}

console.log('\n2. Checking client directory structure...');
const requiredClientFiles = [
  'package.json',
  'vite.config.ts',
  'index.html',
  'src/App.tsx',
  'src/main.tsx'
];

const missingClientFiles = [];
for (const file of requiredClientFiles) {
  const fullPath = path.join(clientDir, file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✓ ${file}`);
  } else {
    missingClientFiles.push(file);
    console.log(`   ✗ ${file} (MISSING)`);
  }
}

console.log('\n3. Checking vercel.json configuration...');
try {
  const vercelConfigPath = path.join(projectRoot, 'vercel.json');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
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
  
  // Check build command
  if (vercelConfig.buildCommand) {
    console.log(`   ✓ vercel.json has build command: ${vercelConfig.buildCommand}`);
  } else {
    console.log('   ✗ vercel.json missing build command');
  }
  
  // Check output directory
  if (vercelConfig.outputDirectory) {
    console.log(`   ✓ vercel.json has output directory: ${vercelConfig.outputDirectory}`);
  } else {
    console.log('   ✗ vercel.json missing output directory');
  }
} catch (error) {
  console.log('   ✗ Error reading vercel.json:', error.message);
}

console.log('\n4. Checking client package.json...');
try {
  const clientPackagePath = path.join(clientDir, 'package.json');
  const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));
  console.log('   ✓ client/package.json is valid JSON');
  
  // Check for required scripts
  if (clientPackage.scripts) {
    if (clientPackage.scripts.build) {
      console.log(`   ✓ client/package.json has build script: ${clientPackage.scripts.build}`);
    } else {
      console.log('   ✗ client/package.json missing build script');
    }
  } else {
    console.log('   ✗ client/package.json missing scripts section');
  }
} catch (error) {
  console.log('   ✗ Error reading client/package.json:', error.message);
}

console.log('\n=== VERIFICATION COMPLETE ===');

if (missingProjectFiles.length > 0 || missingClientFiles.length > 0) {
  console.log('\n❌ ISSUES DETECTED:');
  if (missingProjectFiles.length > 0) {
    console.log('Missing project files:');
    missingProjectFiles.forEach(file => console.log(`   - ${file}`));
  }
  if (missingClientFiles.length > 0) {
    console.log('Missing client files:');
    missingClientFiles.forEach(file => console.log(`   - ${file}`));
  }
  console.log('\nPlease ensure all required files are present before deployment.');
  process.exit(1);
} else {
  console.log('\n✅ All required files are present.');
  console.log('✅ Configuration files appear to be correctly set up for Vercel deployment.');
  console.log('\nNext steps:');
  console.log('1. Ensure Vercel project settings are:');
  console.log('   - Root Directory: client');
  console.log('   - Build Command: npm install && npm run build');
  console.log('   - Output Directory: dist');
  console.log('2. Add environment variables in Vercel project settings:');
  console.log('   - NODE_ENV=production');
  console.log('   - DATABASE_URL=your_production_database_url');
  console.log('   - SESSION_SECRET=your_production_session_secret');
}