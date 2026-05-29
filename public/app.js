const form = document.querySelector("#generatorForm");
const results = document.querySelector("#results");
const freeResults = document.querySelector("#freeResults");
const runState = document.querySelector("#runState");
const freeState = document.querySelector("#freeState");
const viewSubtitle = document.querySelector("#viewSubtitle");
const checkAllButton = document.querySelector("#checkAll");
const autoModeButton = document.querySelector("#autoMode");
const autoState = document.querySelector("#autoState");
const autoFreeList = document.querySelector("#autoFreeList");
const clearAutoFreeButton = document.querySelector("#clearAutoFree");
const checkManualButton = document.querySelector("#checkManual");
const manualUsername = document.querySelector("#manualUsername");
const checkFragmentButton = document.querySelector("#checkFragment");
const fragmentInput = document.querySelector("#fragmentInput");
const copyFreeButton = document.querySelector("#copyFree");
const copyExportButton = document.querySelector("#copyExport");
const refreshExportButton = document.querySelector("#refreshExport");
const exportText = document.querySelector("#exportText");
const toast = document.querySelector("#toast");
const watermark = document.querySelector("#watermark");
const discordForm = document.querySelector("#discordForm");
const discordResults = document.querySelector("#discordResults");
const discordRunState = document.querySelector("#discordRunState");
const discordCheckAllButton = document.querySelector("#discordCheckAll");
const discordAutoModeButton = document.querySelector("#discordAutoMode");
const discordCheckManualButton = document.querySelector("#discordCheckManual");
const discordManualUsername = document.querySelector("#discordManualUsername");
const discordFreeList = document.querySelector("#discordFreeList");
const discordFreeState = document.querySelector("#discordFreeState");
const tiktokForm = document.querySelector("#tiktokForm");
const tiktokResults = document.querySelector("#tiktokResults");
const tiktokRunState = document.querySelector("#tiktokRunState");
const tiktokCheckAllButton = document.querySelector("#tiktokCheckAll");
const tiktokAutoModeButton = document.querySelector("#tiktokAutoMode");
const tiktokCheckManualButton = document.querySelector("#tiktokCheckManual");
const tiktokManualUsername = document.querySelector("#tiktokManualUsername");
const tiktokFreeList = document.querySelector("#tiktokFreeList");
const tiktokFreeState = document.querySelector("#tiktokFreeState");
const settingAutoStart = document.querySelector("#settingAutoStart");
const settingExternalCheck = document.querySelector("#settingExternalCheck");
const settingCompactMode = document.querySelector("#settingCompactMode");
const settingLogoMotion = document.querySelector("#settingLogoMotion");
const settingWatermark = document.querySelector("#settingWatermark");
const brandMark = document.querySelector(".brand-mark");
const pyramidScene = document.querySelector(".pyramid-scene");

const totalCount = document.querySelector("#totalCount");
const freeCount = document.querySelector("#freeCount");
const takenCount = document.querySelector("#takenCount");
const discordTotalCount = document.querySelector("#discordTotalCount");
const discordFreeCount = document.querySelector("#discordFreeCount");
const discordTakenCount = document.querySelector("#discordTakenCount");
const tiktokTotalCount = document.querySelector("#tiktokTotalCount");
const tiktokFreeCount = document.querySelector("#tiktokFreeCount");
const tiktokTakenCount = document.querySelector("#tiktokTakenCount");

const state = {
  items: [],
  checked: new Map(),
  generatedByConfig: new Map(),
  autoFree: new Map(),
  savedAutoFree: new Set(),
  discordFree: new Map(),
  tiktokFree: new Map(),
  discordItems: [],
  discordGeneratedByConfig: new Map(),
  tiktokItems: [],
  tiktokGeneratedByConfig: new Map(),
  autoRunning: false,
  discordAutoRunning: false,
  tiktokAutoRunning: false,
  activeView: "search",
};

const alphabets = {
  clean: "aeiourstlnmkvz",
  compact: "abcdefghijklmnopqrstuvwxyz",
  numbers: "abcdefghijklmnopqrstuvwxyz0123456789",
  discord: "abcdefghijklmnopqrstuvwxyz0123456789._",
  social: "abcdefghijklmnopqrstuvwxyz0123456789._",
};

const englishWordUsernames = [
  "abide",
  "abloom",
  "acacia",
  "acumen",
  "adagio",
  "aerial",
  "aerie",
  "affix",
  "aglow",
  "aileron",
  "alchemy",
  "alcove",
  "alder",
  "alight",
  "alpenglow",
  "amaranth",
  "amber",
  "amity",
  "anise",
  "anvil",
  "apricot",
  "arcane",
  "ardent",
  "argent",
  "aria",
  "arbor",
  "arcadia",
  "ashen",
  "aster",
  "atlas",
  "auric",
  "aurora",
  "autumn",
  "azalea",
  "banyan",
  "barley",
  "basil",
  "beacon",
  "beryl",
  "birch",
  "blithe",
  "bloom",
  "bracken",
  "bramble",
  "brisk",
  "briar",
  "brook",
  "cairn",
  "calyx",
  "canary",
  "canto",
  "cedar",
  "cerulean",
  "chime",
  "cinder",
  "citrine",
  "claret",
  "clover",
  "cobalt",
  "comet",
  "copse",
  "coral",
  "cosmic",
  "cove",
  "crux",
  "cygnet",
  "dahlia",
  "dapper",
  "dawn",
  "dovetail",
  "drift",
  "dusky",
  "easel",
  "echo",
  "effigy",
  "ember",
  "emblem",
  "enamel",
  "equinox",
  "ermine",
  "ether",
  "evergreen",
  "fable",
  "fallow",
  "fathom",
  "felicity",
  "fennec",
  "fennel",
  "feral",
  "ferns",
  "fervor",
  "flint",
  "floret",
  "forage",
  "forge",
  "fresco",
  "garnet",
  "gossamer",
  "grove",
  "halcyon",
  "harbor",
  "hazel",
  "hearth",
  "helios",
  "heron",
  "hollow",
  "horizon",
  "indigo",
  "iris",
  "islet",
  "ivory",
  "jasmine",
  "jasper",
  "juniper",
  "keystone",
  "kindle",
  "lattice",
  "laurel",
  "lichen",
  "lilac",
  "linen",
  "lumen",
  "lunar",
  "lyric",
  "marble",
  "marigold",
  "meadow",
  "meridian",
  "mirth",
  "misty",
  "mosaic",
  "myriad",
  "nectar",
  "nimble",
  "nocturne",
  "nomad",
  "nova",
  "ochre",
  "onyx",
  "opal",
  "oracle",
  "orchid",
  "origin",
  "osprey",
  "palisade",
  "paragon",
  "pebble",
  "petal",
  "pinnacle",
  "plume",
  "prairie",
  "quartz",
  "quill",
  "raven",
  "relic",
  "riddle",
  "ripple",
  "rivet",
  "sable",
  "saffron",
  "sage",
  "serein",
  "serene",
  "shale",
  "silken",
  "solace",
  "solstice",
  "sonnet",
  "sorrel",
  "spire",
  "spruce",
  "sterling",
  "summit",
  "sundial",
  "tallow",
  "tangerine",
  "thistle",
  "topaz",
  "trill",
  "umbra",
  "vale",
  "velvet",
  "vernal",
  "violet",
  "vista",
  "wisp",
  "wisteria",
  "yarrow",
  "zephyr",
  "zenith",
].map((word) => word.toLowerCase()).filter((word) => /^[a-z]{5,32}$/.test(word));

