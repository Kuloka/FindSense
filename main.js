const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const scanner = require("./scanner");

const START_PORT = Number(process.env.PORT || 5173);
const PUBLIC_DIR = path.join(__dirname, "public");
const AUTO_OUTPUT_DIR = path.join(__dirname, "auto-usernames");
const TELEGRAM_CONFIG_PATH = path.join(__dirname, "telegram-config.json");
const DISCORD_CACHE_PATH = path.join(__dirname, "discord-cache.json");
const TELEGRAM_USERNAME = /^(?=.{5,32}$)[a-z][a-z0-9_]*[a-z0-9]$/i;
const DISCORD_USERNAME = /^(?=.{2,32}$)[a-z0-9_.]+$/;
const TIKTOK_USERNAME = /^(?=.{2,24}$)[a-z0-9_.]+$/;
const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const telegramConfig = loadTelegramConfig();

let telegramApiClientPromise = null;
const externalUsernameCache = new Map();
const discordUsernameCache = loadDiscordCache();
const EXTERNAL_CACHE_TTL_MS = 10 * 60 * 1000;
const DISCORD_SUCCESS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const DISCORD_SOFT_CACHE_TTL_MS = 60 * 1000;
const DISCORD_SPEED_GAPS_MS = {
  fast: 2500,
  slow: 9000,
};
const DISCORD_DEFAULT_SPEED = "slow";
let discordQueue = Promise.resolve();
let discordLastRequestAt = 0;
let discordRateLimitedUntil = 0;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(JSON.stringify(payload));
}

function loadTelegramConfig() {
  let fileConfig = {};

  try {
    fileConfig = JSON.parse(fs.readFileSync(TELEGRAM_CONFIG_PATH, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("Could not read telegram-config.json:", error.message);
    }
  }

  return {
    apiId: Number(process.env.TELEGRAM_API_ID || fileConfig.apiId || fileConfig.api_id || 0),
    apiHash: process.env.TELEGRAM_API_HASH || fileConfig.apiHash || fileConfig.api_hash || "",
    session: process.env.TELEGRAM_SESSION || fileConfig.session || "",
  };
}

function loadDiscordCache() {
  try {
    const data = JSON.parse(fs.readFileSync(DISCORD_CACHE_PATH, "utf8"));
    return new Map(Object.entries(data));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("Could not read discord-cache.json:", error.message);
    }
    return new Map();
  }
}

function saveDiscordCache() {
  const data = Object.fromEntries(discordUsernameCache.entries());
  fs.promises.writeFile(DISCORD_CACHE_PATH, JSON.stringify(data, null, 2), "utf8").catch((error) => {
    console.warn("Could not write discord-cache.json:", error.message);
  });
}

function sendStatic(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(data);
  });
}

async function ensureAutoOutputDirs() {
  await fs.promises.mkdir(AUTO_OUTPUT_DIR, { recursive: true });
  await Promise.all(
    [...LETTERS].map((letter) => fs.promises.mkdir(path.join(AUTO_OUTPUT_DIR, letter), { recursive: true })),
  );
}

