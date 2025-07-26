class MCPServerInterface {
    constructor() {
        this.isConnected = false;
        this.connectionType = 'sse';
        this.eventSource = null;
        this.tools = [];
        this.selectedTool = null;
        this.sessionId = null;
        this.currentScreen = 'home';
        
        this.initializeElements();
        this.attachEventListeners();
        this.showHomeScreen();
    }

    initializeElements() {
        // Home screen elements
        this.homeScreen = document.getElementById('homeScreen');
        this.toolInterface = document.getElementById('toolInterface');
        this.homeSearch = document.getElementById('homeSearch');
        this.appsGrid = document.getElementById('appsGrid');
        this.backBtn = document.getElementById('backBtn');
        
        // Connection elements
        this.connectionStatus = document.getElementById('connectionStatus');
        this.connectBtn = document.getElementById('connectBtn');
        this.toolConnectionStatus = document.getElementById('toolConnectionStatus');
        this.toolConnectBtn = document.getElementById('toolConnectBtn');
        
        // Tool elements
        this.toolsList = document.getElementById('toolsList');
        this.toolSelect = document.getElementById('toolSelect');
        this.parametersSection = document.getElementById('parametersSection');
        this.parametersContainer = document.getElementById('parametersContainer');
        this.executeBtn = document.getElementById('executeBtn');
        
        // Results elements
        this.resultsContainer = document.getElementById('resultsContainer');
        this.logsContainer = document.getElementById('logsContainer');
        
        // Server info elements
        this.serverName = document.getElementById('serverName');
        this.serverVersion = document.getElementById('serverVersion');
        this.toolCount = document.getElementById('toolCount');
        this.serverToolCount = document.getElementById('serverToolCount');
        
        // Other elements
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.toastContainer = document.getElementById('toastContainer');
    }

    attachEventListeners() {
        // Home screen listeners
        this.homeSearch?.addEventListener('input', (e) => this.filterApps(e.target.value));
        this.backBtn?.addEventListener('click', () => this.showHomeScreen());
        
        // Category filters
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => this.filterByCategory(e.target.dataset.category));
        });
        
        // App selection
        document.querySelectorAll('.app-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appCard = e.target.closest('.app-card');
                const appId = appCard.dataset.app;
                this.selectApp(appId);
            });
        });
        
        // Hero tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Connection
        this.connectBtn?.addEventListener('click', () => this.toggleConnection());
        this.toolConnectBtn?.addEventListener('click', () => this.toggleConnection());
        
        // Connection type
        document.querySelectorAll('input[name="connectionType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.connectionType = e.target.value;
                if (this.isConnected) {
                    this.disconnect();
                }
            });
        });
        
        // Tool selection
        this.toolSelect?.addEventListener('change', (e) => this.selectTool(e.target.value));
        
        // Tool execution
        this.executeBtn?.addEventListener('click', () => this.executeTool());
        
        // Clear buttons
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearResults());
        document.getElementById('clearLogsBtn')?.addEventListener('click', () => this.clearLogs());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportResults());
        
        // Search functionality
        document.getElementById('toolSearch')?.addEventListener('input', (e) => this.filterTools(e.target.value));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        if (this.executeBtn && !this.executeBtn.disabled) {
                            this.executeTool();
                        }
                        break;
                    case 'k':
                        e.preventDefault();
                        this.clearResults();
                        break;
                }
            }
        });
    }

    showHomeScreen() {
        this.currentScreen = 'home';
        this.homeScreen.style.display = 'block';
        this.toolInterface.style.display = 'none';
        
        // Reset connection state when going back to home
        if (this.isConnected) {
            this.disconnect();
        }
    }

    showToolInterface() {
        this.currentScreen = 'tool';
        this.homeScreen.style.display = 'none';
        this.toolInterface.style.display = 'block';
        
        // Load tools when entering tool interface
        this.loadTools();
    }

    selectApp(appId) {
        if (appId === 'facebook-marketing-api') {
            this.showToolInterface();
        } else {
            this.showToast('This app is coming soon!', 'info');
        }
    }

    filterApps(searchTerm) {
        const appCards = document.querySelectorAll('.app-card');
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        appCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            const matches = title.includes(lowerSearchTerm) || 
                          description.includes(lowerSearchTerm);
            
            if (matches || searchTerm === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterByCategory(category) {
        // Update active category
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Filter apps
        const appCards = document.querySelectorAll('.app-card');
        
        appCards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
            } else {
                const categories = card.dataset.category || '';
                if (categories.includes(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    }

    async loadTools() {
        try {
            const response = await fetch('/api/tools');
            if (response.ok) {
                this.tools = await response.json();
                this.renderTools();
                this.updateServerInfo();
            } else {
                this.showToast('Failed to load tools', 'error');
            }
        } catch (error) {
            console.error('Error loading tools:', error);
            this.showToast('Error loading tools', 'error');
        }
    }

    renderTools() {
        if (this.tools.length === 0) {
            this.toolsList.innerHTML = '<div class="empty-state"><p>No tools available</p></div>';
            this.toolSelect.innerHTML = '<option value="">No tools available</option>';
            return;
        }

        // Render tools list in sidebar
        this.toolsList.innerHTML = this.tools.map(tool => `
            <div class="tool-item" data-tool="${tool.name}" onclick="mcpInterface.selectToolFromSidebar('${tool.name}')">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description || 'No description available'}</div>
            </div>
        `).join('');

        // Populate tool select dropdown
        this.toolSelect.innerHTML = '<option value="">Choose a tool...</option>' +
            this.tools.map(tool => `<option value="${tool.name}">${tool.name}</option>`).join('');
        
        // Update tool count
        if (this.toolCount) {
            this.toolCount.textContent = this.tools.length.toString();
        }
    }

    filterTools(searchTerm) {
        const toolItems = document.querySelectorAll('.tool-item');
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        toolItems.forEach(item => {
            const toolName = item.querySelector('.tool-name').textContent.toLowerCase();
            const toolDescription = item.querySelector('.tool-description').textContent.toLowerCase();
            
            const matches = toolName.includes(lowerSearchTerm) || 
                          toolDescription.includes(lowerSearchTerm);
            
            if (matches || searchTerm === '') {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Show "No results" message if no tools are visible
        const visibleTools = document.querySelectorAll('.tool-item:not(.hidden)');
        const existingNoResults = document.querySelector('.no-results-message');
        
        if (visibleTools.length === 0 && searchTerm !== '') {
            if (!existingNoResults) {
                const noResultsDiv = document.createElement('div');
                noResultsDiv.className = 'no-results-message';
                noResultsDiv.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>No tools found matching "${searchTerm}"</p>
                    </div>
                `;
                this.toolsList.appendChild(noResultsDiv);
            }
        } else if (existingNoResults) {
            existingNoResults.remove();
        }
    }

    selectToolFromSidebar(toolName) {
        this.toolSelect.value = toolName;
        this.selectTool(toolName);
        
        // Update visual selection
        document.querySelectorAll('.tool-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-tool="${toolName}"]`)?.classList.add('selected');
    }

    selectTool(toolName) {
        this.selectedTool = this.tools.find(tool => tool.name === toolName);
        
        if (this.selectedTool) {
            this.renderParameters();
            this.parametersSection.style.display = 'block';
            this.executeBtn.disabled = false;
        } else {
            this.parametersSection.style.display = 'none';
            this.executeBtn.disabled = true;
        }
    }

    renderParameters() {
        if (!this.selectedTool || !this.selectedTool.inputSchema) {
            this.parametersContainer.innerHTML = '<p>No parameters required</p>';
            return;
        }

        const { properties = {}, required = [] } = this.selectedTool.inputSchema;
        
        this.parametersContainer.innerHTML = Object.entries(properties).map(([name, param]) => {
            const isRequired = required.includes(name);
            const inputType = this.getInputType(param.type);
            
            return `
                <div class="parameter-group">
                    <label class="parameter-label" for="param-${name}">
                        ${name}
                        ${isRequired ? '<span class="required-indicator">*</span>' : ''}
                    </label>
                    <input 
                        type="${inputType}" 
                        id="param-${name}" 
                        name="${name}"
                        class="form-control" 
                        ${isRequired ? 'required' : ''}
                        placeholder="${param.description || `Enter ${name}`}"
                    >
                    ${param.description ? `<div class="parameter-description">${param.description}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    getInputType(paramType) {
        switch (paramType) {
            case 'integer':
            case 'number':
                return 'number';
            case 'boolean':
                return 'checkbox';
            case 'array':
                return 'text';
            case 'object':
                return 'text';
            default:
                return 'text';
        }
    }

    async toggleConnection() {
        if (this.isConnected) {
            this.disconnect();
        } else {
            await this.connect();
        }
    }

    async connect() {
        try {
            this.updateConnectionStatus('connecting');
            this.addLog('Connecting to MCP server...', 'info');

            if (this.connectionType === 'sse') {
                await this.connectSSE();
            } else {
                await this.connectHTTP();
            }

            this.isConnected = true;
            this.updateConnectionStatus('connected');
            this.addLog('Successfully connected to MCP server', 'success');
            this.showToast('Connected to MCP server', 'success');
            
        } catch (error) {
            console.error('Connection error:', error);
            this.updateConnectionStatus('disconnected');
            this.addLog(`Connection failed: ${error.message}`, 'error');
            this.showToast('Failed to connect to server', 'error');
        }
    }

    async connectSSE() {
        const response = await fetch('/sse', {
            method: 'GET',
            headers: {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`SSE connection failed: ${response.status}`);
        }

        this.eventSource = new EventSource('/sse');
        
        this.eventSource.onopen = () => {
            this.addLog('SSE connection established', 'info');
        };

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleServerMessage(data);
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        this.eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            this.addLog('SSE connection error', 'error');
            this.disconnect();
        };

        this.sessionId = response.headers.get('X-Session-ID') || this.generateSessionId();
    }

    async connectHTTP() {
        this.sessionId = this.generateSessionId();
        this.addLog('HTTP streaming connection established', 'info');
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        
        this.isConnected = false;
        this.sessionId = null;
        this.updateConnectionStatus('disconnected');
        this.addLog('Disconnected from MCP server', 'info');
    }

    updateConnectionStatus(status) {
        const statusText = {
            'connected': 'Connected',
            'disconnected': 'Disconnected',
            'connecting': 'Connecting...'
        };

        // Update status indicators
        [this.connectionStatus, this.toolConnectionStatus].forEach(statusEl => {
            if (statusEl) {
                const dot = statusEl.querySelector('.status-dot');
                const span = statusEl.querySelector('span');
                
                if (dot) {
                    dot.className = `status-dot ${status === 'connected' ? 'connected' : 'disconnected'}`;
                }
                if (span) {
                    span.textContent = statusText[status];
                }
            }
        });
        
        // Update connect buttons
        [this.connectBtn, this.toolConnectBtn].forEach(btn => {
            if (btn) {
                btn.textContent = status === 'connected' ? 'Disconnect' : 'Connect';
                btn.disabled = status === 'connecting';
            }
        });
    }

    async executeTool() {
        if (!this.selectedTool || !this.isConnected) {
            this.showToast('Please select a tool and connect to server', 'error');
            return;
        }

        const parameters = this.collectParameters();
        if (parameters === null) {
            this.showToast('Please fill in all required parameters', 'error');
            return;
        }

        this.showLoading(true);
        this.addLog(`Executing tool: ${this.selectedTool.name}`, 'info');

        try {
            const result = await this.callTool(this.selectedTool.name, parameters);
            this.displayResult(this.selectedTool.name, result, false);
            this.addLog(`Tool execution completed: ${this.selectedTool.name}`, 'success');
        } catch (error) {
            console.error('Tool execution error:', error);
            this.displayResult(this.selectedTool.name, error.message, true);
            this.addLog(`Tool execution failed: ${error.message}`, 'error');
            this.showToast('Tool execution failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    collectParameters() {
        const parameters = {};
        const inputs = this.parametersContainer.querySelectorAll('input, select, textarea');
        
        for (const input of inputs) {
            const name = input.name;
            let value = input.value;
            
            if (input.type === 'checkbox') {
                value = input.checked;
            } else if (input.type === 'number') {
                value = value ? parseFloat(value) : undefined;
            }
            
            if (input.required && (!value && value !== 0 && value !== false)) {
                return null;
            }
            
            if (value !== undefined && value !== '') {
                parameters[name] = value;
            }
        }
        
        return parameters;
    }

    async callTool(toolName, parameters) {
        const requestData = {
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: parameters
            }
        };

        if (this.connectionType === 'sse') {
            return await this.callToolSSE(requestData);
        } else {
            return await this.callToolHTTP(requestData);
        }
    }

    async callToolSSE(requestData) {
        const response = await fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-ID': this.sessionId
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    async callToolHTTP(requestData) {
        const response = await fetch('/api/call-tool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    handleServerMessage(data) {
        if (data.type === 'tool_result') {
            this.displayResult(data.tool, data.result, data.error);
        } else if (data.type === 'log') {
            this.addLog(data.message, data.level);
        }
    }

    displayResult(toolName, result, isError = false) {
        const emptyState = this.resultsContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const timestamp = new Date().toLocaleTimeString();
        const resultElement = document.createElement('div');
        resultElement.className = `result-item ${isError ? 'result-error' : ''}`;
        
        resultElement.innerHTML = `
            <div class="result-header">
                <span class="result-tool">${toolName}</span>
                <span class="result-timestamp">${timestamp}</span>
            </div>
            <div class="result-content">${this.formatResult(result)}</div>
        `;

        this.resultsContainer.insertBefore(resultElement, this.resultsContainer.firstChild);
        this.resultsContainer.scrollTop = 0;
    }

    formatResult(result) {
        if (typeof result === 'string') {
            return result;
        }
        return JSON.stringify(result, null, 2);
    }

    addLog(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logElement = document.createElement('div');
        logElement.className = 'log-entry';
        
        logElement.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="log-level ${level}">${level.toUpperCase()}</span>
            <span class="message">${message}</span>
        `;

        this.logsContainer.appendChild(logElement);
        this.logsContainer.scrollTop = this.logsContainer.scrollHeight;
    }

    clearResults() {
        this.resultsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-play-circle"></i>
                <h3>Ready to Execute</h3>
                <p>Select a tool and execute it to see results here</p>
            </div>
        `;
    }

    clearLogs() {
        this.logsContainer.innerHTML = `
            <div class="log-entry">
                <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                <span class="log-level info">INFO</span>
                <span class="message">Logs cleared</span>
            </div>
        `;
    }

    exportResults() {
        const results = Array.from(this.resultsContainer.querySelectorAll('.result-item')).map(item => {
            const tool = item.querySelector('.result-tool').textContent;
            const timestamp = item.querySelector('.result-timestamp').textContent;
            const content = item.querySelector('.result-content').textContent;
            const isError = item.classList.contains('result-error');
            
            return { tool, timestamp, content, isError };
        });

        const dataStr = JSON.stringify(results, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `mcp-results-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showToast('Results exported successfully', 'success');
    }

    updateServerInfo() {
        if (this.serverName) this.serverName.textContent = 'Facebook Marketing API MCP';
        if (this.serverVersion) this.serverVersion.textContent = '1.0.0';
        if (this.serverToolCount) this.serverToolCount.textContent = this.tools.length.toString();
    }

    showLoading(show) {
        this.loadingOverlay.classList.toggle('show', show);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    generateSessionId() {
        return 'session-' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize the interface when the page loads
let mcpInterface;
document.addEventListener('DOMContentLoaded', () => {
    mcpInterface = new MCPServerInterface();
});