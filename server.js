const express = require('express');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;
const N8N_PORT = process.env.N8N_PORT || 5678;

app.use(express.json());

// Start n8n process
let n8nProcess;

function startN8n() {
  console.log('Starting n8n...');
  n8nProcess = spawn('npx', ['n8n', 'start'], {
    env: { ...process.env, N8N_PORT: N8N_PORT },
    stdio: 'inherit'
  });
  
  n8nProcess.on('error', (err) => {
    console.error('Failed to start n8n:', err);
  });
  
  n8nProcess.on('close', (code) => {
    console.log(`n8n process exited with code ${code}`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  if (n8nProcess) {
    n8nProcess.kill();
  }
  process.exit(0);
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Info endpoint
app.get('/info', (req, res) => {
  res.json({
    name: 'n8n-express',
    version: '1.0.0',
    description: 'Express server with n8n integration',
    n8nUrl: `http://localhost:${N8N_PORT}`,
    expressPort: PORT
  });
});

// n8n status endpoint
app.get('/n8n/status', (req, res) => {
  res.json({
    status: n8nProcess ? 'running' : 'stopped',
    n8nUrl: `http://localhost:${N8N_PORT}`,
    pid: n8nProcess ? n8nProcess.pid : null
  });
});

// Start n8n endpoint
app.post('/n8n/start', (req, res) => {
  if (n8nProcess) {
    return res.json({ message: 'n8n is already running' });
  }
  
  startN8n();
  res.json({ 
    message: 'n8n starting...', 
    url: `http://localhost:${N8N_PORT}` 
  });
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`n8n will be available at http://localhost:${N8N_PORT}`);
  
  // Auto-start n8n
  setTimeout(() => {
    startN8n();
  }, 2000);
});