async function saveAutoUsername(username) {
  const clean = username.trim().replace(/^@/, "").toLowerCase();
  const checkResult = await scanner.checkTelegramUsername(clean);
  if (checkResult.status !== scanner.STATUSES.FREE) {
    return {
      saved: false,
      status: checkResult.status,
      reason: checkResult.reason || "Username is not confirmed as free.",
    };
  }

  const firstLetter = clean[0];
  if (!LETTERS.includes(firstLetter)) {
    return {
      saved: false,
      reason: "Username must start with a-z.",
    };
  }

  await ensureAutoOutputDirs();

  const filePath = path.join(AUTO_OUTPUT_DIR, firstLetter, `${firstLetter}.txt`);
  let existing = "";

  try {
    existing = await fs.promises.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const names = new Set(existing.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
  if (names.has(clean)) {
    return {
      saved: false,
      duplicate: true,
      file: filePath,
      letter: firstLetter,
    };
  }

  const prefix = existing && !existing.endsWith("\n") ? "\n" : "";
  await fs.promises.appendFile(filePath, `${prefix}${clean}\n`, "utf8");

  return {
    saved: true,
    file: filePath,
    letter: firstLetter,
  };
}

function getUsernameValidationReason(value) {
  if (!/^[a-z]/i.test(value)) return "Username must start with a letter.";
  if (value.length < 5 || value.length > 32) return "Use 5-32 characters.";
  if (!/^[a-z0-9_]+$/i.test(value)) return "Use only letters, numbers, and underscores.";
  if (value.endsWith("_")) return "Username cannot end with an underscore.";
  if (value.includes("__")) return "Username cannot contain multiple underscores in a row.";
  if (/(.)\1\1/i.test(value)) return "Username cannot contain 3 identical characters in a row.";
  return "";
}

function checkTelegramUsernameValidity(username) {
  const clean = username.trim().replace(/^@/, "").toLowerCase();
  const reason = getUsernameValidationReason(clean);

  if (!TELEGRAM_USERNAME.test(clean) || reason) {
    return {
      valid: false,
      status: "invalid",
      confidence: "high",
      reason: reason || "Use 5-32 characters: letters, numbers, and underscores. Start with a letter.",
    };
  }

  return {
    valid: true,
    status: "valid",
    confidence: "medium",
    reason: "",
  };
}

function getDiscordUsernameValidationReason(value) {
  if (value.length < 2 || value.length > 32) return "Discord username должен быть 2-32 символа.";
  if (value !== value.toLowerCase()) return "Discord username должен быть в нижнем регистре.";
  if (!DISCORD_USERNAME.test(value)) return "Можно использовать только a-z, 0-9, _ и точку.";
  if (value.includes("..")) return "Discord не принимает две точки подряд.";
  return "";
}

function getTikTokUsernameValidationReason(value) {
  if (value.length < 2 || value.length > 24) return "TikTok username должен быть 2-24 символа.";
  if (value !== value.toLowerCase()) return "TikTok username должен быть в нижнем регистре.";
  if (!TIKTOK_USERNAME.test(value)) return "Можно использовать только a-z, 0-9, _ и точку.";
  if (value.endsWith(".")) return "TikTok не принимает точку в конце username.";
  return "";
}

function makeTikTokMaybeFreeReason(source) {
  return `${source} не нашел публичный профиль. Это только публичная проверка: TikTok может не дать изменить username из-за резерва, лимита 30 дней, временной блокировки старого ника или внутренних антиспам-правил. Проверь ник в приложении TikTok перед занятием.`;
}

function normalizeDiscordSpeed(value) {
  return Object.prototype.hasOwnProperty.call(DISCORD_SPEED_GAPS_MS, value) ? value : DISCORD_DEFAULT_SPEED;
}

function getDiscordApiMessage(data = {}, response = {}) {
  const message = String(data.message || "").trim();
  const retryAfter = Number(data.retry_after || response.headers?.get?.("retry-after") || 0);

  if (response.status === 429 || /rate limit/i.test(message)) {
    return retryAfter
      ? `Discord временно ограничил проверку. Попробуй через ${Math.ceil(retryAfter)} сек.`
      : "Discord временно ограничил проверку. Попробуй чуть позже.";
  }

  if (/captcha/i.test(message)) {
    return "Discord попросил капчу, поэтому точная проверка сейчас недоступна.";
  }

  return message || "Discord не дал точно проверить username. Попробуй позже.";
}

function getDiscordRetryAfterMs(data = {}, response = {}) {
  const retrySeconds = Number(data.retry_after || response.headers?.get?.("retry-after") || 0);
  return Number.isFinite(retrySeconds) && retrySeconds > 0 ? Math.ceil(retrySeconds * 1000) : 0;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function queueDiscordCheck(task) {
  const run = discordQueue.then(task, task);
  discordQueue = run.catch(() => {});
  return run;
}

function isDiscordCacheFresh(cached) {
  if (!cached?.result) return false;
  const age = Date.now() - Number(cached.time || 0);
  const ttl = ["free", "taken"].includes(cached.result.status)
    ? DISCORD_SUCCESS_CACHE_TTL_MS
    : DISCORD_SOFT_CACHE_TTL_MS;
  return age >= 0 && age < ttl;
}

function rememberDiscordResult(username, result) {
  discordUsernameCache.set(username, { time: Date.now(), result });
  if (["free", "taken"].includes(result.status)) saveDiscordCache();
  return result;
}

function makeDiscordLimitedResult(username) {
  const leftMs = Math.max(0, discordRateLimitedUntil - Date.now());
  const leftSeconds = Math.ceil(leftMs / 1000);

  return {
    username,
    status: "unknown",
    confidence: "low",
    valid: true,
    validityStatus: "valid",
    validityReason: "Формат подходит под правила Discord username.",
    reason: leftSeconds
      ? `Discord пока ограничил проверки. Осталось примерно ${leftSeconds} сек.`
      : "Discord пока ограничил проверки. Попробуй чуть позже.",
    source: "discord-rate-limit",
    retryAfterMs: leftMs,
  };
}

function getDiscordStatusFromApi(data = {}) {
  if (data.taken === true) return "taken";
  if (data.taken === false) return "free";
  return "unknown";
}

async function checkDiscordUsername(username, options = {}) {
  const clean = username.trim().replace(/^@/, "").toLowerCase();
  const speed = normalizeDiscordSpeed(options.speed);
  const reason = getDiscordUsernameValidationReason(clean);

  if (reason) {
    return {
      username: clean,
      link: `https://discord.com/users/${encodeURIComponent(clean)}`,
      status: "invalid",
      confidence: "high",
      valid: false,
      validityStatus: "invalid",
      validityReason: reason,
      reason,
      source: "discord-local-rules",
    };
  }

  const cached = discordUsernameCache.get(clean);
  if (isDiscordCacheFresh(cached)) {
    return cached.result;
  }

  if (Date.now() < discordRateLimitedUntil) {
    return makeDiscordLimitedResult(clean);
  }

  return queueDiscordCheck(() => checkDiscordUsernameNow(clean, speed));
}

async function checkDiscordUsernameNow(clean, speed) {
  const cached = discordUsernameCache.get(clean);
  if (isDiscordCacheFresh(cached)) {
    return cached.result;
  }

  if (Date.now() < discordRateLimitedUntil) {
    return makeDiscordLimitedResult(clean);
  }

  const requestGapMs = DISCORD_SPEED_GAPS_MS[normalizeDiscordSpeed(speed)];
  const sinceLastRequest = Date.now() - discordLastRequestAt;
  if (sinceLastRequest < requestGapMs) {
    await wait(requestGapMs - sinceLastRequest);
  }
  discordLastRequestAt = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch("https://discord.com/api/v9/unique-username/username-attempt-unauthed", {
      method: "POST",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "user-agent": "Findsense/1.0 Discord username checker",
      },
      body: JSON.stringify({ username: clean }),
    });

    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      const retryAfterMs = getDiscordRetryAfterMs(data, response);
      if (response.status === 429) {
        discordRateLimitedUntil = Date.now() + (retryAfterMs || 60 * 1000);
      }

      const result = {
        username: clean,
        status: "unknown",
        confidence: "low",
        valid: true,
        validityStatus: "valid",
        validityReason: "Формат подходит под правила Discord username.",
        reason: getDiscordApiMessage(data, response),
        source: "discord-api",
        retryAfterMs,
        external: data,
      };
      return rememberDiscordResult(clean, result);
    }

    const status = getDiscordStatusFromApi(data);
    const result = {
      username: clean,
      status,
      confidence: status === "unknown" ? "low" : "high",
      valid: true,
      validityStatus: "valid",
      validityReason: "Формат подходит под правила Discord username.",
      reason:
        status === "taken"
          ? "Discord сообщает, что username занят."
          : status === "free"
            ? "Discord сообщает, что username свободен."
            : getDiscordApiMessage(data, response),
      source: "discord-api",
      external: data,
    };
    return rememberDiscordResult(clean, result);
  } catch (error) {
    const result = {
      username: clean,
      status: "unknown",
      confidence: "low",
      valid: true,
      validityStatus: "valid",
      validityReason: "Формат подходит под правила Discord username.",
      reason:
        error.name === "AbortError"
          ? "Discord слишком долго отвечал."
          : "Не получилось подключиться к Discord для точной проверки.",
      source: "discord-api",
    };
    return rememberDiscordResult(clean, result);
  } finally {
    clearTimeout(timeout);
  }
}

