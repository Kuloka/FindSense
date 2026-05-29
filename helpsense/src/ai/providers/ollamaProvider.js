const { AIProvider } = require('./aiProvider');

class OllamaProvider extends AIProvider {
  constructor() {
    super('ollama');
  }

  async generate(options) {
    const model = await this.localModel(options.signal);
    if (!model) {
      return { ok: false, provider: this.name, error: 'No local AI model found. Check internet or install Ollama and pull a model.' };
    }

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      signal: options.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        prompt: [options.instructions, '', options.input].join('\n')
      })
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, provider: this.name, error: data?.error || 'Ollama request failed.' };
    return { ok: true, provider: this.name, text: data.response || '', confidence: 'medium' };
  }

  async stream(options) {
    const model = await this.localModel(options.signal);
    if (!model) {
      return { ok: false, provider: this.name, error: 'No local AI model found. Check internet or install Ollama and pull a model.' };
    }

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      signal: options.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: true,
        prompt: [options.instructions, '', options.input].join('\n')
      })
    });

    if (!response.ok) return { ok: false, provider: this.name, error: 'Ollama request failed.' };

    let text = '';
    for await (const event of readJsonLines(response.body, options.signal)) {
      if (event.response) {
        text += event.response;
        options.onChunk?.(event.response);
      }
      if (event.done) break;
    }
    return { ok: true, provider: this.name, text, confidence: 'medium' };
  }

  async localModel(signal) {
    try {
      const response = await fetch('http://127.0.0.1:11434/api/tags', { signal });
      if (!response.ok) return '';
      const tags = await response.json();
      return tags?.models?.[0]?.name || '';
    } catch {
      return '';
    }
  }
}

async function* readJsonLines(body, signal) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (!signal?.aborted) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        yield JSON.parse(line);
      } catch {
        // Ignore incomplete stream frames.
      }
    }
  }
}

module.exports = {
  OllamaProvider
};
