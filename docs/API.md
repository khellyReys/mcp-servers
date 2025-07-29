# API Documentation

## Overview

The Facebook Marketing API MCP Server provides both MCP protocol support and RESTful HTTP endpoints for tool execution.

## Base URL

```
http://localhost:3001
```

## Authentication

All Facebook Marketing API tools require a valid API key set in the environment variable:
```bash
FACEBOOK_MARKETING_API_API_KEY=your_api_key_here
```

## Endpoints

### Web Interface

#### `GET /`
Returns the main web interface for interactive tool execution.

**Response**: HTML page with the web application

---

### Tool Management

#### `GET /api/tools`
List all available Facebook Marketing API tools.

**Response**:
```json
[
  {
    "name": "get_campaign_insights",
    "description": "Get insights for a specific campaign from the Marketing API",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaign_id": {
          "type": "string",
          "description": "The ID of the campaign to retrieve insights for"
        }
      },
      "required": ["campaign_id"]
    }
  }
]
```

#### `POST /api/call-tool`
Execute a tool via HTTP.

**Request Body**:
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_campaign_insights",
    "arguments": {
      "campaign_id": "123456789"
    }
  }
}
```

**Response**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"data\": [...]\n}"
    }
  ]
}
```

---

### Real-time Communication

#### `GET /sse`
Establish a Server-Sent Events connection for real-time communication.

**Headers**:
- `Accept: text/event-stream`
- `Cache-Control: no-cache`

**Response**: SSE stream with session management

#### `POST /messages`
Handle SSE messages for tool execution.

**Headers**:
- `X-Session-ID: session-id`
- `Content-Type: application/json`

---

### Health Check

#### `GET /health`
Check server health and status.

**Response**:
```json
{
  "status": "healthy",
  "server": "Facebook Marketing API MCP Server",
  "tools": 58,
  "sessions": 2
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing parameters, invalid input)
- `404` - Not Found (unknown tool)
- `500` - Internal Server Error

Error responses include a descriptive message:
```json
{
  "error": "Missing required parameter: campaign_id"
}
```

## Tool Categories

### Campaign Management
- `get_campaign_insights` - Retrieve campaign performance data
- `create_campaign` - Create new advertising campaigns
- `update_campaign_details` - Modify campaign settings

### Ad Set Operations
- `get_adset_insights` - Get ad set performance metrics
- `create_ad_set` - Create new ad sets
- `update_adSet` - Update ad set configurations

### Creative Management
- `get_creative_details` - Retrieve creative information
- `create_adCreative` - Create new ad creatives
- `retrieve_adCreative_details` - Get detailed creative data

### Account Management
- `get_ad_account_details` - Retrieve account information
- `update_ad_account` - Modify account settings
- `get_assigned_users` - List account users

### Analytics & Insights
- `get_insight_details` - Comprehensive insight data
- `attribution_setting` - Attribution configuration
- `get_report_for_insight` - Generate insight reports

## Rate Limiting

The server respects Facebook's API rate limits. If you encounter rate limiting:

1. Reduce request frequency
2. Implement exponential backoff
3. Monitor the `X-App-Usage` header in responses

## Examples

### Get Campaign Insights
```bash
curl -X POST http://localhost:3001/api/call-tool \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "get_campaign_insights",
      "arguments": {
        "campaign_id": "123456789",
        "base_url": "https://graph.facebook.com/v12.0"
      }
    }
  }'
```

### Create Campaign
```bash
curl -X POST http://localhost:3001/api/call-tool \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "create_campaign",
      "arguments": {
        "account_id": "123456789",
        "name": "My Campaign",
        "objective": "OUTCOME_TRAFFIC",
        "status": "PAUSED"
      }
    }
  }'
```