const brandCelebrityUsernames = [
  "adidas",
  "airbnb",
  "amazon",
  "android",
  "apple",
  "armani",
  "astonmartin",
  "audi",
  "balenciaga",
  "barbie",
  "bentley",
  "binance",
  "bitcoin",
  "boeing",
  "bugatti",
  "burberry",
  "cadillac",
  "cartier",
  "chanel",
  "chatgpt",
  "chevrolet",
  "cocacola",
  "coinbase",
  "converse",
  "corvette",
  "dior",
  "discord",
  "disney",
  "dolcegabbana",
  "dropbox",
  "facebook",
  "ferrari",
  "fiverr",
  "forbes",
  "google",
  "gucci",
  "harvard",
  "hbo",
  "honda",
  "hyundai",
  "instagram",
  "jaguar",
  "jeep",
  "jordan",
  "lamborghini",
  "lenovo",
  "lexus",
  "linkedin",
  "louisvuitton",
  "mastercard",
  "mcdonalds",
  "mercedes",
  "microsoft",
  "netflix",
  "nike",
  "nintendo",
  "nvidia",
  "oracle",
  "paypal",
  "pepsi",
  "pinterest",
  "playstation",
  "porsche",
  "prada",
  "reddit",
  "reebok",
  "rolex",
  "samsung",
  "shopify",
  "skype",
  "snapchat",
  "sony",
  "spacex",
  "spotify",
  "starbucks",
  "stripe",
  "subway",
  "supreme",
  "telegram",
  "tesla",
  "tiktok",
  "toyota",
  "twitch",
  "twitter",
  "uber",
  "versace",
  "visa",
  "volkswagen",
  "youtube",
  "zendesk",
  "zendaya",
  "beyonce",
  "billieeilish",
  "bradpitt",
  "cristiano",
  "drake",
  "dualipa",
  "elonmusk",
  "eminem",
  "jennie",
  "justinbieber",
  "kanyewest",
  "katyperry",
  "keanureeves",
  "kimkardashian",
  "leomessi",
  "madonna",
  "messi",
  "mrbeast",
  "neymar",
  "rihanna",
  "ronaldo",
  "selenagomez",
  "shakira",
  "taylorswift",
  "theweeknd",
  "zendaya",
  "acer",
  "adobe",
  "amd",
  "asus",
  "bbc",
  "bmw",
  "bosch",
  "calvin",
  "canon",
  "capcom",
  "casio",
  "cisco",
  "citroen",
  "cnn",
  "coursera",
  "crocs",
  "dell",
  "doordash",
  "ea",
  "ebay",
  "epicgames",
  "fedex",
  "figma",
  "ford",
  "gopro",
  "hermes",
  "hilton",
  "hp",
  "ibm",
  "ikea",
  "intel",
  "kia",
  "kodak",
  "lacoste",
  "logitech",
  "mazda",
  "meta",
  "miami",
  "mitsubishi",
  "mozilla",
  "msi",
  "nasa",
  "nestle",
  "newbalance",
  "nissan",
  "nokia",
  "notion",
  "opel",
  "openai",
  "paramount",
  "patagonia",
  "pixar",
  "puma",
  "quora",
  "renault",
  "rollsroyce",
  "salesforce",
  "sega",
  "shell",
  "siemens",
  "slack",
  "soundcloud",
  "steam",
  "swatch",
  "target",
  "tinder",
  "tumblr",
  "uniqlo",
  "valve",
  "vans",
  "verizon",
  "viber",
  "vimeo",
  "walmart",
  "whatsapp",
  "wikipedia",
  "wordpress",
  "yahoo",
  "yamaha",
  "zara",
  "zoom",
  "adele",
  "arianagrande",
  "badbunny",
  "bellahadid",
  "brunomars",
  "cardib",
  "charlidamelio",
  "dojacat",
  "edsheeran",
  "gigi",
  "gigihadid",
  "haileybieber",
  "harrystyles",
  "jackiechan",
  "jlo",
  "johnnydepp",
  "kendalljenner",
  "kyliejenner",
  "ladygaga",
  "lebronjames",
  "mileycyrus",
  "nickiminaj",
  "oprah",
  "postmalone",
  "snoopdogg",
  "tomcruise",
  "travisscott",
  "willowsmith",
  "zayn",
  "adidasoriginals",
  "aliexpress",
  "alibaba",
  "allianz",
  "americanexpress",
  "americanairlines",
  "atari",
  "atlassian",
  "baidu",
  "balmain",
  "bankofamerica",
  "bbcnews",
  "blackberry",
  "blizzard",
  "booking",
  "bookingcom",
  "budweiser",
  "bulgari",
  "burgerking",
  "byd",
  "canva",
  "carhartt",
  "cartoonnetwork",
  "champion",
  "chipotle",
  "chromium",
  "cloudflare",
  "cnnnews",
  "costco",
  "deezer",
  "deliveryhero",
  "dhl",
  "dominos",
  "drmartens",
  "dreamworks",
  "ducati",
  "duolingo",
  "dyson",
  "electronicarts",
  "etsy",
  "evernote",
  "expedia",
  "fendi",
  "fila",
  "firefox",
  "fortnite",
  "garmin",
  "github",
  "gitlab",
  "givenchy",
  "gmail",
  "godaddy",
  "goldmansachs",
  "grammarly",
  "hackernews",
  "heineken",
  "honor",
  "huawei",
  "imdb",
  "infiniti",
  "invision",
  "jbl",
  "kfc",
  "kickstarter",
  "konami",
  "kpmg",
  "kraken",
  "lego",
  "lime",
  "linux",
  "loreal",
  "lyft",
  "mailchimp",
  "marriott",
  "maserati",
  "maybelline",
  "mcdonald",
  "medium",
  "merck",
  "minecraft",
  "miniclip",
  "monster",
  "motogp",
  "nasdaq",
  "nba",
  "nbc",
  "nfl",
  "nhl",
  "nickelodeon",
  "olympics",
  "panasonic",
  "papa_johns",
  "philips",
  "pizzahut",
  "pubg",
  "qualcomm",
  "quickbooks",
  "rakuten",
  "redbull",
  "roblox",
  "rockstar",
  "safari",
  "salesforce",
  "sap",
  "schweppes",
  "scribd",
  "sephora",
  "shazam",
  "shein",
  "skoda",
  "slideshare",
  "snap",
  "softbank",
  "stackoverflow",
  "subaru",
  "suzuki",
  "swarovski",
  "taco_bell",
  "tedtalks",
  "texaco",
  "threads",
  "tissot",
  "tripadvisor",
  "twilio",
  "ubuntu",
  "udemy",
  "uefa",
  "unity",
  "unrealengine",
  "ups",
  "usps",
  "vogue",
  "volvo",
  "warnerbros",
  "wechat",
  "weibo",
  "wellsfargo",
  "xbox",
  "xiaomi",
  "yandex",
  "yeezy",
  "zalando",
  "zillow",
  "atlanta",
  "austin",
  "berlin",
  "boston",
  "brooklyn",
  "chicago",
  "dallas",
  "dubai",
  "florida",
  "houston",
  "london",
  "miami",
  "moscow",
  "newyork",
  "paris",
  "seattle",
  "sydney",
  "tokyo",
  "toronto",
  "vegas",
  "aishwarya",
  "angelinajolie",
  "billgates",
  "britneyspears",
  "chrisbrown",
  "davidbeckham",
  "djokovic",
  "dwaynejohnson",
  "emmawatson",
  "greta",
  "jackma",
  "jeffbezos",
  "jungkook",
  "karolg",
  "leonardo",
  "markzuckerberg",
  "miketyson",
  "modi",
  "obama",
  "pewdiepie",
  "putin",
  "scarlett",
  "stevejobs",
  "trump",
  "viratkohli",
  "willsmith",
  "zuckerberg",
];

const brandCelebritySuffixes = [
  "hq",
  "vip",
  "pro",
  "app",
  "club",
  "fans",
  "news",
  "daily",
  "world",
  "media",
  "team",
  "real",
  "live",
  "global",
  "online",
  "official",
  "tv",
  "fm",
  "ai",
  "go",
  "io",
  "bot",
  "hub",
  "lab",
  "now",
  "usa",
  "uk",
  "eu",
  "one",
  "top",
  "plus",
  "store",
  "space",
  "planet",
  "studio",
  "network",
];

const brandCelebrityPrefixes = [
  "real",
  "the",
  "team",
  "daily",
  "official",
  "my",
  "go",
  "get",
  "new",
  "best",
  "top",
];

const brandCelebrityNumberSuffixes = [
  "1",
  "24",
  "247",
  "365",
  "360",
  "101",
  "2024",
  "2025",
  "2026",
];

const brandCelebrityPool = buildNameVariantPool(brandCelebrityUsernames);

const viewLabels = {
  search: "Short username scanner",
  discord: "Поиск Discord username",
  tiktok: "Поиск TikTok username",
  free: "Available usernames",
  export: "Copy results",
  settings: "Настройки FINDSENSE",
  about: "About Findsense",
};

const SETTINGS_KEY = "findsense.settings.v1";
const AUTO_FREE_STORAGE_KEY = "findsense.autoFree.v1";
const settings = loadSettings();

function loadSettings() {
  try {
    return {
      autoStart: false,
      externalCheck: false,
      compactMode: false,
      logoMotion: true,
      watermark: true,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"),
    };
  } catch (error) {
    return {
      autoStart: false,
      externalCheck: false,
      compactMode: false,
      logoMotion: true,
      watermark: true,
    };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadAutoFreeStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(AUTO_FREE_STORAGE_KEY) || "{}");
    const items = Array.isArray(data.items) ? data.items : [];
    const discordItems = Array.isArray(data.discordItems) ? data.discordItems : [];
    const tiktokItems = Array.isArray(data.tiktokItems) ? data.tiktokItems : [];
    state.autoFree = new Map(
      items
        .filter((item) => item?.username)
        .map((item) => [item.username, item]),
    );
    state.discordFree = new Map(
      discordItems
        .filter((item) => item?.username)
        .map((item) => [item.username, item]),
    );
    state.tiktokFree = new Map(
      tiktokItems
        .filter((item) => item?.username)
        .map((item) => [item.username, item]),
    );
    state.savedAutoFree = new Set(Array.isArray(data.saved) ? data.saved : []);
  } catch (error) {
    state.autoFree = new Map();
    state.discordFree = new Map();
    state.tiktokFree = new Map();
    state.savedAutoFree = new Set();
  }
}

function saveAutoFreeStorage() {
  localStorage.setItem(
    AUTO_FREE_STORAGE_KEY,
    JSON.stringify({
      items: [...state.autoFree.values()],
      discordItems: [...state.discordFree.values()],
      tiktokItems: [...state.tiktokFree.values()],
      saved: [...state.savedAutoFree],
    }),
  );
}

function applySettings() {
  if (settingAutoStart) settingAutoStart.checked = Boolean(settings.autoStart);
  if (settingExternalCheck) settingExternalCheck.checked = Boolean(settings.externalCheck);
  if (settingCompactMode) settingCompactMode.checked = Boolean(settings.compactMode);
  if (settingLogoMotion) settingLogoMotion.checked = settings.logoMotion !== false;
  if (settingWatermark) settingWatermark.checked = settings.watermark !== false;

  const externalCheck = document.querySelector("#externalCheck");
  if (externalCheck) externalCheck.checked = Boolean(settings.externalCheck);

  document.body.classList.toggle("compact-mode", Boolean(settings.compactMode));
  document.body.classList.toggle("no-logo-motion", settings.logoMotion === false);
  document.body.classList.toggle("hide-watermark", settings.watermark === false);
}

