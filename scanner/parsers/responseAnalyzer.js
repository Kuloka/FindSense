const { getRetryAfterMs, textIncludes } = require("./signals");

function analyzeResponse({ responseCode = null, responseUrl = "", headers = null, body = "" }) {
  const text = typeof body === "string" ? body : JSON.stringify(body || {});
  const normalized = text.toLowerCase();
  const signals = [];
  const retryAfterMs = getRetryAfterMs(headers, typeof body === "object" ? body : {});

  if (responseCode === 429 || retryAfterMs > 0 || textIncludes(normalized, ["rate limit", "too many requests"])) signals.push("rate-limit");
  if (textIncludes(normalized, ["captcha", "verify you are human", "verify to continue", "cloudflare", "cf-chl", "challenge-platform", "access denied"])) signals.push("anti-bot");
  if (textIncludes(normalized, ["temporarily unavailable", "service unavailable", "try again later", "gateway timeout"])) signals.push("temporary-error");
  if (responseCode >= 500) signals.push("server-error");
  if (responseCode >= 300 && responseCode < 400) signals.push("redirect");
  if (typeof body === "string" && (!text.trim() || text.trim().length < 32)) signals.push("empty-or-too-small-body");
  if (String(responseUrl || "").toLowerCase().includes("/login")) signals.push("login-redirect");

  return {
    responseCode,
    responseUrl,
    retryAfterMs,
    signals,
    hasRateLimit: signals.includes("rate-limit"),
    hasAntiBot: signals.includes("anti-bot"),
    hasTemporaryError: signals.includes("temporary-error") || signals.includes("server-error"),
    hasWeakBody: signals.includes("empty-or-too-small-body"),
    hasSuspiciousRedirect: signals.includes("login-redirect"),
  };
}

module.exports = { analyzeResponse };
