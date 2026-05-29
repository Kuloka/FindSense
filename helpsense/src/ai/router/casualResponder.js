const { latestUserText } = require('./messageClassifier');
const { usesCyrillic } = require('../../utils/language');

const CASUAL_CLASSES = new Set(['casual_chat', 'casual_short', 'meme', 'slang', 'emotional_reaction', 'abusive']);

const RU_BOUNDARIES = [
  'я спокойно помогу, но с таким тоном общаться не буду',
  'давай без оскорблений, и я нормально помогу',
  'я не буду продолжать в таком тоне. Напиши спокойно, и разберёмся',
  'с грубостью не работаю, но по делу помогу',
  'я здесь чтобы помочь, но без оскорблений',
  'давай спокойнее. Скажи, что нужно исправить',
  'я понимаю, что бесит, но оскорбления не помогут. Давай по делу',
  'в таком тоне не продолжу. Можно нормально написать, и я помогу',
  'без агрессии, пожалуйста. Что именно сделать?',
  'я не отвечаю на оскорбления, но готов помочь по задаче',
  'давай перезапустим нормально. Что нужно?',
  'я на твоей стороне по задаче, но не в таком тоне'
];

const EN_BOUNDARIES = [
  "I'll help, but I won't continue with insults.",
  'Drop the insults and I can help normally.',
  "I get that you're annoyed, but let's keep it normal.",
  "I won't mirror that tone. Tell me what needs fixing.",
  'We can continue when the tone is calmer.',
  "I'm here to help, not trade insults.",
  'Say it normally and I will help with the task.',
  "Let's keep it respectful and solve it.",
  "I won't continue with that tone, but I can help.",
  'No need for insults. What should I fix?',
  'Resetting the vibe. What do you need?',
  "I'm on the task, just keep it civil."
];

const RU_REACTIONS = new Map([
  ['привет', 'привет, я тут 🙂'],
  ['здравствуй', 'привет, я тут 🙂'],
  ['здравствуйте', 'здравствуйте, я тут 🙂'],
  ['хай', 'хай, что делаем? 😄'],
  ['ку', 'ку, я тут 🙂'],
  ['доброе утро', 'доброе утро'],
  ['добрый день', 'добрый день'],
  ['добрый вечер', 'добрый вечер'],
  ['привіт', 'привіт, я тут'],
  ['вітаю', 'вітаю, я тут'],
  ['сәлем', 'сәлем, мен осындамын'],
  ['спасибо', 'да без проблем'],
  ['спс', 'да без проблем'],
  ['жесть', 'да, жесть конечно 😬'],
  ['капец', 'капец как есть 😅'],
  ['пон', 'понял'],
  ['понял', 'понял'],
  ['ну просто', 'ну просто так просто 😄'],
  ['просто', 'бывает, просто и всё 😄'],
  ['лол', 'ахах да 😄'],
  ['хах', 'ахах 😄'],
  ['ахах', 'ахах, понимаю 😄'],
  ['имба', 'имба, согласен 🔥'],
  ['кринж', 'да, кринжово 😬'],
  ['банан', 'ахах банан так банан 🍌'],
  ['апельсин', 'ахах почему именно апельсин 🍊'],
  ['мандарин', 'мандарин тоже вариант 🍊'],
  ['яблоко', 'яблоко звучит спокойнее 🍏']
]);

const EN_REACTIONS = new Map([
  ['hello', "hey, I'm here 🙂"],
  ['hi', "hey, I'm here 🙂"],
  ['hey', 'hey, what are we doing? 😄'],
  ['yo', "yo, I'm here 😄"],
  ['thanks', 'no problem'],
  ['thank you', 'no problem'],
  ['hola', 'hola, estoy aqui'],
  ['bonjour', 'salut, je suis la'],
  ['hallo', 'hallo, ich bin da'],
  ['ciao', 'ciao, ci sono'],
  ['merhaba', 'merhaba, buradayim'],
  ['ola', 'ola, estou aqui'],
  ['lol', 'lol yeah 😄'],
  ['haha', 'haha yeah 😄'],
  ['ok', 'got it'],
  ['bruh', 'yeah, bruh moment'],
  ['banana', 'banana it is 🍌'],
  ['orange', 'why orange specifically lol 🍊'],
  ['apple', 'apple is a calmer choice 🍏']
]);

