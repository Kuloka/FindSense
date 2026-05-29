const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const CONFIG_PATH = path.join(__dirname, "telegram-config.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  let existing = {};

  try {
    existing = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const apiId = Number(await ask(`Telegram api_id${existing.apiId ? ` [${existing.apiId}]` : ""}: `)) || existing.apiId;
  const apiHash = await ask(`Telegram api_hash${existing.apiHash ? " [saved]" : ""}: `) || existing.apiHash;
  const phoneNumber = await ask("Phone number with country code, for example +79991234567: ");

  if (!apiId || !apiHash || !phoneNumber) {
    throw new Error("api_id, api_hash, and phone number are required.");
  }

  const client = new TelegramClient(new StringSession(existing.session || ""), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => phoneNumber,
    phoneCode: async () => ask("Code from Telegram: "),
    password: async () => ask("2FA password, if Telegram asks for it: "),
    onError: (error) => console.error(error.message || error),
  });

  const session = client.session.save();
  fs.writeFileSync(
    CONFIG_PATH,
    `${JSON.stringify({ apiId, apiHash, session }, null, 2)}\n`,
    "utf8",
  );

  console.log("");
  console.log("Telegram API session saved to telegram-config.json.");
  console.log("Restart Findsense so username checks use Telegram API.");

  await client.disconnect();
}

main()
  .catch((error) => {
    console.error("");
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
