const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run a command and wait for it to complete
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Main function
async function main() {
  try {
    // Change to the client directory
    const clientDir = path.join(__dirname);
    console.log(`Working in directory: ${clientDir}`);
    
    // Run npm install in the client directory
    console.log('Running npm install...');
    const result = await runCommand('npm install');
    console.log('npm install completed successfully');
    console.log(result.stdout);
    
    // Check if package-lock.json was created
    const lockfilePath = path.join(clientDir, 'package-lock.json');
    if (fs.existsSync(lockfilePath)) {
      console.log('package-lock.json created successfully in client directory');
    } else {
      console.log('package-lock.json was not created in client directory');
    }
  } catch (error) {
    console.error('Error running npm install:', error);
  }
}

main();