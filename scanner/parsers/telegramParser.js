const { STATUSES } = require("../constants/statuses");
const { createResult } = require("../result");
const { textIncludes } = require("./signals");
const { analyzeResponse } = require("./responseAnalyzer");
const { resolveStatus, makeParserResult } = require("../engine/finalStatusEngine");

function parseTelegramWeb({ username, responseCode, responseUrl, body, fragmentResult = null }) {
  const platform = "telegram";
  const signals = [];
  const html = String(body || "");
  const url = String(responseUrl || "").toLowerCase();
  const analyzer = analyzeResponse({ responseCode, responseUrl, body });
  const parser = "telegram-web";

  if (fragmentResult) return fragmentResult;

  if (analyzer.hasRateLimit) {
    return createResult({ username, platform, status: STATUSES.RATE_LIMIT, reason: "Telegram web rate limit.", responseCode, source: parser, signals: ["rate-limit"], retryAfterMs: analyzer.retryAfterMs, parserResult: makeParserResult({ parser, analyzer, signals: ["rate-limit"], proposedStatus: STATUSES.RATE_LIMIT }) });
  }
  if (analyzer.hasAntiBot || analyzer.hasTemporaryError || analyzer.hasWeakBody || analyzer.hasSuspiciousRedirect) {
    return createResult({ username, platform, status: STATUSES.MAYBE, reason: "Telegram response is anti-bot/temporary/weak. Not safe to mark FREE.", responseCode, source: parser, signals: analyzer.signals, parserResult: makeParserResult({ parser, analyzer, signals: analyzer.signals, proposedStatus: STATUSES.MAYBE }) });
  }
  if (textIncludes(html, ["username_invalid", "incorrect username", "invalid username", "некорректное имя пользователя"])) {
    return createResult({ username, platform, status: STATUSES.INVALID, reason: "Telegram says this username is invalid.", responseCode, source: parser, signals: ["invalid-text"], parserResult: makeParserResult({ parser, analyzer, signals: ["invalid-text"], proposedStatus: STATUSES.INVALID }) });
  }
  if (textIncludes(html, ["tgme_page_title", "tgme_page_photo", "tgme_channel_info", "tgme_page_extra"])) {
    return createResult({ username, platform, status: STATUSES.TAKEN, reason: "Telegram public profile/channel/group page exists.", responseCode, source: parser, signals: ["public-page"], link: `https://t.me/${username}`, parserResult: makeParserResult({ parser, analyzer, signals: ["public-page"], proposedStatus: STATUSES.TAKEN }) });
  }
  if (textIncludes(html, ["this username is not available", "username not found"])) {
    const status = resolveStatus({ proposedStatus: STATUSES.FREE, confirmations: ["valid-local", "clean-response", "explicit-not-found"], analyzer });
    return createResult({ username, platform, status, reason: status === STATUSES.FREE ? "Telegram gave a clear not-found signal with a clean response." : "Telegram not-found signal is not enough to prove availability.", responseCode, source: parser, signals: ["not-found-text"], parserResult: makeParserResult({ parser, analyzer, signals: ["not-found-text"], confirmations: ["valid-local", "clean-response", "explicit-not-found"], proposedStatus: STATUSES.FREE }) });
  }
  if (responseCode === 404 || url.includes("/resolve?")) {
    return createResult({ username, platform, status: STATUSES.MAYBE, reason: "Telegram returned only weak missing/redirect signal. Not enough evidence for FREE.", responseCode, source: parser, signals: ["weak-missing-signal"], parserResult: makeParserResult({ parser, analyzer, signals: ["weak-missing-signal"], proposedStatus: STATUSES.MAYBE }) });
  }

  return createResult({ username, platform, status: STATUSES.UNKNOWN, reason: "Telegram response had no reliable availability signal. This username is NOT counted as free.", responseCode, source: parser, signals, parserResult: makeParserResult({ parser, analyzer, signals, proposedStatus: STATUSES.UNKNOWN }) });
}

function parseFragment({ username, responseCode, responseUrl, body }) {
  const html = String(body || "").toLowerCase();
  const url = String(responseUrl || "").toLowerCase();
  const platform = "telegram";
  const analyzer = analyzeResponse({ responseCode, responseUrl, body });
  const parser = "fragment";
  const exactPage = url.includes(`/username/${username.toLowerCase()}`);

  if (analyzer.hasRateLimit) {
    return createResult({ username, platform, status: STATUSES.RATE_LIMIT, reason: "Fragment rate limit.", responseCode, source: parser, signals: ["rate-limit"], retryAfterMs: analyzer.retryAfterMs, parserResult: makeParserResult({ parser, analyzer, signals: ["rate-limit"], proposedStatus: STATUSES.RATE_LIMIT }) });
  }
  if (analyzer.hasAntiBot || analyzer.hasTemporaryError) return createResult({ username, platform, status: STATUSES.MAYBE, reason: "Fragment returned anti-bot/temporary response.", responseCode, source: parser, signals: analyzer.signals, parserResult: makeParserResult({ parser, analyzer, signals: analyzer.signals, proposedStatus: STATUSES.MAYBE }) });
  if (!exactPage && !html.includes(`/username/${username.toLowerCase()}`)) return null;
  if (html.includes("collectible username") || html.includes("place bid") || html.includes("auction") || html.includes("for sale") || html.includes("sold for")) {
    return createResult({ username, platform, status: STATUSES.RESERVED, reason: "Found on Fragment marketplace; reserved/auctioned/collectible.", responseCode, source: parser, signals: ["fragment-listing"], link: `https://fragment.com/username/${username}`, parserResult: makeParserResult({ parser, analyzer, signals: ["fragment-listing"], proposedStatus: STATUSES.RESERVED }) });
  }
  if (exactPage) {
    return createResult({ username, platform, status: STATUSES.RESERVED, reason: "Fragment opened a username page.", responseCode, source: parser, signals: ["fragment-page"], link: `https://fragment.com/username/${username}`, parserResult: makeParserResult({ parser, analyzer, signals: ["fragment-page"], proposedStatus: STATUSES.RESERVED }) });
  }
  return null;
}

module.exports = { parseTelegramWeb, parseFragment };
