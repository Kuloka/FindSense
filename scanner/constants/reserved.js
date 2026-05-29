const reservedTelegram = new Set([
  "telegram", "admin", "support", "security", "help", "privacy", "terms", "abuse",
  "bot", "bots", "channel", "channels", "group", "groups", "settings", "login",
  "wallet", "premium", "fragment", "ton", "username", "usernames", "spam",
]);

const reservedTikTok = new Set([
  "tiktok", "admin", "support", "security", "help", "privacy", "terms", "abuse",
  "live", "music", "discover", "following", "followers", "messages", "login",
  "signup", "verify", "verified", "moderator", "ads", "business",
]);

const reservedDiscord = new Set([
  "discord", "admin", "support", "security", "help", "privacy", "terms", "abuse",
  "system", "mod", "moderator", "staff", "everyone", "here", "nitro", "billing",
  "trustandsafety", "safety", "login", "developers",
]);

module.exports = { reservedTelegram, reservedTikTok, reservedDiscord };
