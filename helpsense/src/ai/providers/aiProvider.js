class AIProvider {
  constructor(name) {
    this.name = name;
  }

  async generate() {
    throw new Error(`${this.name}.generate is not implemented.`);
  }

  async stream(options) {
    const result = await this.generate(options);
    if (result?.text) options.onChunk?.(result.text);
    return result;
  }

  async health() {
    return { ok: true, provider: this.name };
  }
}

module.exports = {
  AIProvider
};