function hasExactTikTokProfileSignal(html, username) {
  const escapedUsername = escapeRegExp(username.toLowerCase());
  const exactPatterns = [
    new RegExp(`["']uniqueId["']\\s*:\\s*["']${escapedUsername}["']`, "i"),
    new RegExp(`["']uniqueid["']\\s*:\\s*["']${escapedUsername}["']`, "i"),
    new RegExp(`&quot;uniqueId&quot;\\s*:\\s*&quot;${escapedUsername}&quot;`, "i"),
    new RegExp(`&quot;uniqueid&quot;\\s*:\\s*&quot;${escapedUsername}&quot;`, "i"),
    new RegExp(`data-unique-id=["']${escapedUsername}["']`, "i"),
    new RegExp(`/(?:@|%40)${escapedUsername}(?:["'/?#&<\\\\]|$)`, "i"),
  ];

  return exactPatterns.some((pattern) => pattern.test(html));
}

function classifyTikTokPage(html, response, username) {
  const normalized = html.toLowerCase();
  const responseUrl = String(response.url || "").toLowerCase();
  const hasExactProfile = hasExactTikTokProfileSignal(html, username);

  const takenSignals = [
    `"uniqueid":"`,
    `"nickname":"`,
    `"user":{"id"`,
    `"privateaccount":true`,
    `"privateAccount":true`.toLowerCase(),
    "profile-tab",
    "share-title",
  ];
  const freeSignals = [
    "couldn't find this account",
    "couldn’t find this account",
    "this account doesn't exist",
    "this account doesn’t exist",
    "page not available",
    "user_not_found",
  ];

  if (response.ok && (hasExactProfile || takenSignals.some((signal) => normalized.includes(signal)))) {
    return {
      status: "taken",
      confidence: hasExactProfile ? "high" : "medium",
      reason: hasExactProfile
        ? "TikTok открыл профиль с этим username. Даже приватный аккаунт считается занятым."
        : "Найдены признаки профиля TikTok с этим username.",
    };
  }

  if (response.status === 404) {
    return {
      status: "maybe",
      confidence: "low",
      reason: makeTikTokMaybeFreeReason("Публичная страница TikTok"),
    };
  }

  if (freeSignals.some((signal) => normalized.includes(signal))) {
    return {
      status: "maybe",
      confidence: "low",
      reason: makeTikTokMaybeFreeReason("TikTok"),
    };
  }

  if (response.ok && responseUrl.includes("/@")) {
    return {
      status: "maybe",
      confidence: "low",
      reason: "TikTok ответил страницей, но публичный HTML не дал точного статуса.",
    };
  }

  return {
    status: "unknown",
    confidence: "low",
    reason: "TikTok не дал точный публичный ответ. Попробуй позже.",
  };
}

