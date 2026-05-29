const { normalizeAiPayload } = require('../utils/validation');

function registerAiHandlers(ipcMain, aiManager, keyStore) {
  ipcMain.handle('set-openai-key', (_event, apiKey) => {
    keyStore.sessionApiKey = String(apiKey ?? '').trim();
    return Boolean(keyStore.sessionApiKey || process.env.OPENAI_API_KEY);
  });

  ipcMain.handle('cancel-openai-helper', (_event, requestId) => aiManager.cancel(requestId));

  ipcMain.handle('run-openai-helper', async (_event, payload) => {
    const normalized = normalizeAiPayload(payload);
    if (!normalized.text.trim()) return { ok: false, error: 'Input is empty.' };
    const result = await aiManager.generate(normalized);
    return result;
  });

  ipcMain.handle('stream-openai-helper', async (event, payload) => {
    const normalized = normalizeAiPayload({ ...payload, stream: true });
    if (!normalized.text.trim()) return { ok: false, error: 'Input is empty.' };
    const result = await aiManager.stream(normalized, chunk => {
      event.sender.send('ai-stream-chunk', {
        requestId: normalized.requestId,
        chunk
      });
    });
    event.sender.send('ai-stream-done', {
      requestId: normalized.requestId,
      ok: Boolean(result?.ok),
      error: result?.error || '',
      provider: result?.provider || '',
      confidence: result?.confidence || '',
      text: result?.text || ''
    });
    return result;
  });

  ipcMain.handle('ai-provider-status', () => aiManager.status());
}

module.exports = {
  registerAiHandlers
};
