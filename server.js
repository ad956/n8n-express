const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
    description: 'Express server with n8n integration'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});