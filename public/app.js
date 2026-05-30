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
const telegramAvailabilityStatus = document.querySelector("#telegramAvailabilityStatus");
const telegramSuggestions = document.querySelector("#telegramSuggestions");
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
const discordAvailabilityStatus = document.querySelector("#discordAvailabilityStatus");
const discordSuggestions = document.querySelector("#discordSuggestions");
const discordFreeList = document.querySelector("#discordFreeList");
const discordFreeState = document.querySelector("#discordFreeState");
const discordClearFreeButton = document.querySelector("#discordClearFree");
const tiktokForm = document.querySelector("#tiktokForm");
const tiktokResults = document.querySelector("#tiktokResults");
const tiktokRunState = document.querySelector("#tiktokRunState");
const tiktokCheckAllButton = document.querySelector("#tiktokCheckAll");
const tiktokAutoModeButton = document.querySelector("#tiktokAutoMode");
const tiktokCheckManualButton = document.querySelector("#tiktokCheckManual");
const tiktokManualUsername = document.querySelector("#tiktokManualUsername");
const tiktokAvailabilityStatus = document.querySelector("#tiktokAvailabilityStatus");
const tiktokSuggestions = document.querySelector("#tiktokSuggestions");
const tiktokFreeList = document.querySelector("#tiktokFreeList");
const tiktokFreeState = document.querySelector("#tiktokFreeState");
const tiktokClearFreeButton = document.querySelector("#tiktokClearFree");
const settingAutoStart = document.querySelector("#settingAutoStart");
const settingExternalCheck = document.querySelector("#settingExternalCheck");
const settingCompactMode = document.querySelector("#settingCompactMode");
const settingLogoMotion = document.querySelector("#settingLogoMotion");
const settingWatermark = document.querySelector("#settingWatermark");
const settingLanguage = document.querySelector("#settingLanguage");
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

