// Test script to verify client build process
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Testing client build process...\n');

try {
  // Check if we're in the right directory
  const rootDir = __dirname;
  const clientDir = path.join(rootDir, 'client');
  
  console.log('1. Checking directory structure...');
  if (!fs.existsSync(clientDir)) {
    throw new Error('Client directory not found');
  }
  
  const requiredClientFiles = [
    'package.json',
    'vite.config.ts',
    'index.html',
    'src/App.tsx',
    'src/main.tsx'
  ];
  
  for (const file of requiredClientFiles) {
    const filePath = path.join(clientDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required file not found: ${file}`);
    }
    console.log(`   ✓ ${file}`);
  }
  
  console.log('\n2. Testing client build...');
  // Change to client directory and run build
  process.chdir(clientDir);
  
  // Install dependencies if needed
  console.log('   Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Run build
  console.log('   Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n3. Checking build output...');
  const distDir = path.join(clientDir, 'dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('Build failed - dist directory not created');
  }
  
  const requiredDistFiles = [
    'index.html',
    '_app',
    'assets'
  ];
  
  for (const file of requiredDistFiles) {
    const filePath = path.join(distDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Build incomplete - required file/directory not found: ${file}`);
    }
    console.log(`   ✓ ${file}`);
  }
  
  console.log('\n✅ Client build test completed successfully!');
  console.log('✅ The client application should deploy correctly to Vercel.');
  
} catch (error) {
  console.error('\n❌ Client build test failed:');
  console.error(error.message);
  process.exit(1);
}