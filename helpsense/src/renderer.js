const THEMES = [
  ['rgb', 'RGB', ['#61dafb', '#ff65b7', '#ffe15a', '#9dff47'], false],
  ['white-green', 'WHITE / GREEN', ['#9dff47', '#ffffff'], false],
  ['green-cyan', 'GREEN / CYAN', ['#9dff47', '#36d5ff'], false],
  ['green-yellow', 'GREEN / YELLOW', ['#9dff47', '#ffe15a'], false],
  ['green-pink', 'GREEN / PINK', ['#9dff47', '#ff65b7'], false],
  ['green-violet', 'GREEN / VIOLET', ['#9dff47', '#9c6bff'], false],
  ['green-orange', 'GREEN / ORANGE', ['#9dff47', '#ff9f43'], false],
  ['green-red', 'GREEN / RED', ['#9dff47', '#ff4b4b'], false],
  ['green-blue', 'GREEN / BLUE', ['#9dff47', '#4b7bff'], false],
  ['green-mint', 'GREEN / MINT', ['#9dff47', '#67ffd2'], false],
  ['green-silver', 'GREEN / SILVER', ['#9dff47', '#b8c0cc'], false],
  ['ua', 'Ukraine', ['#0057b7', '#ffd700'], true],
  ['ru', 'Russia', ['#ffffff', '#0039a6', '#d52b1e'], true],
  ['by', 'Belarus', ['#c8313e', '#c8313e', '#4aa657'], true],
  ['us', 'America', ['#b22234', '#ffffff', '#3c3b6e'], true],
  ['tr', 'Turkey', ['#e30a17', '#ffffff'], true]
];

const FALLBACK_CURRENCIES = {
  AED: 'United Arab Emirates Dirham',
  AFN: 'Afghan Afghani',
  ALL: 'Albanian Lek',
  AMD: 'Armenian Dram',
  ANG: 'Netherlands Antillean Guilder',
  AOA: 'Angolan Kwanza',
  ARS: 'Argentine Peso',
  AUD: 'Australian Dollar',
  AWG: 'Aruban Florin',
  AZN: 'Azerbaijani Manat',
  BAM: 'Bosnia and Herzegovina Convertible Mark',
  BBD: 'Barbadian Dollar',
  BDT: 'Bangladeshi Taka',
  BGN: 'Bulgarian Lev',
  BHD: 'Bahraini Dinar',
  BIF: 'Burundian Franc',
  BMD: 'Bermudian Dollar',
  BND: 'Brunei Dollar',
  BOB: 'Bolivian Boliviano',
  BRL: 'Brazilian Real',
  BSD: 'Bahamian Dollar',
  BTN: 'Bhutanese Ngultrum',
  BWP: 'Botswana Pula',
  BYN: 'Belarusian Ruble',
  BZD: 'Belize Dollar',
  CAD: 'Canadian Dollar',
  CDF: 'Congolese Franc',
  CHF: 'Swiss Franc',
  CLP: 'Chilean Peso',
  CNY: 'Chinese Yuan',
  COP: 'Colombian Peso',
  CRC: 'Costa Rican Colon',
  CUP: 'Cuban Peso',
  CVE: 'Cape Verdean Escudo',
  CZK: 'Czech Koruna',
  DJF: 'Djiboutian Franc',
  DKK: 'Danish Krone',
  DOP: 'Dominican Peso',
  DZD: 'Algerian Dinar',
  EGP: 'Egyptian Pound',
  ERN: 'Eritrean Nakfa',
  ETB: 'Ethiopian Birr',
  EUR: 'Euro',
  FJD: 'Fijian Dollar',
  GBP: 'British Pound',
  GEL: 'Georgian Lari',
  GHS: 'Ghanaian Cedi',
  GMD: 'Gambian Dalasi',
  GNF: 'Guinean Franc',
  GTQ: 'Guatemalan Quetzal',
  HKD: 'Hong Kong Dollar',
  HNL: 'Honduran Lempira',
  HTG: 'Haitian Gourde',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Shekel',
  INR: 'Indian Rupee',
  IQD: 'Iraqi Dinar',
  IRR: 'Iranian Rial',
  ISK: 'Icelandic Krona',
  JMD: 'Jamaican Dollar',
  JOD: 'Jordanian Dinar',
  JPY: 'Japanese Yen',
  KES: 'Kenyan Shilling',
  KGS: 'Kyrgyzstani Som',
  KHR: 'Cambodian Riel',
  KMF: 'Comorian Franc',
  KRW: 'South Korean Won',
  KWD: 'Kuwaiti Dinar',
  KZT: 'Kazakhstani Tenge',
  LAK: 'Lao Kip',
  LBP: 'Lebanese Pound',
  LKR: 'Sri Lankan Rupee',
  LYD: 'Libyan Dinar',
  MAD: 'Moroccan Dirham',
  MDL: 'Moldovan Leu',
  MGA: 'Malagasy Ariary',
  MKD: 'Macedonian Denar',
  MMK: 'Myanmar Kyat',
  MNT: 'Mongolian Tugrik',
  MOP: 'Macanese Pataca',
  MUR: 'Mauritian Rupee',
  MVR: 'Maldivian Rufiyaa',
  MWK: 'Malawian Kwacha',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  MZN: 'Mozambican Metical',
  NAD: 'Namibian Dollar',
  NGN: 'Nigerian Naira',
  NOK: 'Norwegian Krone',
  NPR: 'Nepalese Rupee',
  NZD: 'New Zealand Dollar',
  OMR: 'Omani Rial',
  PAB: 'Panamanian Balboa',
  PEN: 'Peruvian Sol',
  PHP: 'Philippine Peso',
  PKR: 'Pakistani Rupee',
  PLN: 'Polish Zloty',
  PYG: 'Paraguayan Guarani',
  QAR: 'Qatari Riyal',
  RON: 'Romanian Leu',
  RSD: 'Serbian Dinar',
  RUB: 'Russian Ruble',
  RWF: 'Rwandan Franc',
  SAR: 'Saudi Riyal',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  TJS: 'Tajikistani Somoni',
  TMT: 'Turkmenistani Manat',
  TND: 'Tunisian Dinar',
  TRY: 'Turkish Lira',
  TWD: 'New Taiwan Dollar',
  TZS: 'Tanzanian Shilling',
  UAH: 'Ukrainian Hryvnia',
  USD: 'United States Dollar',
  UYU: 'Uruguayan Peso',
  UZS: 'Uzbekistani Som',
  VND: 'Vietnamese Dong',
  XAF: 'Central African CFA Franc',
  XOF: 'West African CFA Franc',
  ZAR: 'South African Rand',
  ZMW: 'Zambian Kwacha'
};

const POPULAR_CURRENCIES = ['USD', 'EUR', 'RUB', 'GBP', 'CNY', 'JPY', 'CHF', 'KZT', 'TRY', 'UAH', 'PLN', 'CAD'];
const CURRENCY_API = 'https://api.frankfurter.dev/v2';
const RU_CURRENCY_NAMES = {
  AUD: 'Австралийский доллар',
  BRL: 'Бразильский реал',
  BYN: 'Белорусский рубль',
  CAD: 'Канадский доллар',
  CHF: 'Швейцарский франк',
  CNY: 'Китайский юань',
  CZK: 'Чешская крона',
  DKK: 'Датская крона',
  EUR: 'Евро',
  GBP: 'Британский фунт',
  GEL: 'Грузинский лари',
  HKD: 'Гонконгский доллар',
  HUF: 'Венгерский форинт',
  INR: 'Индийская рупия',
  JPY: 'Японская иена',
  KGS: 'Киргизский сом',
  KRW: 'Южнокорейская вона',
  KZT: 'Казахстанский тенге',
  MXN: 'Мексиканское песо',
  NOK: 'Норвежская крона',
  PLN: 'Польский злотый',
  RON: 'Румынский лей',
  RUB: 'Российский рубль',
  SEK: 'Шведская крона',
  SGD: 'Сингапурский доллар',
  THB: 'Тайский бат',
  TRY: 'Турецкая лира',
  UAH: 'Украинская гривна',
  USD: 'Доллар США',
  UZS: 'Узбекский сум',
  ZAR: 'Южноафриканский ранд'
};

