import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Spawn the vite process with the correct working directory
const child = spawn('npx', ['vite', '--host'], {
  cwd: join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start frontend:', error);
});

child.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});