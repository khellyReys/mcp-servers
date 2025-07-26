export interface Tool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: Record<string, any>;
        required: string[];
    };
}
export interface ToolResult {
    content: Array<{
        type: string;
        text: string;
    }>;
}
export interface ServerInfo {
    name: string;
    version: string;
    tools: number;
    sessions: number;
}
export interface ConnectionStatus {
    isConnected: boolean;
    connectionType: 'sse' | 'http';
    sessionId?: string;
}
export interface LogEntry {
    timestamp: string;
    level: 'info' | 'success' | 'error' | 'warning';
    message: string;
}
export interface AppCard {
    id: string;
    name: string;
    description: string;
    icon: string;
    tags: string[];
    category: string[];
    available: boolean;
}
export interface Category {
    id: string;
    name: string;
    active: boolean;
}
//# sourceMappingURL=types.d.ts.map