const DEFAULTS = {
  chatInput: '',
  selectedQuote: '',
  chatAnswer: '',
  chatMessages: [],
  deepThinking: false,
  deepResearch: false,
  activeSavedId: null,
  translateInput: '',
  translateOutput: '',
  fromLang: 'auto',
  toLang: 'ru',
  currencyAmount: '1',
  currencyFrom: 'USD',
  currencyTo: 'EUR',
  currencyRatesBase: '',
  currencyRatesDate: '',
  currencyUpdatedAt: 0,
  currencyRates: {},
  currencyCurrencies: {},
  codeInput: '',
  codeLanguage: 'auto',
  codeFindings: [],
  totalCopies: 0,
  theme: 'white-green',
  language: 'en',
  savedChats: [],
  watermark: true,
  watermarkText: 'helpsense | {time}',
  watermarkPosition: 'top-right',
  watermarkStyle: 'solid'
};

const state = loadState();
state.isThinking = false;

const status = document.getElementById('status');
const themeGrid = document.getElementById('themeGrid');
const chatInput = document.getElementById('chatInput');
const chatLog = document.getElementById('chatLog');
const chatPlus = document.getElementById('chatPlus');
const plusMenu = document.getElementById('plusMenu');
const deepThink = document.getElementById('deepThink');
const deepResearch = document.getElementById('deepResearch');
const selectionPopover = document.getElementById('selectionPopover');
const selectedQuote = document.getElementById('selectedQuote');
const selectedQuoteText = document.getElementById('selectedQuoteText');
const clearSelectedQuote = document.getElementById('clearSelectedQuote');
const toast = document.getElementById('toast');
const translateInput = document.getElementById('translateInput');
const translateOutput = document.getElementById('translateOutput');
const translateLoading = document.getElementById('translateLoading');
const fromLang = document.getElementById('fromLang');
const toLang = document.getElementById('toLang');
const currencyAmount = document.getElementById('currencyAmount');
const currencyFrom = document.getElementById('currencyFrom');
const currencyTo = document.getElementById('currencyTo');
const currencyResult = document.getElementById('currencyResult');
const currencyRates = document.getElementById('currencyRates');
const currencyMeta = document.getElementById('currencyMeta');
const codeInput = document.getElementById('codeInput');
const codeLanguage = document.getElementById('codeLanguage');
const codeFindings = document.getElementById('codeFindings');
const codeLineNumbers = document.getElementById('codeLineNumbers');
const codeHighlights = document.getElementById('codeHighlights');
const savedList = document.getElementById('savedList');
const watermark = document.getElementById('watermark');
const watermarkToggle = document.getElementById('watermarkToggle');
const watermarkText = document.getElementById('watermarkText');
const watermarkStyle = document.getElementById('watermarkStyle');
const watermarkPositionSelect = document.getElementById('watermarkPositionSelect');
const languageSelect = document.getElementById('languageSelect');
let translateRequestId = 0;
let typewriterTimer = null;
let translateTypeTimer = null;
let typingBubbleElement = null;
let userScrolledChat = false;
let activeChatRequestId = null;
let activeStreamBubble = null;
let activeStreamText = '';
let activeStreamFullText = '';
let activeStreamQueue = '';
let activeStreamTimer = null;
let activeTranslateRequestId = null;
let translateLoadingTimer = null;
let translateAutoTimer = null;
let stopButtonLockedUntil = 0;
let currencyLoadToken = 0;
let codeCheckRequestId = null;

const I18N = {
  en: {
    chat_title: 'Lite',
    chat_placeholder: 'Ask Lite',
    empty_chat: 'Ask something below. The answer will appear here.',
    lang_auto: 'Detect language',
    lang_ru: 'Русский',
    lang_en: 'English',
    lang_uk: 'Українська',
    lang_be: 'Беларуская',
    lang_tr: 'Türkçe',
    lang_kk: 'Қазақша',
    lang_es: 'Español',
    lang_pt: 'Português',
    lang_de: 'Deutsch',
    lang_fr: 'Français',
    lang_pl: 'Polski',
    translate_input: 'Enter text',
    translate_output: 'Translation',
    currency_amount: 'Amount',
    currency_refresh: 'Refresh rates',
    watermark: 'Watermark',
    style: 'Style',
    enabled: 'Enabled',
    position: 'Position',
    text: 'Text',
    saved: 'Saved',
    copy_time: 'Copy Time',
    copy_date: 'Copy Date',
    themes: 'Themes',
    language: 'Language',
    ai_mode: 'AI Mode',
    ai_info: 'Online no-key mode is enabled. Local Ollama is used automatically when available.',
    reset_settings: 'Reset Settings',
    about_desc: 'Desktop helper with Lite, translator, themes and watermark.',
    saved_empty: 'Saved chats appear here.',
    wm_solid: 'Solid',
    wm_minimal: 'Minimal',
    pos_top_left: 'Top Left',
    pos_top_right: 'Top Right',
    pos_bottom_left: 'Bottom Left',
    pos_bottom_right: 'Bottom Right',
    menu_deep: 'Think longer',
    menu_research: 'Deep research',
    ask_chatgpt_lite: 'Ask Lite'
  },
  ru: {
    chat_title: 'Lite',
    chat_placeholder: 'Спросить у Lite',
    empty_chat: 'Спросите что-нибудь внизу. Ответ появится здесь.',
    lang_auto: 'Определить язык',
    lang_ru: 'Русский',
    lang_en: 'English',
    lang_uk: 'Українська',
    lang_be: 'Беларуская',
    lang_tr: 'Türkçe',
    lang_kk: 'Қазақша',
    lang_es: 'Español',
    lang_pt: 'Português',
    lang_de: 'Deutsch',
    lang_fr: 'Français',
    lang_pl: 'Polski',
    translate_input: 'Введите текст',
    translate_output: 'Перевод',
    currency_amount: 'Сумма',
    currency_refresh: 'Обновить курсы',
    watermark: 'Ватермарка',
    style: 'Стиль',
    enabled: 'Включено',
    position: 'Позиция',
    text: 'Текст',
    saved: 'Сохранённые',
    copy_time: 'Копировать время',
    copy_date: 'Копировать дату',
    themes: 'Темы',
    language: 'Язык',
    ai_mode: 'Режим ИИ',
    ai_info: 'Онлайн-режим без ключа включён. Локальный Ollama используется автоматически, если доступен.',
    reset_settings: 'Сбросить настройки',
    about_desc: 'Помощник с Lite, переводчиком, темами и ватермаркой.',
    saved_empty: 'Сохранённые чаты появятся здесь.',
    wm_solid: 'Обычный',
    wm_minimal: 'Минималистичный',
    pos_top_left: 'Сверху слева',
    pos_top_right: 'Сверху справа',
    pos_bottom_left: 'Снизу слева',
    pos_bottom_right: 'Снизу справа',
    menu_deep: 'Думай дольше',
    menu_research: 'Глубокое исследование',
    ask_chatgpt_lite: 'Спросить у Lite'
  }
};

function loadState() {
  try {
    const loaded = { ...DEFAULTS, ...JSON.parse(localStorage.getItem('helpsense.desktop') || '{}') };
    if (!Array.isArray(loaded.savedChats)) loaded.savedChats = [];
    if (!Array.isArray(loaded.chatMessages)) loaded.chatMessages = [];
    if (!loaded.currencyRates || typeof loaded.currencyRates !== 'object') loaded.currencyRates = {};
    loaded.currencyCurrencies = normalizeCurrencies(loaded.currencyCurrencies || {});
    return loaded;
  } catch {
    localStorage.removeItem('helpsense.desktop');
    return { ...DEFAULTS };
  }
}

function save() {
  localStorage.setItem('helpsense.desktop', JSON.stringify(state));
  window.helpsense?.saveAppState(state);
}

function t(key) {
  return (I18N[state.language] || I18N.en)[key] || I18N.en[key] || key;
}

function codeCheckButtonText(isLoading = false) {
  if (state.language === 'ru') return isLoading ? 'Проверка...' : 'Проверить';
  return isLoading ? 'Checking...' : 'Check';
}

function codeCheckText(key) {
  const ru = state.language === 'ru';
  const labels = {
    empty: ru ? 'Пока ошибок нет. Вставь код и нажми проверку.' : 'No issues yet. Paste code and run a check.',
    autoLanguage: ru ? 'Авто язык' : 'Auto language',
    placeholder: ru ? 'Вставь код сюда' : 'Paste code here',
    critical: ru ? 'Критично' : 'Critical',
    warning: ru ? 'Предупреждение' : 'Warning',
    emptyStatus: ru ? 'Код пустой' : 'Code is empty',
    checkingStatus: ru ? 'Проверяю код...' : 'Checking code...',
    failedStatus: ru ? 'Проверка не удалась' : 'Code check failed',
    foundStatus: ru ? 'Ошибки найдены' : 'Code issues found',
    cleanStatus: ru ? 'Ошибок не найдено' : 'No code issues found'
  };
  return labels[key] || key;
}