const RANDOM_WORD_REACTIONS_RU = [
  'ахах, почему именно {word}? 😄',
  '{word}? неожиданный выбор',
  'принял: {word}',
  'так, у нас теперь {word}',
  'звучит как начало странной истории',
  'окей, {word} в чате',
  'и что мы делаем с {word}?',
  'внезапно, но ладно 😄',
  'это было неожиданно',
  'теперь думаю про {word}',
  'сильный ход',
  'ладно, {word} так {word}',
  'хорошо, записал мысленно',
  'это пароль от настроения?',
  'интересный поворот',
  'ну всё, тема задана',
  'я не ожидал, но принимаю',
  'звучит как название уровня',
  'такое слово просто появляется и всё',
  'у этого есть вайб',
  'мне нравится случайность',
  'сейчас бы понять, почему {word}',
  'ладно, интрига есть',
  'это уже почти сюжет',
  'коротко и загадочно',
  'слово дня: {word}',
  'ну вот, теперь оно тут',
  'я почувствовал смену темы',
  'окей, давай от этого плясать',
  'это было резко, но смешно',
  'внезапный {word} засчитан',
  'кажется, это важный сигнал',
  'я вижу, настроение необычное',
  'можно сделать из этого мем',
  'ну звучит уверенно',
  'без контекста, но с характером',
  'теперь это часть истории',
  'ладно, я заинтригован',
  'это слово вошло эффектно',
  'у меня один вопрос: почему оно?',
  'звучит как случайная мысль в 3 ночи',
  'окей, держу {word} в голове',
  'не спорю, слово норм',
  'такое не каждый день пишут',
  'я бы не угадал',
  'с этим можно работать',
  'это либо шутка, либо начало квеста',
  'ладно, загадка принята',
  'чувствуется стиль',
  'по атмосфере понятно',
  'ну да, бывает и {word}',
  'звучит как кодовое слово',
  'если это тест, я живой 😄',
  'я уловил хаос',
  'зачёт за внезапность',
  'это пришло без предупреждения',
  'окей, переключились',
  'пока вопросов больше, чем ответов',
  'ну, {word} существует',
  'это было минималистично',
  'слово короткое, эффект есть',
  'понял, настроение: {word}',
  'это прям отдельная глава',
  'интересно, куда это ведёт',
  'ну теперь я тоже думаю об этом',
  'такой заход я уважаю',
  'в чат ворвалось слово',
  'ладно, звучит уверенно',
  'теперь это официально тема',
  'можно продолжать с этого',
  'я не против',
  'слово принято без возражений',
  'внезапность на месте',
  'ну хорошо, {word}',
  'и тишина стала страннее',
  'это могло быть началом анекдота',
  'звучит как ответ без вопроса',
  'я бы спросил контекст, но оно и так смешно',
  'в этом что-то есть',
  'мощно вошло',
  'минимум слов, максимум загадки',
  'настроение поймано',
  'это уже почти философия',
  'слово просто появилось и победило',
  'ладно, принимаю реальность',
  'кажется, это было важно',
  'сейчас бы расшифровать',
  'ну вот и поговорили 😄',
  'хорошее случайное слово',
  'неожиданно уютно',
  'оно звучит смешнее без контекста',
  'ладно, это запомнится',
  'внезапный поворот принят',
  'такое сообщение нельзя игнорировать',
  'это либо начало, либо финал',
  'звучит как название команды',
  'ну теперь есть тема для разговора',
  'я вижу, ты тестишь реакцию',
  'ответственно заявляю: {word}',
  'странно, но не плохо',
  'это слово пришло уверенно'
];

const RANDOM_WORD_REACTIONS_EN = [
  'why {word} specifically lol 😄',
  '{word}? unexpected',
  'okay, {word} is here now',
  'that came out of nowhere',
  'word of the day: {word}',
  'noted: {word}',
  'that has a vibe',
  'random, but accepted',
  'I respect the sudden topic change',
  'now I’m thinking about {word}',
  'bold entrance for one word',
  'that sounds like a code word',
  'okay, mystery started',
  'minimal message, maximum question',
  'fair enough, {word}',
  'that could be a meme',
  'unexpected but alive',
  'I see the chaos',
  'the plot thickens',
  'that word just walked in'
];