async function checkTikTokOEmbed(username, link) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  const url = `https://www.tiktok.com/oembed?url=${encodeURIComponent(link)}`;

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "application/json",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Findsense/1.0 TikTok username checker",
      },
    });

    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    const authorUrl = String(data.author_url || "").toLowerCase();
    const html = String(data.html || "").toLowerCase();
    if (response.ok && (authorUrl.includes(`/@${username}`) || html.includes(`data-unique-id="${username}"`))) {
      return {
        status: "taken",
        confidence: "high",
        reason: "TikTok oEmbed нашел публичный профиль с этим username.",
        external: data,
      };
    }

    if (response.status === 400 || response.status === 404) {
      return {
        status: "maybe",
        confidence: "low",
        reason: makeTikTokMaybeFreeReason("TikTok oEmbed"),
        external: data,
      };
    }

    return {
      status: "unknown",
      confidence: "low",
      reason: "TikTok oEmbed не дал точный ответ. Используем запасную проверку публичной страницы.",
      external: data,
    };
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkTikTokUsername(username) {
  const clean = username.trim().replace(/^@/, "").toLowerCase();
  const reason = getTikTokUsernameValidationReason(clean);
  const link = `https://www.tiktok.com/@${encodeURIComponent(clean)}`;

  if (reason) {
    return {
      username: clean,
      link,
      status: "invalid",
      confidence: "high",
      valid: false,
      validityStatus: "invalid",
      validityReason: reason,
      reason,
      source: "tiktok-local-rules",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const embedResult = await checkTikTokOEmbed(clean, link);
    if (embedResult?.status === "taken") {
      return {
        username: clean,
        link,
        valid: true,
        validityStatus: "valid",
        validityReason: "Формат подходит под публичные правила TikTok username.",
        source: "tiktok-oembed",
        ...embedResult,
      };
    }

    const response = await fetch(link, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-US,en;q=0.9",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Findsense/1.0 TikTok username checker",
      },
    });
    const html = await response.text();
    const pageResult = classifyTikTokPage(html, response, clean);

    return {
      username: clean,
      link,
      valid: true,
      validityStatus: "valid",
      validityReason: "Формат подходит под публичные правила TikTok username.",
      httpStatus: response.status,
      source: pageResult.status === "taken" ? "tiktok-web" : "tiktok-public",
      ...pageResult,
    };
  } catch (error) {
    return {
      username: clean,
      link,
      status: "unknown",
      confidence: "low",
      valid: true,
      validityStatus: "valid",
      validityReason: "Формат подходит под публичные правила TikTok username.",
      reason:
        error.name === "AbortError"
          ? "TikTok слишком долго отвечал."
          : "Не получилось подключиться к TikTok для точной проверки.",
      source: "tiktok-web",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function makeInvalidUsernameResult(clean, validity, reason = validity.reason) {
  return {
    username: clean,
    status: "invalid",
    confidence: validity.confidence,
    valid: false,
    validityStatus: "invalid",
    validityReason: reason,
    reason,
    source: "local-rules",
  };
}

function makeTelegramApiRequiredResult(clean) {
  return {
    username: clean,
    link: `https://t.me/${encodeURIComponent(clean)}`,
    fragmentLink: null,
    status: "login_required",
    confidence: "low",
    valid: null,
    validityStatus: "unknown",
    validityReason: "Telegram API setup is required before checking usernames.",
    reason:
      "Чтобы проверять некорректность внутри Telegram, настрой сессию: npm run telegram:login, затем перезапусти Findsense.",
    source: "telegram-api-required",
  };
}

function hasTelegramApiConfig() {
  return Boolean(telegramConfig.apiId && telegramConfig.apiHash && telegramConfig.session);
}

async function getTelegramApiClient() {
  if (!hasTelegramApiConfig()) return null;

  if (!telegramApiClientPromise) {
    telegramApiClientPromise = (async () => {
      const { TelegramClient } = require("telegram");
      const { StringSession } = require("telegram/sessions");
      const client = new TelegramClient(new StringSession(telegramConfig.session), telegramConfig.apiId, telegramConfig.apiHash, {
        connectionRetries: 2,
      });

      await client.connect();

      if (!(await client.checkAuthorization())) {
        throw new Error("Telegram session is not authorized.");
      }

      return client;
    })().catch((error) => {
      telegramApiClientPromise = null;
      throw error;
    });
  }

  return telegramApiClientPromise;
}

function getTelegramApiErrorCode(error) {
  return String(error?.errorMessage || error?.message || error || "").toUpperCase();
}

function classifyTelegramApiError(error) {
  const code = getTelegramApiErrorCode(error);

  if (code.includes("USERNAME_INVALID")) {
    return {
      status: "invalid",
      confidence: "high",
      valid: false,
      validityStatus: "invalid",
      validityReason: "Telegram API rejected this username as invalid.",
      reason: "Telegram API says this username is invalid.",
      source: "telegram-api",
    };
  }

  if (code.includes("USERNAME_OCCUPIED") || code.includes("USERNAME_PURCHASE_AVAILABLE")) {
    return {
      status: "taken",
      confidence: "high",
      valid: true,
      validityStatus: "valid",
      validityReason: "Telegram API accepted this username format.",
      reason: "Telegram API says this username is already occupied or reserved.",
      source: "telegram-api",
    };
  }

  if (code.includes("FLOOD_WAIT")) {
    return {
      status: "RATE_LIMIT",
      confidence: "low",
      valid: true,
      validityStatus: "valid",
      validityReason: "Telegram API could not complete the check because of rate limits.",
      reason: "Telegram API rate limit. Try again later.",
      source: "telegram-api",
    };
  }

  return null;
}

function normalizeTelegramApiScannerResult(username, result) {
  if (!result) return null;
  const statusMap = {
    free: scanner.STATUSES.FREE,
    taken: scanner.STATUSES.TAKEN,
    invalid: scanner.STATUSES.INVALID,
    reserved: scanner.STATUSES.RESERVED,
    error: scanner.STATUSES.ERROR,
    unknown: scanner.STATUSES.UNKNOWN,
    maybe: scanner.STATUSES.MAYBE,
    RATE_LIMIT: scanner.STATUSES.RATE_LIMIT,
  };
  const status = statusMap[result.status] || result.status || scanner.STATUSES.UNKNOWN;
  return {
    username,
    platform: "telegram",
    status,
    reason: result.reason || "Telegram API check finished.",
    checkedAt: new Date().toISOString(),
    responseCode: null,
    source: result.source || "telegram-api",
    signals: ["telegram-api"],
    link: `https://t.me/${username}`,
    retryAfterMs: null,
    parserResult: {
      parser: "telegram-api",
      proposedStatus: status,
      confirmations: status === scanner.STATUSES.FREE ? ["valid-local", "api-available", "clean-response"] : [],
      analyzerSignals: [],
      signals: ["telegram-api"],
    },
  };
}

async function checkTelegramApiUsername(username) {
  const client = await getTelegramApiClient();
  if (!client) return null;

  const { Api } = require("telegram");

  try {
    const available = await client.invoke(new Api.account.CheckUsername({ username }));

    return {
      status: available ? "free" : "taken",
      confidence: "high",
      valid: true,
      validityStatus: "valid",
      validityReason: "Telegram API accepted this username format.",
      reason: available
        ? "Telegram API says this username can be used on an account."
        : "Telegram API says this username is not available.",
      source: "telegram-api",
    };
  } catch (error) {
    const classified = classifyTelegramApiError(error);
    if (classified) return classified;
    return {
      status: "error",
      confidence: "low",
      valid: null,
      validityStatus: "unknown",
      validityReason: "Telegram API check failed.",
      reason: `Telegram API check failed: ${error.message || error}`,
      source: "telegram-api",
    };
  }
}

function normalizeExternalUsernameResult(username, data = {}) {
  const valid = data.is_valid ?? data.isValid ?? data.valid;
  const exists = data.exists ?? data.taken;
  const canClaim = data.can_claim ?? data.canClaim ?? data.available;
  const chatType = data.chat_type || data.chatType || "";

  if (valid === false) {
    return {
      status: "invalid",
      confidence: "medium",
      valid: false,
      validityStatus: "invalid",
      validityReason: "External Telegram username API marked this username as invalid.",
      reason: "External checker says this username is invalid.",
      source: "external-api",
      external: data,
    };
  }

  if (canClaim === true) {
    return {
      status: "free",
      confidence: "medium",
      valid: true,
      validityStatus: "valid",
      validityReason: "External Telegram username API marked this username as valid.",
      reason: "External checker says this username can be claimed.",
      source: "external-api",
      external: data,
    };
  }

  if (exists === true || canClaim === false) {
    return {
      status: "taken",
      confidence: "medium",
      valid: valid !== false,
      validityStatus: valid === false ? "invalid" : "valid",
      validityReason: "External Telegram username API found this username in Telegram.",
      reason: chatType
        ? `External checker found this username as ${chatType}.`
        : "External checker says this username is already taken.",
      source: "external-api",
      external: data,
    };
  }

  if (valid === true) {
    return {
      status: "maybe",
      confidence: "low",
      valid: true,
      validityStatus: "valid",
      validityReason: "External Telegram username API marked this username as valid.",
      reason: "External checker says this username format is valid, but did not confirm availability.",
      source: "external-api",
      external: data,
    };
  }

  return null;
}

async function checkExternalUsernameApi(username) {
  const cached = externalUsernameCache.get(username);
  if (cached && Date.now() - cached.time < EXTERNAL_CACHE_TTL_MS) {
    return cached.result;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 900);
  const url = `https://tgapi.mohammadalian.ir/v1/usernames/${encodeURIComponent(username)}/validity`;

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "application/json",
        "user-agent": "Findsense/1.0 Telegram username checker",
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    const result = normalizeExternalUsernameResult(username, data);
    externalUsernameCache.set(username, { time: Date.now(), result });
    return result;
  } catch (error) {
    externalUsernameCache.set(username, { time: Date.now(), result: null });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkTgMeResolveApi(username) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 900);
  const url = `https://tg.me/api/telegram/resolve/${encodeURIComponent(username)}`;

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "application/json",
        "user-agent": "Findsense/1.0 Telegram username checker",
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (!data || data.error || data.ok === false) return null;

    const resolvedUsername = String(data.username || data.userName || "").replace(/^@/, "").toLowerCase();
    if (resolvedUsername && resolvedUsername !== username.toLowerCase()) return null;

    if (data.id || data.className || resolvedUsername) {
      return {
        status: "taken",
        confidence: "high",
        valid: true,
        validityStatus: "valid",
        validityReason: "tg.me public resolve API found this username.",
        reason: data.className
          ? `tg.me found this username as ${data.className}.`
          : "tg.me found a public Telegram entity for this username.",
        source: "tgme-api",
        external: data,
      };
    }
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }

  return null;
}