function bindSetting(input, key, afterChange) {
  if (!input) return;
  input.addEventListener("change", () => {
    settings[key] = input.checked;
    saveSettings();
    applySettings();
    afterChange?.();
  });
}

function bindPyramidMotion() {
  if (!brandMark || !pyramidScene) return;

  brandMark.addEventListener("pointermove", (event) => {
    if (settings.logoMotion === false) return;
    const rect = brandMark.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    const rotateY = 10 + x * 34;
    const rotateX = -7 - y * 28;

    pyramidScene.style.setProperty("--pyramid-rot-x", `${rotateX.toFixed(2)}deg`);
    pyramidScene.style.setProperty("--pyramid-rot-y", `${rotateY.toFixed(2)}deg`);
  });

  brandMark.addEventListener("pointerleave", () => {
    pyramidScene.style.setProperty("--pyramid-rot-x", "-7deg");
    pyramidScene.style.setProperty("--pyramid-rot-y", "10deg");
  });
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1400);
}

function setWatermark(text) {
  if (settings.watermark === false) return;
  const time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  watermark.textContent = `findsense | ${text} | ${time}`;
}

function sanitizePrefix(value) {
  return value
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9_]/g, "");
}

function normalizeManualUsername(value) {
  return value.trim().toLowerCase().replace(/^@/, "");
}

function normalizeNameSeed(value) {
  return sanitizePrefix(value).replace(/_/g, "");
}

function buildNameVariantPool(seeds) {
  const pool = new Set();
  const normalizedSeeds = seeds.map(normalizeNameSeed).filter(Boolean);

  normalizedSeeds.forEach((name) => {
    pool.add(name);

    brandCelebritySuffixes.forEach((suffix) => {
      pool.add(`${name}${suffix}`);
      pool.add(`${name}_${suffix}`);
    });

    brandCelebrityNumberSuffixes.forEach((suffix) => {
      pool.add(`${name}${suffix}`);
      pool.add(`${name}_${suffix}`);
    });

    brandCelebrityPrefixes.forEach((prefix) => {
      pool.add(`${prefix}${name}`);
      pool.add(`${prefix}_${name}`);
    });
  });

  return [...pool].filter(isValidUsername);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function isValidUsername(value) {
  return !getUsernameValidationReason(value);
}

function getUsernameValidationReason(value) {
  if (!/^[a-z]/.test(value)) return "Ник должен начинаться с буквы";
  if (value.length < 5 || value.length > 32) return "Ник должен быть 5-32 символа";
  if (!/^[a-z0-9_]+$/.test(value)) return "Можно использовать только a-z, 0-9 и _";
  if (value.endsWith("_")) return "Ник не может заканчиваться на _";
  if (value.includes("__")) return "Ник не может содержать несколько _ подряд";
  if (/(.)\1\1/.test(value)) return "Ник не может содержать 3 одинаковых символа подряд";
  return "";
}

function getLocalInvalidReason(value) {
  return getUsernameValidationReason(value);
}

function sanitizeDiscordUsername(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9_.]/g, "");
}

function getDiscordUsernameValidationReason(value) {
  if (value.length < 2 || value.length > 32) return "Discord username должен быть 2-32 символа";
  if (!/^[a-z0-9_.]+$/.test(value)) return "Можно использовать только a-z, 0-9, _ и .";
  if (value.includes("..")) return "Discord не принимает две точки подряд";
  return "";
}

function isValidDiscordUsername(value) {
  return !getDiscordUsernameValidationReason(value);
}

function sanitizeTikTokUsername(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9_.]/g, "");
}

function getTikTokUsernameValidationReason(value) {
  if (value.length < 2 || value.length > 24) return "TikTok username должен быть 2-24 символа";
  if (!/^[a-z0-9_.]+$/.test(value)) return "Можно использовать только a-z, 0-9, _ и .";
  if (/^[._]/.test(value)) return "TikTok не принимает . или _ в начале";
  if (/[._]$/.test(value)) return "TikTok не принимает . или _ в конце";
  if (/[._]{2,}/.test(value)) return "TikTok не принимает подряд . или _";
  if (/^\d+$/.test(value)) return "TikTok не принимает username только из цифр";
  if (/tiktok|musically|bytedance/.test(value)) return "TikTok резервирует такие слова";
  if (/(.)\1{3,}/.test(value)) return "TikTok может не принять 4 одинаковых символа подряд";
  return "";
}

function isValidTikTokUsername(value) {
  return !getTikTokUsernameValidationReason(value);
}

function extractUsernamesFromFragment(value) {
  const found = new Set();
  const text = value.toLowerCase();
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?fragment\.com\/username\/([a-z][a-z0-9_]{3,30}[a-z0-9])\b/g,
    /(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-z][a-z0-9_]{3,30}[a-z0-9])\b/g,
    /@([a-z][a-z0-9_]{3,30}[a-z0-9])\b/g,
  ];

  patterns.forEach((pattern) => {
    for (const match of text.matchAll(pattern)) {
      const username = sanitizePrefix(match[1]);
      if (isValidUsername(username)) found.add(username);
    }
  });

  return [...found];
}

function pick(chars) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function shuffle(value) {
  const chars = [...value];
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
  }
  return chars.join("");
}

function shuffleList(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function ensureTelegramShape(value, chars) {
  let result = value;

  if (!/^[a-z]/.test(result)) {
    const letterIndex = [...result].findIndex((char) => /[a-z]/.test(char));
    if (letterIndex >= 0) {
      const letters = [...result];
      [letters[0], letters[letterIndex]] = [letters[letterIndex], letters[0]];
      result = letters.join("");
    } else {
      result = pick("abcdefghijklmnopqrstuvwxyz") + result.slice(1);
    }
  }

  if (result.endsWith("_")) {
    result = result.slice(0, -1) + pick(chars.replace(/_/g, "") || "abcdefghijklmnopqrstuvwxyz0123456789");
  }

  return result;
}

function isPrettyUsername(username) {
  const vowels = "aeiou";
  const lettersOnly = username.replace(/[^a-z]/g, "");
  const digitCount = (username.match(/\d/g) || []).length;

  if (digitCount > 1) return false;
  if (/(.)\1\1/.test(username)) return false;
  if (/[^aeiou0-9_]{4,}/.test(username)) return false;
  if (/[aeiou]{4,}/.test(username)) return false;
  if (/[qxzjw]{3,}/.test(username)) return false;
  if (/_.*_/.test(username)) return false;

  let score = 0;
  for (let index = 1; index < lettersOnly.length; index += 1) {
    const previousIsVowel = vowels.includes(lettersOnly[index - 1]);
    const currentIsVowel = vowels.includes(lettersOnly[index]);
    if (previousIsVowel !== currentIsVowel) score += 1;
  }

  return score >= Math.max(2, Math.floor(lettersOnly.length / 2));
}

function getCharCounts(username) {
  const counts = new Map();
  for (const char of username) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }
  return [...counts.values()].sort((a, b) => b - a);
}

function getUniqueCharCount(username) {
  return new Set(username).size;
}

function hasSameCharsPattern(username, sameChars) {
  if (sameChars === "0") return true;

  const counts = getCharCounts(username);

  if (sameChars === "two-symbols") {
    return getUniqueCharCount(username) === 2 && counts[0] >= 3 && counts[1] >= 2;
  }

  if (sameChars === "3+2") {
    return counts[0] === 3 && counts[1] === 2;
  }

  return counts[0] === Number(sameChars);
}

function pickDifferent(chars, except) {
  const available = [...new Set([...chars])].filter((char) => char !== except);
  return pick(available.join("") || chars);
}

function hasThreeSameInRow(value) {
  return /(.)\1\1/.test(value);
}

function shuffleForTelegram(value) {
  let result = value;

  for (let attempt = 0; attempt < 60; attempt += 1) {
    result = shuffle(value);
    if (!hasThreeSameInRow(result)) return result;
  }

  return result;
}

function uniquePermutations(value) {
  const counts = new Map();
  for (const char of value) counts.set(char, (counts.get(char) || 0) + 1);

  const result = [];
  const chars = [...counts.keys()];
  const build = [];

  function walk() {
    if (build.length === value.length) {
      result.push(build.join(""));
      return;
    }

    for (const char of chars) {
      const left = counts.get(char);
      if (!left) continue;
      counts.set(char, left - 1);
      build.push(char);
      walk();
      build.pop();
      counts.set(char, left);
    }
  }

  walk();
  return result;
}

function makeTwoSymbolUsername(preference, length, chars) {
  const prefix = sanitizePrefix(preference).slice(0, length);
  const first = prefix[0] && chars.includes(prefix[0]) ? prefix[0] : pick(chars.replace(/[^a-z]/g, "") || "abcdefghijklmnopqrstuvwxyz");
  const second = [...prefix].find((char) => char !== first && chars.includes(char)) || pickDifferent(chars, first);
  const firstCount = Math.ceil(length / 2);
  const secondCount = length - firstCount;
  const base = first.repeat(firstCount) + second.repeat(secondCount);

  return ensureTelegramShape(shuffleForTelegram(base), chars);
}

