const { STATUSES } = require("./constants/statuses");
const { checkTelegramUsername } = require("./platforms/telegram");
const { checkTikTokUsername } = require("./platforms/tiktok");
const { checkDiscordUsername } = require("./platforms/discord");

module.exports = {
  STATUSES,
  checkTelegramUsername,
  checkTikTokUsername,
  checkDiscordUsername,
};
