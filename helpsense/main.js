const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { AIManager } = require('./src/ai/aiManager');
const { registerAiHandlers } = require('./src/ipc/aiHandlers');
const { registerAppHandlers } = require('./src/ipc/appHandlers');
const { StateManager } = require('./src/storage/stateManager');

const keyStore = {
  sessionApiKey: ''
};

if (process.platform === 'win32') {
  app.setAppUserModelId('dev.kuloka.helpsense');
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 980,
    height: 680,
    minWidth: 760,
    minHeight: 520,
    backgroundColor: '#080909',
    title: 'helpsense',
    icon: path.join(__dirname, 'src', 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}

const stateManager = new StateManager(app);
const aiManager = new AIManager({
  getApiKey: () => keyStore.sessionApiKey || process.env.OPENAI_API_KEY
});

registerAppHandlers(ipcMain, stateManager);
registerAiHandlers(ipcMain, aiManager, keyStore);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