const translations = {
  ru: {
    appSubtitle: "auto username finder",
    copyFree: "Скопировать свободные",
    navSettings: "Настройки",
    viewLabels: {
      search: "Telegram username scanner",
      discord: "Поиск Discord username",
      tiktok: "Поиск TikTok username",
      free: "Свободные username",
      export: "Экспорт результатов",
      settings: "Настройки FINDSENSE",
      about: "О FindSense",
    },
    settings: {
      title: "Настройки",
      autoStart: "Авто поиск при старте",
      externalCheck: "Внешняя Telegram проверка",
      compactMode: "Компактный режим",
      logoMotion: "Анимация логотипа",
      watermark: "Ватермарка",
      language: "Язык",
    },
    labels: {
      mode: "Режим",
      preference: "Предпочтение",
      length: "Длина",
      count: "Количество",
      sameChars: "Одинаковые",
      chars: "Символы",
      speed: "Скорость",
      speedHint: "Медленная скорость делает паузы между запросами, чтобы Discord не ограничил и не приостановил поиск.",
      quickCheck: "Быстрая проверка",
      discordMode: "Режим Discord",
      discordQuickCheck: "Быстрая проверка Discord",
      tiktokMode: "Режим TikTok",
      tiktokQuickCheck: "Быстрая проверка TikTok",
    },
    info: {
      candidateMode: "Выбирает способ генерации Telegram ников: случайные варианты, английские слова или брендовые/известные слова.",
      prefix: "Добавляет желаемое начало ника. Например, ai даст варианты, которые начинаются с ai.",
      length: "Длина генерируемого ника. Для Telegram доступны короткие варианты от 5 символов.",
      count: "Сколько кандидатов создать в одной пачке проверки.",
      sameChars: "Ограничивает повторы символов. Полезно для поиска коротких красивых комбинаций.",
      charset: "Набор символов для генерации. Читаемые дают более аккуратные ники, цифры расширяют поиск.",
      beautifulOnly: "Оставляет только более читаемые и визуально приятные варианты.",
      externalCheck: "Включает проверку username через Fragment marketplace перед обычной t.me проверкой.",
      discordMode: "Выбирает способ генерации Discord ников: случайные, английские слова или брендовые варианты.",
      discordPrefix: "Желаемое начало Discord ника.",
      discordLength: "Длина Discord ника. Discord разрешает более короткие ники, чем Telegram.",
      discordCount: "Сколько Discord кандидатов создать в одной пачке.",
      discordCharset: "Набор символов для Discord. Discord также допускает точку и нижнее подчеркивание.",
      discordSpeed: "Медленная скорость делает паузы между запросами, чтобы Discord не ограничил и не приостановил поиск. Быстрая проверяет резче, но чаще ловит лимиты.",
      discordBeautifulOnly: "Оставляет более читаемые Discord ники.",
      tiktokMode: "Выбирает способ генерации TikTok ников: случайные, английские слова или брендовые варианты.",
      tiktokPrefix: "Желаемое начало TikTok ника.",
      tiktokLength: "Длина TikTok ника для генерации.",
      tiktokCount: "Сколько TikTok кандидатов создать в одной пачке.",
      tiktokCharset: "Набор символов для TikTok. TikTok допускает буквы, цифры, точку и нижнее подчеркивание, но не в любом месте.",
      tiktokBeautifulOnly: "Оставляет более читаемые TikTok ники.",
      settingAutoStart: "Автоматически запускает Telegram поиск при старте приложения.",
      settingExternalCheck: "Включает внешнюю Telegram проверку по умолчанию.",
      settingCompactMode: "Уменьшает отступы и делает интерфейс плотнее.",
      settingLogoMotion: "Включает движение логотипа при наведении.",
      settingWatermark: "Показывает или скрывает маленький статусный водяной знак внизу.",
      settingLanguage: "Переключает язык интерфейса между русским и английским.",
    },
    options: {
      randomUsernames: "Случайные ники",
      randomNames: "Случайные ники",
      englishWords: "Английские слова",
      brandsCelebs: "Бренды / знаменитости",
      brandsNames: "Бренды / ники",
      anyCount: "Любое число",
      allDifferent: "Все разные",
      exactly2: "Ровно 2",
      exactly3: "Ровно 3",
      exactly4: "Ровно 4",
      twoSymbols: "2 символа (AAABB)",
      threePlusTwo: "3 + 2 (AAABB)",
      readable: "Читаемые",
      allLetters: "Все буквы",
      withDigits: "С цифрами",
      discordChars: "Discord: буквы, цифры, . _",
      tiktokChars: "TikTok: буквы, цифры, . _",
      slow: "Медленная",
      fast: "Быстрая",
      chars2: "2 символа",
      chars3: "3 символа",
      chars4: "4 символа",
      chars5: "5 символов",
      chars6: "6 символов",
      chars7: "7 символов",
      chars8: "8 символов",
    },
    toggles: {
      beautifulOnly: "Только красивые",
      externalCheck: "Fragment check",
    },
    buttons: {
      start: "Начать",
      checkCurrent: "Проверить текущие",
      autoSearch: "Авто поиск",
      stopAuto: "Стоп авто",
      check: "Проверить",
      checkFindsense: "Проверить FINDSENSE",
      clear: "Очистить",
      openTelegram: "Открыть t.me",
      openTikTok: "Открыть TikTok",
      copy: "Скопировать",
      copyList: "Скопировать список",
      refresh: "Обновить",
      removeFree: "Удалить из свободных",
      copyUsername: "Скопировать ник",
    },
    headings: {
      free: "Свободные",
      freeCandidates: "Свободные / кандидаты",
      candidates: "Кандидаты",
      discordCandidates: "Discord кандидаты",
      tiktokCandidates: "TikTok кандидаты",
      freeUsernames: "Свободные юзернеймы",
      export: "Экспорт",
    },
    stats: {
      total: "всего",
      free: "свободно",
      taken: "занято",
    },
    status: {
      pending: "в очереди",
      free: "свободен",
      taken: "занят",
      invalid: "некорректен",
      reserved: "резерв",
      unknown: "макс. шанс",
      maybe: "макс. шанс",
      rate_limit: "лимит",
      login_required: "нужен вход",
      error: "сбой",
    },
    empty: {
      candidates: "Сгенерируй кандидатов или проверь ник вручную.",
      discordCandidates: "Сгенерируй Discord кандидатов или проверь ник вручную.",
      tiktokCandidates: "Сгенерируй TikTok кандидатов или проверь ник вручную.",
      free: "Пока нет найденных свободных юзернеймов.",
      autoFree: "Свободные имена появятся здесь во время авто-поиска.",
      serviceFree: "Свободные имена появятся здесь после проверки.",
      discordFree: "Свободные Discord username появятся здесь после проверки.",
      tiktokFree: "TikTok username с максимальным шансом свободы появятся здесь после проверки.",
    },
    reason: {
      telegramMaxChance: "Максимальный шанс свободности: Telegram не нашел надежных признаков занятого публичного профиля. Для точного подтверждения войди через telegram-login.cmd.",
      discordMaxChance: "Максимальный шанс свободности: Discord не подтвердил, что ник занят. Проверь ник в приложении перед использованием.",
      tiktokMaxChance: "Максимальный шанс свободности: TikTok не подтвердил публичный профиль с этим ником. Проверь ник в приложении перед использованием.",
    },
    states: {
      ready: "Готов к поиску",
      appearAfterCheck: "Появятся после проверки",
      autoStopped: "Авто режим остановлен",
      autoStopping: "Останавливаем авто режим...",
      autoRunning: "Авто режим работает, найдено свободных: {count}",
      autoStoppedWithFound: "Авто остановлен, найдено свободных: {count}",
      found: "{count} найдено",
      freeCount: "{count} свободно",
      generated: "Список сгенерирован: {count} новых",
      noMoreTelegram: "Новых ников для этих настроек не осталось",
      noMoreDiscord: "Новых Discord ников не осталось",
      noMoreTikTok: "Новых TikTok ников не осталось",
      checkingTelegram: "Проверяем @{username}",
      checkingDiscord: "Проверяем {username}",
      checkingTikTok: "Проверяем @{username}",
      done: "Готово.",
      addedManual: "Добавлен вручную.",
      notChecked: "Еще не проверяли.",
    },
    toast: {
      copied: "Скопировано",
      noFree: "Свободных имен пока нет",
      emptyList: "Список пуст",
      freeCleared: "Список свободных очищен",
      removed: "@{username} удален",
      enterName: "Введи ник",
      enterDiscord: "Введи Discord ник",
      enterTikTok: "Введи TikTok ник",
      ready: "Готово",
    },
  },
  en: {
    appSubtitle: "auto username finder",
    copyFree: "Copy free usernames",
    navSettings: "Settings",
    viewLabels: {
      search: "Telegram username scanner",
      discord: "Discord username search",
      tiktok: "TikTok username search",
      free: "Available usernames",
      export: "Copy results",
      settings: "FINDSENSE settings",
      about: "About FindSense",
    },
    settings: {
      title: "Settings",
      autoStart: "Auto search on startup",
      externalCheck: "External Telegram check",
      compactMode: "Compact mode",
      logoMotion: "Logo animation",
      watermark: "Watermark",
      language: "Language",
    },
    labels: {
      mode: "Mode",
      preference: "Preference",
      length: "Length",
      count: "Count",
      sameChars: "Repeated chars",
      chars: "Characters",
      speed: "Speed",
      speedHint: "Slow speed adds pauses between requests so Discord is less likely to limit or pause the search.",
      quickCheck: "Quick check",
      discordMode: "Discord mode",
      discordQuickCheck: "Quick Discord check",
      tiktokMode: "TikTok mode",
      tiktokQuickCheck: "Quick TikTok check",
    },
    info: {
      candidateMode: "Chooses how Telegram usernames are generated: random variants, English words, or brand-style words.",
      prefix: "Adds a desired username start. For example, ai generates variants starting with ai.",
      length: "Generated username length. Telegram short names start from 5 characters.",
      count: "How many candidates to create in one batch.",
      sameChars: "Limits repeated characters. Useful for short clean combinations.",
      charset: "Character set for generation. Readable is cleaner; digits expand the search.",
      beautifulOnly: "Keeps only more readable and visually clean variants.",
      externalCheck: "Checks the username against the Fragment marketplace before the regular t.me check.",
      discordMode: "Chooses how Discord usernames are generated: random, English words, or brand-style variants.",
      discordPrefix: "Desired start for a Discord username.",
      discordLength: "Discord username length. Discord allows shorter usernames than Telegram.",
      discordCount: "How many Discord candidates to create in one batch.",
      discordCharset: "Character set for Discord. Discord also allows dot and underscore.",
      discordSpeed: "Slow speed adds pauses between requests so Discord is less likely to limit or pause the search. Fast mode checks harder but hits limits more often.",
      discordBeautifulOnly: "Keeps more readable Discord usernames.",
      tiktokMode: "Chooses how TikTok usernames are generated: random, English words, or brand-style variants.",
      tiktokPrefix: "Desired start for a TikTok username.",
      tiktokLength: "Generated TikTok username length.",
      tiktokCount: "How many TikTok candidates to create in one batch.",
      tiktokCharset: "Character set for TikTok. TikTok allows letters, digits, dot, and underscore, but not everywhere.",
      tiktokBeautifulOnly: "Keeps more readable TikTok usernames.",
      settingAutoStart: "Starts Telegram search automatically when the app opens.",
      settingExternalCheck: "Enables external Telegram checking by default.",
      settingCompactMode: "Reduces spacing and makes the interface denser.",
      settingLogoMotion: "Enables logo motion on hover.",
      settingWatermark: "Shows or hides the small status watermark at the bottom.",
      settingLanguage: "Switches the interface between Russian and English.",
    },
    options: {
      randomUsernames: "Random usernames",
      randomNames: "Random names",
      englishWords: "English words",
      brandsCelebs: "Brands / celebrities",
      brandsNames: "Brands / names",
      anyCount: "Any count",
      allDifferent: "All different",
      exactly2: "Exactly 2",
      exactly3: "Exactly 3",
      exactly4: "Exactly 4",
      twoSymbols: "2 symbols (AAABB)",
      threePlusTwo: "3 + 2 (AAABB)",
      readable: "Readable",
      allLetters: "All letters",
      withDigits: "With digits",
      discordChars: "Discord: letters, digits, . _",
      tiktokChars: "TikTok: letters, digits, . _",
      slow: "Slow",
      fast: "Fast",
      chars2: "2 characters",
      chars3: "3 characters",
      chars4: "4 characters",
      chars5: "5 characters",
      chars6: "6 characters",
      chars7: "7 characters",
      chars8: "8 characters",
    },
    toggles: {
      beautifulOnly: "Beautiful only",
      externalCheck: "Fragment check",
    },
    buttons: {
      start: "Start",
      checkCurrent: "Check current",
      autoSearch: "Auto search",
      stopAuto: "Stop auto",
      check: "Check",
      checkFindsense: "Check FINDSENSE",
      clear: "Clear",
      openTelegram: "Open t.me",
      openTikTok: "Open TikTok",
      copy: "Copy",
      copyList: "Copy list",
      refresh: "Refresh",
      removeFree: "Remove from free",
      copyUsername: "Copy username",
    },
    headings: {
      free: "Free",
      freeCandidates: "Free / candidates",
      candidates: "Candidates",
      discordCandidates: "Discord candidates",
      tiktokCandidates: "TikTok candidates",
      freeUsernames: "Available usernames",
      export: "Export",
    },
    stats: {
      total: "total",
      free: "free",
      taken: "taken",
    },
    status: {
      pending: "queued",
      free: "free",
      taken: "taken",
      invalid: "invalid",
      reserved: "reserved",
      unknown: "max chance",
      maybe: "max chance",
      rate_limit: "rate limit",
      login_required: "login required",
      error: "error",
    },
    empty: {
      candidates: "Generate candidates or check a username manually.",
      discordCandidates: "Generate Discord candidates or check a username manually.",
      tiktokCandidates: "Generate TikTok candidates or check a username manually.",
      free: "No available usernames found yet.",
      autoFree: "Available usernames will appear here during auto search.",
      serviceFree: "Available usernames will appear here after checks.",
      discordFree: "Available Discord usernames will appear here after checks.",
      tiktokFree: "High-confidence TikTok candidates will appear here after checks.",
    },
    reason: {
      telegramMaxChance: "Maximum chance of availability: Telegram did not return reliable signs of a taken public profile. For exact confirmation, sign in through telegram-login.cmd.",
      discordMaxChance: "Maximum chance of availability: Discord did not confirm that this username is taken. Check it in the app before using it.",
      tiktokMaxChance: "Maximum chance of availability: TikTok did not confirm a public profile with this username. Check it in the app before using it.",
    },
    states: {
      ready: "Ready to search",
      appearAfterCheck: "Will appear after checks",
      autoStopped: "Auto mode stopped",
      autoStopping: "Stopping auto mode...",
      autoRunning: "Auto mode running, free found: {count}",
      autoStoppedWithFound: "Auto stopped, free found: {count}",
      found: "{count} found",
      freeCount: "{count} free",
      generated: "List generated: {count} new",
      noMoreTelegram: "No more Telegram names for these settings",
      noMoreDiscord: "No more Discord names",
      noMoreTikTok: "No more TikTok names",
      checkingTelegram: "Checking @{username}",
      checkingDiscord: "Checking {username}",
      checkingTikTok: "Checking @{username}",
      done: "Done.",
      addedManual: "Added manually.",
      notChecked: "Not checked yet.",
    },
    toast: {
      copied: "Copied",
      noFree: "No free usernames yet",
      emptyList: "List is empty",
      freeCleared: "Free list cleared",
      removed: "@{username} removed",
      enterName: "Enter a username",
      enterDiscord: "Enter a Discord username",
      enterTikTok: "Enter a TikTok username",
      ready: "Ready",
    },
  },
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
      language: "ru",
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"),
    };
  } catch (error) {
    return {
      autoStart: false,
      externalCheck: false,
      compactMode: false,
      logoMotion: true,
      watermark: true,
      language: "ru",
    };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getLanguage() {
  return translations[settings.language] ? settings.language : "ru";
}

function tr(path, params = {}) {
  const keys = path.split(".");
  let value = translations[getLanguage()];
  for (const key of keys) value = value?.[key];
  if (typeof value !== "string") {
    value = translations.ru;
    for (const key of keys) value = value?.[key];
  }
  return String(value || path).replace(/\{(\w+)\}/g, (_, key) => params[key] ?? "");
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setLabel(id, value) {
  const label = document.querySelector(`#${id}`)?.closest("label");
  if (!label) return;
  const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (textNode) {
    textNode.textContent = `\n                  ${value}\n                  `;
    return;
  }
  const span = label.querySelector("span");
  if (span) span.textContent = value;
}

function setLabelTitle(id, value) {
  const label = document.querySelector(`#${id}`)?.closest("label");
  if (label) label.title = value;
  const input = document.querySelector(`#${id}`);
  if (input) input.title = value;
}

const infoControlIds = [
  "candidateMode",
  "prefix",
  "length",
  "count",
  "sameChars",
  "charset",
  "beautifulOnly",
  "externalCheck",
  "discordMode",
  "discordPrefix",
  "discordLength",
  "discordCount",
  "discordCharset",
  "discordSpeed",
  "discordBeautifulOnly",
  "tiktokMode",
  "tiktokPrefix",
  "tiktokLength",
  "tiktokCount",
  "tiktokCharset",
  "tiktokBeautifulOnly",
];

let activeInfoControlId = "";

function getInfoTitle(controlId) {
  const label = document.querySelector(`#${controlId}`)?.closest("label");
  if (!label) return "Info";

  if (label.classList.contains("toggle-row") || label.classList.contains("setting-row")) {
    return label.querySelector("span")?.textContent.trim() || "Info";
  }

  const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  return textNode?.textContent.trim().replace(/\s+/g, " ") || "Info";
}

function ensureInfoDialog() {
  let dialog = document.querySelector("#infoDialog");
  if (dialog) return dialog;

  dialog = document.createElement("div");
  dialog.id = "infoDialog";
  dialog.className = "info-dialog";
  dialog.innerHTML = `
    <div class="info-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="infoDialogTitle">
      <button class="info-dialog-close" type="button" aria-label="Close">×</button>
      <h3 id="infoDialogTitle"></h3>
      <p id="infoDialogText"></p>
    </div>
  `;
  document.body.appendChild(dialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.classList.contains("info-dialog-close")) {
      closeInfoDialog();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeInfoDialog();
  });

  return dialog;
}

function openInfoDialog(controlId) {
  activeInfoControlId = controlId;
  const dialog = ensureInfoDialog();
  dialog.querySelector("#infoDialogTitle").textContent = getInfoTitle(controlId);
  dialog.querySelector("#infoDialogText").textContent = tr(`info.${controlId}`);
  dialog.classList.add("show");
}

function closeInfoDialog() {
  const dialog = document.querySelector("#infoDialog");
  if (dialog) dialog.classList.remove("show");
}

function setupInfoButtons() {
  infoControlIds.forEach((controlId) => {
    const control = document.querySelector(`#${controlId}`);
    const label = control?.closest("label");
    if (!label || label.querySelector(`.field-info-button[data-info-for="${controlId}"]`)) return;

    label.classList.add("info-host");
    const button = document.createElement("button");
    button.className = "field-info-button";
    button.type = "button";
    button.dataset.infoFor = controlId;
    button.textContent = "i";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openInfoDialog(controlId);
    });
    label.appendChild(button);
  });
}