function applyCodeCheckLanguage() {
  document.getElementById('checkCode').textContent = codeCheckButtonText(Boolean(codeCheckRequestId));
  codeLanguage.options[0].textContent = codeCheckText('autoLanguage');
  codeInput.placeholder = codeCheckText('placeholder');
  const codeTab = document.querySelector('[data-tab="codecheck"]');
  if (codeTab) {
    const title = state.language === 'ru' ? 'Проверка кода' : 'Code check';
    codeTab.title = title;
    codeTab.setAttribute('aria-label', title);
  }
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('option[data-i18n]').forEach(option => {
    option.textContent = t(option.dataset.i18n);
  });
  watermarkStyle.value = state.watermarkStyle;
  watermarkPositionSelect.value = state.watermarkPosition;
  fromLang.value = state.fromLang;
  toLang.value = state.toLang;
  languageSelect.value = state.language;
  applyCodeCheckLanguage();
  applyCurrencyLanguage();
}

function setStatus(text) {
  status.textContent = text;
  clearTimeout(setStatus.timer);
  setStatus.timer = setTimeout(() => {
    status.textContent = 'Ready';
  }, 1800);
}

function formattedDate() {
  return new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formattedTime() {
  return new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

async function copy(text) {
  const value = String(text ?? '');
  if (!value.trim()) return setStatus('Nothing to copy');
  if (window.helpsense?.copyText) await window.helpsense.copyText(value);
  else await navigator.clipboard.writeText(value);
  state.totalCopies += 1;
  save();
  renderWatermark();
  showToast('Message copied');
  setStatus('Copied');
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatInline(value) {
  return formatNotebookFractions(escapeHtml(normalizeMathMarkup(value))
    .replace(/==(.+?)==/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1'));
}

function normalizeMathMarkup(value) {
  return String(value || '')
    .replace(/\\\(|\\\)|\\\[|\\\]/g, '')
    .replace(/\\frac\s*\{\s*(-?\d+)\s*\}\s*\{\s*(\d+)\s*\}/g, '$1/$2')
    .replace(/\\frac\s*(-?\d+)\s*\{\s*(\d+)\s*\}/g, '$1/$2')
    .replace(/\\frac\s*\{\s*(-?\d+)\s*\}\s*(\d+)/g, '$1/$2')
    .replace(/\\frac\s*(-?\d)\s*(\d)/g, '$1/$2')
    .replace(/\\div/g, '÷')
    .replace(/\\cdot|\\times/g, '×')
    .replace(/\\pi/g, 'π');
}

function formatNotebookFractions(value) {
  return String(value).replace(/(^|[^\w>])(-?\d+)\s*\/\s*(\d+)(?![\w<])/g, (_match, prefix, numerator, denominator) => (
    `${prefix}<span class="notebook-fraction"><span class="fraction-top">${numerator}</span><span class="fraction-bottom">${denominator}</span></span>`
  ));
}

function assistantMarkdown(text) {
  const lines = String(text || '').split(/\r?\n/);
  const html = [];
  let list = null;

  function closeList() {
    if (!list) return;
    html.push(`</${list}>`);
    list = null;
  }

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      return;
    }

    const bullet = trimmed.match(/^(?:[-*•])\s+(.+)$/);
    if (bullet) {
      if (list !== 'ul') {
        closeList();
        html.push('<ul>');
        list = 'ul';
      }
      html.push(`<li>${formatInline(bullet[1])}</li>`);
      return;
    }

    const numbered = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numbered) {
      if (list !== 'ol') {
        closeList();
        html.push('<ol>');
        list = 'ol';
      }
      html.push(`<li>${formatInline(numbered[2])}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${formatInline(trimmed)}</p>`);
  });

  closeList();
  return html.join('');
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

function typeText(target, text, onDone, speed = 32) {
  clearInterval(typewriterTimer);
  typingBubbleElement = target;
  state.isTyping = true;
  renderSendButton();
  target.textContent = '';
  target.classList.add('typing-text');
  let index = 0;
  typewriterTimer = setInterval(() => {
    index += 1;
    target.textContent = text.slice(0, index);
    if (!userScrolledChat) chatLog.scrollTop = chatLog.scrollHeight;
    if (index >= text.length) {
      clearInterval(typewriterTimer);
      target.textContent = text;
      target.classList.remove('typing-text');
      state.isTyping = false;
      typingBubbleElement = null;
      renderSendButton();
      onDone?.();
    }
  }, speed);
}

function stopTyping() {
  if (!state.isTyping) return false;
  clearInterval(typewriterTimer);
  typingBubbleElement?.classList.remove('typing-text');
  state.isTyping = false;
  typingBubbleElement = null;
  renderSendButton();
  setStatus('Stopped');
  return true;
}

function typeTextarea(target, text, speed = 30) {
  clearInterval(translateTypeTimer);
  target.value = '';
  let index = 0;
  translateTypeTimer = setInterval(() => {
    index += 1;
    target.value = text.slice(0, index);
    if (index >= text.length) {
      clearInterval(translateTypeTimer);
      target.value = text;
    }
  }, speed);
}

function setTranslateLoading(isLoading) {
  translateLoading?.parentElement?.classList.toggle('translating', Boolean(isLoading));
  clearInterval(translateLoadingTimer);
  if (!isLoading) {
    const label = translateLoading?.querySelector('span');
    if (label) label.textContent = 'Переводится';
    return;
  }

  const label = translateLoading?.querySelector('span');
  if (!label) return;
  const text = 'Переводится';
  let index = 0;
  label.textContent = '';
  translateLoadingTimer = setInterval(() => {
    index = index >= text.length ? text.length : index + 1;
    label.textContent = text.slice(0, index);
    if (index >= text.length) clearInterval(translateLoadingTimer);
  }, 35);
}

function clearTranslateOutput() {
  translateRequestId += 1;
  clearTimeout(translateAutoTimer);
  if (activeTranslateRequestId) {
    window.helpsense?.cancelOpenAIHelper?.(activeTranslateRequestId);
    activeTranslateRequestId = null;
  }
  setTranslateLoading(false);
  state.translateOutput = '';
  eraseTranslateOutput();
}

function scheduleAutoTranslate() {
  clearTimeout(translateAutoTimer);
  if (!translateInput.value.trim()) return;
  translateAutoTimer = setTimeout(() => {
    document.getElementById('translateAi').click();
  }, 2500);
}

function eraseTranslateOutput() {
  clearInterval(translateTypeTimer);
  const startValue = translateOutput.value;
  if (!startValue) {
    translateOutput.placeholder = t('translate_output');
    return;
  }

  translateOutput.placeholder = '';
  let index = startValue.length;
  translateTypeTimer = setInterval(() => {
    index -= Math.max(1, Math.ceil(index / 24));
    translateOutput.value = startValue.slice(0, Math.max(0, index));
    if (index <= 0) {
      clearInterval(translateTypeTimer);
      translateOutput.value = '';
      translateOutput.placeholder = t('translate_output');
    }
  }, 14);
}

function cleanTranslationText(text, sourceText = '') {
  let value = cleanAssistantText(text);
  const jsonAnswer = extractUserFacingJsonAnswer(value);
  if (jsonAnswer !== null) value = jsonAnswer;
  value = String(value || '')
    .replace(/^\s*```(?:json|text)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .replace(/^\s*(?:translation|translated text|перевод)\s*:\s*/i, '')
    .replace(/\s*\}\s*!?\s*$/g, '')
    .trim();

  const source = String(sourceText || '').trim();
  if (source && value.startsWith(source) && value.length > source.length) {
    value = value.slice(source.length).replace(/^[\s:;,.!?}\]-]+/, '').trim() || value;
  }
  return value;
}

async function rememberApiKey() {
  return true;
}

async function runAi(payload) {
  await rememberApiKey();
  return window.helpsense?.runOpenAIHelper(payload);
}

async function streamAi(payload, onChunk) {
  await rememberApiKey();
  if (!window.helpsense?.streamOpenAIHelper) {
    const response = await runAi(payload);
    if (response?.ok && response.text) onChunk(response.text);
    return response;
  }
  return window.helpsense.streamOpenAIHelper(payload);
}

function stopThinking() {
  if (!state.isThinking) return false;
  if (Date.now() < stopButtonLockedUntil) return true;
  const requestId = activeChatRequestId;
  activeChatRequestId = null;
  state.isThinking = false;
  activeStreamBubble = null;
  activeStreamText = '';
  activeStreamFullText = '';
  activeStreamQueue = '';
  clearInterval(activeStreamTimer);
  window.helpsense?.cancelOpenAIHelper?.(requestId);
  renderChat();
  renderSendButton();
  setStatus('Stopped');
  return true;
}

function appendStreamChunk(requestId, chunk) {
  if (activeChatRequestId !== requestId) return;
  ensureStreamBubble();
  activeStreamFullText += String(chunk || '');
  activeStreamFullText = cleanAssistantText(activeStreamFullText);
  activeStreamQueue += String(chunk || '');
  startStreamTypewriter();
}

function ensureStreamBubble() {
  if (activeStreamBubble) return;
  chatLog.querySelector('.typing-bubble')?.remove();
  activeStreamBubble = streamingAssistantBubble();
  chatLog.appendChild(activeStreamBubble);
  if (!userScrolledChat) chatLog.scrollTop = chatLog.scrollHeight;
}

window.helpsense?.onAIStreamChunk?.(({ requestId, chunk }) => {
  appendStreamChunk(requestId, chunk);
});

function startStreamTypewriter() {
  if (activeStreamTimer) return;
  activeStreamTimer = setInterval(() => {
    if (!activeStreamQueue || !activeStreamBubble) {
      clearInterval(activeStreamTimer);
      activeStreamTimer = null;
      return;
    }
    const step = 1;
    activeStreamText += activeStreamQueue.slice(0, step);
    activeStreamQueue = activeStreamQueue.slice(step);
    setStreamBubbleContent(cleanAssistantText(activeStreamText));
    if (!userScrolledChat) chatLog.scrollTop = chatLog.scrollHeight;
  }, 30);
}

function flushStreamTypewriter() {
  activeStreamText = cleanAssistantText(activeStreamFullText || activeStreamText);
  activeStreamQueue = '';
  setStreamBubbleContent(activeStreamText);
}

function setStreamBubbleContent(text) {
  if (!activeStreamBubble) return;
  let content = activeStreamBubble.querySelector('.assistant-content');
  if (!content) {
    content = document.createElement('div');
    content.className = 'assistant-content';
    activeStreamBubble.replaceChildren(content);
  }
  content.innerHTML = assistantMarkdown(text);
}

function waitForStreamTypewriter(maxWait = 8000) {
  const started = Date.now();
  return new Promise(resolve => {
    const timer = setInterval(() => {
      if (!activeStreamQueue || Date.now() - started > maxWait) {
        clearInterval(timer);
        if (Date.now() - started > maxWait) flushStreamTypewriter();
        resolve();
      }
    }, 30);
  });
}

function chatContext() {
  return state.chatMessages
    .slice(-8)
    .map(message => {
      if (message.role === 'user' && message.quote) {
        return `Selected text: "${message.quote}"\nUser: ${message.text || 'Explain it.'}`;
      }
      return `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.text || ''}`;
    })
    .join('\n');
}

function themeBackground(colors, isFlag, id) {
  if (id === 'rgb') {
    return 'conic-gradient(from 20deg,#36d5ff,#9c6bff,#ff65b7,#ffe15a,#9dff47,#36d5ff)';
  }
  if (id === 'us') {
    return 'linear-gradient(90deg,#3c3b6e 0 43%,transparent 43%),repeating-linear-gradient(180deg,#b22234 0 7.7%,#fff 7.7% 15.4%)';
  }
  if (isFlag) {
    return `linear-gradient(180deg, ${colors.map((color, index) => {
      const start = (index / colors.length) * 100;
      const end = ((index + 1) / colors.length) * 100;
      return `${color} ${start}% ${end}%`;
    }).join(', ')})`;
  }
  return `radial-gradient(circle at 34% 32%, ${colors[1] || colors[0]} 0 18%, transparent 42%), linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`;
}

function renderThemes() {
  themeGrid.replaceChildren(...THEMES.map(([id, name, colors, isFlag]) => {
    const button = document.createElement('button');
    button.className = `theme theme-${id}${state.theme === id ? ' active' : ''}${isFlag ? ' flag' : ''}`;
    button.type = 'button';
    button.title = name;
    button.setAttribute('aria-label', name);
    button.style.background = themeBackground(colors, isFlag, id);
    button.addEventListener('click', () => {
      state.theme = id;
      save();
      applyTheme();
      renderThemes();
      renderWatermark();
    });
    return button;
  }));
}

function applyTheme() {
  const theme = THEMES.find(item => item[0] === state.theme) || THEMES[1];
  const main = state.theme === 'rgb' ? '#9dff47' : theme[2][0];
  document.documentElement.style.setProperty('--main', main);
  document.documentElement.style.setProperty('--second', theme[2][1] || theme[2][0]);
  document.documentElement.style.setProperty('--bar', `linear-gradient(90deg, ${theme[2].join(', ')})`);
  document.documentElement.style.setProperty('--sense', '#9dff47');
}

function currencyName(code) {
  if (state.language === 'ru' && RU_CURRENCY_NAMES[code]) return RU_CURRENCY_NAMES[code];
  const currencies = state.currencyCurrencies && Object.keys(normalizeCurrencies(state.currencyCurrencies)).length
    ? normalizeCurrencies(state.currencyCurrencies)
    : FALLBACK_CURRENCIES;
  const value = currencies[code] || FALLBACK_CURRENCIES[code] || code;
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value.name || value.title || value.description || FALLBACK_CURRENCIES[code] || code;
  }
  return String(value || code);
}

function currencyText(key, data = {}) {
  const ru = state.language === 'ru';
  const labels = {
    noRate: ru ? `Нет курса для ${data.from} -> ${data.to}` : `No rate for ${data.from} -> ${data.to}`,
    ratesDate: ru ? `Дата курсов: ${data.date}` : `Rates date: ${data.date}`,
    cachedRates: ru ? 'Курсы из кеша' : 'Cached rates',
    updating: ru ? 'Обновляю курсы...' : 'Updating rates...',
    updated: ru ? 'Курсы валют обновлены' : 'Currency rates updated',
    offline: ru ? `Офлайн-кеш: ${data.date || 'сохранено'}` : `Offline cache: ${data.date || 'saved'}`,
    unavailable: ru ? 'Курсы недоступны' : 'Rates unavailable',
    loading: ru ? 'Загрузка курсов...' : 'Loading rates...',
    currencyTitle: ru ? 'Валюты' : 'Currency',
    swapTitle: ru ? 'Поменять местами' : 'Swap'
  };
  return labels[key] || key;
}

function applyCurrencyLanguage() {
  const currencyTab = document.querySelector('[data-tab="currency"]');
  if (currencyTab) {
    currencyTab.title = currencyText('currencyTitle');
    currencyTab.setAttribute('aria-label', currencyText('currencyTitle'));
  }
  const swapCurrency = document.getElementById('swapCurrency');
  if (swapCurrency) swapCurrency.title = currencyText('swapTitle');
}

function currencyCodes() {
  const merged = { ...FALLBACK_CURRENCIES, ...normalizeCurrencies(state.currencyCurrencies || {}) };
  return Object.keys(merged).sort((a, b) => {
    const favorite = POPULAR_CURRENCIES.indexOf(a) - POPULAR_CURRENCIES.indexOf(b);
    if (POPULAR_CURRENCIES.includes(a) && POPULAR_CURRENCIES.includes(b)) return favorite;
    if (POPULAR_CURRENCIES.includes(a)) return -1;
    if (POPULAR_CURRENCIES.includes(b)) return 1;
    return a.localeCompare(b);
  });
}

function normalizeCurrencies(raw) {
  const normalized = {};
  if (Array.isArray(raw)) {
    raw.forEach(item => {
      const code = String(item?.iso_code || item?.code || item?.currency || '').toUpperCase();
      if (!code) return;
      normalized[code] = item?.name || item?.title || FALLBACK_CURRENCIES[code] || code;
    });
    return normalized;
  }

  if (raw && typeof raw === 'object') {
    Object.entries(raw).forEach(([key, value]) => {
      const keyLooksLikeCode = /^[A-Za-z]{3}$/.test(String(key));
      const code = String(keyLooksLikeCode ? key : (value?.iso_code || value?.code || value?.currency || key)).toUpperCase();
      if (!/^[A-Z]{3}$/.test(code)) return;
      if (!code) return;
      normalized[code] = typeof value === 'string'
        ? value
        : (value?.name || value?.title || value?.description || FALLBACK_CURRENCIES[code] || code);
    });
  }
  return normalized;
}

function normalizeRates(raw, base) {
  const rates = { [base]: 1 };
  let date = '';

  if (Array.isArray(raw)) {
    raw.forEach(item => {
      const quote = String(item?.quote || item?.currency || '').toUpperCase();
      const rate = Number(item?.rate);
      if (!quote || !Number.isFinite(rate)) return;
      rates[quote] = rate;
      if (!date && item?.date) date = item.date;
    });
    return { rates, date };
  }

  if (raw && typeof raw === 'object') {
    if (raw.date) date = raw.date;
    Object.entries(raw.rates || raw.quotes || {}).forEach(([quote, rate]) => {
      const number = Number(rate);
      if (Number.isFinite(number)) rates[String(quote).toUpperCase()] = number;
    });
    if (raw.quote && raw.rate) {
      const number = Number(raw.rate);
      if (Number.isFinite(number)) rates[String(raw.quote).toUpperCase()] = number;
    }
  }

  return { rates, date };
}

function renderCurrencyOptions() {
  const codes = currencyCodes();
  const selectedFrom = state.currencyFrom || DEFAULTS.currencyFrom;
  const selectedTo = state.currencyTo || DEFAULTS.currencyTo;
  const options = codes.map(code => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = `${code} - ${currencyName(code)}`;
    return option;
  });
  currencyFrom.replaceChildren(...options);
  currencyTo.replaceChildren(...options.map(option => option.cloneNode(true)));
  currencyFrom.value = codes.includes(selectedFrom) ? selectedFrom : DEFAULTS.currencyFrom;
  currencyTo.value = codes.includes(selectedTo) ? selectedTo : DEFAULTS.currencyTo;
  state.currencyFrom = currencyFrom.value;
  state.currencyTo = currencyTo.value;
}

function formatCurrencyNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0';
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: Math.abs(number) >= 100 ? 2 : 6
  }).format(number);
}

function currentCurrencyRate(to = state.currencyTo) {
  if (state.currencyFrom === to) return 1;
  return Number(state.currencyRates?.[to]) || 0;
}

function updateCurrencyResult() {
  const amount = Math.max(0, Number(currencyAmount.value || 0));
  const rate = currentCurrencyRate();
  const converted = amount * rate;
  const from = state.currencyFrom;
  const to = state.currencyTo;
  currencyResult.textContent = rate
    ? `${formatCurrencyNumber(amount)} ${from} = ${formatCurrencyNumber(converted)} ${to}`
    : currencyText('noRate', { from, to });
  renderCurrencyRates();
}

function renderCurrencyRates() {
  const targets = POPULAR_CURRENCIES
    .filter(code => code !== state.currencyFrom)
    .concat(currencyCodes().filter(code => code !== state.currencyFrom && !POPULAR_CURRENCIES.includes(code)))
    .slice(0, 24);

  currencyRates.replaceChildren(...targets.map(code => {
    const rate = currentCurrencyRate(code);
    const item = document.createElement('button');
    item.className = 'currency-rate';
    item.type = 'button';
    item.disabled = !rate;
    item.innerHTML = `<strong>${code}</strong><span>${escapeHtml(currencyName(code))}</span><em>${rate ? formatCurrencyNumber(rate) : '...'}</em>`;
    item.addEventListener('click', () => {
      state.currencyTo = code;
      currencyTo.value = code;
      save();
      updateCurrencyResult();
    });
    return item;
  }));
}

async function loadCurrencies() {
  state.currencyCurrencies = normalizeCurrencies(state.currencyCurrencies || {});
  const savedCount = Object.keys(state.currencyCurrencies || {}).length;
  if (savedCount > Object.keys(FALLBACK_CURRENCIES).length) {
    renderCurrencyOptions();
    return;
  }
  if (savedCount) renderCurrencyOptions();
  try {
    const response = await fetch(`${CURRENCY_API}/currencies`);
    if (!response.ok) throw new Error('Currency list failed');
    const currencies = normalizeCurrencies(await response.json());
    if (Object.keys(currencies).length) {
      state.currencyCurrencies = currencies;
      renderCurrencyOptions();
      save();
    }
  } catch {
    state.currencyCurrencies = { ...FALLBACK_CURRENCIES };
    renderCurrencyOptions();
  }
}

async function refreshCurrencyRates(force = false) {
  const requestId = ++currencyLoadToken;
  const base = state.currencyFrom || DEFAULTS.currencyFrom;
  const cacheAge = Date.now() - Number(state.currencyUpdatedAt || 0);
  const hasFreshCache = cacheAge > 0 && cacheAge < 6 * 60 * 60 * 1000;
  if (!force && hasFreshCache && state.currencyRatesBase === base && Object.keys(state.currencyRates || {}).length) {
    updateCurrencyResult();
    currencyMeta.textContent = state.currencyRatesDate
      ? currencyText('ratesDate', { date: state.currencyRatesDate })
      : currencyText('cachedRates');
    return;
  }

  currencyMeta.textContent = currencyText('updating');
  try {
    const response = await fetch(`${CURRENCY_API}/rates?base=${encodeURIComponent(base)}`);
    if (!response.ok) throw new Error('Rates failed');
    const data = normalizeRates(await response.json(), base);
    if (!Object.keys(data.rates).some(code => code !== base)) throw new Error('Rates empty');
    if (requestId !== currencyLoadToken) return;
    state.currencyRatesBase = base;
    state.currencyRatesDate = data.date || formattedDate();
    state.currencyUpdatedAt = Date.now();
    state.currencyRates = data.rates;
    save();
    updateCurrencyResult();
    currencyMeta.textContent = currencyText('ratesDate', { date: state.currencyRatesDate });
    setStatus(currencyText('updated'));
  } catch {
    if (requestId !== currencyLoadToken) return;
    currencyMeta.textContent = Object.keys(state.currencyRates || {}).length
      ? currencyText('offline', { date: state.currencyRatesDate })
      : currencyText('unavailable');
    updateCurrencyResult();
    setStatus(currencyText('unavailable'));
  }
}

function renderCurrency() {
  applyCurrencyLanguage();
  currencyAmount.value = state.currencyAmount || DEFAULTS.currencyAmount;
  renderCurrencyOptions();
  updateCurrencyResult();
  currencyMeta.textContent = state.currencyRatesDate
    ? currencyText('ratesDate', { date: state.currencyRatesDate })
    : currencyText('loading');
}

function normalizeFinding(item) {
  const severity = String(item?.severity || '').toLowerCase() === 'critical' ? 'critical' : 'warning';
  const line = Math.max(1, Number.parseInt(item?.line, 10) || 1);
  return {
    line,
    severity,
    message: String(item?.message || item?.problem || '').slice(0, 260),
    fix: String(item?.fix || item?.suggestion || '').slice(0, 320)
  };
}

function parseCodeFindings(text) {
  const raw = String(text || '').trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed.findings;
    if (!Array.isArray(list)) return [];
    return list.map(normalizeFinding).filter(item => item.message);
  } catch {
    return raw
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(0, 12)
      .map((line, index) => normalizeFinding({
        line: index + 1,
        severity: /critical|error|bug|fatal/i.test(line) ? 'critical' : 'warning',
        message: line
      }));
  }
}

function localCodeFindings(code, language = 'auto') {
  const lang = String(language || '').toLowerCase();
  if (!['auto', 'javascript', 'typescript'].includes(lang)) return [];
  const ru = state.language === 'ru';
  const text = {
    loop: ru ? 'Цикл идёт до length включительно и выйдет за границы массива.' : 'Loop uses length inclusively and will go out of bounds.',
    loopFix: ru ? 'Используй i < items.length.' : 'Use i < items.length.',
    assign: ru ? 'В условии используется присваивание вместо сравнения.' : 'Assignment is used inside the condition instead of comparison.',
    assignFix: ru ? 'Используй === или проверь булево значение напрямую.' : 'Use === or check the boolean directly.',
    loose: ru ? 'Нестрогое сравнение может дать неожиданный результат.' : 'Loose equality can produce unexpected results.',
    looseFix: ru ? 'Используй ===.' : 'Use ===.',
    nullValue: ru ? 'Переменная получает null и ниже может вызвать ошибку при чтении свойства.' : 'Variable is set to null and can crash when a property is read later.',
    nullValueFix: ru ? 'Перед использованием проверь значение или передай объект.' : 'Check the value before use or pass an object.',
    missingPrice: ru ? 'У элемента нет price, расчёт получит undefined.' : 'Item is missing price, so the calculation gets undefined.',
    missingPriceFix: ru ? 'Добавь price или значение по умолчанию.' : 'Add price or use a default value.',
    nullRead: ru ? 'customer может быть null, обращение к name упадёт.' : 'customer can be null, so reading name will crash.',
    nullReadFix: ru ? 'Проверь customer перед чтением name.' : 'Check customer before reading name.',
    firstItem: ru ? 'Первый элемент используется без проверки, что массив не пустой.' : 'First item is used without checking that the array is not empty.',
    firstItemFix: ru ? 'Проверь items.length.' : 'Check items.length.'
  };
  const lines = String(code || '').split(/\r?\n/);
  const findings = [];
  const seen = new Set();
  const add = (line, severity, message, fix) => {
    const key = `${line}:${severity}:${message}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push(normalizeFinding({ line, severity, message, fix }));
  };

  lines.forEach((line, index) => {
    const number = index + 1;
    if (/\bfor\s*\([^;]+;\s*\w+\s*<=\s*\w+\.length\b/.test(line)) {
      add(number, 'critical', text.loop, text.loopFix);
    }
    if (/\bif\s*\([^)]*[^=!<>]=[^=][^)]*\)/.test(line)) {
      add(number, 'critical', text.assign, text.assignFix);
    }
    if (/[^=!<>]==[^=]/.test(line)) {
      add(number, 'warning', text.loose, text.looseFix);
    }
    if (/const\s+\w+\s*=\s*null\s*;?/.test(line)) {
      add(number, 'critical', text.nullValue, text.nullValueFix);
    }
    if (/\{\s*title\s*:\s*["'][^"']+["']\s*\}/.test(line) && /\.price\b/.test(code)) {
      add(number, 'critical', text.missingPrice, text.missingPriceFix);
    }
  });

  const nullCustomerLine = lines.findIndex(line => /const\s+customer\s*=\s*null/.test(line)) + 1;
  lines.forEach((line, index) => {
    if (/customer\.name/.test(line) && nullCustomerLine) {
      add(index + 1, 'critical', text.nullRead, text.nullReadFix);
    }
    if (/items\[\s*0\s*\]/.test(line)) {
      add(index + 1, 'warning', text.firstItem, text.firstItemFix);
    }
  });

  return findings;
}

function mergeCodeFindings(primary, secondary) {
  const result = [];
  const seen = new Set();
  [...primary, ...secondary].forEach(item => {
    const normalized = normalizeFinding(item);
    const key = `${normalized.line}:${normalized.severity}:${normalized.message}`;
    if (seen.has(key) || !normalized.message) return;
    seen.add(key);
    result.push(normalized);
  });
  return result.slice(0, 12).sort((a, b) => a.line - b.line || (a.severity === 'critical' ? -1 : 1));
}

function renderCodeCheck() {
  if (document.activeElement !== codeInput) codeInput.value = state.codeInput || '';
  codeLanguage.value = state.codeLanguage || DEFAULTS.codeLanguage;
  const findings = Array.isArray(state.codeFindings) ? state.codeFindings : [];
  applyCodeCheckLanguage();
  renderCodeEditorDecorations(findings);

  if (!findings.length) {
    codeFindings.innerHTML = `<div class="code-empty">${escapeHtml(codeCheckText('empty'))}</div>`;
    return;
  }

  codeFindings.replaceChildren(...findings.map(item => {
    const card = document.createElement('div');
    card.className = `code-finding ${item.severity}`;
    const badge = document.createElement('strong');
    badge.textContent = item.severity === 'critical' ? codeCheckText('critical') : codeCheckText('warning');
    const text = document.createElement('span');
    const line = document.createElement('b');
    line.className = 'code-finding-line';
    line.textContent = item.line;
    const message = document.createElement('span');
    message.textContent = item.message;
    text.append(line, message);
    card.append(badge, text);
    if (item.fix) {
      const fix = document.createElement('em');
      fix.textContent = item.fix;
      card.appendChild(fix);
    }
    return card;
  }));
}

function renderCodeEditorDecorations(findings = []) {
  const lineCount = Math.max(1, (state.codeInput || codeInput.value || '').split(/\r?\n/).length);
  codeLineNumbers.textContent = Array.from({ length: lineCount }, (_item, index) => index + 1).join('\n');
  const active = new Map();
  findings.forEach(item => {
    const current = active.get(item.line);
    if (!current || current.severity !== 'critical') active.set(item.line, item);
  });
  codeHighlights.replaceChildren(...Array.from({ length: lineCount }, (_item, index) => {
    const line = index + 1;
    const finding = active.get(line);
    const row = document.createElement('div');
    row.className = `code-highlight${finding ? ` ${finding.severity}` : ''}`;
    row.title = finding?.message || '';
    return row;
  }));
  syncCodeEditorScroll();
}

function syncCodeEditorScroll() {
  const top = codeInput.scrollTop;
  codeLineNumbers.scrollTop = top;
  codeHighlights.style.transform = `translateY(${-top}px)`;
}

function renderWatermark() {
  const template = state.watermarkText || DEFAULTS.watermarkText;
  watermark.textContent = template
    .replaceAll('{time}', formattedTime())
    .replaceAll('{date}', formattedDate());
  watermark.style.display = state.watermark ? 'block' : 'none';
  watermark.className = `watermark ${state.watermarkPosition} ${state.watermarkStyle}`;
  watermarkToggle.classList.toggle('on', state.watermark);
  watermarkToggle.setAttribute('aria-pressed', String(state.watermark));
  watermarkText.value = state.watermarkText;
  watermarkStyle.value = state.watermarkStyle;
  watermarkPositionSelect.value = state.watermarkPosition;
}

function renderChat() {
  chatLog.replaceChildren();
  const messages = state.chatMessages;
  if (!messages.length) {
    chatLog.appendChild(emptyChatNode());
    return;
  }
  messages.forEach(message => chatLog.appendChild(messageBubble(message)));
  if (state.isThinking) chatLog.appendChild(typingBubble());
  const last = messages[messages.length - 1];
  if (!state.isThinking && last?.role === 'assistant') {
    chatLog.appendChild(copyAnswerButton());
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

function emptyChatNode() {
  const empty = document.createElement('div');
  empty.className = 'empty-chat';
  const logo = document.createElement('div');
  logo.className = 'lite-empty-logo';
  logo.innerHTML = '<span></span><span></span><span></span><span></span>';
  const name = document.createElement('strong');
  name.textContent = 'LITE';
  const text = document.createElement('p');
  text.textContent = t('empty_chat');
  empty.append(logo, name, text);
  return empty;
}

function messageBubble(messageOrType, text = '') {
  const message = typeof messageOrType === 'object'
    ? messageOrType
    : { role: messageOrType, text };

  if (message.role === 'user' && message.quote) {
    const turn = document.createElement('div');
    turn.className = 'user-turn';
    const quote = document.createElement('div');
    quote.className = 'sent-quote';
    quote.innerHTML = `<span class="quote-arrow">↪</span><span>${escapeHtml(message.quote)}</span>`;
    const bubble = messageBubble({ role: 'user', text: message.text });
    turn.append(quote, bubble);
    return turn;
  }

  const bubble = document.createElement('div');
  bubble.className = `message ${message.role}`;
  if (message.text) {
    const content = document.createElement('div');
    if (message.role === 'assistant') {
      content.className = 'assistant-content';
      content.innerHTML = assistantMarkdown(message.text);
    } else {
      content.textContent = message.text;
    }
    bubble.appendChild(content);
  }
  return bubble;
}

function animatedAssistantBubble(text) {
  const bubble = messageBubble({ role: 'assistant', text: '' });
  typeText(bubble, text, () => {
    renderChat();
  });
  return bubble;
}

function streamingAssistantBubble() {
  const bubble = messageBubble({ role: 'assistant', text: '' });
  bubble.classList.add('typing-text');
  const content = document.createElement('div');
  content.className = 'assistant-content';
  bubble.appendChild(content);
  return bubble;
}

function typingBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'message assistant typing-bubble';
  bubble.innerHTML = '<span></span><span></span><span></span>';
  return bubble;
}

function copyAnswerButton() {
  const wrap = document.createElement('div');
  wrap.className = 'answer-tools';
  const button = document.createElement('button');
  button.className = 'copy-answer';
  button.type = 'button';
  button.title = 'Copy answer';
  button.setAttribute('aria-label', 'Copy answer');
  button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 8h10v12H8z"></path><path d="M5 16V4h11"></path></svg>';
  button.addEventListener('click', () => copy(state.chatAnswer));
  wrap.appendChild(button);
  return wrap;
}

function renderSaved() {
  savedList.replaceChildren();
  if (!state.savedChats.length) {
    const empty = document.createElement('div');
    empty.className = 'saved-empty';
    empty.textContent = t('saved_empty');
    savedList.appendChild(empty);
    return;
  }
  state.savedChats.slice().reverse().forEach(item => {
    const row = document.createElement('div');
    row.className = 'saved-item';
    const title = document.createElement('button');
    title.className = 'saved-title';
    title.type = 'button';
    title.textContent = `${item.question.slice(0, 38) || 'Untitled chat'}`;
    const meta = document.createElement('span');
    meta.textContent = item.date;
    const del = document.createElement('button');
    del.className = 'saved-delete';
    del.type = 'button';
    del.textContent = 'x';
    title.addEventListener('click', () => {
      state.chatMessages = Array.isArray(item.messages)
        ? item.messages
        : [
          { role: 'user', text: item.question || '' },
          { role: 'assistant', text: item.answer || '' }
        ].filter(message => message.text);
      state.chatInput = '';
      state.selectedQuote = '';
      state.chatAnswer = state.chatMessages.filter(message => message.role === 'assistant').slice(-1)[0]?.text || '';
      state.activeSavedId = item.id || item.date;
      chatInput.value = '';
      save();
      renderChat();
      setStatus('Loaded saved chat');
    });
    del.addEventListener('click', event => {
      event.stopPropagation();
      state.savedChats = state.savedChats.filter(saved => (saved.id || saved.date) !== (item.id || item.date));
      if (state.activeSavedId === (item.id || item.date)) state.activeSavedId = null;
      save();
      renderSaved();
      setStatus('Saved chat deleted');
    });
    row.append(title, meta, del);
    savedList.appendChild(row);
  });
}

function saveCurrentChat() {
  if (!state.chatMessages.length) return setStatus('Nothing to save');
  state.savedChats = [
    ...state.savedChats,
    {
      id: `${Date.now()}`,
      date: `${formattedDate()} ${formattedTime()}`,
      question: state.chatMessages.find(item => item.role === 'user')?.text || '',
      answer: state.chatMessages.filter(item => item.role === 'assistant').slice(-1)[0]?.text || '',
      messages: state.chatMessages
    }
  ].slice(-30);
  save();
  renderSaved();
  setStatus('Chat saved');
}

function clearCurrentChat() {
  if (state.isThinking) stopThinking();
  if (!state.chatMessages.length) return setStatus('Chat is already empty');
  chatLog.classList.add('clearing');
  setTimeout(() => {
    state.chatMessages = [];
    state.chatAnswer = '';
    state.activeSavedId = null;
    chatLog.classList.remove('clearing');
    save();
    renderChat();
    setStatus('Chat cleared');
  }, 230);
}

function render() {
  chatInput.value = state.chatInput;
  resizeChatInput();
  renderSelectedQuote();
  translateInput.value = state.translateInput;
  translateOutput.value = state.translateOutput;
  fromLang.value = state.fromLang;
  toLang.value = state.toLang;
  document.getElementById('checkCode').textContent = codeCheckButtonText(Boolean(codeCheckRequestId));
  renderComposerModes();
  renderSendButton();
  renderChat();
  renderSaved();
  renderCurrency();
  renderCodeCheck();
  renderWatermark();
  applyLanguage();
}

function renderComposerModes() {
  deepThink.classList.toggle('active', Boolean(state.deepThinking));
  deepResearch.classList.toggle('active', Boolean(state.deepResearch));
}

function renderSendButton() {
  const button = document.getElementById('sendChat');
  const canStop = Boolean(state.isTyping || state.isThinking);
  const stopLocked = canStop && Date.now() < stopButtonLockedUntil;
  button.classList.toggle('stop-mode', canStop);
  button.classList.toggle('stop-locked', stopLocked);
  button.title = canStop ? 'Stop' : 'Send';
  button.setAttribute('aria-label', canStop ? 'Stop' : 'Send');
  button.innerHTML = canStop
    ? '<span class="stop-square" aria-hidden="true"></span>'
    : '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';
}

function renderSelectedQuote() {
  const hasQuote = Boolean(state.selectedQuote);
  selectedQuote.classList.toggle('show', hasQuote);
  selectedQuote.classList.remove('active');
  selectedQuoteText.textContent = state.selectedQuote || '';
  resizeChatInput();
}

function resizeChatInput() {
  chatInput.style.height = 'auto';
  const nextHeight = Math.min(chatInput.scrollHeight, 150);
  chatInput.style.height = `${Math.max(nextHeight, 42)}px`;
  chatInput.style.overflowY = chatInput.scrollHeight > 150 ? 'auto' : 'hidden';
  const composerHeight = document.querySelector('.chat-bar')?.offsetHeight || 64;
  document.documentElement.style.setProperty('--composer-height', `${composerHeight}px`);
}

document.querySelectorAll('.tab').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab === button));
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(`view-${button.dataset.tab}`).classList.add('active');
    if (button.dataset.tab === 'currency') refreshCurrencyRates();
  });
});

