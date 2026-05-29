/**
 * Maps UI language codes to readable prompt labels.
 * @param {string} code
 * @returns {string}
 */
function languageName(code) {
  return {
    auto: 'auto detect',
    ru: 'Russian',
    en: 'English',
    uk: 'Ukrainian',
    be: 'Belarusian',
    tr: 'Turkish',
    kk: 'Kazakh',
    es: 'Spanish',
    pt: 'Portuguese',
    de: 'German',
    fr: 'French',
    pl: 'Polish',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic'
  }[String(code)] || String(code);
}

/**
 * Lightweight script detector used for local deterministic answers.
 * @param {string} value
 * @returns {boolean}
 */
function usesCyrillic(value) {
  return /[а-яё]/i.test(String(value));
}

module.exports = {
  languageName,
  usesCyrillic
};