function refreshInfoButtons() {
  document.querySelectorAll(".field-info-button").forEach((button) => {
    const controlId = button.dataset.infoFor;
    button.title = tr(`info.${controlId}`);
    button.setAttribute("aria-label", tr(`info.${controlId}`));
  });
  if (activeInfoControlId && document.querySelector("#infoDialog.show")) {
    openInfoDialog(activeInfoControlId);
  }
}

function setOptionText(id, values) {
  const select = document.querySelector(`#${id}`);
  if (!select) return;
  Object.entries(values).forEach(([value, text]) => {
    const option = [...select.options].find((item) => item.value === value);
    if (option) option.textContent = text;
  });
}

function setCounterLabel(id, label) {
  const counter = document.querySelector(`#${id}`);
  if (!counter?.parentElement) return;
  counter.parentElement.lastChild.textContent = ` ${label}`;
}

function applyLanguage() {
  document.documentElement.lang = getLanguage();

  setText(".brand span", tr("appSubtitle"));
  setText("#copyFree", tr("copyFree"));
  setText('[data-view="settings"] span', tr("navSettings"));
  setText(".settings-head h2", tr("settings.title"));
  setText(".settings-grid #settingAutoStart + span", tr("settings.autoStart"));
  setText(".panel-title", tr("headings.export"));

  const settingRows = document.querySelectorAll(".setting-row span");
  if (settingRows[0]) settingRows[0].textContent = tr("settings.autoStart");
  if (settingRows[1]) settingRows[1].textContent = tr("settings.externalCheck");
  if (settingRows[2]) settingRows[2].textContent = tr("settings.compactMode");
  if (settingRows[3]) settingRows[3].textContent = tr("settings.logoMotion");
  if (settingRows[4]) settingRows[4].textContent = tr("settings.watermark");
  if (settingRows[5]) settingRows[5].textContent = tr("settings.language");

  setLabel("candidateMode", tr("labels.mode"));
  setLabel("prefix", tr("labels.preference"));
  setLabel("length", tr("labels.length"));
  setLabel("count", tr("labels.count"));
  setLabel("sameChars", tr("labels.sameChars"));
  setLabel("charset", tr("labels.chars"));
  setLabel("manualUsername", tr("labels.quickCheck"));
  setLabel("discordMode", tr("labels.discordMode"));
  setLabel("discordPrefix", tr("labels.preference"));
  setLabel("discordLength", tr("labels.length"));
  setLabel("discordCount", tr("labels.count"));
  setLabel("discordCharset", tr("labels.chars"));
  setLabel("discordSpeed", tr("labels.speed"));
  setLabelTitle("discordSpeed", tr("labels.speedHint"));
  setLabel("discordManualUsername", tr("labels.discordQuickCheck"));
  setLabel("tiktokMode", tr("labels.tiktokMode"));
  setLabel("tiktokPrefix", tr("labels.preference"));
  setLabel("tiktokLength", tr("labels.length"));
  setLabel("tiktokCount", tr("labels.count"));
  setLabel("tiktokCharset", tr("labels.chars"));
  setLabel("tiktokManualUsername", tr("labels.tiktokQuickCheck"));

  setText('label[for="unused"]', "");
  document.querySelectorAll(".toggle-row span").forEach((span, index) => {
    const values = [
      tr("toggles.beautifulOnly"),
      tr("toggles.externalCheck"),
      tr("toggles.beautifulOnly"),
      tr("toggles.beautifulOnly"),
    ];
    if (values[index]) span.textContent = values[index];
  });

  setOptionText("candidateMode", {
    random: tr("options.randomUsernames"),
    english: tr("options.englishWords"),
    names: tr("options.brandsCelebs"),
  });
  setOptionText("discordMode", {
    random: tr("options.randomNames"),
    english: tr("options.englishWords"),
    names: tr("options.brandsNames"),
  });
  setOptionText("tiktokMode", {
    random: tr("options.randomNames"),
    english: tr("options.englishWords"),
    names: tr("options.brandsNames"),
  });
  setOptionText("sameChars", {
    0: tr("options.anyCount"),
    1: tr("options.allDifferent"),
    2: tr("options.exactly2"),
    3: tr("options.exactly3"),
    4: tr("options.exactly4"),
    "two-symbols": tr("options.twoSymbols"),
    "3+2": tr("options.threePlusTwo"),
  });
  ["charset", "discordCharset", "tiktokCharset"].forEach((id) => {
    setOptionText(id, {
      clean: tr("options.readable"),
      compact: tr("options.allLetters"),
      numbers: tr("options.withDigits"),
      discord: tr("options.discordChars"),
      social: tr("options.tiktokChars"),
    });
  });
  ["length", "discordLength", "tiktokLength"].forEach((id) => {
    setOptionText(id, {
      2: tr("options.chars2"),
      3: tr("options.chars3"),
      4: tr("options.chars4"),
      5: tr("options.chars5"),
      6: tr("options.chars6"),
      7: tr("options.chars7"),
      8: tr("options.chars8"),
    });
  });
  setOptionText("discordSpeed", {
    slow: tr("options.slow"),
    fast: tr("options.fast"),
  });

  document.querySelectorAll(".actions .primary-button[type='submit']").forEach((button) => {
    button.textContent = tr("buttons.start");
  });
  setText("#checkAll", tr("buttons.checkCurrent"));
  setText("#discordCheckAll", tr("buttons.checkCurrent"));
  setText("#tiktokCheckAll", tr("buttons.checkCurrent"));
  setText("#checkManual", tr("buttons.check"));
  setText("#discordCheckManual", tr("buttons.check"));
  setText("#tiktokCheckManual", tr("buttons.check"));
  setText("#checkFragment", tr("buttons.checkFindsense"));
  setText("#clearAutoFree", tr("buttons.clear"));
  setText("#discordClearFree", tr("buttons.clear"));
  setText("#tiktokClearFree", tr("buttons.clear"));
  setText("#copyExport", tr("buttons.copyList"));
  setText("#refreshExport", tr("buttons.refresh"));
  setCounterLabel("totalCount", tr("stats.total"));
  setCounterLabel("freeCount", tr("stats.free"));
  setCounterLabel("takenCount", tr("stats.taken"));
  setCounterLabel("discordTotalCount", tr("stats.total"));
  setCounterLabel("discordFreeCount", tr("stats.free"));
  setCounterLabel("discordTakenCount", tr("stats.taken"));
  setCounterLabel("tiktokTotalCount", tr("stats.total"));
  setCounterLabel("tiktokFreeCount", tr("stats.free"));
  setCounterLabel("tiktokTakenCount", tr("stats.taken"));

  const headings = document.querySelectorAll(".results-head h2, .auto-head h2");
  if (headings[0]) headings[0].textContent = tr("headings.free");
  if (headings[1]) headings[1].textContent = tr("headings.candidates");
  if (headings[2]) headings[2].textContent = tr("headings.free");
  if (headings[3]) headings[3].textContent = tr("headings.discordCandidates");
  if (headings[4]) headings[4].textContent = tr("headings.freeCandidates");
  if (headings[5]) headings[5].textContent = tr("headings.tiktokCandidates");
  if (headings[6]) headings[6].textContent = tr("headings.freeUsernames");

  viewSubtitle.textContent = tr(`viewLabels.${state.activeView}`);
  refreshInfoButtons();
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
  if (settingLanguage) settingLanguage.value = getLanguage();

  const externalCheck = document.querySelector("#externalCheck");
  if (externalCheck) {
    externalCheck.checked = Boolean(settings.externalCheck);
    externalCheck.disabled = false;
  }

  document.body.classList.toggle("compact-mode", Boolean(settings.compactMode));
  document.body.classList.toggle("no-logo-motion", settings.logoMotion === false);
  document.body.classList.toggle("hide-watermark", settings.watermark === false);
  applyLanguage();
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
  if (!value) return "Введи username";
  if (!/^[a-z0-9_]+$/.test(value)) return "Можно использовать только a-z, 0-9 и _";
  if (value.length > 64) return "Username слишком длинный";
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
  if (!value) return "Введи Discord username";
  if (!/^[a-z0-9_.]+$/.test(value)) return "Можно использовать только a-z, 0-9, _ и .";
  if (value.length > 64) return "Username слишком длинный";
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
  if (!value) return "Введи TikTok username";
  if (!/^[a-z0-9_.]+$/.test(value)) return "Можно использовать только a-z, 0-9, _ и .";
  if (value.length > 64) return "Username слишком длинный";
  return "";
}

