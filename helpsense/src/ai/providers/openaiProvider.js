const { AIProvider } = require('./aiProvider');

class OpenAIProvider extends AIProvider {
  constructor(getApiKey) {
    super('openai');
    this.getApiKey = getApiKey;
  }

  hasApiKey() {
    return Boolean(this.getApiKey());
  }

  async generate(options) {
    const response = await this.request(options, false);
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, provider: this.name, error: data?.error?.message || `OpenAI request failed: ${response.status}` };
    }
    return { ok: true, provider: this.name, text: data.output_text || '', confidence: 'high' };
  }

  async stream(options) {
    const response = await this.request(options, true);
    if (!response.ok) {
      let error = `OpenAI request failed: ${response.status}`;
      try {
        const data = await response.json();
        error = data?.error?.message || error;
      } catch {
        // The stream body can be unreadable after an HTTP error; keep the status error.
      }
      return { ok: false, provider: this.name, error };
    }

    let text = '';
    for await (const event of readSse(response.body, options.signal)) {
      if (event.type === 'response.output_text.delta' && event.delta) {
        text += event.delta;
        options.onChunk?.(event.delta);
      }
      if (event.type === 'response.completed') break;
      if (event.type === 'response.failed') {
        return { ok: false, provider: this.name, error: event.response?.error?.message || 'OpenAI stream failed.' };
      }
    }

    return { ok: true, provider: this.name, text, confidence: 'high' };
  }

  async request(options, stream) {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error('OpenAI API key is missing.');

    const body = {
      model: options.model,
      store: false,
      stream,
      instructions: options.instructions,
      input: options.input
    };
    if (typeof options.temperature === 'number') body.temperature = options.temperature;
    if (typeof options.maxOutputTokens === 'number') body.max_output_tokens = options.maxOutputTokens;

    return fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      signal: options.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
  }
}

async function* readSse(body, signal) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (!signal?.aborted) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() || '';

    for (const rawEvent of events) {
      const dataLines = rawEvent
        .split('\n')
        .filter(line => line.startsWith('data:'))
        .map(line => line.slice(5).trim());
      if (!dataLines.length) continue;
      const payload = dataLines.join('\n');
      if (payload === '[DONE]') return;
      try {
        yield JSON.parse(payload);
      } catch {
        // Ignore malformed SSE frames; provider errors are reported as structured events.
      }
    }
  }
}

module.exports = {
  OpenAIProvider
};
