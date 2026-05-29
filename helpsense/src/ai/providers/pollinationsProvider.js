const { AIProvider } = require('./aiProvider');

class PollinationsProvider extends AIProvider {
  constructor() {
    super('pollinations');
  }

  async generate(options) {
    const prompt = [options.instructions, '', options.input].join('\n');
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
      signal: options.signal
    });
    if (!response.ok) return { ok: false, provider: this.name, error: 'Pollinations request failed.' };
    const answer = await response.text();
    return { ok: true, provider: this.name, text: answer.trim(), confidence: 'low' };
  }
}

module.exports = {
  PollinationsProvider
};
