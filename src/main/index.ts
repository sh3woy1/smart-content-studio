import { app, BrowserWindow, ipcMain, Menu, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { OllamaService } from './services/ollama-service';
import { DatabaseService } from './services/database-service';
import { FileService } from './services/file-service';
import { setupIpcHandlers } from './ipc-handlers';
import { createAppMenu } from './menu';
import Store from 'electron-store';

// Initialize electron store for app settings
const store = new Store();

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null;
let ollamaService: OllamaService;
let databaseService: DatabaseService;
let fileService: FileService;

const isDevelopment = process.env.NODE_ENV !== 'production';

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDevelopment, // Allow loading local files in dev
    },
    icon: path.join(__dirname, '../../resources/icons/icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: process.platform !== 'darwin',
    backgroundColor: '#1a1a1a',
    show: false, // Don't show until ready
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  // Load the index.html
  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Set up the menu
  const menu = createAppMenu(mainWindow, app);
  Menu.setApplicationMenu(menu);

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Optimize performance
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.setZoomFactor(1);
    mainWindow?.webContents.setVisualZoomLevelLimits(1, 1);
  });
}

// Initialize services
async function initializeServices() {
  try {
    // Initialize Ollama service
    ollamaService = new OllamaService(store.get('ollamaUrl', 'http://localhost:11434') as string);
    
    // Initialize database service
    const dbPath = path.join(app.getPath('userData'), 'content-studio.db');
    databaseService = new DatabaseService(dbPath);
    await databaseService.initialize();
    
    // Initialize file service
    const documentsPath = path.join(app.getPath('documents'), 'SmartContentStudio');
    if (!fs.existsSync(documentsPath)) {
      fs.mkdirSync(documentsPath, { recursive: true });
    }
    fileService = new FileService(documentsPath);
    
    // Set up IPC handlers
    setupIpcHandlers(ollamaService, databaseService, fileService, store);
    
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error);
    dialog.showErrorBox('Initialization Error', 
      'Failed to initialize application services. Please check that Ollama is running.');
  }
}

// App event handlers
app.whenReady().then(async () => {
  await initializeServices();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app updates
app.on('before-quit', async () => {
  if (databaseService) {
    await databaseService.close();
  }
});

// Handle certificate errors
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDevelopment) {
    // Ignore certificate errors in development
    event.preventDefault();
    callback(true);
  } else {
    // Use default behavior in production
    callback(false);
  }
});

// Performance optimizations
app.commandLine.appendSwitch('disable-http-cache');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

// Export for testing
export { mainWindow, ollamaService, databaseService, fileService };