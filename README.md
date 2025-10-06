# n8n-Express Server for Render

Express server with integrated n8n workflow automation, optimized for Render deployment.

## Features

- Express.js server with REST API endpoints
- Integrated n8n workflow automation
- Health monitoring endpoints
- Auto-start n8n on server launch
- Render-optimized configuration

## Deployment on Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Starter (or higher)

## Environment Variables (Auto-configured)

- `PORT` - Express server port (set by Render)
- `N8N_PORT` - n8n port (default: 5678)
- `N8N_HOST` - Set to 0.0.0.0 for Render
- `RENDER_EXTERNAL_URL` - Your Render app URL (auto-set)

## Installation (Local Development)

```bash
npm install
```

## Usage

```bash
npm start
```

## Endpoints

- `GET /` - Server information and available endpoints
- `GET /health` - Server health check (includes n8n status)
- `GET /info` - Server and n8n information
- `GET /n8n/status` - n8n process status
- `GET /n8n/start` - Start n8n manually

## Access

- Express Server: Your Render URL (e.g., https://your-app.onrender.com)
- n8n Interface: Your Render URL:5678 (e.g., https://your-app.onrender.com:5678)

## Key Changes for Render

- Uses `0.0.0.0` host binding instead of localhost
- Proper SIGTERM handling for graceful shutdowns
- Direct node binary execution instead of npx
- Environment-aware URL generation
- Health endpoint for Render monitoring