async function checkExternalUsernameApis(username) {
  const cached = externalUsernameCache.get(username);
  if (cached && Date.now() - cached.time < EXTERNAL_CACHE_TTL_MS) {
    return cached.result;
  }

  const results = await Promise.allSettled([
    checkExternalUsernameApi(username),
    checkTgMeResolveApi(username),
  ]);
  const values = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)
    .filter(Boolean);
  const result =
    values.find((item) => item.status === "invalid") ||
    values.find((item) => item.status === "taken") ||
    values.find((item) => item.status === "free") ||
    values[0] ||
    null;

  externalUsernameCache.set(username, { time: Date.now(), result });
  return result;
}

function classifyTelegramValidity(html, pageResult) {
  if (pageResult.status === "invalid") {
    return {
      valid: false,
      status: "invalid",
      confidence: "high",
      reason: "Telegram rejected this username as invalid.",
    };
  }

  return {
    valid: true,
    status: "valid",
    confidence: pageResult.confidence === "high" ? "high" : "medium",
    reason: "Telegram accepted this username format.",
  };
}

function classifyTelegramPage(html, responseUrl) {
  const normalized = html.toLowerCase();

  const takenSignals = [
    "tgme_page_title",
    "tgme_page_photo",
    "tgme_page_extra",
    "tgme_channel_info",
  ];

  const unavailableSignals = [
    "username not found",
    "this username is not available",
  ];

  const invalidSignals = [
    "username_invalid",
    "username invalid",
    "incorrect username",
    "invalid username",
    "некорректное имя пользователя",
  ];

  const maybeSignals = [
    "tgme_username_link",
    'name="robots" content="noindex, nofollow"',
    "telegram: contact @",
  ];

  const looksTaken = takenSignals.some((signal) => normalized.includes(signal));
  const looksUnavailable = unavailableSignals.some((signal) => normalized.includes(signal));
  const looksInvalid = invalidSignals.some((signal) => normalized.includes(signal));
  const looksMaybe = maybeSignals.some((signal) => normalized.includes(signal));
  const isResolvePage = responseUrl && responseUrl.includes("/resolve?");

  if (looksInvalid) {
    return {
      status: "invalid",
      confidence: "high",
      reason: "Telegram says this username is invalid.",
    };
  }

  if (looksTaken) {
    return {
      status: "taken",
      confidence: "high",
      reason: "A public Telegram profile, group, or channel page was found.",
    };
  }

  if (looksUnavailable) {
    return {
      status: "free",
      confidence: "medium",
      reason: "Telegram did not return a public page. Check inside Telegram before claiming it.",
    };
  }

  if (looksMaybe || isResolvePage) {
    return {
      status: "free",
      confidence: "low",
      reason: "Telegram did not show a public page or bad-format signal.",
    };
  }

  return {
    status: "free",
    confidence: "low",
    reason: "No formal violation, public page, or reserve signal was found.",
  };
}