function isValidTikTokUsername(value) {
  return !getTikTokUsernameValidationReason(value);
}

function extractUsernamesFromFragment(value) {
  const found = new Set();
  const text = value.toLowerCase();
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?fragment\.com\/username\/([a-z0-9_]{1,64})\b/g,
    /(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-z0-9_]{1,64})\b/g,
    /@([a-z0-9_]{1,64})\b/g,
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

function isMaxChanceFreeStatus(status) {
  return ["free", "maybe", "unknown"].includes(normalizeStatus(status));
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
  const status = isMaxChanceFreeStatus(current?.status) ? current.status : item.status;
  const result = isMaxChanceFreeStatus(current?.status) ? current : item;
  return isMaxChanceFreeStatus(status) && !isInvalidTelegramResult(result);
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

function clearServiceFreeItems(service) {
  if (service === "discord") {
    state.discordFree.clear();
    saveAutoFreeStorage();
    renderDiscord();
    showToast(tr("toast.freeCleared"));
    return;
  }

  if (service === "tiktok") {
    state.tiktokFree.clear();
    saveAutoFreeStorage();
    renderTikTok();
    showToast(tr("toast.freeCleared"));
  }
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

function getPlatformInvalidReason(platform, username) {
  if (platform === "discord") return getDiscordUsernameValidationReason(username);
  if (platform === "tiktok") return getTikTokUsernameValidationReason(username);
  return getLocalInvalidReason(username);
}

function isMaxChanceCandidate(result = {}, username = result.username, platform = "telegram") {
  const status = normalizeStatus(result.status);
  if (!isMaxChanceFreeStatus(status)) return false;
  if (["error", "rate_limit", "login_required"].includes(status)) return false;
  if (isDefinitiveNotFreeStatus(status)) return false;
  if (result.valid === false) return false;
  if (username && getPlatformInvalidReason(platform, username)) return false;
  return true;
}

function getMaxChanceReason(platform, result = {}) {
  if (normalizeStatus(result.status) === "free" && result.reason) return result.reason;
  return tr(`reason.${platform}MaxChance`);
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
  const strictLength = Number.isFinite(length) && length >= 1 && length <= 32;
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
    reason: tr("states.notChecked"),
  }));
  discordRunState.textContent = state.discordItems.length
    ? tr("states.generated", { count: state.discordItems.length })
    : tr("states.noMoreDiscord");
  setWatermark(`${state.discordItems.length} discord candidates`);
  if (!state.discordItems.length) showToast(tr("states.noMoreDiscord"));
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
    reason: tr("states.notChecked"),
  }));
  tiktokRunState.textContent = state.tiktokItems.length
    ? tr("states.generated", { count: state.tiktokItems.length })
    : tr("states.noMoreTikTok");
  setWatermark(`${state.tiktokItems.length} tiktok candidates`);
  if (!state.tiktokItems.length) showToast(tr("states.noMoreTikTok"));
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
    reason: tr("states.notChecked"),
  }));
  state.checked.clear();
  runState.textContent = state.items.length
    ? tr("states.generated", { count: state.items.length })
    : tr("states.noMoreTelegram");
  setWatermark(`${state.items.length} candidates`);
  if (!state.items.length) showToast(tr("states.noMoreTelegram"));
  render();
}

