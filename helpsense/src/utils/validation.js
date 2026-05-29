const ALLOWED_URLS = [
  'https://translate.google.com/',
  'https://translate.google.com/?',
  'https://www.deepl.com/translator'
];

function toSafeString(value, maxLength = 4000) {
  return String(value ?? '').slice(0, maxLength);
}

function validateUrl(value) {
  const url = String(value ?? '');
  return ALLOWED_URLS.some(prefix => url.startsWith(prefix));
}

function normalizeAiPayload(payload) {
  const task = toSafeString(payload?.task, 40);
  const maxText = task === 'translate' ? 1400 : (task === 'code_check' ? 6000 : 3200);
  return {
    requestId: toSafeString(payload?.requestId || `${Date.now()}-${Math.random()}`, 120),
    task,
    text: toSafeString(payload?.text, maxText),
    from: toSafeString(payload?.from || 'auto', 16),
    to: toSafeString(payload?.to || 'en', 16),
    language: toSafeString(payload?.language || '', 16),
    deepThinking: Boolean(payload?.deepThinking),
    deepResearch: Boolean(payload?.deepResearch),
    stream: Boolean(payload?.stream)
  };
}

module.exports = {
  normalizeAiPayload,
  toSafeString,
  validateUrl
};