function isInvalidTelegramResult(result = {}) {
  if (["error", "login_required"].includes(result.status) || result.source === "telegram-api-required") return false;
  const text = `${result.status || ""} ${result.reason || ""}`.toLowerCase();
  return (
    result.valid === false ||
    result.status === "invalid" ||
    text.includes("invalid") ||
    text.includes("incorrect") ||
    text.includes("некоррект")
  );
}

function classifyFragmentPage(html, statusCode, responseUrl, username) {
  if (statusCode === 404) return null;
  if (!responseUrl) return null;

  const parsedUrl = new URL(responseUrl);
  const expectedPath = `/username/${username.toLowerCase()}`;
  const actualPath = parsedUrl.pathname.toLowerCase().replace(/\/$/, "");
  const isExactUsernamePage = actualPath === expectedPath;
  if (!isExactUsernamePage) return null;

  const normalized = html.toLowerCase();

  const listedSignals = [
    "collectible username",
    "fragment.com/username/",
    "place bid",
    "auction",
    "for sale",
    "sold for",
  ];

  const missingSignals = [
    "not found",
    "there is no such username",
  ];

  if (missingSignals.some((signal) => normalized.includes(signal))) {
    return null;
  }

  if (listedSignals.some((signal) => normalized.includes(signal))) {
    return {
      status: "reserved",
      confidence: "high",
      fragmentLink: null,
      reason: "Found on Fragment marketplace. This username may be reserved, auctioned, or for sale.",
    };
  }

  return {
    status: "reserved",
    confidence: "medium",
    fragmentLink: null,
    reason: "Fragment opened a marketplace page for this username.",
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function classifyFragmentSearchPage(html, username) {
  const escapedUsername = escapeRegExp(username.toLowerCase());
  const exactUsernameLink = new RegExp(
    `href=["'](?:https://fragment\\.com)?/username/${escapedUsername}/?["']`,
    "i",
  );

  if (!exactUsernameLink.test(html)) return null;

  return {
    status: "reserved",
    confidence: "medium",
    fragmentLink: null,
    reason: "Found exact username listing in Fragment search.",
  };
}

async function fetchFragmentPage(url, signal) {
  const response = await fetch(url, {
    redirect: "follow",
    signal,
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Findsense/1.0 Fragment username checker",
      accept: "text/html,application/xhtml+xml",
    },
  });

  return {
    html: await response.text(),
    status: response.status,
    url: response.url,
  };
}

async function checkFragmentUsername(username) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const link = `https://fragment.com/username/${encodeURIComponent(username)}`;
  const searchLink = `https://fragment.com/?query=${encodeURIComponent(username)}`;

  try {
    const [directResult, searchResult] = await Promise.allSettled([
      fetchFragmentPage(link, controller.signal),
      fetchFragmentPage(searchLink, controller.signal),
    ]);

    if (directResult.status === "fulfilled") {
      const result = classifyFragmentPage(
        directResult.value.html,
        directResult.value.status,
        directResult.value.url,
        username,
      );
      if (result) return { ...result, fragmentLink: link };
    }

    if (searchResult.status === "fulfilled") {
      const result = classifyFragmentSearchPage(searchResult.value.html, username);
      if (result) return { ...result, fragmentLink: link };
    }

    return null;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkUsername(username, options = {}) {
  const clean = username.trim().replace(/^@/, "").toLowerCase();
  const validity = checkTelegramUsernameValidity(clean);
  const useExternalCheck = Boolean(options.external);

  const hasApi = hasTelegramApiConfig();
  const telegramApiResult = hasApi ? await checkTelegramApiUsername(clean) : null;
  if (telegramApiResult && telegramApiResult.status !== "unknown") {
    return {
      username: clean,
      link: `https://t.me/${clean}`,
      fragmentLink: null,
      checkedInsideTelegram: true,
      ...telegramApiResult,
    };
  }

  if (!validity.valid) {
    return hasApi
      ? {
          username: clean,
          link: `https://t.me/${clean}`,
          fragmentLink: null,
          checkedInsideTelegram: true,
          status: "error",
          confidence: "low",
          valid: null,
          validityStatus: "unknown",
          validityReason: "Telegram API could not confirm this username.",
          reason: "Telegram API did not return a clear validity result. Try this username again.",
          source: "telegram-api",
        }
      : makeInvalidUsernameResult(clean, validity);
  }

  if (validity.valid) {
    const [externalResult, fragmentResult] = await Promise.all([
      !hasApi && useExternalCheck ? checkExternalUsernameApis(clean) : Promise.resolve(null),
      checkFragmentUsername(clean),
    ]);

    if (externalResult?.status === "invalid") {
      return {
        username: clean,
        link: `https://t.me/${clean}`,
        fragmentLink: null,
        externalChecked: true,
        ...externalResult,
      };
    }

    if (fragmentResult) {
      return {
        username: clean,
        link: `https://t.me/${clean}`,
        status: "taken",
        confidence: fragmentResult.confidence || "high",
        valid: true,
        validityStatus: "valid",
        validityReason: hasApi
          ? "Telegram API did not reject this username format before the Fragment check."
          : "Matches public Telegram username format rules.",
        fragmentLink: fragmentResult.fragmentLink,
        reason: fragmentResult.reason || "Found on Fragment marketplace. This username is occupied.",
      };
    }

    if (externalResult && externalResult.status !== "maybe") {
      return {
        username: clean,
        link: `https://t.me/${clean}`,
        fragmentLink: null,
        externalChecked: true,
        ...externalResult,
      };
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(`https://t.me/${encodeURIComponent(clean)}`, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Findsense/1.0 Telegram username checker",
        accept: "text/html,application/xhtml+xml",
      },
    });

    const html = await response.text();
    const telegramResult = classifyTelegramPage(html, response.url);
    const telegramValidity = classifyTelegramValidity(html, telegramResult);

    if (!validity.valid) {
      return makeInvalidUsernameResult(
        clean,
        {
          ...validity,
          confidence: telegramResult.status === "invalid" ? "high" : "medium",
        },
        telegramResult.status === "invalid"
          ? telegramResult.reason
          : `Telegram check did not confirm this username as available. ${validity.reason}`,
      );
    }

    const publicFallback = !hasApi;
    const status = publicFallback && telegramResult.status === "free" ? "maybe" : telegramResult.status;

    return {
      username: clean,
      link: `https://t.me/${clean}`,
      valid: telegramValidity.valid,
      validityStatus: telegramValidity.status,
      validityReason: publicFallback
        ? "Public Telegram pages were checked, but internal Telegram username validation was not available."
        : telegramValidity.reason,
      httpStatus: response.status,
      fragmentLink: null,
      publicFallback,
      source: publicFallback ? "public-web" : "telegram-web",
      ...telegramResult,
      status,
      reason: publicFallback && telegramResult.status === "free"
        ? "Публичная страница Telegram не найдена. Без входа в Telegram API нельзя точно подтвердить, примет ли Telegram это имя."
        : telegramResult.reason,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, OPTIONS",
        "access-control-allow-headers": "content-type",
      });
      res.end();
      return;
    }

    if (url.pathname === "/api/check") {
      try {
        const username = url.searchParams.get("username") || "";
        const clean = username.trim().replace(/^@/, "").toLowerCase();
        const scanned = await scanner.checkTelegramUsername(clean);
        if (
          hasTelegramApiConfig() &&
          [scanner.STATUSES.MAYBE, scanner.STATUSES.UNKNOWN].includes(scanned.status)
        ) {
          const apiResult = normalizeTelegramApiScannerResult(clean, await checkTelegramApiUsername(clean));
          sendJson(res, 200, apiResult || scanned);
          return;
        }
        if (!hasTelegramApiConfig() && [scanner.STATUSES.MAYBE, scanner.STATUSES.UNKNOWN].includes(scanned.status)) {
          sendJson(res, 200, {
            ...scanned,
            reason: `${scanned.reason} Для точного FREE в Telegram нужна авторизация через telegram-login.cmd.`,
            signals: [...(scanned.signals || []), "telegram-api-required"],
          });
          return;
        }
        sendJson(res, 200, scanned);
      } catch (error) {
        sendJson(res, 502, {
          status: scanner.STATUSES.ERROR,
          platform: "telegram",
          confidence: "low",
          checkedAt: new Date().toISOString(),
          reason:
            error.name === "AbortError"
              ? "Telegram took too long to respond."
              : "Could not reach Telegram from this machine.",
        });
      }
      return;
    }

    if (url.pathname === "/api/check-discord") {
      try {
        const username = url.searchParams.get("username") || "";
        const speed = normalizeDiscordSpeed(url.searchParams.get("speed") || "");
        sendJson(res, 200, await scanner.checkDiscordUsername(username, { speed }));
      } catch (error) {
        sendJson(res, 500, {
          status: scanner.STATUSES.ERROR,
          platform: "discord",
          checkedAt: new Date().toISOString(),
          confidence: "low",
          reason: "Could not check Discord username.",
        });
      }
      return;
    }

    if (url.pathname === "/api/check-tiktok") {
      try {
        const username = url.searchParams.get("username") || "";
        sendJson(res, 200, await scanner.checkTikTokUsername(username));
      } catch (error) {
        sendJson(res, 500, {
          status: scanner.STATUSES.ERROR,
          platform: "tiktok",
          checkedAt: new Date().toISOString(),
          confidence: "low",
          reason: "Could not check TikTok username.",
        });
      }
      return;
    }

    if (url.pathname === "/api/save-auto-free") {
      try {
        const username = url.searchParams.get("username") || "";
        sendJson(res, 200, await saveAutoUsername(username));
      } catch (error) {
        sendJson(res, 500, {
          saved: false,
          reason: "Could not save username to disk.",
        });
      }
      return;
    }

    const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(PUBLIC_DIR, safePath);

    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    sendStatic(res, filePath);
  });
}

function listen(port, onReady) {
  const server = createServer();

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < START_PORT + 20) {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      server.close();
      listen(port + 1, onReady);
      return;
    }

    throw error;
  });

  server.listen(port, () => {
    if (onReady) onReady(port, server);
    console.log("");
    console.log("Findsense is running.");
    console.log(`Open http://localhost:${port} in your browser.`);
    console.log("Press Ctrl+C to stop the server.");
    console.log("");
  });
}

if (require.main === module) {
  listen(START_PORT);
}

module.exports = { listen };



