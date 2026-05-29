const { STATUSES } = require("./constants/statuses");

function normalizeUsername(value) {
  return String(value || "").trim().replace(/^@/, "").toLowerCase();
}

function createResult({
  username,
  platform,
  status = STATUSES.UNKNOWN,
  reason = "No conclusive signal.",
  responseCode = null,
  source = "scanner",
  signals = [],
  link = null,
  retryAfterMs = null,
  parserResult = null,
  raw = undefined,
}) {
  return {
    username,
    platform,
    status,
    reason,
    checkedAt: new Date().toISOString(),
    responseCode,
    source,
    signals,
    link,
    retryAfterMs,
    parserResult: parserResult || {
      source,
      signals,
      responseCode,
    },
    raw,
  };
}

function localResult(username, platform, status, reason, extra = {}) {
  return createResult({ username, platform, status, reason, source: "local-validation", ...extra });
}

module.exports = { createResult, localResult, normalizeUsername };