languageSelect.addEventListener('change', event => {
  state.language = event.target.value;
  save();
  applyLanguage();
  renderChat();
  renderSaved();
});

chatInput.addEventListener('input', event => {
  state.chatInput = event.target.value;
  resizeChatInput();
  save();
});

chatInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('sendChat').click();
  }
});

chatLog.addEventListener('scroll', () => {
  const distanceFromBottom = chatLog.scrollHeight - chatLog.scrollTop - chatLog.clientHeight;
  userScrolledChat = distanceFromBottom > 80;
});

chatPlus.addEventListener('click', event => {
  event.stopPropagation();
  const open = !plusMenu.classList.contains('open');
  plusMenu.classList.toggle('open', open);
  chatPlus.classList.toggle('active', open);
});

document.addEventListener('click', event => {
  if (!plusMenu.contains(event.target) && event.target !== chatPlus) {
    plusMenu.classList.remove('open');
    chatPlus.classList.remove('active');
  }
});

deepThink.addEventListener('click', () => {
  state.deepThinking = !state.deepThinking;
  save();
  renderComposerModes();
  setStatus(state.deepThinking ? 'Think longer enabled' : 'Think longer disabled');
});

deepResearch.addEventListener('click', () => {
  state.deepResearch = !state.deepResearch;
  save();
  renderComposerModes();
  setStatus(state.deepResearch ? 'Deep research enabled' : 'Deep research disabled');
});

