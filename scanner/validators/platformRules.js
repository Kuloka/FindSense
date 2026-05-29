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
  if (reservedTelegram.has(username)) return localResult(username, platform, STATUSES.RESERVED, "Telegram reserved/system username.");
  if (username.length < 5 || username.length > 32) {
    return localResult(username, platform, STATUSES.INVALID, "Telegram username must be 5-32 characters.");
  }
  if (!/^[a-z][a-z0-9_]*$/.test(username)) {
    return localResult(username, platform, STATUSES.INVALID, "Telegram allows lowercase a-z, 0-9, underscore and must start with a letter.");
  }
  if (username.startsWith("_") || username.endsWith("_")) {
    return localResult(username, platform, STATUSES.INVALID, "Telegram username cannot start or end with underscore.");
  }
  if (username.includes("__")) return localResult(username, platform, STATUSES.INVALID, "Telegram username cannot contain double underscore.");
  if (hasSuspiciousPattern(username)) return localResult(username, platform, STATUSES.MAYBE, "Suspicious pattern; needs network confirmation.");

  return null;
}

function validateTikTok(value) {
  const username = normalizeUsername(value);
  const platform = "tiktok";

  if (!username) return localResult(username, platform, STATUSES.INVALID, "Username is empty.");
  if (reservedTikTok.has(username)) return localResult(username, platform, STATUSES.RESERVED, "TikTok reserved/system username.");
  if (username.length < 2 || username.length > 24) {
    return localResult(username, platform, STATUSES.INVALID, "TikTok username must be 2-24 characters.");
  }
  if (!/^[a-z0-9._]+$/.test(username)) {
    return localResult(username, platform, STATUSES.INVALID, "TikTok allows lowercase a-z, 0-9, dot and underscore.");
  }
  if (tiktokForbiddenPatterns.some((pattern) => pattern.test(username))) {
    return localResult(username, platform, STATUSES.INVALID, "TikTok username contains a forbidden or unusable pattern.");
  }
  if (hasSuspiciousPattern(username)) return localResult(username, platform, STATUSES.MAYBE, "Suspicious or restricted-looking TikTok pattern.");

  return null;
}

function validateDiscord(value) {
  const username = normalizeUsername(value);
  const platform = "discord";

  if (!username) return localResult(username, platform, STATUSES.INVALID, "Username is empty.");
  if (reservedDiscord.has(username)) return localResult(username, platform, STATUSES.RESERVED, "Discord reserved/system username.");
  if (username.length < 2 || username.length > 32) return localResult(username, platform, STATUSES.INVALID, "Discord username must be 2-32 characters.");
  if (username !== username.toLowerCase()) return localResult(username, platform, STATUSES.INVALID, "Discord usernames must be lowercase.");
  if (!/^[a-z0-9._]+$/.test(username)) return localResult(username, platform, STATUSES.INVALID, "Discord allows lowercase a-z, 0-9, dot and underscore.");
  if (username.includes("..")) return localResult(username, platform, STATUSES.INVALID, "Discord username cannot contain consecutive dots.");
  if (/^\.|_$|^\_|\.$/.test(username)) return localResult(username, platform, STATUSES.INVALID, "Discord username cannot start/end with dot or underscore.");
  if (hasSuspiciousPattern(username)) return localResult(username, platform, STATUSES.MAYBE, "Suspicious Discord username pattern.");

  return null;
}

module.exports = { validateTelegram, validateTikTok, validateDiscord };
