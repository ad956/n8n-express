# n8n-Express Server

Express server with integrated n8n workflow automation.

## Features

- Express.js server with REST API endpoints
- Integrated n8n workflow automation
- Health monitoring endpoints
- Auto-start n8n on server launch

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Endpoints

- `GET /health` - Server health check
- `GET /info` - Server and n8n information
- `GET /n8n/status` - n8n process status
- `POST /n8n/start` - Start n8n manually

## Access

- Express Server: http://localhost:3000
- n8n Interface: http://localhost:5678

## Environment Variables

- `PORT` - Express server port (default: 3000)
- `N8N_PORT` - n8n port (default: 5678)