window.FindsenseTerminal = (() => {
  function getTerminal(service) {
    const normalizedService = String(service || "TG").toUpperCase();
    const selector = normalizedService === "TT"
      ? "#terminalLogTikTok"
      : normalizedService === "DC"
        ? "#terminalLogDiscord"
        : "#terminalLogTelegram";
    return document.querySelector(selector);
  }

  function write(type, message, service = "TG") {
    const terminal = getTerminal(service);
    if (!terminal) return;

    const row = document.createElement("div");
    const time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    row.className = `terminal-row terminal-${String(type || "scan").toLowerCase()}`;
    row.innerHTML = `<span>${time}</span><b>[${String(type || "SCAN").toUpperCase()}]</b><em>${message}</em>`;
    terminal.prepend(row);
    [...terminal.children].slice(28).forEach((child) => child.remove());
  }

  function boot() {
    [
      ["TG", "Telegram Fragment scanner online"],
      ["TT", "TikTok scanner online"],
      ["DC", "Discord scanner online"],
    ].forEach(([service, message]) => {
      write("sys", message, service);
      write("parser", "reserved keyword detector armed", service);
      write("scan", "queue awaiting candidates", service);
    });
  }

  return { write, boot };
})();
