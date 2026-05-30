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
const TELEGRAM_USERNAME = /^[a-z0-9_]+$/i;
const DISCORD_USERNAME = /^[a-z0-9_.]+$/;
const TIKTOK_USERNAME = /^[a-z0-9_.]+$/;
const USERNAME_BUCKETS = "abcdefghijklmnopqrstuvwxyz0123456789";
const telegramConfig = loadTelegramConfig();

let telegramApiClientPromise = null;
const externalUsernameCache = new Map();
const discordUsernameCache = loadDiscordCache();
const usernameCheckCache = new Map();
const usernameReservations = new Map();
const EXTERNAL_CACHE_TTL_MS = 10 * 60 * 1000;
const USERNAME_CHECK_CACHE_TTL_MS = 20 * 1000;
const USERNAME_RESERVATION_TTL_MS = 60 * 1000;
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
    [...USERNAME_BUCKETS].map((letter) => fs.promises.mkdir(path.join(AUTO_OUTPUT_DIR, letter), { recursive: true })),
  );
}

async function saveAutoUsername(username) {
  const clean = username.trim().replace(/^@/, "").toLowerCase();
  const finalResult = await checkPlatformUsername("telegram", clean, { final: true });
  if (finalResult.status !== "available") {
    return {
      saved: false,
      status: finalResult.rawStatus || finalResult.status,
      reason: finalResult.reason || "Username is not confirmed as free.",
    };
  }

  const firstLetter = clean[0];
  if (!USERNAME_BUCKETS.includes(firstLetter)) {
    return {
      saved: false,
      reason: "Username cannot be saved into a local bucket.",
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
  if (!value) return "Username is empty.";
  if (!/^[a-z0-9_]+$/i.test(value)) return "Use only letters, numbers, and underscores.";
  if (value.length > 64) return "Username is too long.";
  return "";
}

function checkTelegramUsernameValidity(username) {
  const clean = username.trim().replace(/^@/, "").toLowerCase();
  const reason = getUsernameValidationReason(clean);

  if (reason) {
    return {
      valid: false,
      status: "invalid",
      confidence: "high",
      reason,
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
  if (!value) return "Username is empty.";
  if (!DISCORD_USERNAME.test(value)) return "Можно использовать только a-z, 0-9, _ и точку.";
  if (value.length > 64) return "Username is too long.";
  return "";
}

function getTikTokUsernameValidationReason(value) {
  if (!value) return "Username is empty.";
  if (!TIKTOK_USERNAME.test(value)) return "Можно использовать только a-z, 0-9, _ и точку.";
  if (value.length > 64) return "Username is too long.";
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

function normalizePlatform(value) {
  const platform = String(value || "telegram").trim().toLowerCase();
  return ["telegram", "discord", "tiktok"].includes(platform) ? platform : "telegram";
}

function normalizeUsernameForPlatform(platform, username) {
  const clean = String(username || "").trim().replace(/^@/, "").toLowerCase();
  if (platform === "discord") return clean.replace(/\s+/g, "");
  return clean;
}

function getPlatformValidationReason(platform, username) {
  if (platform === "discord") return getDiscordUsernameValidationReason(username);
  if (platform === "tiktok") return getTikTokUsernameValidationReason(username);
  return getUsernameValidationReason(username);
}

function toGenericUsernameStatus(status) {
  if (status === scanner.STATUSES.FREE) return "available";
  if (status === scanner.STATUSES.TAKEN) return "taken";
  if (status === scanner.STATUSES.INVALID) return "invalid";
  if (status === scanner.STATUSES.RESERVED) return "reserved";
  return "unknown";
}

function toGenericUsernameResult(platform, username, result, options = {}) {
  const status = toGenericUsernameStatus(result?.status);
  return {
    username,
    platform,
    status,
    rawStatus: result?.status || scanner.STATUSES.UNKNOWN,
    reason: result?.reason || (status === "unknown" ? "Unable to verify username right now." : ""),
    checkedAt: result?.checkedAt || new Date().toISOString(),
    final: Boolean(options.final),
    source: result?.source || result?.parserResult?.parser || platform,
    confidence: result?.confidence || "medium",
    retryAfterMs: result?.retryAfterMs || null,
    link: result?.link || null,
  };
}

function getUsernameCacheKey(platform, username, options = {}) {
  const fragment = options.fragment ? "fragment" : "plain";
  const speed = options.speed || "";
  return `${platform}:${username}:${fragment}:${speed}`;
}

function readUsernameCache(key) {
  const cached = usernameCheckCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.at > USERNAME_CHECK_CACHE_TTL_MS) {
    usernameCheckCache.delete(key);
    return null;
  }
  return cached.value;
}

function writeUsernameCache(key, value) {
  usernameCheckCache.set(key, { at: Date.now(), value });
}

async function runPlatformScanner(platform, username, options = {}) {
  if (platform === "discord") {
    const speed = normalizeDiscordSpeed(options.speed || "fast");
    return scanner.checkDiscordUsername(username, { speed });
  }

  if (platform === "tiktok") {
    return scanner.checkTikTokUsername(username);
  }

  const scanned = await scanner.checkTelegramUsername(username, {
    fragment: options.fragment === true,
  });

  if (
    hasTelegramApiConfig() &&
    [scanner.STATUSES.MAYBE, scanner.STATUSES.UNKNOWN].includes(scanned.status)
  ) {
    const apiResult = normalizeTelegramApiScannerResult(username, await checkTelegramApiUsername(username));
    return apiResult || scanned;
  }

  if (!hasTelegramApiConfig() && [scanner.STATUSES.MAYBE, scanner.STATUSES.UNKNOWN].includes(scanned.status)) {
    return {
      ...scanned,
      reason: `${scanned.reason} Для точного FREE в Telegram нужна авторизация через telegram-login.cmd.`,
      signals: [...(scanned.signals || []), "telegram-api-required"],
    };
  }

  return scanned;
}

async function checkPlatformUsername(platformValue, usernameValue, options = {}) {
  const platform = normalizePlatform(platformValue);
  const username = normalizeUsernameForPlatform(platform, usernameValue);
  const reason = getPlatformValidationReason(platform, username);

  if (reason) {
    return {
      username,
      platform,
      status: "invalid",
      rawStatus: scanner.STATUSES.INVALID,
      reason,
      checkedAt: new Date().toISOString(),
      final: Boolean(options.final),
      source: "server-validation",
      confidence: "high",
      retryAfterMs: null,
      link: null,
    };
  }

  const cacheKey = getUsernameCacheKey(platform, username, options);
  if (!options.final) {
    const cached = readUsernameCache(cacheKey);
    if (cached) return { ...cached, cached: true };
  }

  const scanned = await runPlatformScanner(platform, username, options);
  const result = toGenericUsernameResult(platform, username, scanned, options);
  if (!options.final) writeUsernameCache(cacheKey, result);
  return result;
}

function cleanupReservations() {
  const now = Date.now();
  for (const [key, reservation] of usernameReservations.entries()) {
    if (reservation.expiresAt <= now) usernameReservations.delete(key);
  }
}

function generateUsernameSuggestions(platform, username) {
  const base = username.replace(/[^a-z0-9_.]/g, "").replace(/^[._]+|[._]+$/g, "");
  const root = base || "user";
  const compact = root.replace(/[._]/g, "");
  const short = compact.slice(0, Math.max(2, Math.min(8, compact.length)));
  const vowels = compact.replace(/[aeiou]/g, "");
  const random = () => String(Math.floor(Math.random() * 9999) + 1);
  const variants = new Set();

  [root, compact, short, vowels].filter(Boolean).forEach((item) => {
    variants.add(`${item}${random()}`);
    variants.add(`${item}_${random()}`);
    variants.add(`${item}${Math.floor(Math.random() * 99) + 1}`);
    if (platform !== "telegram") variants.add(`${item}.${random()}`);
    if (item.length > 3) variants.add(item.slice(0, -1));
  });

  [
    ["a", "x"],
    ["o", "0"],
    ["i", "y"],
    ["e", "3"],
    ["s", "z"],
  ].forEach(([from, to]) => {
    if (compact.includes(from)) variants.add(compact.replace(new RegExp(from, "g"), to));
  });

  if (platform === "tiktok") {
    variants.add(`${short}vibe${random().slice(0, 2)}`);
    variants.add(`${short}x${random().slice(0, 3)}`);
  } else if (platform === "discord") {
    variants.add(`${short}_dev`);
    variants.add(`${short}_hq`);
  } else {
    variants.add(`${short}_app`);
    variants.add(`${short}_go`);
  }

  return [...variants]
    .map((value) => normalizeUsernameForPlatform(platform, value))
    .filter((value) => value && !getPlatformValidationReason(platform, value) && value !== username)
    .slice(0, 36);
}

async function suggestPlatformUsernames(platformValue, usernameValue) {
  const platform = normalizePlatform(platformValue);
  const username = normalizeUsernameForPlatform(platform, usernameValue);
  const candidates = generateUsernameSuggestions(platform, username);
  const suggestions = [];

  for (const candidate of candidates) {
    if (suggestions.length >= 12) break;
    try {
      const result = await checkPlatformUsername(platform, candidate, {
        speed: "fast",
        fragment: platform === "telegram",
      });
      if (result.status === "available") suggestions.push(result);
    } catch (error) {
      // Suggestion checks are best-effort; the main username check remains authoritative.
    }
  }

  return {
    username,
    platform,
    suggestions,
    count: suggestions.length,
  };
}

async function reservePlatformUsername(platformValue, usernameValue) {
  cleanupReservations();
  const platform = normalizePlatform(platformValue);
  const username = normalizeUsernameForPlatform(platform, usernameValue);
  const key = `${platform}:${username}`;
  const existing = usernameReservations.get(key);
  const now = Date.now();

  if (existing && existing.expiresAt > now) {
    return {
      reserved: false,
      username,
      platform,
      status: "reserved",
      reason: "Username is already temporarily reserved.",
      expiresAt: new Date(existing.expiresAt).toISOString(),
    };
  }

  const finalCheck = await checkPlatformUsername(platform, username, { final: true, fragment: true, speed: "fast" });
  if (finalCheck.status !== "available") {
    return {
      reserved: false,
      ...finalCheck,
    };
  }

  const reservationId = `${platform}-${username}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const expiresAt = now + USERNAME_RESERVATION_TTL_MS;
  usernameReservations.set(key, { reservationId, expiresAt });

  return {
    reserved: true,
    username,
    platform,
    status: "available",
    reservationId,
    expiresAt: new Date(expiresAt).toISOString(),
    ttlMs: USERNAME_RESERVATION_TTL_MS,
  };
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

    if (url.pathname === "/api/check-username" || url.pathname === "/api/checkUsername") {
      try {
        const platform = normalizePlatform(url.searchParams.get("platform"));
        const username = url.searchParams.get("username") || "";
        const result = await checkPlatformUsername(platform, username, {
          fragment: url.searchParams.get("fragment") === "1",
          speed: url.searchParams.get("speed") || "fast",
        });
        sendJson(res, 200, result);
      } catch (error) {
        sendJson(res, 502, {
          status: "unknown",
          reason: "Unable to verify username, try again.",
          checkedAt: new Date().toISOString(),
        });
      }
      return;
    }

    if (url.pathname === "/api/final-check-username" || url.pathname === "/api/finalCheckUsername") {
      try {
        const platform = normalizePlatform(url.searchParams.get("platform"));
        const username = url.searchParams.get("username") || "";
        const result = await checkPlatformUsername(platform, username, {
          final: true,
          fragment: true,
          speed: url.searchParams.get("speed") || "fast",
        });
        sendJson(res, 200, result);
      } catch (error) {
        sendJson(res, 502, {
          status: "unknown",
          reason: "Unable to complete final username verification.",
          checkedAt: new Date().toISOString(),
        });
      }
      return;
    }

    if (url.pathname === "/api/suggest-usernames" || url.pathname === "/api/suggestUsernames") {
      try {
        const platform = normalizePlatform(url.searchParams.get("platform"));
        const username = url.searchParams.get("username") || "";
        sendJson(res, 200, await suggestPlatformUsernames(platform, username));
      } catch (error) {
        sendJson(res, 502, {
          platform: normalizePlatform(url.searchParams.get("platform")),
          suggestions: [],
          reason: "Unable to build username suggestions right now.",
        });
      }
      return;
    }

    if (url.pathname === "/api/reserve-username" || url.pathname === "/api/reserveUsername") {
      try {
        const platform = normalizePlatform(url.searchParams.get("platform"));
        const username = url.searchParams.get("username") || "";
        const result = await reservePlatformUsername(platform, username);
        sendJson(res, result.reserved ? 200 : 409, result);
      } catch (error) {
        sendJson(res, 502, {
          reserved: false,
          status: "unknown",
          reason: "Unable to reserve username right now.",
        });
      }
      return;
    }

    if (url.pathname === "/api/check") {
      try {
        const username = url.searchParams.get("username") || "";
        const clean = username.trim().replace(/^@/, "").toLowerCase();
        const scanned = await scanner.checkTelegramUsername(clean, {
          fragment: url.searchParams.get("fragment") === "1",
        });
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



