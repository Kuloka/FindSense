const { BASE_SYSTEM_PROMPT, SAFETY_PROMPT } = require('./prompts/basePrompt');
const { buildInstructions } = require('./prompts/taskPrompts');
const { buildContext } = require('./memory/conversationMemory');
const { SemanticMemory } = require('./memory/semanticMemory');
const { localTranslate } = require('./dictionaries/localDictionary');
const { quickCasualResponse } = require('./router/casualResponder');
const { classifyMessage } = require('./router/messageClassifier');
const { modelSettings, routeModel } = require('./router/modelRouter');
const { OpenAIProvider } = require('./providers/openaiProvider');
const { OllamaProvider } = require('./providers/ollamaProvider');
const { PollinationsProvider } = require('./providers/pollinationsProvider');
const { answerKnownPattern } = require('../utils/math');

class AIManager {
  constructor({ getApiKey }) {
    this.controllers = new Map();
    this.cache = new SemanticMemory();
    this.openai = new OpenAIProvider(getApiKey);
    this.ollama = new OllamaProvider();
    this.pollinations = new PollinationsProvider();
  }

  cancel(requestId) {
    const controller = this.controllers.get(String(requestId ?? ''));
    if (!controller) return false;
    controller.helpsenseCancelled = true;
    controller.abort();
    this.controllers.delete(String(requestId ?? ''));
    return true;
  }

  async generate(payload) {
    payload = this.preparePayload(payload);
    const dictionaryAnswer = localTranslate(payload);
    if (dictionaryAnswer) {
      return { ok: true, text: cleanAssistantText(dictionaryAnswer), provider: 'local-dictionary', confidence: 'high' };
    }

    if (payload.task === 'chat') {
      const localAnswer = answerKnownPattern(payload.text);
      if (localAnswer) return { ok: true, text: cleanAssistantText(localAnswer), provider: 'local-math', confidence: 'high' };
      const casualAnswer = quickCasualResponse(payload);
      if (casualAnswer) return { ok: true, text: cleanAssistantText(casualAnswer), provider: 'local-casual', confidence: 'medium' };
    }

    const cacheKey = cacheKeyFor(payload);
    const cached = payload.task !== 'chat' ? this.cache.get(cacheKey) : null;
    if (cached) return { ...cached, cached: true };

    const result = await this.runWithController(payload, async options => this.generateWithFallback(options));
    if (result?.ok && payload.task !== 'chat') this.cache.set(cacheKey, result);
    return result;
  }

  async stream(payload, onChunk) {
    payload = this.preparePayload(payload);
    const dictionaryAnswer = localTranslate(payload);
    if (dictionaryAnswer) {
      const clean = cleanAssistantText(dictionaryAnswer);
      onChunk?.(clean);
      return { ok: true, text: clean, provider: 'local-dictionary', confidence: 'high' };
    }

    if (payload.task === 'chat') {
      const localAnswer = answerKnownPattern(payload.text);
      if (localAnswer) {
        const clean = cleanAssistantText(localAnswer);
        onChunk?.(clean);
        return { ok: true, text: clean, provider: 'local-math', confidence: 'high' };
      }
      const casualAnswer = quickCasualResponse(payload);
      if (casualAnswer) {
        const clean = cleanAssistantText(casualAnswer);
        onChunk?.(clean);
        return { ok: true, text: clean, provider: 'local-casual', confidence: 'medium' };
      }
    }

    return this.runWithController(payload, async options => this.streamWithFallback(options, onChunk));
  }

  async status() {
    return {
      openai: { ok: this.openai.hasApiKey(), configured: this.openai.hasApiKey() },
      ollama: await this.ollama.health(),
      pollinations: { ok: true, configured: true }
    };
  }

