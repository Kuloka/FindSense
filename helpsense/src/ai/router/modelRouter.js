function routeModel(payload) {
  if (payload.deepResearch) return 'gpt-5.2';
  if (payload.task === 'translate' || payload.task?.startsWith('translate_')) return 'gpt-5.4-mini';
  if (payload.task === 'code_check') return 'gpt-5.4-mini';
  if (payload.task === 'summarize' || payload.task === 'shorten') return 'gpt-5.4-mini';
  if (isCasualClass(payload.messageClass) || payload.messageClass === 'abusive') return 'gpt-5.4-mini';
  if (payload.messageClass === 'math' || payload.messageClass === 'coding') return 'gpt-5.4';
  if (payload.deepThinking) return 'gpt-5.2';
  return 'gpt-5.4';
}

function modelSettings(payload) {
  const messageClass = payload.messageClass || 'serious_question';
  if (isCasualClass(messageClass)) {
    return {
      temperature: 0.8,
      maxOutputTokens: 420,
      behavior: 'fast_conversational'
    };
  }
  if (messageClass === 'abusive') {
    return {
      temperature: 0.55,
      maxOutputTokens: 180,
      behavior: 'calm_boundary'
    };
  }
  if (payload.task === 'code_check') {
    return {
      temperature: 0.15,
      maxOutputTokens: 520,
      behavior: 'fast_code_review'
    };
  }
  if (messageClass === 'math' || messageClass === 'deep_reasoning' || payload.deepThinking || payload.deepResearch) {
    return {
      temperature: 0.2,
      maxOutputTokens: payload.deepResearch ? 1600 : 900,
      behavior: 'reasoning'
    };
  }
  return {
    temperature: 0.45,
    maxOutputTokens: 900,
    behavior: 'balanced'
  };
}

function isCasualClass(messageClass) {
  return ['casual_chat', 'casual_short', 'meme', 'slang', 'emotional_reaction'].includes(messageClass);
}

module.exports = {
  modelSettings,
  routeModel
};
