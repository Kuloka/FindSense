const { STATUSES } = require("../constants/statuses");
const { createResult, normalizeUsername } = require("../result");
const { validateDiscord } = require("../validators/platformRules");
const { parseDiscordApi } = require("../parsers/discordParser");
const { makeAbortSignal } = require("./http");

const cache = new Map();
let queue = Promise.resolve();
let lastRequestAt = 0;
let rateLimitedUntil = 0;

const speedGaps = { fast: 2500, slow: 9000 };

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function queueCheck(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

function getCache(username) {
  const cached = cache.get(username);
  if (!cached) return null;
  const age = Date.now() - cached.time;
  const ttl = [STATUSES.FREE, STATUSES.TAKEN].includes(cached.result.status) ? 24 * 60 * 60 * 1000 : 60 * 1000;
  return age >= 0 && age < ttl ? cached.result : null;
}

function setCache(username, result) {
  cache.set(username, { time: Date.now(), result });
  return result;
}

async function checkDiscordUsername(value, options = {}) {
  const username = normalizeUsername(value);
  const local = validateDiscord(username);
  if (local && local.status !== STATUSES.MAYBE) return local;

  const cached = getCache(username);
  if (cached) return cached;

  if (Date.now() < rateLimitedUntil) {
    const retryAfterMs = rateLimitedUntil - Date.now();
    return createResult({ username, platform: "discord", status: STATUSES.RATE_LIMIT, reason: `Discord rate limited. Retry after ${Math.ceil(retryAfterMs / 1000)}s.`, source: "discord-api", signals: ["cached-rate-limit"], retryAfterMs });
  }

  return queueCheck(async () => {
    const speed = Object.prototype.hasOwnProperty.call(speedGaps, options.speed) ? options.speed : "slow";
    const gap = speedGaps[speed];
    const since = Date.now() - lastRequestAt;
    if (since < gap) await wait(gap - since);
    lastRequestAt = Date.now();

    const { controller, timeout } = makeAbortSignal(9000);
    try {
      const response = await fetch("https://discord.com/api/v9/unique-username/username-attempt-unauthed", {
        method: "POST",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "user-agent": "Findsense/2.0 Discord username scanner",
        },
        body: JSON.stringify({ username }),
      });
      let body = {};
      try {
        body = await response.json();
      } catch (error) {
        body = {};
      }
      const result = parseDiscordApi({ username, responseCode: response.status, headers: response.headers, body });
      if (result.status === STATUSES.RATE_LIMIT) rateLimitedUntil = Date.now() + (result.retryAfterMs || 60 * 1000);
      if (local?.status === STATUSES.MAYBE && result.status === STATUSES.FREE) {
        return setCache(username, { ...result, status: STATUSES.MAYBE, signals: [...result.signals, "local-suspicious"], reason: `${local.reason} Discord says available, but local pattern is suspicious.` });
      }
      return setCache(username, result);
    } catch (error) {
      return createResult({
        username,
        platform: "discord",
        status: error.name === "AbortError" ? STATUSES.UNKNOWN : STATUSES.ERROR,
        reason: error.name === "AbortError" ? "Discord request timed out." : "Could not reach Discord.",
        source: "discord-api",
        signals: [error.name === "AbortError" ? "timeout" : "network-error"],
      });
    } finally {
      clearTimeout(timeout);
    }
  });
}

module.exports = { checkDiscordUsername };