function selectedTextInfo() {
  const selection = window.getSelection();
  const text = selection?.toString().trim() || '';
  if (!text) return null;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;
  return { text, rect };
}

document.addEventListener('selectionchange', () => {
  clearTimeout(document.selectionTimer);
  document.selectionTimer = setTimeout(() => {
    const info = selectedTextInfo();
    if (!info || selectionPopover.contains(document.activeElement)) {
      selectionPopover.classList.remove('show');
      return;
    }

    selectionPopover.dataset.text = info.text.slice(0, 1800);
    selectionPopover.style.left = `${Math.min(window.innerWidth - 180, Math.max(10, info.rect.left + info.rect.width / 2 - 76))}px`;
    selectionPopover.style.top = `${Math.max(8, info.rect.top - 48)}px`;
    selectionPopover.classList.add('show');
  }, 80);
});

selectionPopover.addEventListener('mousedown', event => {
  event.preventDefault();
});

selectionPopover.addEventListener('click', () => {
  const text = selectionPopover.dataset.text || '';
  if (!text) return;
  state.selectedQuote = text;
  save();
  renderSelectedQuote();
  document.querySelector('[data-tab="chat"]').click();
  chatInput.focus();
  selectionPopover.classList.remove('show');
  setStatus('Selected text added to Lite');
});

