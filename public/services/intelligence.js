window.FindsenseIntelligence = (() => {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const rareLetters = new Set(["q", "x", "z", "v", "k", "j"]);

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Math.round(value)));
  }

  function normalizedName(value = "") {
    return String(value).toLowerCase().replace(/^@/, "").replace(/[^a-z0-9._]/g, "");
  }

  function hasReadablePattern(name) {
    let alternating = 0;
    for (let index = 1; index < name.length; index += 1) {
      if (vowels.has(name[index]) !== vowels.has(name[index - 1])) alternating += 1;
    }
    return alternating >= Math.max(2, Math.floor(name.length * 0.42));
  }

  function getScores(username, status = "unknown") {
    const name = normalizedName(username);
    const length = name.length || 1;
    const uniqueChars = new Set(name.replace(/[^a-z0-9]/g, "")).size;
    const rareCount = [...name].filter((char) => rareLetters.has(char)).length;
    const hasDigits = /\d/.test(name);
    const hasSeparator = /[._]/.test(name);
    const repeated = /(.)\1{2,}/.test(name);
    const readable = hasReadablePattern(name);
    const cleanWord = /^[a-z]+$/.test(name);

    const rarity = clamp(104 - length * 7 + uniqueChars * 6 + rareCount * 8 - (hasDigits ? 5 : 0) - (hasSeparator ? 8 : 0));
    const brandability = clamp(52 + (cleanWord ? 18 : 0) + (length <= 6 ? 16 : 0) + uniqueChars * 3 - (repeated ? 14 : 0) - (hasSeparator ? 10 : 0));
    const pronounceability = clamp(38 + (readable ? 34 : 0) + (cleanWord ? 12 : 0) - rareCount * 5 - (hasDigits ? 20 : 0) - (hasSeparator ? 12 : 0));
    const confidenceLift = ["free", "taken", "reserved", "invalid"].includes(String(status).toLowerCase()) ? 5 : 0;

    return {
      rarity: clamp(rarity + confidenceLift),
      brandability: brandability >= 78 ? "HIGH" : brandability >= 56 ? "MED" : "LOW",
      pronounceability: pronounceability >= 76 ? "GOOD" : pronounceability >= 52 ? "FAIR" : "LOW",
      estimatedRarity: rarity >= 88 ? "ULTRA RARE" : rarity >= 72 ? "RARE" : rarity >= 52 ? "LIMITED" : "COMMON",
    };
  }

  function renderScoreGrid(username, status) {
    const scores = getScores(username, status);
    return `
      <div class="intel-grid" aria-label="username intelligence">
        <span><b>${scores.rarity}/100</b><em>RARITY</em></span>
        <span><b>${scores.brandability}</b><em>BRANDABLE</em></span>
        <span><b>${scores.pronounceability}</b><em>SPEAK</em></span>
        <span><b>${scores.estimatedRarity}</b><em>ESTIMATE</em></span>
      </div>
    `;
  }

  return { getScores, renderScoreGrid };
})();