function statusText(status) {
  const normalized = normalizeStatus(status);
  return tr(`status.${normalized}`) || normalized;
}

function createCard(item) {
  const card = document.createElement("article");
  const status = normalizeStatus(item.status);
  card.className = `username-card status-${status}`;
  card.dataset.username = item.username;

  const displayUsername = escapeHtml(item.username);
  const link = item.link || `https://t.me/${encodeURIComponent(item.username)}`;
  const resolvedFragmentLink = item.fragmentLink || (item.source === "fragment" ? item.link : "");
  const fragmentLink = resolvedFragmentLink
    ? `<a class="link-button" href="${escapeHtml(resolvedFragmentLink)}" target="_blank" rel="noreferrer">Fragment</a>`
    : "";
  const scoreGrid = window.FindsenseIntelligence?.renderScoreGrid(item.username, status) || "";
  card.innerHTML = `
    <div class="username-top">
      <span class="username">@${displayUsername}</span>
      <span class="badge ${status}">${statusText(item.status)}</span>
    </div>
    <p class="reason">${escapeHtml(item.reason)}</p>
    ${scoreGrid}
    <div class="card-actions">
      <a class="link-button" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(tr("buttons.openTelegram"))}</a>
      ${fragmentLink}
      <button class="link-button check-one" type="button">${escapeHtml(tr("buttons.check"))}</button>
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
  const scoreGrid = window.FindsenseIntelligence?.renderScoreGrid(item.username, status) || "";

  card.innerHTML = `
    <div class="username-top">
      <span class="username">${escapeHtml(item.username)}</span>
      <span class="badge ${status}">${statusText(item.status)}</span>
    </div>
    <p class="reason">${escapeHtml(item.reason)}</p>
    ${scoreGrid}
    <div class="card-actions">
      <button class="link-button discord-check-one" type="button">${escapeHtml(tr("buttons.check"))}</button>
      <button class="link-button discord-copy-one" type="button">${escapeHtml(tr("buttons.copy"))}</button>
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
  const scoreGrid = window.FindsenseIntelligence?.renderScoreGrid(item.username, status) || "";

  card.innerHTML = `
    <div class="username-top">
      <span class="username">@${escapeHtml(item.username)}</span>
      <span class="badge ${status}">${statusText(item.status)}</span>
    </div>
    <p class="reason">${escapeHtml(item.reason)}</p>
    ${scoreGrid}
    <div class="card-actions">
      <a class="link-button" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(tr("buttons.openTikTok"))}</a>
      <button class="link-button tiktok-check-one" type="button">${escapeHtml(tr("buttons.check"))}</button>
      <button class="link-button tiktok-copy-one" type="button">${escapeHtml(tr("buttons.copy"))}</button>
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
    empty.textContent = tr("empty.discordCandidates");
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
    empty.textContent = tr("empty.tiktokCandidates");
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
      <button class="auto-copy" type="button" title="${escapeHtml(tr("buttons.copyUsername"))}" aria-label="${escapeHtml(tr("buttons.copyUsername"))} ${escapeHtml(item.username)}">⧉</button>
      <button class="auto-remove" type="button" title="${escapeHtml(tr("buttons.removeFree"))}" aria-label="${escapeHtml(tr("buttons.removeFree"))} ${escapeHtml(item.username)}">×</button>
    </div>
    <span>${escapeHtml(item.checkedAt || "")}</span>
  `;
  row.querySelector(".auto-copy").addEventListener("click", () => {
    copyText(item.username, tr("toast.emptyList"));
  });
  row.querySelector(".auto-remove").addEventListener("click", () => {
    state.autoFree.delete(item.username);
    state.savedAutoFree.delete(item.username);
    saveAutoFreeStorage();
    render();
    showToast(tr("toast.removed", { username: item.username }));
  });
  return row;
}

