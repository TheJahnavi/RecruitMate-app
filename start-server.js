const { exec } = require('child_process');

// Set environment variables
process.env.NODE_ENV = 'development';

// Run the TypeScript server file with tsx
exec('npx tsx server/index.ts', { cwd: __dirname }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(`stdout: ${stdout}`);
});