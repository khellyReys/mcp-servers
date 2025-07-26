#!/usr/bin/env node

import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { discoverTools } from "./lib/tools.js";
import { Tool, ToolResult, ServerInfo } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SERVER_NAME = "facebook-marketing-api-mcp-server";
const PORT = process.env.PORT || 3001;

async function transformTools(tools: any[]): Promise<Tool[]> {
  return tools
    .map((tool) => {
      const definitionFunction = tool.definition?.function;
      if (!definitionFunction) return null;
      return {
        name: definitionFunction.name,
        description: definitionFunction.description,
        inputSchema: definitionFunction.parameters,
      };
    })
    .filter((tool): tool is Tool => tool !== null);
}

async function setupServerHandlers(server: Server, tools: any[]): Promise<void> {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: await transformTools(tools),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const tool = tools.find((t) => t.definition.function.name === toolName);
    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
    }
    const args = request.params.arguments;
    const requiredParameters =
      tool.definition?.function?.parameters?.required || [];
    for (const requiredParameter of requiredParameters) {
      if (!(requiredParameter in args)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Missing required parameter: ${requiredParameter}`
        );
      }
    }
    try {
      const result = await tool.function(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("[Error] Failed to fetch data:", error);
      throw new McpError(
        ErrorCode.InternalError,
        `API error: ${(error as Error).message}`
      );
    }
  });
}

async function createWebServer(): Promise<express.Application> {
  const app = express();
  const tools = await discoverTools();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));
  
  // Store active sessions for SSE
  const sessions = new Map<string, SSEServerTransport>();
  const servers = new Map<string, Server>();

  // API Routes
  app.get('/api/tools', async (req: Request, res: Response) => {
    try {
      const transformedTools = await transformTools(tools);
      res.json(transformedTools);
    } catch (error) {
      console.error('Error getting tools:', error);
      res.status(500).json({ error: 'Failed to get tools' });
    }
  });

  app.post('/api/call-tool', async (req: Request, res: Response) => {
    try {
      const { method, params } = req.body;
      
      if (method !== 'tools/call') {
        return res.status(400).json({ error: 'Invalid method' });
      }

      const toolName = params.name;
      const tool = tools.find((t) => t.definition.function.name === toolName);
      
      if (!tool) {
        return res.status(404).json({ error: `Unknown tool: ${toolName}` });
      }

      const args = params.arguments || {};
      const requiredParameters = tool.definition?.function?.parameters?.required || [];
      
      for (const requiredParameter of requiredParameters) {
        if (!(requiredParameter in args)) {
          return res.status(400).json({ 
            error: `Missing required parameter: ${requiredParameter}` 
          });
        }
      }

      const result = await tool.function(args);
      
      res.json({
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      });
    } catch (error) {
      console.error('Error calling tool:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // SSE endpoint
  app.get('/sse', async (req: Request, res: Response) => {
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create a new Server instance for this session
    const server = new Server(
      {
        name: SERVER_NAME,
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    server.onerror = (error) => console.error("[SSE Error]", error);
    await setupServerHandlers(server, tools);

    const transport = new SSEServerTransport("/messages", res);
    sessions.set(sessionId, transport);
    servers.set(sessionId, server);

    // Send session ID to client
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId })}\n\n`);

    req.on('close', async () => {
      sessions.delete(sessionId);
      await server.close();
      servers.delete(sessionId);
      console.log(`[SSE] Session ${sessionId} closed`);
    });

    try {
      await server.connect(transport);
      console.log(`[SSE] Session ${sessionId} connected`);
    } catch (error) {
      console.error(`[SSE] Failed to connect session ${sessionId}:`, error);
      res.end();
    }
  });

  // SSE message handler
  app.post('/messages', async (req: Request, res: Response) => {
    const sessionId = req.headers['x-session-id'] as string;
    const transport = sessions.get(sessionId);
    const server = servers.get(sessionId);

    if (transport && server) {
      try {
        await transport.handlePostMessage(req, res);
      } catch (error) {
        console.error(`[SSE] Error handling message for session ${sessionId}:`, error);
        res.status(500).json({ error: 'Failed to handle message' });
      }
    } else {
      res.status(400).json({ error: 'Invalid session' });
    }
  });

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    const serverInfo: ServerInfo = {
      status: 'healthy', 
      server: SERVER_NAME,
      tools: tools.length,
      sessions: sessions.size
    };
    res.json(serverInfo);
  });

  // Serve the frontend
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });

  return app;
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const isSSE = args.includes("--sse");
  const isWeb = args.includes("--web");
  const tools = await discoverTools();

  if (isWeb || (!isSSE && !process.stdin.isTTY)) {
    // Web server mode
    console.log(`[Web Server] Starting ${SERVER_NAME}...`);
    const app = await createWebServer();
    
    app.listen(PORT, () => {
      console.log(`[Web Server] Running on http://localhost:${PORT}`);
      console.log(`[Web Server] Available tools: ${tools.length}`);
      console.log(`[Web Server] SSE endpoint: http://localhost:${PORT}/sse`);
      console.log(`[Web Server] API endpoint: http://localhost:${PORT}/api`);
    });
  } else if (isSSE) {
    // SSE mode (legacy)
    const app = express();
    const transports: Record<string, SSEServerTransport> = {};
    const servers: Record<string, Server> = {};

    app.get("/sse", async (_req: Request, res: Response) => {
      const server = new Server(
        {
          name: SERVER_NAME,
          version: "1.0.0",
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );
      server.onerror = (error) => console.error("[Error]", error);
      await setupServerHandlers(server, tools);

      const transport = new SSEServerTransport("/messages", res);
      transports[transport.sessionId] = transport;
      servers[transport.sessionId] = server;

      res.on("close", async () => {
        delete transports[transport.sessionId];
        await server.close();
        delete servers[transport.sessionId];
      });

      await server.connect(transport);
    });

    app.post("/messages", async (req: Request, res: Response) => {
      const sessionId = req.query.sessionId as string;
      const transport = transports[sessionId];
      const server = servers[sessionId];

      if (transport && server) {
        await transport.handlePostMessage(req, res);
      } else {
        res.status(400).send("No transport/server found for sessionId");
      }
    });

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`[SSE Server] running on port ${port}`);
    });
  } else {
    // STDIO mode
    const server = new Server(
      {
        name: SERVER_NAME,
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    server.onerror = (error) => console.error("[Error]", error);
    await setupServerHandlers(server, tools);

    process.on("SIGINT", async () => {
      await server.close();
      process.exit(0);
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

run().catch(console.error);