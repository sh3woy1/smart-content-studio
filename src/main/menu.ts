import { Menu, MenuItemConstructorOptions, BrowserWindow, app, shell, dialog } from 'electron';

export function createAppMenu(mainWindow: BrowserWindow, application: typeof app): Menu {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Document',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu:new-document');
          }
        },
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            mainWindow.webContents.send('menu:new-project');
          }
        },
        { type: 'separator' },
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu:open-file');
          }
        },
        {
          label: 'Open Recent',
          submenu: [
            { label: 'Clear Recent', click: () => mainWindow.webContents.send('menu:clear-recent') }
          ]
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu:save');
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('menu:save-as');
          }
        },
        { type: 'separator' },
        {
          label: 'Export',
          submenu: [
            {
              label: 'Export as HTML',
              click: () => mainWindow.webContents.send('menu:export', 'html')
            },
            {
              label: 'Export as PDF',
              click: () => mainWindow.webContents.send('menu:export', 'pdf')
            },
            {
              label: 'Export as Word',
              click: () => mainWindow.webContents.send('menu:export', 'docx')
            },
            {
              label: 'Export as Plain Text',
              click: () => mainWindow.webContents.send('menu:export', 'txt')
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            application.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => mainWindow.webContents.send('menu:find')
        },
        {
          label: 'Replace',
          accelerator: 'CmdOrCtrl+H',
          click: () => mainWindow.webContents.send('menu:replace')
        }
      ]
    },
    {
      label: 'AI Assistant',
      submenu: [
        {
          label: 'Improve Writing',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow.webContents.send('menu:ai-improve')
        },
        {
          label: 'Expand Text',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow.webContents.send('menu:ai-expand')
        },
        {
          label: 'Summarize',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('menu:ai-summarize')
        },
        { type: 'separator' },
        {
          label: 'Change Tone',
          submenu: [
            { label: 'Professional', click: () => mainWindow.webContents.send('menu:ai-tone', 'professional') },
            { label: 'Casual', click: () => mainWindow.webContents.send('menu:ai-tone', 'casual') },
            { label: 'Friendly', click: () => mainWindow.webContents.send('menu:ai-tone', 'friendly') },
            { label: 'Persuasive', click: () => mainWindow.webContents.send('menu:ai-tone', 'persuasive') },
            { label: 'Formal', click: () => mainWindow.webContents.send('menu:ai-tone', 'formal') }
          ]
        },
        { type: 'separator' },
        {
          label: 'Generate Content',
          submenu: [
            { label: 'Blog Post', click: () => mainWindow.webContents.send('menu:ai-generate', 'blog') },
            { label: 'Social Media', click: () => mainWindow.webContents.send('menu:ai-generate', 'social') },
            { label: 'Email', click: () => mainWindow.webContents.send('menu:ai-generate', 'email') },
            { label: 'Product Description', click: () => mainWindow.webContents.send('menu:ai-generate', 'product') }
          ]
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: 'Distraction Free Mode',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
            mainWindow.webContents.send('menu:toggle-distraction-free');
          }
        },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
        ...(process.platform === 'darwin'
          ? [
              { type: 'separator' as const },
              { label: 'Bring All to Front', role: 'front' as const }
            ]
          : [])
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com/smart-content-studio/docs');
          }
        },
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+/',
          click: () => mainWindow.webContents.send('menu:show-shortcuts')
        },
        { type: 'separator' },
        {
          label: 'Check Ollama Status',
          click: () => mainWindow.webContents.send('menu:check-ollama')
        },
        { type: 'separator' },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Smart Content Studio',
              message: 'Smart Content Studio',
              detail: 'Version 1.0.0\n\nA powerful content creation tool powered by Ollama AI.\n\n© 2024 Smart Content Studio',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: application.getName(),
      submenu: [
        { label: 'About ' + application.getName(), role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ' + application.getName(), accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideOthers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => application.quit() }
      ]
    });
  }

  return Menu.buildFromTemplate(template);
}