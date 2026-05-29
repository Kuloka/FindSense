function textIncludes(text, signals) {
  const normalized = String(text || "").toLowerCase();
  return signals.some((signal) => normalized.includes(signal));
}

function hasAnyHeader(headers, names) {
  return names.some((name) => Boolean(headers?.get?.(name)));
}

function getRetryAfterMs(headers, body = {}) {
  const headerValue = Number(headers?.get?.("retry-after") || 0);
  const bodyValue = Number(body.retry_after || body.retryAfter || 0);
  const seconds = headerValue || bodyValue;
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds * 1000) : 0;
}

module.exports = { textIncludes, hasAnyHeader, getRetryAfterMs };