function renderAutoFreeList() {
  const items = getAutoFreeItems();
  autoFreeList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "auto-empty";
    empty.textContent = tr("empty.autoFree");
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
      <button class="auto-copy" type="button" title="${escapeHtml(tr("buttons.copyUsername"))}" aria-label="${escapeHtml(tr("buttons.copyUsername"))} ${escapeHtml(item.username)}">⧉</button>
    </div>
    <span>${escapeHtml(status)}${item.confidence ? ` · ${escapeHtml(item.confidence)}` : ""}</span>
  `;

  const linkElement = row.querySelector(".disabled-link");
  if (linkElement) {
    linkElement.addEventListener("click", (event) => event.preventDefault());
  }

  row.querySelector(".auto-copy").addEventListener("click", () => {
    copyText(item.username, tr("toast.emptyList"));
  });

  return row;
}

function renderServiceFreeList(container, stateElement, items, options = {}) {
  if (!container) return;
  container.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "auto-empty";
    empty.textContent = options.emptyText || tr("empty.serviceFree");
    container.appendChild(empty);
    if (stateElement) stateElement.textContent = tr("states.appearAfterCheck");
    return;
  }

  items.forEach((item) => container.appendChild(createServiceFreeItem(item, options)));
  if (stateElement) stateElement.textContent = tr("states.found", { count: items.length });
}

function rememberFreeItem(username, result = {}) {
  const isTelegramConfirmed = result.checkedInsideTelegram && result.valid === true;
  if (isInvalidTelegramResult(result)) {
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
  renderCards(results, state.items, tr("empty.candidates"));
  renderCards(freeResults, allFreeItems, tr("empty.free"));
  renderAutoFreeList();
  renderExport();

  const free = allFreeItems.length;
  const autoFree = getAutoFreeItems().length;
  const taken = state.items.filter((item) => item.status === "taken").length;
  totalCount.textContent = state.items.length;
  freeCount.textContent = free;
  takenCount.textContent = taken;
  freeState.textContent = allFreeItems.length
    ? tr("states.freeCount", { count: allFreeItems.length })
    : tr("states.appearAfterCheck");
  autoState.textContent = state.autoRunning
    ? tr("states.autoRunning", { count: autoFree })
    : autoFree
      ? tr("states.autoStoppedWithFound", { count: autoFree })
      : tr("states.autoStopped");
  autoModeButton.textContent = state.autoRunning ? tr("buttons.stopAuto") : tr("buttons.autoSearch");
  autoModeButton.classList.toggle("danger-button", state.autoRunning);
  applyLanguage();
}

function renderDiscord() {
  renderDiscordCards();

  const currentFreeItems = state.discordItems.filter((item) => isMaxChanceCandidate(item, item.username, "discord"));
  const freeItems = mergeFreeItems(getPersistentServiceFreeItems("discord"), currentFreeItems);
  const free = freeItems.length;
  const taken = state.discordItems.filter((item) => normalizeStatus(item.status) === "taken").length;
  discordTotalCount.textContent = state.discordItems.length;
  discordFreeCount.textContent = free;
  discordTakenCount.textContent = taken;
  renderServiceFreeList(discordFreeList, discordFreeState, freeItems, {
    emptyText: tr("empty.discordFree"),
  });
  if (discordAutoModeButton) {
    discordAutoModeButton.textContent = state.discordAutoRunning ? tr("buttons.stopAuto") : tr("buttons.autoSearch");
    discordAutoModeButton.classList.toggle("danger-button", state.discordAutoRunning);
  }
  applyLanguage();
}

function renderTikTok() {
  renderTikTokCards();

  const currentFreeItems = state.tiktokItems.filter((item) => isMaxChanceCandidate(item, item.username, "tiktok"));
  const freeItems = mergeFreeItems(getPersistentServiceFreeItems("tiktok"), currentFreeItems);
  const free = freeItems.length;
  const taken = state.tiktokItems.filter((item) => normalizeStatus(item.status) === "taken").length;
  tiktokTotalCount.textContent = state.tiktokItems.length;
  tiktokFreeCount.textContent = free;
  tiktokTakenCount.textContent = taken;
  renderServiceFreeList(tiktokFreeList, tiktokFreeState, freeItems, {
    prefix: "@",
    getLink: (username) => `https://www.tiktok.com/@${encodeURIComponent(username)}`,
    emptyText: tr("empty.tiktokFree"),
  });
  if (tiktokAutoModeButton) {
    tiktokAutoModeButton.textContent = state.tiktokAutoRunning ? tr("buttons.stopAuto") : tr("buttons.autoSearch");
    tiktokAutoModeButton.classList.toggle("danger-button", state.tiktokAutoRunning);
  }
  applyLanguage();
}

function updateDiscordItem(username, patch) {
  const index = state.discordItems.findIndex((item) => item.username === username);
  if (index === -1) return;
  state.discordItems[index] = { ...state.discordItems[index], ...patch };
  window.FindsenseLiveFeed?.append(state.discordItems[index].username, state.discordItems[index].status, "DC");
  window.FindsenseTerminal?.write(normalizeStatus(state.discordItems[index].status), `discord ${state.discordItems[index].username}: ${state.discordItems[index].reason || "response parsed"}`, "DC");
  renderDiscord();
}

function updateTikTokItem(username, patch) {
  const index = state.tiktokItems.findIndex((item) => item.username === username);
  if (index === -1) return;
  state.tiktokItems[index] = { ...state.tiktokItems[index], ...patch };
  window.FindsenseLiveFeed?.append(state.tiktokItems[index].username, state.tiktokItems[index].status, "TT");
  window.FindsenseTerminal?.write(normalizeStatus(state.tiktokItems[index].status), `tiktok @${state.tiktokItems[index].username}: ${state.tiktokItems[index].reason || "response parsed"}`, "TT");
  renderTikTok();
}

function updateItem(username, patch) {
  const index = state.items.findIndex((item) => item.username === username);
  if (index === -1) return;
  state.items[index] = { ...state.items[index], ...patch };
  window.FindsenseLiveFeed?.append(state.items[index].username, state.items[index].status, "TG");
  window.FindsenseTerminal?.write(normalizeStatus(state.items[index].status), `telegram @${state.items[index].username}: ${state.items[index].reason || "response parsed"}`, "TG");
  render();
}

async function fetchCheckResult(username) {
  const useFragment = document.querySelector("#externalCheck")?.checked;
  const path = `/api/check?username=${encodeURIComponent(username)}${useFragment ? "&fragment=1" : ""}`;
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

const usernameApiCache = new Map();

function getUsernameApiBaseUrls(path) {
  return window.location.protocol === "http:" || window.location.protocol === "https:"
    ? [path]
    : [`http://localhost:5173${path}`, path];
}

async function fetchJsonWithRetry(path, options = {}) {
  const urls = getUsernameApiBaseUrls(path);
  let lastError;

  for (const url of urls) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (!response.ok && attempt < 2 && response.status >= 500) {
          await wait(220 * (attempt + 1));
          continue;
        }
        return { response, result };
      } catch (error) {
        lastError = error;
        if (attempt < 2) await wait(220 * (attempt + 1));
      }
    }
  }

  throw lastError || new Error(options.errorMessage || "Unable to verify username, try again.");
}

