# Deployment Guide

## Overview

This guide covers deploying the Facebook Marketing API MCP Server in various environments.

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Facebook Marketing API
FACEBOOK_MARKETING_API_API_KEY=your_facebook_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# Optional: Custom base URLs
FACEBOOK_API_BASE_URL=https://graph.facebook.com/v12.0
```

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Facebook Marketing API access token

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd facebook-marketing-api-mcp-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

## Production Deployment

### Docker Deployment

1. **Build the Docker image**:
```bash
docker build -t facebook-mcp-server .
```

2. **Run the container**:
```bash
docker run -d \
  --name facebook-mcp-server \
  -p 3001:3001 \
  --env-file .env \
  facebook-mcp-server
```

3. **Docker Compose** (recommended):
```yaml
version: '3.8'
services:
  facebook-mcp-server:
    build: .
    ports:
      - "3001:3001"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name

# Set environment variables
heroku config:set FACEBOOK_MARKETING_API_API_KEY=your_key

# Deploy
git push heroku main
```

#### AWS EC2
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup
git clone <your-repo-url>
cd facebook-marketing-api-mcp-server
npm install --production

# Start with PM2
pm2 start server.js --name "facebook-mcp-server"
pm2 startup
pm2 save
```

#### Google Cloud Run
```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/facebook-mcp-server

# Deploy to Cloud Run
gcloud run deploy facebook-mcp-server \
  --image gcr.io/PROJECT-ID/facebook-mcp-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FACEBOOK_MARKETING_API_API_KEY=your_key
```

## Reverse Proxy Setup

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SSE specific configuration
    location /sse {
        proxy_pass http://localhost:3001/sse;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Cache-Control 'no-cache';
        proxy_set_header X-Accel-Buffering 'no';
        proxy_buffering off;
        chunked_transfer_encoding off;
    }
}
```

## Monitoring and Logging

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs facebook-mcp-server

# Restart application
pm2 restart facebook-mcp-server
```

### Health Checks
The server provides a health endpoint at `/health`:

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "healthy",
  "server": "Facebook Marketing API MCP Server",
  "tools": 58,
  "sessions": 0
}
```

## Security Considerations

### Environment Security
- Never commit `.env` files to version control
- Use secure secret management in production
- Rotate API keys regularly

### Network Security
- Use HTTPS in production
- Implement rate limiting
- Configure CORS appropriately
- Use firewall rules to restrict access

### API Security
- Validate all input parameters
- Implement request logging
- Monitor for unusual activity
- Use least-privilege API tokens

## Scaling

### Horizontal Scaling
```bash
# Run multiple instances with PM2
pm2 start server.js -i max --name "facebook-mcp-server"
```

### Load Balancing
Use a load balancer (nginx, HAProxy, or cloud load balancer) to distribute traffic across multiple instances.

### Database Considerations
If you add persistent storage:
- Use connection pooling
- Implement proper indexing
- Consider read replicas for scaling

## Troubleshooting

### Common Issues

1. **Port already in use**:
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process
kill -9 <PID>
```

2. **Facebook API errors**:
- Check API key validity
- Verify account permissions
- Monitor rate limits

3. **Memory issues**:
```bash
# Monitor memory usage
pm2 monit
# Restart if needed
pm2 restart facebook-mcp-server
```

### Logs Location
- Development: Console output
- PM2: `~/.pm2/logs/`
- Docker: `docker logs <container-name>`

## Backup and Recovery

### Configuration Backup
- Backup `.env` files securely
- Document API key sources
- Keep deployment scripts in version control

### Data Backup
If using persistent storage:
- Regular database backups
- Test restore procedures
- Document recovery steps