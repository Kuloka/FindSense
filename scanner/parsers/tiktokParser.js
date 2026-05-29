const { STATUSES } = require("../constants/statuses");
const { createResult } = require("../result");
const { textIncludes } = require("./signals");
const { analyzeResponse } = require("./responseAnalyzer");
const { resolveStatus, makeParserResult } = require("../engine/finalStatusEngine");

function parseTikTokOEmbed({ username, responseCode, body }) {
  const platform = "tiktok";
  const data = body || {};
  const text = JSON.stringify(data).toLowerCase();
  const analyzer = analyzeResponse({ responseCode, body: data });
  const parser = "tiktok-oembed";

  if (analyzer.hasRateLimit) {
    return createResult({ username, platform, status: STATUSES.RATE_LIMIT, reason: "TikTok oEmbed rate limit.", responseCode, source: parser, signals: ["rate-limit"], retryAfterMs: analyzer.retryAfterMs, parserResult: makeParserResult({ parser, analyzer, signals: ["rate-limit"], proposedStatus: STATUSES.RATE_LIMIT }) });
  }
  if (responseCode === 200 && (String(data.author_url || "").toLowerCase().includes(`/@${username}`) || text.includes(`data-unique-id=\\\"${username}`))) {
    return createResult({ username, platform, status: STATUSES.TAKEN, reason: "TikTok oEmbed found an exact public profile.", responseCode, source: parser, signals: ["exact-oembed-profile"], link: `https://www.tiktok.com/@${username}`, parserResult: makeParserResult({ parser, analyzer, signals: ["exact-oembed-profile"], proposedStatus: STATUSES.TAKEN }) });
  }
  if ([400, 404].includes(responseCode)) {
    return createResult({ username, platform, status: STATUSES.MAYBE, reason: "TikTok oEmbed did not find profile; not enough evidence for FREE.", responseCode, source: parser, signals: ["oembed-missing"], parserResult: makeParserResult({ parser, analyzer, signals: ["oembed-missing"], proposedStatus: STATUSES.MAYBE }) });
  }
  return null;
}

function parseTikTokPage({ username, responseCode, responseUrl, body }) {
  const platform = "tiktok";
  const html = String(body || "");
  const normalized = html.toLowerCase();
  const analyzer = analyzeResponse({ responseCode, responseUrl, body });
  const parser = "tiktok-web";
  const exactSignals = [
    `"uniqueid":"${username}"`,
    `"uniqueId":"${username}"`.toLowerCase(),
    `data-unique-id="${username}"`,
    `/@${username}`,
  ];

  if (analyzer.hasRateLimit) {
    return createResult({ username, platform, status: STATUSES.RATE_LIMIT, reason: "TikTok page rate limit.", responseCode, source: parser, signals: ["rate-limit"], retryAfterMs: analyzer.retryAfterMs, parserResult: makeParserResult({ parser, analyzer, signals: ["rate-limit"], proposedStatus: STATUSES.RATE_LIMIT }) });
  }
  if (analyzer.hasAntiBot || analyzer.hasTemporaryError || analyzer.hasWeakBody || analyzer.hasSuspiciousRedirect) {
    return createResult({ username, platform, status: STATUSES.MAYBE, reason: "TikTok returned captcha/blocked/temporary/weak response. Not safe to mark FREE.", responseCode, source: parser, signals: analyzer.signals, parserResult: makeParserResult({ parser, analyzer, signals: analyzer.signals, proposedStatus: STATUSES.MAYBE }) });
  }
  if (exactSignals.some((signal) => normalized.includes(signal))) {
    return createResult({ username, platform, status: STATUSES.TAKEN, reason: "TikTok page contains exact profile signals.", responseCode, source: parser, signals: ["exact-profile"], link: `https://www.tiktok.com/@${username}`, parserResult: makeParserResult({ parser, analyzer, signals: ["exact-profile"], proposedStatus: STATUSES.TAKEN }) });
  }
  if (textIncludes(normalized, ["couldn't find this account", "couldn’t find this account", "user_not_found", "this account doesn't exist", "page not available"])) {
    const status = resolveStatus({ proposedStatus: STATUSES.FREE, confirmations: ["valid-local", "clean-response", "explicit-not-found"], analyzer });
    return createResult({ username, platform, status, reason: status === STATUSES.FREE ? "TikTok gave a clear not-found signal with a clean response." : "TikTok missing profile signal does not prove claimability.", responseCode, source: parser, signals: ["missing-profile-text"], parserResult: makeParserResult({ parser, analyzer, signals: ["missing-profile-text"], confirmations: ["valid-local", "clean-response", "explicit-not-found"], proposedStatus: STATUSES.FREE }) });
  }
  if (responseCode === 404) {
    return createResult({ username, platform, status: STATUSES.MAYBE, reason: "TikTok returned 404 only; not enough evidence for FREE.", responseCode, source: parser, signals: ["weak-404"], parserResult: makeParserResult({ parser, analyzer, signals: ["weak-404"], proposedStatus: STATUSES.MAYBE }) });
  }
  return createResult({ username, platform, status: STATUSES.UNKNOWN, reason: "TikTok response had no reliable signal. This username is NOT counted as free.", responseCode, source: parser, signals: [], link: `https://www.tiktok.com/@${username}`, parserResult: makeParserResult({ parser, analyzer, signals: [], proposedStatus: STATUSES.UNKNOWN }) });
}

module.exports = { parseTikTokOEmbed, parseTikTokPage };