function makeUsername(preference, length, chars, sameChars) {
  if (sameChars === "two-symbols") {
    return makeTwoSymbolUsername(preference, length, chars);
  }

  let value = sanitizePrefix(preference).slice(0, length);

  while (value.length < length) value += pick(chars);

  return ensureTelegramShape(shuffle(value), chars);
}

function makeTwoSymbolPool(prefix, length, chars, beautifulOnly) {
  const pool = new Set();
  const alphabet = [...new Set([...chars])];
  const wanted = [...new Set([...prefix].filter((char) => chars.includes(char)))];
  const firstCount = Math.ceil(length / 2);
  const secondCount = length - firstCount;

  for (let firstIndex = 0; firstIndex < alphabet.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < alphabet.length; secondIndex += 1) {
      const first = alphabet[firstIndex];
      const second = alphabet[secondIndex];

      if (wanted.length && !wanted.every((char) => char === first || char === second)) continue;

      const bases = firstCount === secondCount
        ? [first.repeat(firstCount) + second.repeat(secondCount)]
        : [
            first.repeat(firstCount) + second.repeat(secondCount),
            first.repeat(secondCount) + second.repeat(firstCount),
          ];

      bases.forEach((base) => {
        uniquePermutations(base).forEach((username) => {
          if (
            isValidUsername(username) &&
            hasSameCharsPattern(username, "two-symbols") &&
            (!beautifulOnly || isPrettyUsername(username))
          ) {
            pool.add(username);
          }
        });
      });
    }
  }

  return shuffleList([...pool]);
}

function isFreeLikeStatus(status) {
  return normalizeStatus(status) === "free";
}

function normalizeStatus(status) {
  return String(status || "pending").toLowerCase();
}

function isDefinitiveNotFreeStatus(status) {
  return ["taken", "reserved", "invalid"].includes(normalizeStatus(status));
}

function isInvalidTelegramResult(result = {}) {
  const status = normalizeStatus(result.status);
  if (["error", "rate_limit", "login_required"].includes(status) || result.source === "telegram-api-required") return false;
  const text = `${result.status || ""} ${result.reason || ""}`.toLowerCase();
  return (
    result.valid === false ||
    status === "invalid" ||
    text.includes("invalid") ||
    text.includes("incorrect") ||
    text.includes("некоррект")
  );
}

function isFreeCandidate(item) {
  const current = state.items.find((entry) => entry.username === item.username);
  if (current && (isDefinitiveNotFreeStatus(current.status) || isInvalidTelegramResult(current))) {
    return false;
  }
  const status = isFreeLikeStatus(current?.status) ? current.status : item.status;
  const result = isFreeLikeStatus(current?.status) ? current : item;
  return isFreeLikeStatus(status) && !isInvalidTelegramResult(result) && !getLocalInvalidReason(item.username);
}

function isAutoFreeCandidate(item) {
  if (!item?.username || !isFreeLikeStatus(item.status)) return false;

  const current = state.items.find((entry) => entry.username === item.username);
  if (current && (isDefinitiveNotFreeStatus(current.status) || isInvalidTelegramResult(current))) {
    return false;
  }

  return !isInvalidTelegramResult(item);
}

function pruneAutoFreeList() {
  saveAutoFreeStorage();
}

function getFreeItems() {
  return state.items.filter(isFreeCandidate);
}

function getAutoFreeItems() {
  return [...state.autoFree.values()].filter((item) => item?.username);
}

function getAllFreeItems() {
  const items = new Map();
  getAutoFreeItems().forEach((item) => items.set(item.username, item));
  getFreeItems().forEach((item) => {
    if (!items.has(item.username)) items.set(item.username, item);
  });
  return [...items.values()];
}

function getPersistentServiceFreeItems(service) {
  const source = service === "discord" ? state.discordFree : state.tiktokFree;
  return [...source.values()].filter((item) => item?.username);
}

function rememberServiceFreeItem(service, username, result = {}) {
  const target = service === "discord" ? state.discordFree : state.tiktokFree;
  const prefix = service === "tiktok" ? "@" : "";
  const link = service === "tiktok"
    ? result.link || `https://www.tiktok.com/@${encodeURIComponent(username)}`
    : result.link || "";

  target.set(username, {
    username,
    status: result.status || "free",
    confidence: result.confidence,
    link,
    reason: result.reason || "Свободен.",
    checkedAt: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    title: `${prefix}${username}`,
  });
  saveAutoFreeStorage();
}

function mergeFreeItems(savedItems, currentItems) {
  const items = new Map();
  savedItems.forEach((item) => {
    if (item?.username) items.set(item.username, item);
  });
  currentItems.forEach((item) => {
    if (item?.username && !items.has(item.username)) items.set(item.username, item);
  });
  return [...items.values()];
}

function getGeneratorConfig() {
  return {
    mode: document.querySelector("#candidateMode").value,
    prefix: sanitizePrefix(document.querySelector("#prefix").value),
    length: Number(document.querySelector("#length").value),
    count: Number(document.querySelector("#count").value),
    sameChars: document.querySelector("#sameChars").value,
    charset: document.querySelector("#charset").value,
    beautifulOnly: document.querySelector("#beautifulOnly").checked,
  };
}

function getGeneratorConfigKey(config) {
  return JSON.stringify(config);
}

function getEnglishWordCandidates(config, previousCandidates) {
  return getListCandidates(englishWordUsernames, config, previousCandidates);
}

function getNameCandidates(config, previousCandidates) {
  return getListCandidates(brandCelebrityPool, config, previousCandidates);
}

function getListCandidates(source, config, previousCandidates) {
  const { prefix, length, count, beautifulOnly } = config;
  const strictLength = Number.isFinite(length) && length >= 5 && length <= 32;
  const pool = source.filter((word) => {
    if (!isValidUsername(word)) return false;
    if (strictLength && word.length !== length) return false;
    if (prefix && !word.startsWith(prefix)) return false;
    return !beautifulOnly || isPrettyUsername(word);
  });
  const fresh = pool.filter((word) => !previousCandidates.has(word));
  return shuffleList(fresh).slice(0, count);
}

function getRandomCandidates(config, previousCandidates) {
  const { prefix, length, count, sameChars, charset, beautifulOnly } = config;
  const chars = alphabets[charset];
  const candidates = new Set();
  let guard = 0;

  if (sameChars === "two-symbols") {
    const pool = makeTwoSymbolPool(prefix, length, chars, beautifulOnly);
    const fresh = pool.filter((username) => !previousCandidates.has(username));
    fresh.some((username) => {
      candidates.add(username);
      return candidates.size >= count;
    });
  }

  while (candidates.size < count && guard < count * (beautifulOnly || sameChars !== "0" ? 1200 : 40)) {
    const username = makeUsername(prefix, length, chars, sameChars);
    if (
      !previousCandidates.has(username) &&
      isValidUsername(username) &&
      hasSameCharsPattern(username, sameChars) &&
      (!beautifulOnly || isPrettyUsername(username))
    ) {
      candidates.add(username);
    }
    guard += 1;
  }

  return [...candidates];
}

function makeDiscordUsername(preference, length, chars) {
  let value = sanitizeDiscordUsername(preference).slice(0, length);
  const safeChars = chars || alphabets.discord;

  while (value.length < length) value += pick(safeChars);
  value = shuffle(value);

  for (let attempt = 0; attempt < 40 && !isValidDiscordUsername(value); attempt += 1) {
    value = shuffle(value.replace(/\.\.+/g, "."));
    while (value.length < length) value += pick(safeChars.replace(/\./g, "") || "abcdefghijklmnopqrstuvwxyz0123456789_");
    value = value.slice(0, length);
  }

  if (!isValidDiscordUsername(value)) {
    value = value.replace(/\.\.+/g, ".").replace(/[^a-z0-9_]/g, pick("abcdefghijklmnopqrstuvwxyz"));
  }

  return value.slice(0, length);
}

function makeSocialUsername(preference, length, chars, sanitize, isValid) {
  let value = sanitize(preference).slice(0, length);
  const safeChars = chars || alphabets.social;

  while (value.length < length) value += pick(safeChars);
  value = shuffle(value);

  for (let attempt = 0; attempt < 40 && !isValid(value); attempt += 1) {
    value = value.replace(/\.+$/g, "");
    while (value.length < length) value += pick(safeChars.replace(/\./g, "") || "abcdefghijklmnopqrstuvwxyz0123456789_");
    value = shuffle(value.slice(0, length));
  }

  if (!isValid(value)) {
    value = value
      .replace(/\.+$/g, pick("abcdefghijklmnopqrstuvwxyz"))
      .replace(/[^a-z0-9_]/g, pick("abcdefghijklmnopqrstuvwxyz"));
  }

  return value.slice(0, length);
}

function getDiscordGeneratorConfig() {
  return {
    mode: document.querySelector("#discordMode").value,
    prefix: sanitizeDiscordUsername(document.querySelector("#discordPrefix").value),
    length: Number(document.querySelector("#discordLength").value),
    count: Number(document.querySelector("#discordCount").value),
    charset: document.querySelector("#discordCharset").value,
    speed: document.querySelector("#discordSpeed").value,
    beautifulOnly: document.querySelector("#discordBeautifulOnly").checked,
  };
}

