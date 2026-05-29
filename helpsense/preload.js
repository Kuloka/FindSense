const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('helpsense', {
  copyText: (text) => ipcRenderer.invoke('copy-text', text),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  setOpenAIKey: (apiKey) => ipcRenderer.invoke('set-openai-key', apiKey),
  runOpenAIHelper: (payload) => ipcRenderer.invoke('run-openai-helper', payload),
  streamOpenAIHelper: (payload) => ipcRenderer.invoke('stream-openai-helper', payload),
  cancelOpenAIHelper: (requestId) => ipcRenderer.invoke('cancel-openai-helper', requestId),
  onAIStreamChunk: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('ai-stream-chunk', listener);
    return () => ipcRenderer.removeListener('ai-stream-chunk', listener);
  },
  onAIStreamDone: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('ai-stream-done', listener);
    return () => ipcRenderer.removeListener('ai-stream-done', listener);
  },
  getAIProviderStatus: () => ipcRenderer.invoke('ai-provider-status'),
  loadAppState: () => ipcRenderer.invoke('load-app-state'),
  saveAppState: (state) => ipcRenderer.invoke('save-app-state', state)
});