clearSelectedQuote.addEventListener('click', () => {
  state.selectedQuote = '';
  save();
  renderSelectedQuote();
});

selectedQuote.addEventListener('click', event => {
  if (event.target === clearSelectedQuote) return;
  selectedQuote.classList.add('active');
  clearTimeout(selectedQuote.activeTimer);
  selectedQuote.activeTimer = setTimeout(() => {
    selectedQuote.classList.remove('active');
  }, 3000);
});

translateInput.addEventListener('input', event => {
  state.translateInput = event.target.value;
  clearTranslateOutput();
  scheduleAutoTranslate();
  save();
});

translateInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('translateAi').click();
  }
});

fromLang.addEventListener('change', event => {
  state.fromLang = event.target.value;
  clearTranslateOutput();
  scheduleAutoTranslate();
  save();
});

toLang.addEventListener('change', event => {
  state.toLang = event.target.value;
  clearTranslateOutput();
  scheduleAutoTranslate();
  save();
});

codeInput.addEventListener('input', event => {
  state.codeInput = event.target.value;
  save();
  renderCodeCheck();
});

codeInput.addEventListener('scroll', syncCodeEditorScroll);

codeLanguage.addEventListener('change', event => {
  state.codeLanguage = event.target.value;
  save();
});

currencyAmount.addEventListener('input', event => {
  state.currencyAmount = event.target.value;
  save();
  updateCurrencyResult();
});

