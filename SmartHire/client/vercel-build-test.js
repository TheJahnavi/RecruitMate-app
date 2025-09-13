// Simple build test script
console.log('Vercel build test script running...');
console.log('Current directory:', __dirname);
console.log('Environment:', process.env.NODE_ENV);

// Check if required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'src/App.tsx',
  'src/main.tsx',
  'index.html'
];

console.log('Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${file}: ${exists ? 'FOUND' : 'MISSING'}`);
  if (exists) {
    try {
      const stats = fs.statSync(filePath);
      console.log(`    Size: ${stats.size} bytes`);
    } catch (err) {
      console.log(`    Error checking file: ${err.message}`);
    }
  }
});

console.log('Build test completed.');