function getAvailabilityElements(service) {
  if (service === "discord") {
    return {
      input: discordManualUsername,
      status: discordAvailabilityStatus,
      suggestions: discordSuggestions,
      state: discordRunState,
    };
  }
  if (service === "tiktok") {
    return {
      input: tiktokManualUsername,
      status: tiktokAvailabilityStatus,
      suggestions: tiktokSuggestions,
      state: tiktokRunState,
    };
  }
  return {
    input: manualUsername,
    status: telegramAvailabilityStatus,
    suggestions: telegramSuggestions,
    state: runState,
  };
}

function normalizeAvailabilityUsername(service, rawValue) {
  if (service === "discord") return sanitizeDiscordUsername(rawValue);
  if (service === "tiktok") return sanitizeTikTokUsername(rawValue);
  return normalizeManualUsername(rawValue);
}

function getServiceLocalReason(service, username) {
  if (service === "discord") return getDiscordUsernameValidationReason(username);
  if (service === "tiktok") return getTikTokUsernameValidationReason(username);
  return getLocalInvalidReason(username);
}

function getUsernameApiPath(endpoint, service, username) {
  const platform = service === "telegram" ? "telegram" : service;
  const params = new URLSearchParams({
    platform,
    username,
  });
  if (service === "telegram" && document.querySelector("#externalCheck")?.checked) params.set("fragment", "1");
  if (service === "discord") params.set("speed", "fast");
  return `/api/${endpoint}?${params.toString()}`;
}

async function fetchUsernameAvailability(service, username, options = {}) {
  const endpoint = options.final ? "final-check-username" : "check-username";
  const cacheKey = `${endpoint}:${service}:${username}:${document.querySelector("#externalCheck")?.checked ? 1 : 0}`;
  const cached = usernameApiCache.get(cacheKey);
  if (!options.final && cached && Date.now() - cached.at < 15000) return cached.value;

  const value = await fetchJsonWithRetry(getUsernameApiPath(endpoint, service, username), {
    errorMessage: "Unable to verify username, try again.",
  });
  if (!options.final) usernameApiCache.set(cacheKey, { at: Date.now(), value });
  return value;
}

async function fetchUsernameSuggestions(service, username) {
  return fetchJsonWithRetry(getUsernameApiPath("suggest-usernames", service, username), {
    errorMessage: "Unable to build username suggestions right now.",
  });
}

const availabilityDebounce = {
  telegram: { timer: null, token: 0 },
  discord: { timer: null, token: 0 },
  tiktok: { timer: null, token: 0 },
};

function formatAvailabilityStatus(service, result = {}) {
  const username = result.username || "";
  const prefix = service === "discord" ? "" : "@";
  const statusMap = {
    available: "AVAILABLE",
    taken: "TAKEN",
    invalid: "INVALID",
    reserved: "RESERVED",
    unknown: "UNKNOWN",
  };
  const status = statusMap[result.status] || statusText(result.rawStatus || result.status || "unknown");
  return `${prefix}${username}: ${status}${result.reason ? ` - ${result.reason}` : ""}`;
}

function setAvailabilityStatus(service, status, text) {
  const { status: statusElement, state } = getAvailabilityElements(service);
  if (statusElement) {
    statusElement.className = `availability-status is-${status}`;
    statusElement.textContent = text || "";
  }
  if (state) state.textContent = text || tr("states.ready");
}

function renderSuggestionChips(service, suggestions = []) {
  const { input, suggestions: container } = getAvailabilityElements(service);
  if (!container) return;
  container.innerHTML = "";

  suggestions.slice(0, 12).forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-chip";
    button.textContent = service === "discord" ? item.username : `@${item.username}`;
    button.addEventListener("click", () => {
      input.value = service === "discord" ? item.username : `@${item.username}`;
      scheduleAvailabilityCheck(service, input.value);
    });
    container.appendChild(button);
  });
}