  async runWithController(payload, runner) {
    const requestId = payload.requestId;
    const controller = new AbortController();
    const timeoutMs = payload.task === 'chat'
      ? (payload.deepResearch ? 600000 : 300000)
      : 45000;
    const timeout = setTimeout(() => {
      controller.helpsenseTimedOut = true;
      controller.abort();
    }, timeoutMs);
    this.controllers.set(requestId, controller);

    try {
      const options = this.buildOptions(payload, controller.signal);
      const result = await runner(options);
      if (!result?.ok && controller.helpsenseTimedOut) {
        return { ok: false, error: 'AI timed out. Try again.' };
      }
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          ok: false,
          error: controller.helpsenseTimedOut ? 'AI timed out. Try again.' : 'Request stopped.'
        };
      }
      return { ok: false, error: error.message || 'AI request failed.' };
    } finally {
      clearTimeout(timeout);
      this.controllers.delete(requestId);
    }
  }

  buildOptions(payload, signal) {
    const taskInstructions = buildInstructions(payload);
    const settings = modelSettings(payload);
    return {
      payload,
      signal,
      model: routeModel(payload),
      temperature: settings.temperature,
      maxOutputTokens: settings.maxOutputTokens,
      behavior: settings.behavior,
      instructions: [
        BASE_SYSTEM_PROMPT,
        payload.language ? `If the latest message has no clear language, answer in the UI language: ${payload.language}.` : '',
        SAFETY_PROMPT,
        taskInstructions
      ].filter(Boolean).join('\n'),
      input: buildContext(payload)
    };
  }

  preparePayload(payload) {
    if (payload.messageClass) return payload;
    return {
      ...payload,
      messageClass: classifyMessage(payload)
    };
  }

  async generateWithFallback(options) {
    const providers = this.providerChain(options.payload);
    return this.firstSuccessful(providers, provider => provider.generate(options));
  }

  async streamWithFallback(options, onChunk) {
    const providers = this.providerChain(options.payload);
    return this.firstSuccessful(providers, provider => provider.stream({ ...options, onChunk }));
  }

  providerChain(payload = {}) {
    const isFastTranslation = payload.task === 'translate' || payload.task?.startsWith('translate_');
    if (isFastTranslation) {
      return this.openai.hasApiKey()
        ? [this.openai, this.pollinations, this.ollama]
        : [this.pollinations, this.ollama];
    }

    if (isCasualClass(payload.messageClass) || payload.messageClass === 'abusive') {
      return this.openai.hasApiKey()
        ? [this.openai, this.pollinations, this.ollama]
        : [this.pollinations, this.ollama];
    }

    return this.openai.hasApiKey()
      ? [this.openai, this.ollama, this.pollinations]
      : [this.ollama, this.pollinations];
  }

  async firstSuccessful(providers, runProvider) {
    let lastError = { ok: false, error: 'AI is unavailable.' };
    for (const provider of providers) {
      const result = await retry(() => runProvider(provider), 2);
      if (result?.ok) return { ...result, text: cleanAssistantText(result.text) };
      lastError = result || lastError;
    }
    return lastError;
  }
}

async function retry(fn, attempts) {
  let last;
  for (let index = 0; index < attempts; index += 1) {
    try {
      return await fn();
    } catch (error) {
      last = error;
      if (error.name === 'AbortError') throw error;
    }
  }
  return { ok: false, error: last?.message || 'Provider failed.' };
}

function cacheKeyFor(payload) {
  return JSON.stringify({
    task: payload.task,
    text: payload.text,
    from: payload.from,
    to: payload.to
  });
}

function cleanAssistantText(text) {
  const raw = String(text || '').trim();
  const jsonAnswer = extractUserFacingJsonAnswer(raw);
  if (jsonAnswer !== null) return jsonAnswer;
  if (/^\s*```(?:json)?\s*\{[\s\S]*?(?:"reasoning"|"analysis"|"role")/i.test(raw)) {
    const fenced = raw.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
    const fencedAnswer = extractUserFacingJsonAnswer(fenced);
    if (fencedAnswer !== null) return fencedAnswer;
  }
  if (/^\s*\{[\s\S]*?(?:"reasoning"|"analysis"|"role")/i.test(raw)) return '';
  return String(text || '')
    .replace(/(?:\n|\r|\s)*\(?\s*note\s*:\s*[\s\S]*$/i, '')
    .replace(/(?:\n|\r|\s)*\(?\s*примечание\s*:\s*[\s\S]*$/i, '')
    .trim();
}

function extractUserFacingJsonAnswer(raw) {
  try {
    const source = String(raw || '').trim();
    const parsed = JSON.parse(source);
    if (!parsed || typeof parsed !== 'object') return null;
    if ('translation' in parsed && typeof parsed.translation === 'string') return parsed.translation.trim();
    if (!('reasoning' in parsed) && !('analysis' in parsed) && !('role' in parsed)) return null;
    const candidates = [
      parsed.translation,
      parsed.final,
      parsed.answer,
      parsed.content,
      parsed.text,
      parsed.message?.content,
      Array.isArray(parsed.messages) ? parsed.messages.at(-1)?.content : ''
    ];
    const answer = candidates.find(value => typeof value === 'string' && value.trim());
    return answer ? cleanAssistantText(answer) : '';
  } catch {
    const source = String(raw || '').trim();
    const jsonStart = source.indexOf('{');
    const jsonEnd = source.lastIndexOf('}');
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      return extractUserFacingJsonAnswer(source.slice(jsonStart, jsonEnd + 1));
    }
    return null;
  }
}

module.exports = {
  AIManager
};

function isCasualClass(messageClass) {
  return ['casual_chat', 'casual_short', 'meme', 'slang', 'emotional_reaction'].includes(messageClass);
}