const randomWordCounters = new Map();
const FIXED_RU_REACTION_WORDS = new Set([
  'привет', 'здравствуй', 'здравствуйте', 'хай', 'ку', 'доброе утро', 'добрый день',
  'добрый вечер', 'привіт', 'вітаю', 'сәлем', 'спасибо', 'спс', 'жесть', 'капец',
  'пон', 'понял', 'ну просто', 'просто', 'лол', 'хах', 'ахах', 'имба', 'кринж'
]);
const FIXED_EN_REACTION_WORDS = new Set([
  'hello', 'hi', 'hey', 'yo', 'thanks', 'thank you', 'hola', 'bonjour', 'hallo',
  'ciao', 'merhaba', 'ola', 'lol', 'haha', 'ok', 'bruh'
]);

function quickCasualResponse(payload) {
  if (payload.task !== 'chat' || !CASUAL_CLASSES.has(payload.messageClass)) return null;
  const latest = latestUserText(payload.text);
  const normalized = latest.toLowerCase().replace(/[!?.,…]+/g, '').trim();
  if (!normalized || normalized.length > 80) return null;
  if (payload.messageClass === 'abusive' || isAbusiveText(normalized)) {
    return pickBoundary(normalized, payload.language);
  }
  if (normalized.length > 36) return null;
  if (/[?？]/.test(latest) || isQuestionLike(normalized)) return null;
  if (/^\d+(?:[.,]\d+)?$/.test(normalized)) {
    return payload.language === 'ru'
      ? `${normalized}. Что с ним сделать?`
      : `${normalized}. What should I do with it?`;
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length > 3) return null;

  if (usesCyrillic(normalized)) {
    if (words.length === 1 && looksLikeNormalWord(normalized) && !FIXED_RU_REACTION_WORDS.has(normalized)) {
      return randomWordReaction(normalized, 'ru');
    }
    if (RU_REACTIONS.has(normalized)) return RU_REACTIONS.get(normalized);
    if (/^ты теперь/i.test(normalized)) return 'принял, буду увереннее';
    if (words.length === 1 && looksLikeNormalWord(normalized)) return randomWordReaction(normalized, 'ru');
    return null;
  }

  if (words.length === 1 && /^[a-z]+$/i.test(normalized) && !FIXED_EN_REACTION_WORDS.has(normalized)) {
    return randomWordReaction(normalized, 'en');
  }
  if (EN_REACTIONS.has(normalized)) return EN_REACTIONS.get(normalized);
  if (words.length === 1 && /^[a-z]+$/i.test(normalized)) return randomWordReaction(normalized, 'en');
  return null;
}

function looksLikeNormalWord(value) {
  return /^[а-яёіїєґқұүғһөә]+$/i.test(value) && value.length >= 3;
}

function isQuestionLike(value) {
  const starters = [
    'что', 'кто', 'где', 'куда', 'откуда', 'когда', 'зачем', 'почему', 'как',
    'какой', 'какая', 'какое', 'какие', 'чем'
  ];
  return starters.some(starter => value === starter || value.startsWith(`${starter} `))
    || /^(?:what|who|where|when|why|how)\b/i.test(value);
}

function isAbusiveText(value) {
  return /(?:сука|бля|блять|хуй|хуя|нахуй|пизд|еба|ёба|долбо|дебил|идиот|тупой|тупая|тварь|ублюд|fuck|shit|bitch|asshole|idiot|moron|stupid)/i.test(value);
}

function pickBoundary(value, language) {
  const variants = language === 'ru' || usesCyrillic(value) ? RU_BOUNDARIES : EN_BOUNDARIES;
  const index = Math.abs([...value].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % variants.length;
  return variants[index];
}

function randomWordReaction(word, language) {
  const variants = language === 'ru' ? RANDOM_WORD_REACTIONS_RU : RANDOM_WORD_REACTIONS_EN;
  const key = `${language}:${word}`;
  const current = randomWordCounters.get(key) || 0;
  randomWordCounters.set(key, current + 1);
  const offset = Math.abs([...word].reduce((sum, char) => sum + char.charCodeAt(0), 0));
  return variants[(offset + current) % variants.length].replaceAll('{word}', word);
}

module.exports = {
  quickCasualResponse
};
