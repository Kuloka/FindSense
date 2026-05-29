const math = require('mathjs');
const { usesCyrillic } = require('./language');

function latestUserText(text) {
  const lines = userLines(text);
  if (!lines.length) return String(text).trim();
  return lines[lines.length - 1];
}

function previousUserText(text) {
  const lines = userLines(text);
  return lines.length > 1 ? lines[lines.length - 2] : '';
}

function userLines(text) {
  return String(text)
    .split('\n')
    .filter(line => line.startsWith('User:'))
    .map(line => line.replace(/^User:\s*/, '').trim());
}

/**
 * Handles small arithmetic locally before a model call.
 * Keeps responses deterministic and avoids spending provider requests on simple math.
 * @param {string} text
 * @returns {string|null}
 */
function answerKnownPattern(text) {
  const question = latestUserText(text).toLowerCase().replace(',', '.');
  const previousQuestion = previousUserText(text).toLowerCase();
  if (!question) return null;

  const sqrtMatch = question.match(/(?:корень(?:\s+из)?|sqrt)\s*(-?\d+(?:\.\d+)?)/i);
  if (sqrtMatch) {
    const value = Number(sqrtMatch[1]);
    if (value < 0) {
      return usesCyrillic(question)
        ? 'У отрицательного числа нет обычного вещественного квадратного корня.'
        : 'A negative number has no real square root.';
    }
    return formatMathAnswer(`sqrt(${formatNumber(value)})`, Math.sqrt(value), question);
  }

  const followUpNumber = question.match(/^(?:а\s*)?(?:из\s*)?(-?\d+(?:\.\d+)?)\??$/i);
  if (followUpNumber && /корень|sqrt/i.test(previousQuestion)) {
    const value = Number(followUpNumber[1]);
    if (value < 0) {
      return usesCyrillic(question)
        ? 'У отрицательного числа нет обычного вещественного квадратного корня.'
        : 'A negative number has no real square root.';
    }
    return formatMathAnswer(`sqrt(${formatNumber(value)})`, Math.sqrt(value), question);
  }

  const percentMatch = question.match(/(-?\d+(?:\.\d+)?)\s*%\s*(?:от|of)\s*(-?\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const percent = Number(percentMatch[1]);
    const value = Number(percentMatch[2]);
    return formatMathAnswer(`${formatNumber(percent)}% от ${formatNumber(value)}`, value * percent / 100, question);
  }

  const expression = extractMathExpression(question);
  if (!expression) return null;
  if (hasDivisionByZero(expression)) {
    return usesCyrillic(question)
      ? 'На ноль делить нельзя: деление на 0 не определено.'
      : 'You cannot divide by zero: division by 0 is undefined.';
  }
  const result = evaluateMathExpression(expression);
  if (result === null) return null;
  return formatMathAnswer(expression, result, question);
}

function extractMathExpression(question) {
  let value = String(question)
    .replace(/сколько\s+(?:будет|получится)?/gi, ' ')
    .replace(/посчитай|вычисли|реши|calculate|what is|what's/gi, ' ')
    .replace(/квадратный\s+корень\s+из/gi, 'sqrt')
    .replace(/корень\s+из/gi, 'sqrt')
    .replace(/н[оу]ль/gi, '0')
    .replace(/н[оу]ля/gi, '0')
    .replace(/н[оу]лю/gi, '0')
    .replace(/\bzero\b/gi, '0')
    .replace(/(?:разделить|делить|поделить)\s+на/gi, '/')
    .replace(/(?:раздели|подели)\s+на/gi, '/')
    .replace(/\bdivided\s+by\b/gi, '/')
    .replace(/(?:умножить|помножить)\s+на/gi, '*')
    .replace(/(?:умножь|помножь)\s+на/gi, '*')
    .replace(/\btimes\b/gi, '*')
    .replace(/плюс/gi, '+')
    .replace(/\bplus\b/gi, '+')
    .replace(/минус/gi, '-')
    .replace(/\bminus\b/gi, '-')
    .replace(/\bpi\b/gi, 'pi')
    .replace(/\be\b/gi, 'e')
    .replace(/×|х|x/gi, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '.')
    .replace(/\s+/g, '');

  const match = value.match(/(?:sin|cos|tan|sqrt|pi|e|[-+*/().\d^%])+/i);
  if (!match || match[0].length < 2) return null;
  value = match[0];
  if (!/[+\-*/^%]|(?:sin|cos|tan|sqrt)/i.test(value)) return null;
  return value;
}

/**
 * Evaluates a constrained arithmetic expression through mathjs.
 * @param {string} expression
 * @returns {number|null}
 */
function evaluateMathExpression(expression) {
  if (!isSafeMathExpression(expression)) return null;
  if (hasDivisionByZero(expression)) return null;
  try {
    const result = math.evaluate(expression);
    if (typeof result !== 'number' || !Number.isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

function isSafeMathExpression(expression) {
  return /^[\d+\-*/().\s^%a-z]+$/i.test(String(expression))
    && !/[;={}\[\]'"`\\]/.test(String(expression))
    && !/(?:import|createUnit|evaluate|parse|simplify|derivative)/i.test(String(expression));
}

function hasDivisionByZero(expression) {
  const compact = String(expression).replace(/\s+/g, '');
  return /\/(?:\+|-)?(?:0+(?:\.0+)?)(?![\d.])/.test(compact);
}

function formatMathAnswer(expression, result, source = '') {
  const displayExpression = localizeExpression(expression, source);
  return `${displayExpression} = ${formatResult(result, expression)}`;
}

function localizeExpression(expression, source) {
  if (!usesCyrillic(source)) return expression;
  return String(expression)
    .replace(/^sqrt\((.+)\)$/i, 'корень из $1')
    .replace(/sqrt\((.+?)\)/gi, 'корень из $1')
    .replace(/\bpi\b/gi, 'π');
}

function formatNumber(value) {
  if (Number.isInteger(value)) return value.toLocaleString('ru-RU');
  return Number(value.toPrecision(12)).toLocaleString('ru-RU', {
    maximumFractionDigits: 10
  });
}

function formatResult(value, expression = '') {
  if (Number.isInteger(value)) return formatNumber(value);
  if (shouldPreferFraction(expression)) {
    const fraction = toSimpleFraction(value);
    if (fraction) return fraction;
  }
  return formatNumber(value);
}

function shouldPreferFraction(expression) {
  return /\/|\bfraction\b/i.test(String(expression));
}

function toSimpleFraction(value) {
  try {
    const fraction = math.fraction(value);
    if (fraction.d > 10000n) return '';
    const restored = Number(fraction.s * fraction.n) / Number(fraction.d);
    if (Math.abs(restored - value) > 1e-10) return '';
    return fraction.toFraction(true);
  } catch {
    return '';
  }
}

module.exports = {
  answerKnownPattern,
  evaluateMathExpression,
  extractMathExpression,
  hasDivisionByZero,
  latestUserText,
  previousUserText
};
