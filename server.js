const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const PORT = process.env.PORT || 3000;
let n8nProcess;

app.use(express.json());
app.use(express.static('public'));

// Block direct n8n access without auth
app.use('/n8n', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${getDailyPin()}`) {
    return res.redirect('/');
  }
  next();
});

function startN8n() {
  console.log('Starting n8n...');
  const isLocal = !process.env.RENDER_EXTERNAL_URL;
  
  n8nProcess = spawn('node', ['./node_modules/n8n/bin/n8n', 'start'], {
    env: { 
      ...process.env, 
      N8N_HOST: '0.0.0.0',
      N8N_PORT: '5678',
      N8N_PATH: isLocal ? '/' : '/n8n/',
      WEBHOOK_URL: process.env.RENDER_EXTERNAL_URL || `http://localhost:3000`
    },
    stdio: 'inherit'
  });
  
  n8nProcess.on('error', (err) => {
    console.error('Failed to start n8n:', err);
  });
}

// Generate daily PIN: MM * DD (max 4 digits)
function getDailyPin() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return String(month * day).padStart(4, '0');
}

process.on('SIGTERM', () => {
  if (n8nProcess) n8nProcess.kill();
  process.exit(0);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    n8nRunning: !!n8nProcess,
    uptime: Math.floor(process.uptime())
  });
});

app.post('/auth', (req, res) => {
  const { pin } = req.body;
  const correctPin = getDailyPin();
  
  if (pin === correctPin) {
    res.json({ success: true, token: correctPin });
  } else {
    res.status(401).json({ success: false, message: 'Invalid PIN' });
  }
});

// Proxy n8n through our server
app.use('/n8n', createProxyMiddleware({
  target: 'http://localhost:5678',
  changeOrigin: true,
  pathRewrite: { '^/n8n': '' },
  ws: true
}));

app.get('/api/info', (req, res) => {
  const isLocal = !process.env.RENDER_EXTERNAL_URL;
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  
  res.json({
    n8nUrl: isLocal ? `http://localhost:5678` : `${baseUrl}/n8n`,
    status: n8nProcess ? 'running' : 'stopped',
    uptime: Math.floor(process.uptime())
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  setTimeout(startN8n, 2000);
});