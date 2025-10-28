const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Ollama API
  ollama: {
    checkConnection: () => ipcRenderer.invoke('ollama:check-connection'),
    listModels: () => ipcRenderer.invoke('ollama:list-models'),
    generate: (request) => ipcRenderer.invoke('ollama:generate', request),
    streamGenerate: (request) => ipcRenderer.invoke('ollama:stream-generate', request),
    pullModel: (modelName) => ipcRenderer.invoke('ollama:pull-model', modelName),
    setModel: (model) => ipcRenderer.invoke('ollama:set-model', model),
    getCurrentModel: () => ipcRenderer.invoke('ollama:get-current-model'),
    onStreamData: (callback) => ipcRenderer.on('ollama:stream-data', callback),
    onPullProgress: (callback) => ipcRenderer.on('ollama:pull-progress', callback),
  },

  // Database API
  database: {
    createProject: (name, description) => ipcRenderer.invoke('db:create-project', name, description),
    getProjects: (status) => ipcRenderer.invoke('db:get-projects', status),
    createDocument: (projectId, title, content, type) => 
      ipcRenderer.invoke('db:create-document', projectId, title, content, type),
    getDocuments: (projectId) => ipcRenderer.invoke('db:get-documents', projectId),
    updateDocument: (id, updates) => ipcRenderer.invoke('db:update-document', id, updates),
    getTemplates: (category) => ipcRenderer.invoke('db:get-templates', category),
    addHistory: (documentId, action, data) => 
      ipcRenderer.invoke('db:add-history', documentId, action, data),
    updateAnalytics: (data) => ipcRenderer.invoke('db:update-analytics', data),
    getAnalytics: (days) => ipcRenderer.invoke('db:get-analytics', days),
  },

  // File System API
  file: {
    saveDocument: (fileName, content, projectPath) => 
      ipcRenderer.invoke('file:save-document', fileName, content, projectPath),
    readDocument: (filePath) => ipcRenderer.invoke('file:read-document', filePath),
    exportDocument: (content, fileName, options) => 
      ipcRenderer.invoke('file:export-document', content, fileName, options),
    importDocument: (filePath) => ipcRenderer.invoke('file:import-document', filePath),
    listFiles: (dirPath) => ipcRenderer.invoke('file:list-files', dirPath),
    deleteDocument: (filePath) => ipcRenderer.invoke('file:delete-document', filePath),
  },

  // Dialog API
  dialog: {
    openFile: () => ipcRenderer.invoke('dialog:open-file'),
    saveFile: (defaultName, content) => ipcRenderer.invoke('dialog:save-file', defaultName, content),
  },

  // Settings API
  settings: {
    get: (key) => ipcRenderer.invoke('settings:get', key),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:get-all'),
  },

  // System API
  system: {
    openExternal: (url) => ipcRenderer.invoke('system:open-external', url),
    showItemInFolder: (fullPath) => ipcRenderer.invoke('system:show-item-in-folder', fullPath),
    copyToClipboard: (text) => ipcRenderer.invoke('system:copy-to-clipboard', text),
    getClipboard: () => ipcRenderer.invoke('system:get-clipboard'),
  },

  // Menu events
  menu: {
    onNewDocument: (callback) => ipcRenderer.on('menu:new-document', callback),
    onNewProject: (callback) => ipcRenderer.on('menu:new-project', callback),
    onOpenFile: (callback) => ipcRenderer.on('menu:open-file', callback),
    onSave: (callback) => ipcRenderer.on('menu:save', callback),
    onSaveAs: (callback) => ipcRenderer.on('menu:save-as', callback),
    onExport: (callback) => ipcRenderer.on('menu:export', callback),
    onFind: (callback) => ipcRenderer.on('menu:find', callback),
    onReplace: (callback) => ipcRenderer.on('menu:replace', callback),
    onAIImprove: (callback) => ipcRenderer.on('menu:ai-improve', callback),
    onAIExpand: (callback) => ipcRenderer.on('menu:ai-expand', callback),
    onAISummarize: (callback) => ipcRenderer.on('menu:ai-summarize', callback),
    onAITone: (callback) => ipcRenderer.on('menu:ai-tone', callback),
    onAIGenerate: (callback) => ipcRenderer.on('menu:ai-generate', callback),
    onToggleDistractionFree: (callback) => ipcRenderer.on('menu:toggle-distraction-free', callback),
    onShowShortcuts: (callback) => ipcRenderer.on('menu:show-shortcuts', callback),
    onCheckOllama: (callback) => ipcRenderer.on('menu:check-ollama', callback),
    onClearRecent: (callback) => ipcRenderer.on('menu:clear-recent', callback),
  },

  // Remove all listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
});