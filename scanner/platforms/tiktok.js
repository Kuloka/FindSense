const { STATUSES } = require("../constants/statuses");
const { createResult, normalizeUsername } = require("../result");
const { validateTikTok } = require("../validators/platformRules");
const { parseTikTokOEmbed, parseTikTokPage } = require("../parsers/tiktokParser");
const { fetchJson, fetchText, makeAbortSignal } = require("./http");

function getSignals(result) {
  return Array.isArray(result?.signals) ? result.signals : [];
}

function getAnalyzerSignals(result) {
  return Array.isArray(result?.parserResult?.analyzerSignals) ? result.parserResult.analyzerSignals : [];
}

function hasHardUnsafeSignal(result) {
  const hardUnsafeSignals = new Set([
    "rate-limit",
    "server-error",
    "empty-or-too-small-body",
    "suspicious-redirect",
    "login-redirect",
  ]);
  return [...getSignals(result), ...getAnalyzerSignals(result)].some((signal) => hardUnsafeSignals.has(signal));
}

function maybePromoteHighProbabilityFree({ username, link, embedResult, pageResult }) {
  const embedSignals = getSignals(embedResult);
  const pageSignals = getSignals(pageResult);
  const analyzerSignals = getAnalyzerSignals(pageResult);
  const embedMissing = embedSignals.includes("oembed-missing");
  const webMissing = pageSignals.includes("weak-404") || pageSignals.includes("missing-profile-text");
  const webBlockedButUsable = analyzerSignals.includes("anti-bot") || analyzerSignals.includes("temporary-error");

  if (!embedMissing || (!webMissing && !webBlockedButUsable) || hasHardUnsafeSignal(pageResult)) return pageResult;
  if (![STATUSES.MAYBE, STATUSES.FREE].includes(pageResult.status)) return pageResult;

  const signals = [...new Set([...embedSignals, ...pageSignals, "high-probability-free"])];
  return createResult({
    username,
    platform: "tiktok",
    status: STATUSES.FREE,
    reason: webMissing
      ? "High probability free: TikTok oEmbed did not find profile and web page returned a clean missing-profile signal."
      : "High probability free: TikTok oEmbed did not find profile; web page was blocked, so this is not a 100% confirmation.",
    responseCode: pageResult.responseCode,
    source: "tiktok-combined",
    signals,
    link,
    parserResult: {
      parser: "tiktok-combined",
      proposedStatus: STATUSES.FREE,
      confirmations: webMissing
        ? ["valid-local", "oembed-missing", "clean-web-missing"]
        : ["valid-local", "oembed-missing", "web-blocked-not-confirmed"],
      analyzerSignals,
      signals,
      oembed: embedResult.parserResult,
      web: pageResult.parserResult,
    },
  });
}

async function checkTikTokUsername(value) {
  const username = normalizeUsername(value);
  const local = validateTikTok(username);
  if (local && local.status !== STATUSES.MAYBE) return local;

  const link = `https://www.tiktok.com/@${encodeURIComponent(username)}`;
  const { controller, timeout } = makeAbortSignal(9000);

  try {
    const embedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(link)}`;
    const embed = await fetchJson(embedUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "application/json",
        "user-agent": "Mozilla/5.0 Findsense/2.0 TikTok username scanner",
      },
    });
    const embedResult = parseTikTokOEmbed({ username, responseCode: embed.response.status, body: embed.body });
    if (embedResult?.status === STATUSES.TAKEN || embedResult?.status === STATUSES.RATE_LIMIT) return embedResult;

    const page = await fetchText(link, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-US,en;q=0.9",
        "user-agent": "Mozilla/5.0 Findsense/2.0 TikTok username scanner",
      },
    });
    const pageResult = parseTikTokPage({ username, responseCode: page.response.status, responseUrl: page.response.url, body: page.body });
    const combinedResult = maybePromoteHighProbabilityFree({ username, link, embedResult, pageResult });
    if (local?.status === STATUSES.MAYBE && pageResult.status !== STATUSES.TAKEN) {
      return { ...combinedResult, status: STATUSES.MAYBE, signals: [...combinedResult.signals, "local-suspicious"], reason: `${local.reason} ${combinedResult.reason}` };
    }
    return combinedResult;
  } catch (error) {
    return createResult({
      username,
      platform: "tiktok",
      status: error.name === "AbortError" ? STATUSES.UNKNOWN : STATUSES.ERROR,
      reason: error.name === "AbortError" ? "TikTok request timed out." : "Could not reach TikTok.",
      source: "tiktok-web",
      signals: [error.name === "AbortError" ? "timeout" : "network-error"],
      link,
    });
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { checkTikTokUsername };
