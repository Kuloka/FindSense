const enRu = require('./en-ru.json');
const ruEn = require('./ru-en.json');

function localTranslate(payload) {
  if (payload.task !== 'translate') return null;
  const text = normalize(payload.text);
  if (!text) return null;

  const from = payload.from;
  const to = payload.to;
  const dictionary = pickDictionary(from, to, text);
  if (!dictionary) return null;

  const exact = dictionary[text];
  if (exact) return matchCapitalization(payload.text.trim(), exact);

  const words = text.split(/\s+/);
  if (words.length > 8) return null;
  const translated = words.map(word => dictionary[word] || '').filter(Boolean);
  if (translated.length !== words.length) return null;
  return translated.join(' ');
}

function pickDictionary(from, to, text) {
  if (to === 'ru') return enRu;
  if (to === 'en') return ruEn;
  if (from === 'ru' && to === 'en') return ruEn;
  if (from === 'en' && to === 'ru') return enRu;
  if (from === 'auto') return /[а-яё]/i.test(text) && to === 'en' ? ruEn : enRu;
  return null;
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[!?.,;:]+$/g, '')
    .trim();
}

function matchCapitalization(source, translated) {
  return /^[A-ZА-ЯЁ]/.test(source)
    ? translated.charAt(0).toUpperCase() + translated.slice(1)
    : translated;
}

module.exports = {
  localTranslate
};