function getDiscordListCandidates(source, config, previousCandidates) {
  const { prefix, length, count, beautifulOnly } = config;
  const pool = source
    .map((word) => sanitizeDiscordUsername(word))
    .filter((word) => {
      if (!isValidDiscordUsername(word)) return false;
      if (word.length !== length) return false;
      if (prefix && !word.startsWith(prefix)) return false;
      return !beautifulOnly || isPrettyUsername(word.replace(/\./g, ""));
    });
  const fresh = pool.filter((word) => !previousCandidates.has(word));
  return shuffleList(fresh).slice(0, count);
}

function getDiscordRandomCandidates(config, previousCandidates) {
  const { prefix, length, count, charset, beautifulOnly } = config;
  const chars = alphabets[charset] || alphabets.discord;
  const candidates = new Set();
  let guard = 0;

  while (candidates.size < count && guard < count * (beautifulOnly ? 400 : 60)) {
    const username = makeDiscordUsername(prefix, length, chars);
    if (
      !previousCandidates.has(username) &&
      isValidDiscordUsername(username) &&
      (!beautifulOnly || isPrettyUsername(username.replace(/\./g, "")))
    ) {
      candidates.add(username);
    }
    guard += 1;
  }

  return [...candidates];
}

function generateDiscordCandidates() {
  const config = getDiscordGeneratorConfig();
  const configKey = JSON.stringify(config);
  const previousCandidates = state.discordGeneratedByConfig.get(configKey) || new Set();
  const candidateGetters = {
    english: (currentConfig, previous) => getDiscordListCandidates(englishWordUsernames, currentConfig, previous),
    names: (currentConfig, previous) => getDiscordListCandidates(brandCelebrityPool, currentConfig, previous),
    random: getDiscordRandomCandidates,
  };
  const getCandidates = candidateGetters[config.mode] || getDiscordRandomCandidates;
  const candidates = getCandidates(config, previousCandidates);

  candidates.forEach((username) => previousCandidates.add(username));
  state.discordGeneratedByConfig.set(configKey, previousCandidates);
  state.discordItems = candidates.map((username) => ({
    username,
    status: "pending",
    reason: "Еще не проверяли.",
  }));
  discordRunState.textContent = state.discordItems.length
    ? `Список сгенерирован: ${state.discordItems.length} новых`
    : "Новых Discord неймов для этих настроек не осталось";
  setWatermark(`${state.discordItems.length} discord candidates`);
  if (!state.discordItems.length) showToast("Новых Discord неймов не осталось");
  renderDiscord();
}

function getTikTokGeneratorConfig() {
  return {
    mode: document.querySelector("#tiktokMode").value,
    prefix: sanitizeTikTokUsername(document.querySelector("#tiktokPrefix").value),
    length: Number(document.querySelector("#tiktokLength").value),
    count: Number(document.querySelector("#tiktokCount").value),
    charset: document.querySelector("#tiktokCharset").value,
    beautifulOnly: document.querySelector("#tiktokBeautifulOnly").checked,
  };
}

function getTikTokListCandidates(source, config, previousCandidates) {
  const { prefix, length, count, beautifulOnly } = config;
  const pool = source
    .map((word) => sanitizeTikTokUsername(word))
    .filter((word) => {
      if (!isValidTikTokUsername(word)) return false;
      if (word.length !== length) return false;
      if (prefix && !word.startsWith(prefix)) return false;
      return !beautifulOnly || isPrettyUsername(word.replace(/\./g, ""));
    });
  const fresh = pool.filter((word) => !previousCandidates.has(word));
  return shuffleList(fresh).slice(0, count);
}

function getTikTokRandomCandidates(config, previousCandidates) {
  const { prefix, length, count, charset, beautifulOnly } = config;
  const chars = alphabets[charset] || alphabets.social;
  const candidates = new Set();
  let guard = 0;

  while (candidates.size < count && guard < count * (beautifulOnly ? 400 : 60)) {
    const username = makeSocialUsername(prefix, length, chars, sanitizeTikTokUsername, isValidTikTokUsername);
    if (
      !previousCandidates.has(username) &&
      isValidTikTokUsername(username) &&
      (!beautifulOnly || isPrettyUsername(username.replace(/\./g, "")))
    ) {
      candidates.add(username);
    }
    guard += 1;
  }

  return [...candidates];
}

function generateTikTokCandidates() {
  const config = getTikTokGeneratorConfig();
  const configKey = JSON.stringify(config);
  const previousCandidates = state.tiktokGeneratedByConfig.get(configKey) || new Set();
  const candidateGetters = {
    english: (currentConfig, previous) => getTikTokListCandidates(englishWordUsernames, currentConfig, previous),
    names: (currentConfig, previous) => getTikTokListCandidates(brandCelebrityPool, currentConfig, previous),
    random: getTikTokRandomCandidates,
  };
  const getCandidates = candidateGetters[config.mode] || getTikTokRandomCandidates;
  const candidates = getCandidates(config, previousCandidates);

  candidates.forEach((username) => previousCandidates.add(username));
  state.tiktokGeneratedByConfig.set(configKey, previousCandidates);
  state.tiktokItems = candidates.map((username) => ({
    username,
    status: "pending",
    reason: "Еще не проверяли.",
  }));
  tiktokRunState.textContent = state.tiktokItems.length
    ? `Список сгенерирован: ${state.tiktokItems.length} новых`
    : "Новых TikTok неймов для этих настроек не осталось";
  setWatermark(`${state.tiktokItems.length} tiktok candidates`);
  if (!state.tiktokItems.length) showToast("Новых TikTok неймов не осталось");
  renderTikTok();
}

function generateCandidates() {
  const config = getGeneratorConfig();
  const configKey = getGeneratorConfigKey(config);
  const previousCandidates = state.generatedByConfig.get(configKey) || new Set();
  const candidateGetters = {
    english: getEnglishWordCandidates,
    names: getNameCandidates,
    random: getRandomCandidates,
  };
  const getCandidates = candidateGetters[config.mode] || getRandomCandidates;
  const candidates = getCandidates(config, previousCandidates);

  const generated = [...candidates];
  generated.forEach((username) => previousCandidates.add(username));
  state.generatedByConfig.set(configKey, previousCandidates);
  state.items = [...candidates].map((username) => ({
    username,
    status: "pending",
    reason: "Еще не проверяли.",
  }));
  state.checked.clear();
  runState.textContent = state.items.length
    ? `Список сгенерирован: ${state.items.length} новых`
    : "Новых ников для этих настроек не осталось";
  setWatermark(`${state.items.length} candidates`);
  if (!state.items.length) showToast("Новых ников для этих настроек не осталось");
  render();
}

function statusText(status) {
  const normalized = normalizeStatus(status);
  return {
    pending: "в очереди",
    free: "свободен",
    taken: "занят",
    invalid: "некорректен",
    reserved: "резерв",
    unknown: "неясно",
    maybe: "не подтверждено",
    rate_limit: "лимит",
    login_required: "нужен вход",
    error: "сбой",
  }[normalized] || normalized;
}

function createCard(item) {
  const card = document.createElement("article");
  const status = normalizeStatus(item.status);
  card.className = `username-card status-${status}`;
  card.dataset.username = item.username;

  const displayUsername = escapeHtml(item.username);
  const link = item.link || `https://t.me/${encodeURIComponent(item.username)}`;
  const fragmentLink = item.fragmentLink
    ? `<a class="link-button" href="${escapeHtml(item.fragmentLink)}" target="_blank" rel="noreferrer">FINDSENSE</a>`
    : "";
  card.innerHTML = `
    <div class="username-top">
      <span class="username">@${displayUsername}</span>
      <span class="badge ${status}">${statusText(item.status)}</span>
    </div>
    <p class="reason">${escapeHtml(item.reason)}</p>
    <div class="card-actions">
      <a class="link-button" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">Открыть t.me</a>
      ${fragmentLink}
      <button class="link-button check-one" type="button">Проверить</button>
    </div>
  `;

  card.querySelector(".check-one").addEventListener("click", () => checkOne(item.username));
  return card;
}

function createDiscordCard(item) {
  const card = document.createElement("article");
  const status = normalizeStatus(item.status);
  card.className = `username-card status-${status}`;
  card.dataset.username = item.username;

  card.innerHTML = `
    <div class="username-top">
      <span class="username">${escapeHtml(item.username)}</span>
      <span class="badge ${status}">${statusText(item.status)}</span>
    </div>
    <p class="reason">${escapeHtml(item.reason)}</p>
    <div class="card-actions">
      <button class="link-button discord-check-one" type="button">Проверить</button>
      <button class="link-button discord-copy-one" type="button">Скопировать</button>
    </div>
  `;

  card.querySelector(".discord-check-one").addEventListener("click", () => checkDiscordOne(item.username));
  card.querySelector(".discord-copy-one").addEventListener("click", () => copyText(item.username, "Ник пуст"));
  return card;
}

function createTikTokCard(item) {
  const card = document.createElement("article");
  const status = normalizeStatus(item.status);
  card.className = `username-card status-${status}`;
  card.dataset.username = item.username;
  const link = item.link || `https://www.tiktok.com/@${encodeURIComponent(item.username)}`;

  card.innerHTML = `
    <div class="username-top">
      <span class="username">@${escapeHtml(item.username)}</span>
      <span class="badge ${status}">${statusText(item.status)}</span>
    </div>
    <p class="reason">${escapeHtml(item.reason)}</p>
    <div class="card-actions">
      <a class="link-button" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">Открыть TikTok</a>
      <button class="link-button tiktok-check-one" type="button">Проверить</button>
      <button class="link-button tiktok-copy-one" type="button">Скопировать</button>
    </div>
  `;

  card.querySelector(".tiktok-check-one").addEventListener("click", () => checkTikTokOne(item.username));
  card.querySelector(".tiktok-copy-one").addEventListener("click", () => copyText(item.username, "Ник пуст"));
  return card;
}

