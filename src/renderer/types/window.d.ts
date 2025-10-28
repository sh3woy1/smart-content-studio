export interface ElectronAPI {
  ollama: {
    checkConnection: () => Promise<boolean>;
    listModels: () => Promise<any[]>;
    generate: (request: any) => Promise<any>;
    streamGenerate: (request: any) => Promise<any>;
    pullModel: (modelName: string) => Promise<void>;
    setModel: (model: string) => Promise<boolean>;
    getCurrentModel: () => Promise<string>;
    onStreamData: (callback: (event: any, data: any) => void) => void;
    onPullProgress: (callback: (event: any, progress: any) => void) => void;
  };
  
  database: {
    createProject: (name: string, description?: string) => Promise<any>;
    getProjects: (status?: string) => Promise<any[]>;
    createDocument: (projectId: string, title: string, content: string, type: string) => Promise<any>;
    getDocuments: (projectId?: string) => Promise<any[]>;
    updateDocument: (id: string, updates: any) => Promise<void>;
    getTemplates: (category?: string) => Promise<any[]>;
    addHistory: (documentId: string, action: string, data: any) => Promise<void>;
    updateAnalytics: (data: any) => Promise<void>;
    getAnalytics: (days?: number) => Promise<any[]>;
  };
  
  file: {
    saveDocument: (fileName: string, content: string, projectPath?: string) => Promise<string>;
    readDocument: (filePath: string) => Promise<string>;
    exportDocument: (content: string, fileName: string, options: any) => Promise<string>;
    importDocument: (filePath: string) => Promise<string>;
    listFiles: (dirPath?: string) => Promise<string[]>;
    deleteDocument: (filePath: string) => Promise<void>;
  };
  
  dialog: {
    openFile: () => Promise<string | null>;
    saveFile: (defaultName: string, content: string) => Promise<string | null>;
  };
  
  settings: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<boolean>;
    getAll: () => Promise<any>;
  };
  
  system: {
    openExternal: (url: string) => Promise<boolean>;
    showItemInFolder: (fullPath: string) => Promise<boolean>;
    copyToClipboard: (text: string) => Promise<boolean>;
    getClipboard: () => Promise<string>;
  };
  
  menu: {
    onNewDocument: (callback: () => void) => void;
    onNewProject: (callback: () => void) => void;
    onOpenFile: (callback: () => void) => void;
    onSave: (callback: () => void) => void;
    onSaveAs: (callback: () => void) => void;
    onExport: (callback: (event: any, format: string) => void) => void;
    onFind: (callback: () => void) => void;
    onReplace: (callback: () => void) => void;
    onAIImprove: (callback: () => void) => void;
    onAIExpand: (callback: () => void) => void;
    onAISummarize: (callback: () => void) => void;
    onAITone: (callback: (event: any, tone: string) => void) => void;
    onAIGenerate: (callback: (event: any, type: string) => void) => void;
    onToggleDistractionFree: (callback: () => void) => void;
    onShowShortcuts: (callback: () => void) => void;
    onCheckOllama: (callback: () => void) => void;
    onClearRecent: (callback: () => void) => void;
  };
  
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}