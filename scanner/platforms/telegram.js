const { STATUSES } = require("../constants/statuses");
const { createResult, normalizeUsername } = require("../result");
const { validateTelegram } = require("../validators/platformRules");
const { parseFragment, parseTelegramWeb } = require("../parsers/telegramParser");
const { fetchText, makeAbortSignal } = require("./http");

async function checkFragment(username) {
  const { controller, timeout } = makeAbortSignal(8000);
  const urls = [
    `https://fragment.com/username/${encodeURIComponent(username)}`,
    `https://fragment.com/?query=${encodeURIComponent(username)}`,
  ];

  try {
    for (const url of urls) {
      const { response, body } = await fetchText(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          accept: "text/html,application/xhtml+xml",
          "user-agent": "Findsense/2.0 username scanner",
        },
      });
      const parsed = parseFragment({ username, responseCode: response.status, responseUrl: response.url, body });
      if (parsed) return parsed;
    }
    return null;
  } catch (error) {
    if (error.name === "AbortError") {
      return createResult({ username, platform: "telegram", status: STATUSES.UNKNOWN, reason: "Fragment check timed out.", source: "fragment", signals: ["timeout"] });
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkTelegramUsername(value, options = {}) {
  const username = normalizeUsername(value);
  const local = validateTelegram(username);
  if (local && local.status !== STATUSES.MAYBE) return local;

  const fragmentResult = await checkFragment(username);
  if (fragmentResult && [STATUSES.RESERVED, STATUSES.RATE_LIMIT].includes(fragmentResult.status)) return fragmentResult;

  const { controller, timeout } = makeAbortSignal(9000);
  try {
    const { response, body } = await fetchText(`https://t.me/${encodeURIComponent(username)}`, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Findsense/2.0 Telegram username scanner",
      },
    });
    const result = parseTelegramWeb({
      username,
      responseCode: response.status,
      responseUrl: response.url,
      body,
      fragmentResult: null,
    });
    return local?.status === STATUSES.MAYBE && result.status === STATUSES.MAYBE
      ? { ...result, signals: [...result.signals, "local-suspicious"], reason: `${local.reason} ${result.reason}` }
      : result;
  } catch (error) {
    return createResult({
      username,
      platform: "telegram",
      status: error.name === "AbortError" ? STATUSES.UNKNOWN : STATUSES.ERROR,
      reason: error.name === "AbortError" ? "Telegram request timed out." : "Could not reach Telegram.",
      source: "telegram-web",
      signals: [error.name === "AbortError" ? "timeout" : "network-error"],
    });
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { checkTelegramUsername };