function renderCards(container, items, emptyText) {
  container.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => container.appendChild(createCard(item)));
}

function renderDiscordCards() {
  discordResults.innerHTML = "";

  if (!state.discordItems.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Сгенерируй Discord кандидатов или проверь нейм вручную.";
    discordResults.appendChild(empty);
    return;
  }

  state.discordItems.forEach((item) => discordResults.appendChild(createDiscordCard(item)));
}

function renderTikTokCards() {
  tiktokResults.innerHTML = "";

  if (!state.tiktokItems.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Сгенерируй TikTok кандидатов или проверь нейм вручную.";
    tiktokResults.appendChild(empty);
    return;
  }

  state.tiktokItems.forEach((item) => tiktokResults.appendChild(createTikTokCard(item)));
}

function createAutoFreeItem(item) {
  const row = document.createElement("div");
  row.className = "auto-free-item";
  const link = item.link || `https://t.me/${encodeURIComponent(item.username)}`;
  row.innerHTML = `
    <div class="auto-free-top service-free-top">
      <a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">@${escapeHtml(item.username)}</a>
      <button class="auto-copy" type="button" title="Скопировать ник" aria-label="Скопировать ${escapeHtml(item.username)}">⧉</button>
      <button class="auto-remove" type="button" title="Удалить из свободных" aria-label="Удалить ${escapeHtml(item.username)}">×</button>
    </div>
    <span>${escapeHtml(item.checkedAt || "")}</span>
  `;
  row.querySelector(".auto-copy").addEventListener("click", () => {
    copyText(item.username, "Ник пуст");
  });
  row.querySelector(".auto-remove").addEventListener("click", () => {
    state.autoFree.delete(item.username);
    state.savedAutoFree.delete(item.username);
    saveAutoFreeStorage();
    render();
    showToast(`@${item.username} удален`);
  });
  return row;
}

function renderAutoFreeList() {
  const items = getAutoFreeItems();
  autoFreeList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "auto-empty";
    empty.textContent = "Свободные имена появятся здесь во время авто-поиска.";
    autoFreeList.appendChild(empty);
    return;
  }

  items.forEach((item) => autoFreeList.appendChild(createAutoFreeItem(item)));
}

function createServiceFreeItem(item, options = {}) {
  const row = document.createElement("div");
  row.className = "auto-free-item";
  const prefix = options.prefix || "";
  const link = item.link || options.getLink?.(item.username) || "";
  const title = `${prefix}${item.username}`;
  const status = statusText(item.status || "free");
  const openLink = link
    ? `<a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(title)}</a>`
    : `<a href="#" class="disabled-link">${escapeHtml(title)}</a>`;

  row.innerHTML = `
    <div class="auto-free-top">
      ${openLink}
      <button class="auto-copy" type="button" title="Скопировать ник" aria-label="Скопировать ${escapeHtml(item.username)}">⧉</button>
    </div>
    <span>${escapeHtml(status)}${item.confidence ? ` · ${escapeHtml(item.confidence)}` : ""}</span>
  `;

  const linkElement = row.querySelector(".disabled-link");
  if (linkElement) {
    linkElement.addEventListener("click", (event) => event.preventDefault());
  }

  row.querySelector(".auto-copy").addEventListener("click", () => {
    copyText(item.username, "Ник пуст");
  });

  return row;
}

function renderServiceFreeList(container, stateElement, items, options = {}) {
  if (!container) return;
  container.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "auto-empty";
    empty.textContent = options.emptyText || "Свободные имена появятся здесь после проверки.";
    container.appendChild(empty);
    if (stateElement) stateElement.textContent = "Появятся после проверки";
    return;
  }

  items.forEach((item) => container.appendChild(createServiceFreeItem(item, options)));
  if (stateElement) stateElement.textContent = `${items.length} найдено`;
}

function rememberFreeItem(username, result = {}) {
  const isTelegramConfirmed = result.checkedInsideTelegram && result.valid === true;
  if ((!isTelegramConfirmed && getLocalInvalidReason(username)) || isInvalidTelegramResult(result)) {
    return;
  }

  state.autoFree.set(username, {
    username,
    status: result.status || "free",
    valid: result.valid,
    checkedInsideTelegram: result.checkedInsideTelegram,
    confidence: result.confidence,
    link: result.link || `https://t.me/${encodeURIComponent(username)}`,
    fragmentLink: result.fragmentLink,
    reason: result.reason || "Свободен.",
    checkedAt: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
  });
  saveAutoFreeStorage();
}

function renderExport() {
  const lines = state.items.map((item) => {
    const prefix = item.status === "free"
      ? "FREE"
      : item.status === "taken"
        ? "TAKEN"
        : item.status === "reserved"
          ? "RESERVED"
          : item.status.toUpperCase();
    return `${prefix} @${item.username}`;
  });

  exportText.value = lines.join("\n");
}

function render() {
  pruneAutoFreeList();
  const allFreeItems = getAllFreeItems();
  renderCards(results, state.items, "Сгенерируй кандидатов или проверь ник вручную.");
  renderCards(freeResults, allFreeItems, "Пока нет найденных свободных юзернеймов.");
  renderAutoFreeList();
  renderExport();

  const free = allFreeItems.length;
  const autoFree = getAutoFreeItems().length;
  const taken = state.items.filter((item) => item.status === "taken").length;
  totalCount.textContent = state.items.length;
  freeCount.textContent = free;
  takenCount.textContent = taken;
  freeState.textContent = allFreeItems.length ? `${allFreeItems.length} свободно` : "Появятся после проверки";
  autoState.textContent = state.autoRunning
    ? `Авто режим работает, найдено свободных: ${autoFree}`
    : autoFree
      ? `Авто остановлен, найдено свободных: ${autoFree}`
      : "Авто режим остановлен";
  autoModeButton.textContent = state.autoRunning ? "Стоп авто" : "Авто поиск";
  autoModeButton.classList.toggle("danger-button", state.autoRunning);
}

function renderDiscord() {
  renderDiscordCards();

  const currentFreeItems = state.discordItems.filter((item) => normalizeStatus(item.status) === "free");
  const freeItems = mergeFreeItems(getPersistentServiceFreeItems("discord"), currentFreeItems);
  const free = freeItems.length;
  const taken = state.discordItems.filter((item) => normalizeStatus(item.status) === "taken").length;
  discordTotalCount.textContent = state.discordItems.length;
  discordFreeCount.textContent = free;
  discordTakenCount.textContent = taken;
  renderServiceFreeList(discordFreeList, discordFreeState, freeItems, {
    emptyText: "Свободные Discord username появятся здесь после проверки.",
  });
  if (discordAutoModeButton) {
    discordAutoModeButton.textContent = state.discordAutoRunning ? "Стоп авто" : "Авто поиск";
    discordAutoModeButton.classList.toggle("danger-button", state.discordAutoRunning);
  }
}

function renderTikTok() {
  renderTikTokCards();

  const currentFreeItems = state.tiktokItems.filter((item) => normalizeStatus(item.status) === "free");
  const freeItems = mergeFreeItems(getPersistentServiceFreeItems("tiktok"), currentFreeItems);
  const free = freeItems.length;
  const taken = state.tiktokItems.filter((item) => normalizeStatus(item.status) === "taken").length;
  tiktokTotalCount.textContent = state.tiktokItems.length;
  tiktokFreeCount.textContent = free;
  tiktokTakenCount.textContent = taken;
  renderServiceFreeList(tiktokFreeList, tiktokFreeState, freeItems, {
    prefix: "@",
    getLink: (username) => `https://www.tiktok.com/@${encodeURIComponent(username)}`,
    emptyText: "TikTok username с максимальным шансом свободы появятся здесь после проверки.",
  });
  if (tiktokAutoModeButton) {
    tiktokAutoModeButton.textContent = state.tiktokAutoRunning ? "Стоп авто" : "Авто поиск";
    tiktokAutoModeButton.classList.toggle("danger-button", state.tiktokAutoRunning);
  }
}

function updateDiscordItem(username, patch) {
  const index = state.discordItems.findIndex((item) => item.username === username);
  if (index === -1) return;
  state.discordItems[index] = { ...state.discordItems[index], ...patch };
  renderDiscord();
}

function updateTikTokItem(username, patch) {
  const index = state.tiktokItems.findIndex((item) => item.username === username);
  if (index === -1) return;
  state.tiktokItems[index] = { ...state.tiktokItems[index], ...patch };
  renderTikTok();
}

function updateItem(username, patch) {
  const index = state.items.findIndex((item) => item.username === username);
  if (index === -1) return;
  state.items[index] = { ...state.items[index], ...patch };
  render();
}

async function fetchCheckResult(username) {
  const externalCheck = document.querySelector("#externalCheck")?.checked;
  const path = `/api/check?username=${encodeURIComponent(username)}${externalCheck ? "&external=1" : ""}`;
  const urls = window.location.protocol === "http:" || window.location.protocol === "https:"
    ? [path]
    : [`http://localhost:5173${path}`, path];
  let lastError;

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const result = await response.json();
      return { response, result };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Не удалось подключиться к локальному серверу проверки.");
}

