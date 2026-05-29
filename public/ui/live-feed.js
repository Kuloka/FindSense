window.FindsenseLiveFeed = (() => {
  const statuses = ["FREE", "TAKEN", "RESERVED", "INVALID", "UNKNOWN"];
  const seeds = {
    TG: ["aarvi", "voron", "qxyna", "neovi", "arkxo", "lumex", "zairu", "veliq"],
    TT: ["vexa", "tokro", "miqz", "lunoa", "ravax", "zentr", "kivio", "nexu"],
    DC: ["ax", "voro", "qz", "mika", "riven", "koji", "nox", "vel"],
  };
  let index = 0;

  function normalizeStatus(status) {
    const value = String(status || "UNKNOWN").toUpperCase();
    if (value.includes("FREE")) return "FREE";
    if (value.includes("TAKEN")) return "TAKEN";
    if (value.includes("RESERVED")) return "RESERVED";
    if (value.includes("INVALID")) return "INVALID";
    return value === "PENDING" ? "UNKNOWN" : value;
  }

  function getFeed(service) {
    const normalizedService = String(service || "TG").toUpperCase();
    const selector = normalizedService === "TT"
      ? "#liveFeedTikTok"
      : normalizedService === "DC"
        ? "#liveFeedDiscord"
        : "#liveFeedTelegram";
    return document.querySelector(selector);
  }

  function append(username, status, service = "SCAN") {
    const feed = getFeed(service);
    if (!feed || !username) return;

    const state = normalizeStatus(status);
    const row = document.createElement("div");
    row.className = `feed-item feed-${state.toLowerCase()}`;
    row.innerHTML = `
      <span class="feed-service">${service}</span>
      <strong>@${String(username).replace(/^@/, "")}</strong>
      <em>${state}</em>
    `;
    feed.prepend(row);
    [...feed.children].slice(18).forEach((child) => child.remove());
  }

  function startAmbient() {
    setInterval(() => {
      const service = ["TG", "TT", "DC"][index % 3];
      const pool = seeds[service];
      const username = pool[Math.floor(index / 3) % pool.length];
      const status = statuses[(index * 3 + 1) % statuses.length];
      append(username, status, service);
      index += 1;
    }, 3200);
  }

  return { append, startAmbient };
})();
