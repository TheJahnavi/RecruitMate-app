// Simple test script to verify the build process
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

async function testBuild() {
  try {
    console.log('Testing build process...');
    
    // Change to client directory and run build
    const clientDir = path.join(process.cwd(), 'client');
    console.log(`Building client in ${clientDir}...`);
    
    const { stdout, stderr } = await execAsync('cd client && npm run build', {
      cwd: process.cwd()
    });
    
    console.log('Build stdout:', stdout);
    if (stderr) {
      console.log('Build stderr:', stderr);
    }
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error.message);
    if (error.stdout) console.log('stdout:', error.stdout);
    if (error.stderr) console.log('stderr:', error.stderr);
  }
}

testBuild();