function scheduleAvailabilityCheck(service, rawValue) {
  const config = availabilityDebounce[service];
  if (!config) return;

  clearTimeout(config.timer);
  config.token += 1;
  const token = config.token;

  const username = normalizeAvailabilityUsername(service, rawValue);
  const localReason = getServiceLocalReason(service, username);
  renderSuggestionChips(service, []);

  if (!username) {
    setAvailabilityStatus(service, "idle", "");
    return;
  }

  if (localReason) {
    setAvailabilityStatus(service, "invalid", localReason);
    return;
  }

  setAvailabilityStatus(service, "loading", `Checking ${service === "discord" ? username : `@${username}`}...`);

  config.timer = setTimeout(async () => {
    try {
      const { response, result } = await fetchUsernameAvailability(service, username);
      if (token !== config.token) return;
      const normalized = { ...result, username: result.username || username };
      const message = response.ok
        ? formatAvailabilityStatus(service, normalized)
        : result.reason || "Сервер отклонил username.";
      setAvailabilityStatus(service, normalized.status || "unknown", message);

      if (["taken", "reserved", "invalid"].includes(normalized.status)) {
        const suggestionsResponse = await fetchUsernameSuggestions(service, username);
        if (token !== config.token) return;
        renderSuggestionChips(service, suggestionsResponse.result?.suggestions || []);
      }
    } catch (error) {
      if (token !== config.token) return;
      setAvailabilityStatus(service, "unknown", error.message || "Unable to verify username, try again.");
    }
  }, 450);
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

  updateItem(username, { status: "pending", reason: tr("states.checkingTelegram", { username }) });
  runState.textContent = tr("states.checkingTelegram", { username });
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

    const displayReason = isMaxChanceCandidate({ ...normalizedResult, status }, username, "telegram")
      ? getMaxChanceReason("telegram", { ...normalizedResult, status })
      : normalizedResult.reason || tr("states.done");

    updateItem(username, {
      status,
      link: normalizedResult.link,
      fragmentLink: normalizedResult.fragmentLink || (normalizedResult.source === "fragment" ? normalizedResult.link : null),
      source: normalizedResult.source,
      reason: displayReason,
      confidence: normalizedResult.confidence,
    });
    state.checked.set(username, normalizedResult);
    if (normalizeStatus(status) === "login_required") {
      state.autoRunning = false;
      showToast("Telegram API login required");
    }
    if (isMaxChanceCandidate({ ...normalizedResult, status }, username, "telegram") && !isInvalidTelegramResult(normalizedResult)) {
      rememberFreeItem(username, { ...normalizedResult, status, reason: displayReason });
      if (state.autoRunning && isFreeLikeStatus(status)) await saveAutoFreeUsername(username);
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
    runState.textContent = tr("states.ready");
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

  updateDiscordItem(username, { status: "pending", reason: tr("states.checkingDiscord", { username: clean }) });
  discordRunState.textContent = tr("states.checkingDiscord", { username: clean });
  setWatermark(`checking discord ${clean}`);

  try {
    const { response, result } = await fetchDiscordCheckResult(clean);
    if (!response.ok) throw new Error(result.reason || "Проверка Discord завершилась ошибкой.");

    const status = result.status || "unknown";
    const displayReason = isMaxChanceCandidate({ ...result, status }, result.username || clean, "discord")
      ? getMaxChanceReason("discord", { ...result, status })
      : result.reason || tr("states.done");

    updateDiscordItem(username, {
      username: result.username || clean,
      status,
      reason: displayReason,
      confidence: result.confidence,
      retryAfterMs: result.retryAfterMs,
      source: result.source,
    });
    if (isMaxChanceCandidate({ ...result, status }, result.username || clean, "discord")) {
      rememberServiceFreeItem("discord", result.username || clean, { ...result, status, reason: displayReason });
    }
    return { status, result };
  } catch (error) {
    updateDiscordItem(username, {
      status: "error",
      reason: error.message === "Failed to fetch"
        ? "Локальный сервер проверки не отвечает. Перезапусти приложение через start-findsense.cmd."
        : error.message || "Не получилось выполнить запрос к локальному серверу.",
    });
    return { status: "error", error };
  } finally {
    discordRunState.textContent = tr("states.ready");
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

  updateTikTokItem(username, { status: "pending", reason: tr("states.checkingTikTok", { username: clean }) });
  tiktokRunState.textContent = tr("states.checkingTikTok", { username: clean });
  setWatermark(`checking tiktok ${clean}`);

  try {
    const { response, result } = await fetchTikTokCheckResult(clean);
    if (!response.ok) throw new Error(result.reason || "Проверка TikTok завершилась ошибкой.");

    const status = result.status || "unknown";
    const displayReason = isMaxChanceCandidate({ ...result, status }, result.username || clean, "tiktok")
      ? getMaxChanceReason("tiktok", { ...result, status })
      : result.reason || tr("states.done");

    updateTikTokItem(username, {
      username: result.username || clean,
      status,
      link: result.link,
      reason: displayReason,
      confidence: result.confidence,
      source: result.source,
    });
    if (isMaxChanceCandidate({ ...result, status }, result.username || clean, "tiktok")) {
      rememberServiceFreeItem("tiktok", result.username || clean, { ...result, status, reason: displayReason });
    }
    return { status, result };
  } catch (error) {
    updateTikTokItem(username, {
      status: "error",
      reason: error.message === "Failed to fetch"
        ? "Локальный сервер проверки не отвечает. Перезапусти приложение через start-findsense.cmd."
        : error.message || "Не получилось выполнить запрос к локальному серверу.",
    });
    return { status: "error", error };
  } finally {
    tiktokRunState.textContent = tr("states.ready");
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
    showToast(tr("toast.enterDiscord"));
    return;
  }

  if (!state.discordItems.some((item) => item.username === username)) {
    state.discordItems.unshift({
      username,
      status: "pending",
      reason: tr("states.addedManual"),
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
    showToast(tr("toast.enterTikTok"));
    return;
  }

  if (!state.tiktokItems.some((item) => item.username === username)) {
    state.tiktokItems.unshift({
      username,
      status: "pending",
      reason: tr("states.addedManual"),
    });
    renderTikTok();
  }

  checkTikTokOne(username);
}

async function checkAll() {
  checkAllButton.disabled = true;
  autoModeButton.disabled = true;

  await checkItemsWithLimit([...state.items], 1, 450);

  checkAllButton.disabled = false;
  autoModeButton.disabled = false;
  runState.textContent = tr("states.done");
  showToast(tr("states.done"));
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
  autoModeButton.textContent = tr("buttons.stopAuto");
  showToast(tr("states.autoRunning", { count: getAutoFreeItems().length }));

  while (state.autoRunning) {
    batch += 1;
    generateCandidates();

    if (!state.items.length) {
      state.autoRunning = false;
      showToast(tr("states.noMoreTelegram"));
      break;
    }

    runState.textContent = `Авто: пачка ${batch}`;
    await checkItemsWithLimit([...state.items], 1, 450);

    if (state.autoRunning) await wait(650);
  }

  state.autoRunning = false;
  checkAllButton.disabled = false;
  autoModeButton.disabled = false;
  runState.textContent = tr("states.autoStopped");
  setWatermark("ready");
  render();
}

function toggleAutoMode() {
  if (state.autoRunning) {
    state.autoRunning = false;
    autoModeButton.disabled = true;
    autoState.textContent = tr("states.autoStopping");
    return;
  }

  state.autoRunning = true;
  render();
  runAutoMode();
}

function addManualCandidate() {
  const username = normalizeManualUsername(manualUsername.value);
  if (!username) {
    showToast(tr("toast.enterName"));
    return;
  }

  if (!state.items.some((item) => item.username === username)) {
    state.items.unshift({
      username,
      status: "pending",
      reason: tr("states.addedManual"),
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
  showToast(tr("toast.copied"));
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
  viewSubtitle.textContent = tr(`viewLabels.${name}`);
  render();
  renderDiscord();
  renderTikTok();
}

function bootFindsenseApp() {
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
    showToast(tr("toast.freeCleared"));
  });
  discordClearFreeButton?.addEventListener("click", () => clearServiceFreeItems("discord"));
  tiktokClearFreeButton?.addEventListener("click", () => clearServiceFreeItems("tiktok"));
  checkManualButton.addEventListener("click", addManualCandidate);
  discordCheckManualButton.addEventListener("click", addDiscordManualCandidate);
  tiktokCheckManualButton.addEventListener("click", addTikTokManualCandidate);
  checkFragmentButton.addEventListener("click", checkFragmentCandidates);
  manualUsername.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addManualCandidate();
  });
  manualUsername.addEventListener("input", () => scheduleAvailabilityCheck("telegram", manualUsername.value));
  discordManualUsername.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addDiscordManualCandidate();
  });
  discordManualUsername.addEventListener("input", () => scheduleAvailabilityCheck("discord", discordManualUsername.value));
  tiktokManualUsername.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTikTokManualCandidate();
  });
  tiktokManualUsername.addEventListener("input", () => scheduleAvailabilityCheck("tiktok", tiktokManualUsername.value));

  copyFreeButton.addEventListener("click", () => {
    const freeItems = getAutoFreeItems().length ? getAutoFreeItems() : getFreeItems();
    const freeUsernames = formatFreeUsernamesForCopy(freeItems);
    copyText(freeUsernames, tr("toast.noFree"));
  });

  copyExportButton.addEventListener("click", () => copyText(exportText.value, tr("toast.emptyList")));
  refreshExportButton.addEventListener("click", () => {
    renderExport();
    showToast(tr("buttons.refresh"));
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  bindSetting(settingAutoStart, "autoStart");
  bindSetting(settingExternalCheck, "externalCheck");
  bindSetting(settingCompactMode, "compactMode");
  bindSetting(settingLogoMotion, "logoMotion");
  bindSetting(settingWatermark, "watermark");
  setupInfoButtons();
  if (settingLanguage) {
    settingLanguage.addEventListener("change", () => {
      settings.language = settingLanguage.value;
      saveSettings();
      applySettings();
      render();
      renderDiscord();
      renderTikTok();
    });
  }
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
}

if (window.FindsenseBootTerminal?.isActive) {
  window.addEventListener("findsense:start-main", bootFindsenseApp, { once: true });
} else {
  bootFindsenseApp();
}