currencyFrom.addEventListener('change', event => {
  state.currencyFrom = event.target.value;
  save();
  refreshCurrencyRates(true);
});

currencyTo.addEventListener('change', event => {
  state.currencyTo = event.target.value;
  save();
  updateCurrencyResult();
});

document.getElementById('swapCurrency').addEventListener('click', () => {
  const from = state.currencyFrom;
  state.currencyFrom = state.currencyTo;
  state.currencyTo = from;
  currencyFrom.value = state.currencyFrom;
  currencyTo.value = state.currencyTo;
  save();
  refreshCurrencyRates(true);
});

document.getElementById('refreshCurrency').addEventListener('click', () => refreshCurrencyRates(true));

watermarkText.addEventListener('input', event => {
  state.watermarkText = event.target.value;
  save();
  renderWatermark();
});

watermarkStyle.addEventListener('change', event => {
  state.watermarkStyle = event.target.value;
  save();
  renderWatermark();
});

watermarkPositionSelect.addEventListener('change', event => {
  state.watermarkPosition = event.target.value;
  save();
  renderWatermark();
});

watermarkToggle.addEventListener('click', () => {
  state.watermark = !state.watermark;
  save();
  renderWatermark();
});

document.getElementById('sendChat').addEventListener('click', async () => {
  if (stopTyping()) return;
  if (stopThinking()) return;
  if (!chatInput.value.trim() && !state.selectedQuote) return setStatus('Question is empty');
  const sendButton = document.getElementById('sendChat');
  sendButton.classList.add('sending');
  setTimeout(() => sendButton.classList.remove('sending'), 520);
  const question = chatInput.value.trim() || (state.language === 'ru' ? 'Объясни выделенный фрагмент.' : 'Explain the selected text.');
  const selectedQuoteText = state.selectedQuote;
  state.chatInput = '';
  state.selectedQuote = '';
  state.chatAnswer = '';
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  activeChatRequestId = requestId;
  state.chatMessages.push({
    role: 'user',
    text: question,
    quote: selectedQuoteText || ''
  });
  chatInput.value = '';
  resizeChatInput();
  renderSelectedQuote();
  state.isThinking = true;
  stopButtonLockedUntil = Date.now() + 500;
  setTimeout(renderSendButton, 520);
  renderSendButton();
  renderChat();
  activeStreamText = '';
  activeStreamFullText = '';
  activeStreamQueue = '';
  activeStreamBubble = null;
  setStatus('Lite is thinking...');
  const response = await streamAi({
    requestId,
    task: 'chat',
    text: chatContext(),
    language: state.language,
    deepThinking: state.deepThinking,
    deepResearch: state.deepResearch
  }, chunk => appendStreamChunk(requestId, chunk));
  if (activeChatRequestId !== requestId) return;
  activeChatRequestId = null;
  state.isThinking = false;
  await waitForStreamTypewriter();
  activeStreamBubble?.classList.remove('typing-text');
  activeStreamBubble = null;
  renderSendButton();
  if (!response?.ok) {
    activeStreamText = '';
    activeStreamFullText = '';
    activeStreamQueue = '';
    renderChat();
    return setStatus(response?.error || 'Lite failed');
  }
  const answer = cleanAssistantText(response.text || activeStreamFullText || activeStreamText);
  activeStreamText = '';
  activeStreamFullText = '';
  activeStreamQueue = '';
  state.chatAnswer = answer;
  state.chatMessages.push({ role: 'assistant', text: answer });
  if (state.activeSavedId) {
    const saved = state.savedChats.find(item => (item.id || item.date) === state.activeSavedId);
    if (saved) {
      saved.answer = answer;
      saved.messages = state.chatMessages;
    }
  }
  save();
  renderChat();
  setStatus('Lite answered');
});

