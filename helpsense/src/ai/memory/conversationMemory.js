const MAX_CONTEXT_MESSAGES = 12;
const MAX_CONTEXT_CHARS = 4800;

function normalizeMessage(message) {
  if (!message || typeof message !== 'object') return null;
  const role = message.role === 'assistant' ? 'assistant' : 'user';
  const content = String(message.content ?? message.text ?? '').trim();
  if (!content) return null;
  return { role, content };
}

function parseLegacyConversation(text) {
  return String(text || '')
    .split('\n')
    .map(line => {
      if (line.startsWith('User:')) return { role: 'user', content: line.replace(/^User:\s*/, '').trim() };
      if (line.startsWith('Assistant:')) return { role: 'assistant', content: line.replace(/^Assistant:\s*/, '').trim() };
      if (line.startsWith('Selected text:')) return { role: 'user', content: line.trim() };
      if (line.startsWith('User question about selected text:')) return { role: 'user', content: line.replace(/^User question about selected text:\s*/, '').trim() };
      return null;
    })
    .filter(Boolean);
}

function normalizeConversation(payload) {
  if (Array.isArray(payload.messages)) {
    return payload.messages.map(normalizeMessage).filter(Boolean);
  }
  return parseLegacyConversation(payload.text);
}

function buildContext(payload) {
  const messages = normalizeConversation(payload).slice(-MAX_CONTEXT_MESSAGES);
  const lines = messages.map(message => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content}`);
  let context = lines.join('\n');
  if (context.length > MAX_CONTEXT_CHARS) {
    context = context.slice(context.length - MAX_CONTEXT_CHARS);
    context = `Conversation summary: Earlier context was trimmed for length.\n${context}`;
  }
  return context || String(payload.text || '');
}

module.exports = {
  buildContext,
  normalizeConversation
};
