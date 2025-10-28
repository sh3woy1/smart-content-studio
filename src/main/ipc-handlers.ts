import { ipcMain, dialog, shell, clipboard } from 'electron';
import { OllamaService } from './services/ollama-service';
import { DatabaseService } from './services/database-service';
import { FileService } from './services/file-service';
import Store from 'electron-store';
import * as path from 'path';

export function setupIpcHandlers(
  ollamaService: OllamaService,
  databaseService: DatabaseService,
  fileService: FileService,
  store: Store
) {
  // Ollama handlers
  ipcMain.handle('ollama:check-connection', async () => {
    return await ollamaService.checkConnection();
  });

  ipcMain.handle('ollama:list-models', async () => {
    return await ollamaService.listModels();
  });

  ipcMain.handle('ollama:generate', async (event, request) => {
    return await ollamaService.generate(request);
  });

  ipcMain.handle('ollama:stream-generate', async (event, request) => {
    const responses: any[] = [];
    
    await ollamaService.streamGenerate(request, (data) => {
      responses.push(data);
      event.sender.send('ollama:stream-data', data);
    });
    
    return responses;
  });

  ipcMain.handle('ollama:pull-model', async (event, modelName) => {
    await ollamaService.pullModel(modelName, (progress) => {
      event.sender.send('ollama:pull-progress', progress);
    });
    return true;
  });

  ipcMain.handle('ollama:set-model', async (event, model) => {
    ollamaService.setCurrentModel(model);
    return true;
  });

  ipcMain.handle('ollama:get-current-model', async () => {
    return ollamaService.getCurrentModel();
  });

  // Database handlers
  ipcMain.handle('db:create-project', async (event, name, description) => {
    return databaseService.createProject(name, description);
  });

  ipcMain.handle('db:get-projects', async (event, status) => {
    return databaseService.getProjects(status);
  });

  ipcMain.handle('db:create-document', async (event, projectId, title, content, type) => {
    return databaseService.createDocument(projectId, title, content, type);
  });

  ipcMain.handle('db:get-documents', async (event, projectId) => {
    return databaseService.getDocuments(projectId);
  });

  ipcMain.handle('db:update-document', async (event, id, updates) => {
    return databaseService.updateDocument(id, updates);
  });

  ipcMain.handle('db:get-templates', async (event, category) => {
    return databaseService.getTemplates(category);
  });

  ipcMain.handle('db:add-history', async (event, documentId, action, data) => {
    return databaseService.addHistory(documentId, action, data);
  });

  ipcMain.handle('db:update-analytics', async (event, data) => {
    return databaseService.updateAnalytics(data);
  });

  ipcMain.handle('db:get-analytics', async (event, days) => {
    return databaseService.getAnalytics(days);
  });

  // File handlers
  ipcMain.handle('file:save-document', async (event, fileName, content, projectPath) => {
    return await fileService.saveDocument(fileName, content, projectPath);
  });

  ipcMain.handle('file:read-document', async (event, filePath) => {
    return await fileService.readDocument(filePath);
  });

  ipcMain.handle('file:export-document', async (event, content, fileName, options) => {
    return await fileService.exportDocument(content, fileName, options);
  });

  ipcMain.handle('file:import-document', async (event, filePath) => {
    return await fileService.importDocument(filePath);
  });

  ipcMain.handle('file:list-files', async (event, dirPath) => {
    return await fileService.listFiles(dirPath);
  });

  ipcMain.handle('file:delete-document', async (event, filePath) => {
    return await fileService.deleteDocument(filePath);
  });

  // Dialog handlers
  ipcMain.handle('dialog:open-file', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Text Files', extensions: ['md', 'txt', 'html', 'rtf'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  ipcMain.handle('dialog:save-file', async (event, defaultName, content) => {
    const result = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters: [
        { name: 'Markdown', extensions: ['md'] },
        { name: 'HTML', extensions: ['html'] },
        { name: 'Text', extensions: ['txt'] }
      ]
    });
    
    if (!result.canceled && result.filePath) {
      await fileService.saveDocument(path.basename(result.filePath), content, path.dirname(result.filePath));
      return result.filePath;
    }
    return null;
  });

  // Settings handlers
  ipcMain.handle('settings:get', async (event, key) => {
    return store.get(key);
  });

  ipcMain.handle('settings:set', async (event, key, value) => {
    store.set(key, value);
    return true;
  });

  ipcMain.handle('settings:get-all', async () => {
    return store.store;
  });

  // System handlers
  ipcMain.handle('system:open-external', async (event, url) => {
    await shell.openExternal(url);
    return true;
  });

  ipcMain.handle('system:show-item-in-folder', async (event, fullPath) => {
    shell.showItemInFolder(fullPath);
    return true;
  });

  ipcMain.handle('system:copy-to-clipboard', async (event, text) => {
    clipboard.writeText(text);
    return true;
  });

  ipcMain.handle('system:get-clipboard', async () => {
    return clipboard.readText();
  });
}