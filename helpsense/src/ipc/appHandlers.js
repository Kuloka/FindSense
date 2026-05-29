const { clipboard, shell } = require('electron');
const { validateUrl } = require('../utils/validation');

function registerAppHandlers(ipcMain, stateManager) {
  ipcMain.handle('load-app-state', () => stateManager.load());
  ipcMain.handle('save-app-state', (_event, state) => stateManager.save(state));

  ipcMain.handle('copy-text', (_event, text) => {
    clipboard.writeText(String(text ?? ''));
    return true;
  });

  ipcMain.handle('open-url', (_event, url) => {
    if (!validateUrl(url)) return false;
    shell.openExternal(String(url));
    return true;
  });
}

module.exports = {
  registerAppHandlers
};
