const { STATUSES } = require("../constants/statuses");
const { reservedTelegram, reservedTikTok, reservedDiscord } = require("../constants/reserved");
const { localResult, normalizeUsername } = require("../result");

const suspiciousPatterns = [
  /__+/,
  /\.\.+/,
  /[._]{2,}/,
  /_{2,}/,
  /(.)\1{4,}/,
  /^(admin|support|security|official)[._-]?\d*$/,
];

const tiktokForbiddenPatterns = [
  /^[._]/,
  /[._]$/,
  /[._]{2,}/,
  /^\d+$/,
  /tiktok|musically|bytedance/,
  /(.)\1{3,}/,
];

function hasSuspiciousPattern(username) {
  return suspiciousPatterns.some((pattern) => pattern.test(username));
}

function validateTelegram(value) {
  const username = normalizeUsername(value);
  const platform = "telegram";

  if (!username) return localResult(username, platform, STATUSES.INVALID, "Username is empty.");
  if (reservedTelegram.has(username)) return localResult(username, platform, STATUSES.MAYBE, "Reserved-looking Telegram username; server check required.");
  if (!/^[a-z0-9_]+$/.test(username)) {
    return localResult(username, platform, STATUSES.INVALID, "Telegram check allows lowercase a-z, 0-9 and underscore.");
  }
  if (username.length > 64) {
    return localResult(username, platform, STATUSES.INVALID, "Username is too long for a Telegram check.");
  }
  if (username.endsWith("_") || username.includes("__")) {
    return localResult(username, platform, STATUSES.MAYBE, "Telegram may reject this pattern; server check required.");
  }
  if (hasSuspiciousPattern(username)) return localResult(username, platform, STATUSES.MAYBE, "Suspicious pattern; needs network confirmation.");

  return null;
}

function validateTikTok(value) {
  const username = normalizeUsername(value);
  const platform = "tiktok";

  if (!username) return localResult(username, platform, STATUSES.INVALID, "Username is empty.");
  if (reservedTikTok.has(username)) return localResult(username, platform, STATUSES.MAYBE, "Reserved-looking TikTok username; server check required.");
  if (!/^[a-z0-9._]+$/.test(username)) {
    return localResult(username, platform, STATUSES.INVALID, "TikTok allows lowercase a-z, 0-9, dot and underscore.");
  }
  if (username.length > 64) {
    return localResult(username, platform, STATUSES.INVALID, "Username is too long for a TikTok check.");
  }
  if (tiktokForbiddenPatterns.some((pattern) => pattern.test(username))) {
    return localResult(username, platform, STATUSES.MAYBE, "TikTok may reject this pattern; server check required.");
  }
  if (hasSuspiciousPattern(username)) return localResult(username, platform, STATUSES.MAYBE, "Suspicious or restricted-looking TikTok pattern.");

  return null;
}

function validateDiscord(value) {
  const username = normalizeUsername(value);
  const platform = "discord";

  if (!username) return localResult(username, platform, STATUSES.INVALID, "Username is empty.");
  if (reservedDiscord.has(username)) return localResult(username, platform, STATUSES.MAYBE, "Reserved-looking Discord username; server check required.");
  if (!/^[a-z0-9._]+$/.test(username)) return localResult(username, platform, STATUSES.INVALID, "Discord allows lowercase a-z, 0-9, dot and underscore.");
  if (username.length > 64) return localResult(username, platform, STATUSES.INVALID, "Username is too long for a Discord check.");
  if (username.includes("..") || /^\.|_$|^\_|\.$/.test(username)) {
    return localResult(username, platform, STATUSES.MAYBE, "Discord may reject this pattern; server check required.");
  }
  if (hasSuspiciousPattern(username)) return localResult(username, platform, STATUSES.MAYBE, "Suspicious Discord username pattern.");

  return null;
}

module.exports = { validateTelegram, validateTikTok, validateDiscord };