document.getElementById('saveChat').addEventListener('click', saveCurrentChat);
document.getElementById('swapLang').addEventListener('click', () => {
  const from = fromLang.value;
  const to = toLang.value;
  const inputText = translateInput.value;
  const outputText = translateOutput.value;
  state.fromLang = from === 'auto' ? to : to;
  state.toLang = from === 'auto'
    ? (state.language !== to ? state.language : (to === 'ru' ? 'en' : 'ru'))
    : from;
  state.translateInput = outputText;
  state.translateOutput = inputText;
  fromLang.value = state.fromLang;
  toLang.value = state.toLang;
  translateInput.value = state.translateInput;
  clearInterval(translateTypeTimer);
  setTranslateLoading(false);
  translateOutput.placeholder = state.translateOutput ? '' : t('translate_output');
  translateOutput.value = state.translateOutput;
  clearTimeout(translateAutoTimer);
  scheduleAutoTranslate();
  save();
});

document.getElementById('translateAi').addEventListener('click', async () => {
  clearTimeout(translateAutoTimer);
  if (!translateInput.value.trim()) {
    clearTranslateOutput();
    return setStatus('Text is empty');
  }
  state.translateInput = translateInput.value;
  const requestId = ++translateRequestId;
  const requestToken = `translate-${requestId}`;
  activeTranslateRequestId = requestToken;
  clearInterval(translateTypeTimer);
  translateOutput.value = '';
  translateOutput.placeholder = '';
  setTranslateLoading(true);
  setStatus('Translating...');
  const response = await runAi({
    requestId: requestToken,
    task: 'translate',
    text: state.translateInput,
    language: state.language,
    from: fromLang.value,
    to: toLang.value
  });
  if (requestId !== translateRequestId) return;
  activeTranslateRequestId = null;
  setTranslateLoading(false);
  if (!response?.ok) {
    translateOutput.placeholder = t('translate_output');
    return setStatus(response?.error || 'Translation failed');
  }
  const translatedText = cleanTranslationText(response.text || '', state.translateInput);
  const translated = translatedText.trim() === '...' ? '' : translatedText;
  state.translateOutput = translated;
  translateOutput.placeholder = translated ? '' : t('translate_output');
  typeTextarea(translateOutput, translated, 22);
  save();
  setStatus('Translated');
});

document.getElementById('checkCode').addEventListener('click', async () => {
  if (!codeInput.value.trim()) return setStatus(codeCheckText('emptyStatus'));
  state.codeInput = codeInput.value;
  state.codeLanguage = codeLanguage.value;
  const localFindings = localCodeFindings(state.codeInput, state.codeLanguage);
  state.codeFindings = localFindings;
  renderCodeCheck();
  const button = document.getElementById('checkCode');
  button.disabled = true;
  button.textContent = codeCheckButtonText(true);
  const requestId = `code-check-${Date.now()}`;
  codeCheckRequestId = requestId;
  setStatus(codeCheckText('checkingStatus'));
  const response = await runAi({
    requestId,
    task: 'code_check',
    text: state.codeInput,
    language: state.language,
    from: state.codeLanguage
  });
  if (codeCheckRequestId !== requestId) return;
  codeCheckRequestId = null;
  button.disabled = false;
  button.textContent = codeCheckButtonText(false);
  if (!response?.ok) return setStatus(response?.error || codeCheckText('failedStatus'));
  state.codeFindings = mergeCodeFindings(localFindings, parseCodeFindings(response.text));
  save();
  renderCodeCheck();
  setStatus(state.codeFindings.length ? codeCheckText('foundStatus') : codeCheckText('cleanStatus'));
});

document.getElementById('clearChat').addEventListener('click', clearCurrentChat);
document.getElementById('copyTime').addEventListener('click', () => copy(formattedTime()));
document.getElementById('copyDate').addEventListener('click', () => copy(formattedDate()));
document.getElementById('resetAll').addEventListener('click', () => {
  Object.assign(state, DEFAULTS);
  save();
  applyTheme();
  renderThemes();
  render();
  setStatus('Settings reset');
});

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    saveCurrentChat();
  }
});

setInterval(renderWatermark, 1000);
setInterval(() => refreshCurrencyRates(), 30 * 60 * 1000);
applyTheme();
renderThemes();
render();
const savedStatePromise = window.helpsense?.loadAppState?.();
if (savedStatePromise) {
  savedStatePromise.then(saved => {
    if (!saved || typeof saved !== 'object') return;
    Object.assign(state, { ...DEFAULTS, ...saved });
    if (!Array.isArray(state.savedChats)) state.savedChats = [];
    if (!Array.isArray(state.chatMessages)) state.chatMessages = [];
    if (!state.currencyRates || typeof state.currencyRates !== 'object') state.currencyRates = {};
    state.currencyCurrencies = normalizeCurrencies(state.currencyCurrencies || {});
    state.isThinking = false;
    applyTheme();
    renderThemes();
    render();
  }).finally(() => {
    loadCurrencies().then(() => refreshCurrencyRates());
  });
} else {
  loadCurrencies().then(() => refreshCurrencyRates());
}