async function fetchDiscordCheckResult(username) {
  const speed = document.querySelector("#discordSpeed")?.value || "slow";
  const path = `/api/check-discord?username=${encodeURIComponent(username)}&speed=${encodeURIComponent(speed)}`;
  const urls = window.location.protocol === "http:" || window.location.protocol === "https:"
    ? [path]
    : [`http://localhost:5173${path}`, path];
  let lastError;

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const result = await response.json();
      return { response, result };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Не удалось подключиться к локальному серверу проверки.");
}

async function fetchTikTokCheckResult(username) {
  const path = `/api/check-tiktok?username=${encodeURIComponent(username)}`;
  const urls = window.location.protocol === "http:" || window.location.protocol === "https:"
    ? [path]
    : [`http://localhost:5173${path}`, path];
  let lastError;

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const result = await response.json();
      return { response, result };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Не удалось подключиться к локальному серверу проверки.");
}

async function saveAutoFreeUsername(username) {
  if (state.savedAutoFree.has(username)) return;

  const path = `/api/save-auto-free?username=${encodeURIComponent(username)}`;
  const urls = window.location.protocol === "http:" || window.location.protocol === "https:"
    ? [path]
    : [`http://localhost:5173${path}`, path];
  let lastError;

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) throw new Error(result.reason || "Не удалось сохранить ник.");
      if (!result.saved && !result.duplicate) {
        throw new Error(result.reason || "Ник не подтвержден как свободный.");
      }
      state.savedAutoFree.add(username);
      saveAutoFreeStorage();
      if (result.saved) showToast(`@${username} сохранен в ${result.letter}.txt`);
      return result;
    } catch (error) {
      lastError = error;
    }
  }

  showToast(lastError?.message || "Не удалось сохранить ник в txt");
}

async function checkOne(username) {
  const localInvalidReason = getLocalInvalidReason(username);
  if (localInvalidReason) {
    updateItem(username, {
      status: "invalid",
      reason: localInvalidReason,
      confidence: "high",
    });
    return {
      status: "invalid",
      result: {
        username,
        status: "invalid",
        valid: false,
        reason: localInvalidReason,
      },
    };
  }

  updateItem(username, { status: "pending", reason: "Проверяем Telegram..." });
  runState.textContent = `Проверяем @${username}`;
  setWatermark(`checking @${username}`);

  try {
    const { response, result } = await fetchCheckResult(username);

    if (!response.ok) {
      throw new Error(result.reason || "Проверка завершилась ошибкой.");
    }

    const normalizedResult = isInvalidTelegramResult(result)
      ? { ...result, status: "INVALID", confidence: result.confidence || "high" }
      : result;
    const status = normalizedResult.status || "UNKNOWN";

    updateItem(username, {
      status,
      link: normalizedResult.link,
      fragmentLink: normalizedResult.fragmentLink,
      reason: normalizedResult.reason || "Готово.",
      confidence: normalizedResult.confidence,
    });
    state.checked.set(username, normalizedResult);
    if (normalizeStatus(status) === "login_required") {
      state.autoRunning = false;
      showToast("Нужен вход в Telegram API");
    }
    if (isFreeLikeStatus(status) && !isInvalidTelegramResult(normalizedResult)) {
      rememberFreeItem(username, { ...normalizedResult, status });
      if (state.autoRunning) await saveAutoFreeUsername(username);
    }
    return { status, result: normalizedResult };
  } catch (error) {
    updateItem(username, {
      status: "error",
      reason: error.message === "Failed to fetch"
        ? "Локальный сервер проверки не отвечает. Перезапусти приложение через start-findsense.cmd."
        : error.message || "Не получилось выполнить запрос к локальному серверу.",
    });
    return { status: "error", error };
  } finally {
    runState.textContent = "Готов к поиску";
    setWatermark("ready");
  }
}

async function checkDiscordOne(username) {
  const clean = sanitizeDiscordUsername(username);
  const localInvalidReason = getDiscordUsernameValidationReason(clean);

  if (localInvalidReason) {
    updateDiscordItem(username, {
      username: clean,
      status: "invalid",
      reason: localInvalidReason,
      confidence: "high",
    });
    return { status: "invalid" };
  }

  updateDiscordItem(username, { status: "pending", reason: "Проверяем Discord..." });
  discordRunState.textContent = `Проверяем ${clean}`;
  setWatermark(`checking discord ${clean}`);

  try {
    const { response, result } = await fetchDiscordCheckResult(clean);
    if (!response.ok) throw new Error(result.reason || "Проверка Discord завершилась ошибкой.");

    updateDiscordItem(username, {
      username: result.username || clean,
      status: result.status || "unknown",
      reason: result.reason || "Готово.",
      confidence: result.confidence,
      retryAfterMs: result.retryAfterMs,
      source: result.source,
    });
    if (normalizeStatus(result.status) === "free") {
      rememberServiceFreeItem("discord", result.username || clean, result);
    }
    return { status: result.status || "unknown", result };
  } catch (error) {
    updateDiscordItem(username, {
      status: "error",
      reason: error.message === "Failed to fetch"
        ? "Локальный сервер проверки не отвечает. Перезапусти приложение через start-findsense.cmd."
        : error.message || "Не получилось выполнить запрос к локальному серверу.",
    });
    return { status: "error", error };
  } finally {
    discordRunState.textContent = "Готов к поиску";
    setWatermark("ready");
  }
}

async function checkTikTokOne(username) {
  const clean = sanitizeTikTokUsername(username);
  const localInvalidReason = getTikTokUsernameValidationReason(clean);

  if (localInvalidReason) {
    updateTikTokItem(username, {
      username: clean,
      status: "invalid",
      reason: localInvalidReason,
      confidence: "high",
    });
    return { status: "invalid" };
  }

  updateTikTokItem(username, { status: "pending", reason: "Проверяем TikTok..." });
  tiktokRunState.textContent = `Проверяем @${clean}`;
  setWatermark(`checking tiktok ${clean}`);

  try {
    const { response, result } = await fetchTikTokCheckResult(clean);
    if (!response.ok) throw new Error(result.reason || "Проверка TikTok завершилась ошибкой.");

    updateTikTokItem(username, {
      username: result.username || clean,
      status: result.status || "unknown",
      link: result.link,
      reason: result.reason || "Готово.",
      confidence: result.confidence,
      source: result.source,
    });
    if (normalizeStatus(result.status) === "free") {
      rememberServiceFreeItem("tiktok", result.username || clean, result);
    }
    return { status: result.status || "unknown", result };
  } catch (error) {
    updateTikTokItem(username, {
      status: "error",
      reason: error.message === "Failed to fetch"
        ? "Локальный сервер проверки не отвечает. Перезапусти приложение через start-findsense.cmd."
        : error.message || "Не получилось выполнить запрос к локальному серверу.",
    });
    return { status: "error", error };
  } finally {
    tiktokRunState.textContent = "Готов к поиску";
    setWatermark("ready");
  }
}

async function checkAllDiscord() {
  discordCheckAllButton.disabled = true;
  const speed = document.querySelector("#discordSpeed")?.value || "slow";
  const clientDelay = speed === "fast" ? 350 : 1100;

  for (const item of [...state.discordItems]) {
    const checkResult = await checkDiscordOne(item.username);
    const retryAfterMs = checkResult.result?.retryAfterMs || 0;
    if (retryAfterMs > 0 || checkResult.result?.source === "discord-rate-limit") {
      showToast("Discord дал лимит, проверку поставили на паузу");
      break;
    }
    await wait(clientDelay);
  }

  discordCheckAllButton.disabled = false;
  discordRunState.textContent = "Проверка Discord завершена";
  showToast("Discord проверка завершена");
}

function addDiscordManualCandidate() {
  const username = sanitizeDiscordUsername(discordManualUsername.value);
  if (!username) {
    showToast("Введи Discord нейм");
    return;
  }

  if (!state.discordItems.some((item) => item.username === username)) {
    state.discordItems.unshift({
      username,
      status: "pending",
      reason: "Добавлен вручную.",
    });
    renderDiscord();
  }

  checkDiscordOne(username);
}

async function checkAllTikTok() {
  tiktokCheckAllButton.disabled = true;
  tiktokRunState.textContent = "Быстрая проверка TikTok...";

  await checkTikTokItemsWithLimit([...state.tiktokItems], 5);

  tiktokCheckAllButton.disabled = false;
  tiktokRunState.textContent = "Проверка TikTok завершена";
  showToast("TikTok проверка завершена");
}

