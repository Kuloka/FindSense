const { STATUSES } = require("../constants/statuses");
const { createResult } = require("../result");
const { getRetryAfterMs } = require("./signals");
const { analyzeResponse } = require("./responseAnalyzer");
const { resolveStatus, makeParserResult } = require("../engine/finalStatusEngine");

function parseDiscordApi({ username, responseCode, headers, body }) {
  const platform = "discord";
  const retryAfterMs = getRetryAfterMs(headers, body);
  const message = String(body?.message || "").toLowerCase();
  const analyzer = analyzeResponse({ responseCode, headers, body });
  const parser = "discord-api";

  if (analyzer.hasRateLimit || retryAfterMs > 0 || message.includes("rate limit")) {
    return createResult({ username, platform, status: STATUSES.RATE_LIMIT, reason: retryAfterMs ? `Discord rate limit. Retry after ${Math.ceil(retryAfterMs / 1000)}s.` : "Discord rate limit.", responseCode, source: parser, signals: ["rate-limit"], retryAfterMs, parserResult: makeParserResult({ parser, analyzer, signals: ["rate-limit"], proposedStatus: STATUSES.RATE_LIMIT }) });
  }
  if (analyzer.hasAntiBot || message.includes("captcha")) {
    return createResult({ username, platform, status: STATUSES.MAYBE, reason: "Discord requires captcha/anti-bot verification.", responseCode, source: parser, signals: [...analyzer.signals, "captcha"].filter(Boolean), parserResult: makeParserResult({ parser, analyzer, signals: [...analyzer.signals, "captcha"].filter(Boolean), proposedStatus: STATUSES.MAYBE }) });
  }
  if (responseCode >= 500) {
    return createResult({ username, platform, status: STATUSES.ERROR, reason: "Discord server error.", responseCode, source: parser, signals: ["server-error"], parserResult: makeParserResult({ parser, analyzer, signals: ["server-error"], proposedStatus: STATUSES.ERROR }) });
  }
  if (body?.taken === true) return createResult({ username, platform, status: STATUSES.TAKEN, reason: "Discord reports username is taken.", responseCode, source: parser, signals: ["taken-api"], parserResult: makeParserResult({ parser, analyzer, signals: ["taken-api"], proposedStatus: STATUSES.TAKEN }) });
  if (body?.taken === false) {
    const confirmations = ["valid-local", "clean-response", "api-available"];
    const status = resolveStatus({ proposedStatus: STATUSES.FREE, confirmations, analyzer });
    return createResult({ username, platform, status, reason: status === STATUSES.FREE ? "Discord explicitly reports username is available." : "Discord availability response was not clean enough to mark FREE.", responseCode, source: parser, signals: ["free-api"], parserResult: makeParserResult({ parser, analyzer, signals: ["free-api"], confirmations, proposedStatus: STATUSES.FREE }) });
  }

  return createResult({ username, platform, status: STATUSES.UNKNOWN, reason: body?.message || "Discord response did not include a reliable taken flag.", responseCode, source: parser, signals: [], parserResult: makeParserResult({ parser, analyzer, signals: [], proposedStatus: STATUSES.UNKNOWN }) });
}

module.exports = { parseDiscordApi };
