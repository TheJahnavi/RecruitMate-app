import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Demo API endpoint for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'SmartHire Demo Server is running!' });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 SmartHire Demo Server running at: http://localhost:${PORT}`);
  console.log(`📱 Open your browser and go to: http://localhost:${PORT}`);
  console.log(`📋 To test AI agents, use the test script: npx tsx test-ai-agents.ts`);
});