async function checkTikTokItemsWithLimit(items, limit = 5, shouldContinue = () => true) {
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      const item = items[index];
      if (!item) return;
      if (!shouldContinue()) return;
      await checkTikTokOne(item.username);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

function addTikTokManualCandidate() {
  const username = sanitizeTikTokUsername(tiktokManualUsername.value);
  if (!username) {
    showToast("Введи TikTok нейм");
    return;
  }

  if (!state.tiktokItems.some((item) => item.username === username)) {
    state.tiktokItems.unshift({
      username,
      status: "pending",
      reason: "Добавлен вручную.",
    });
    renderTikTok();
  }

  checkTikTokOne(username);
}

async function checkAll() {
  checkAllButton.disabled = true;
  autoModeButton.disabled = true;
  const externalCheck = document.querySelector("#externalCheck")?.checked;

  await checkItemsWithLimit([...state.items], externalCheck ? 4 : 1, externalCheck ? 80 : 450);

  checkAllButton.disabled = false;
  autoModeButton.disabled = false;
  runState.textContent = "Проверка завершена";
  showToast("Проверка завершена");
}

async function startTelegramSearch() {
  if (state.autoRunning) return;
  generateCandidates();
  if (state.items.length) await checkAll();
}

async function startDiscordSearch() {
  generateDiscordCandidates();
  if (state.discordItems.length) await checkAllDiscord();
}

async function startTikTokSearch() {
  generateTikTokCandidates();
  if (state.tiktokItems.length) await checkAllTikTok();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkItemsWithLimit(items, limit = 1, delayMs = 450) {
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      const item = items[index];
      if (!item || (state.autoRunning === false && autoModeButton.disabled)) return;
      await checkOne(item.username);
      if (delayMs) await wait(delayMs);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

async function runDiscordAutoMode() {
  let batch = 0;
  discordCheckAllButton.disabled = true;
  showToast("Discord авто запущен");
  renderDiscord();

  while (state.discordAutoRunning) {
    batch += 1;
    generateDiscordCandidates();
    if (!state.discordItems.length) {
      state.discordAutoRunning = false;
      showToast("Discord авто: новых кандидатов нет");
      break;
    }
    discordRunState.textContent = `Discord авто: пачка ${batch}`;
    const speed = document.querySelector("#discordSpeed")?.value || "slow";
    const clientDelay = speed === "fast" ? 350 : 1100;
    for (const item of [...state.discordItems]) {
      if (!state.discordAutoRunning) break;
      const checkResult = await checkDiscordOne(item.username);
      const status = normalizeStatus(checkResult.result?.status || checkResult.status);
      if (status === "rate_limit") {
        showToast("Discord дал лимит, авто остановлен");
        state.discordAutoRunning = false;
        break;
      }
      await wait(clientDelay);
    }
    if (state.discordAutoRunning) await wait(650);
  }

  state.discordAutoRunning = false;
  discordCheckAllButton.disabled = false;
  if (discordAutoModeButton) discordAutoModeButton.disabled = false;
  discordRunState.textContent = "Discord авто остановлен";
  renderDiscord();
}

function toggleDiscordAutoMode() {
  if (state.discordAutoRunning) {
    state.discordAutoRunning = false;
    renderDiscord();
    return;
  }
  state.discordAutoRunning = true;
  runDiscordAutoMode();
}

async function runTikTokAutoMode() {
  let batch = 0;
  tiktokCheckAllButton.disabled = true;
  showToast("TikTok авто запущен");
  renderTikTok();

  while (state.tiktokAutoRunning) {
    batch += 1;
    generateTikTokCandidates();
    if (!state.tiktokItems.length) {
      state.tiktokAutoRunning = false;
      showToast("TikTok авто: новых кандидатов нет");
      break;
    }
    tiktokRunState.textContent = `TikTok авто: пачка ${batch}`;
    await checkTikTokItemsWithLimit([...state.tiktokItems], 5, () => state.tiktokAutoRunning);
    if (state.tiktokAutoRunning) await wait(650);
  }

  state.tiktokAutoRunning = false;
  tiktokCheckAllButton.disabled = false;
  if (tiktokAutoModeButton) tiktokAutoModeButton.disabled = false;
  tiktokRunState.textContent = "TikTok авто остановлен";
  renderTikTok();
}

function toggleTikTokAutoMode() {
  if (state.tiktokAutoRunning) {
    state.tiktokAutoRunning = false;
    renderTikTok();
    return;
  }
  state.tiktokAutoRunning = true;
  runTikTokAutoMode();
}

async function runAutoMode() {
  let batch = 0;
  checkAllButton.disabled = true;
  autoModeButton.textContent = "Стоп авто";
  showToast("Авто режим запущен");

  while (state.autoRunning) {
    batch += 1;
    generateCandidates();

    if (!state.items.length) {
      state.autoRunning = false;
      showToast("Авто: новых кандидатов нет");
      break;
    }

    runState.textContent = `Авто: пачка ${batch}`;
    const externalCheck = document.querySelector("#externalCheck")?.checked;
    await checkItemsWithLimit([...state.items], externalCheck ? 4 : 1, externalCheck ? 80 : 450);

    if (state.autoRunning) await wait(650);
  }

  state.autoRunning = false;
  checkAllButton.disabled = false;
  autoModeButton.disabled = false;
  runState.textContent = "Авто режим остановлен";
  setWatermark("ready");
  render();
}

function toggleAutoMode() {
  if (state.autoRunning) {
    state.autoRunning = false;
    autoModeButton.disabled = true;
    autoState.textContent = "Останавливаем авто режим...";
    return;
  }

  state.autoRunning = true;
  render();
  runAutoMode();
}

function addManualCandidate() {
  const username = normalizeManualUsername(manualUsername.value);
  if (!username) {
    showToast("Введи ник");
    return;
  }

  if (!state.items.some((item) => item.username === username)) {
    state.items.unshift({
      username,
      status: "pending",
      reason: "Добавлен вручную.",
    });
    render();
  }

  checkOne(username);
}

async function checkFragmentCandidates() {
  const usernames = extractUsernamesFromFragment(fragmentInput.value);

  if (!usernames.length) {
    showToast("Не нашел ников в FINDSENSE");
    return;
  }

  checkFragmentButton.disabled = true;
  const added = [];

  usernames.forEach((username) => {
    if (!state.items.some((item) => item.username === username)) {
      added.push(username);
      state.items.unshift({
        username,
        status: "pending",
        reason: "Найден в FINDSENSE.",
        link: `https://t.me/${username}`,
      });
    }
  });

  render();
  runState.textContent = `FINDSENSE: ${usernames.length} найдено`;
  showToast(`FINDSENSE: ${usernames.length} найдено`);

  for (const username of usernames) {
    await checkOne(username);
    await new Promise((resolve) => setTimeout(resolve, 450));
  }

  checkFragmentButton.disabled = false;
  runState.textContent = added.length ? `FINDSENSE: ${added.length} добавлено` : "FINDSENSE уже в списке";
}

async function copyText(text, emptyMessage) {
  if (!text.trim()) {
    showToast(emptyMessage);
    return;
  }

  await navigator.clipboard.writeText(text);
  showToast("Скопировано");
}

function formatFreeUsernamesForCopy(items) {
  const groups = new Map();

  items
    .map((item) => item.username)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .forEach((username) => {
      const firstLetter = username[0] || "#";
      if (!groups.has(firstLetter)) groups.set(firstLetter, []);
      groups.get(firstLetter).push(username);
    });

  return [...groups.entries()]
    .map(([letter, usernames]) => [letter, ...usernames].join("\n"))
    .join("\n\n");
}

function setView(name) {
  state.activeView = name;
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#view-${name}`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name);
  });
  viewSubtitle.textContent = viewLabels[name];
  render();
  renderDiscord();
  renderTikTok();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  startTelegramSearch();
});

discordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startDiscordSearch();
});

tiktokForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startTikTokSearch();
});

checkAllButton.addEventListener("click", checkAll);
discordCheckAllButton.addEventListener("click", checkAllDiscord);
tiktokCheckAllButton.addEventListener("click", checkAllTikTok);
discordAutoModeButton?.addEventListener("click", toggleDiscordAutoMode);
tiktokAutoModeButton?.addEventListener("click", toggleTikTokAutoMode);
autoModeButton.addEventListener("click", toggleAutoMode);
clearAutoFreeButton.addEventListener("click", () => {
  state.autoFree.clear();
  state.savedAutoFree.clear();
  saveAutoFreeStorage();
  render();
  showToast("Список свободных очищен");
});
checkManualButton.addEventListener("click", addManualCandidate);
discordCheckManualButton.addEventListener("click", addDiscordManualCandidate);
tiktokCheckManualButton.addEventListener("click", addTikTokManualCandidate);
checkFragmentButton.addEventListener("click", checkFragmentCandidates);
manualUsername.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addManualCandidate();
});
discordManualUsername.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addDiscordManualCandidate();
});
tiktokManualUsername.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTikTokManualCandidate();
});

copyFreeButton.addEventListener("click", () => {
  const freeItems = getAutoFreeItems().length ? getAutoFreeItems() : getFreeItems();
  const freeUsernames = formatFreeUsernamesForCopy(freeItems);
  copyText(freeUsernames, "Свободных имен пока нет");
});

copyExportButton.addEventListener("click", () => copyText(exportText.value, "Список пуст"));
refreshExportButton.addEventListener("click", () => {
  renderExport();
  showToast("Экспорт обновлен");
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

bindSetting(settingAutoStart, "autoStart");
bindSetting(settingExternalCheck, "externalCheck");
bindSetting(settingCompactMode, "compactMode");
bindSetting(settingLogoMotion, "logoMotion");
bindSetting(settingWatermark, "watermark");
bindPyramidMotion();
document.querySelector("#externalCheck")?.addEventListener("change", (event) => {
  settings.externalCheck = event.target.checked;
  saveSettings();
  applySettings();
});

applySettings();
loadAutoFreeStorage();
setInterval(() => setWatermark("ready"), 30000);
generateCandidates();
generateDiscordCandidates();
generateTikTokCandidates();
if (settings.autoStart) {
  setTimeout(() => startTelegramSearch(), 250);
}
