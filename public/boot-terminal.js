(() => {
  const terminal = document.querySelector("#bootTerminal");
  const panel = document.querySelector("#bootDirectPanel");
  const output = document.querySelector("#bootDirectOutput");
  const form = document.querySelector("#bootDirectCommand");
  const input = document.querySelector("#bootDirectInput");
  const value = document.querySelector("#bootDirectValue");

  if (!terminal || !panel || !output || !form || !input || !value) {
    window.FindsenseBootTerminal = { isActive: false };
    return;
  }

  window.FindsenseBootTerminal = { isActive: true };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const banner = [
    "███████╗██╗███╗   ██╗██████╗ ███████╗███████╗███╗   ██╗███████╗███████╗",
    "██╔════╝██║████╗  ██║██╔══██╗██╔════╝██╔════╝████╗  ██║██╔════╝██╔════╝",
    "█████╗  ██║██╔██╗ ██║██║  ██║███████╗█████╗  ██╔██╗ ██║███████╗█████╗",
    "██╔══╝  ██║██║╚██╗██║██║  ██║╚════██║██╔══╝  ██║╚██╗██║╚════██║██╔══╝",
    "██║     ██║██║ ╚████║██████╔╝███████║███████╗██║ ╚████║███████║███████╗",
    "╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝",
  ];

  const sideArt = [
    "                                        _.oo.",
    "                 _.u[[/;:,.         .odMMMMMM'",
    "              .o888UU[[[/;:-.  .o@P^    MMM^",
    "             oN88888UU[[[/;::-.        dP^",
    "            dNMMNN888UU[[[/;:--.   .o@P^",
    "           ,MMMMMMN888UU[[/;::-. o@^",
    "           NNMMMNN888UU[[[/~.o@P^",
    "           888888888UU[[[/o@^-..",
    "          oI8888UU[[[/o@P^:--..",
    "       .@^  YUU[[[/o@^;::---..",
    "     oMP     ^/o@P^;:::---..",
    "  .dMMM    .o@^ ^;::---...",
    " dMMMMMMM@^`       `^^^^",
    "YMMMUP^",
    " ^^",
  ];

  const lines = [
    ...banner,
    "",
    ...sideArt,
    "",
    "WELCOME TO FINDSENSE",
    "",
    "findsense@core:~$ boot",
    "",
    "[system] loading username engine...",
    "[system] loading telegram scanner...",
    "[system] loading discord scanner...",
    "[system] loading tiktok scanner...",
    "[system] loading instagram scanner...",
    "",
    "[success] username database loaded",
    "[success] scanner network online",
    "[success] availability engine ready",
    "",
    "---",
    "",
    "TYPE START TO CONTINUE",
    "",
  ];

  const finalBanner = [
    " █     █░▓█████  ██▓     ▄████▄   ▒█████   ███▄ ▄███▓▓█████          ▄▄▄█████▓ ▒█████            █    ██   ██████ ▓█████  ██▀███   ███▄    █  ▄▄▄       ███▄ ▄███▓▓█████            █████▒██▓ ███▄    █ ▓█████▄ ▓█████  ██▀███",
    "▓█░ █ ░█░▓█   ▀ ▓██▒    ▒██▀ ▀█  ▒██▒  ██▒▓██▒▀█▀ ██▒▓█   ▀          ▓  ██▒ ▓▒▒██▒  ██▒          ██  ▓██▒▒██    ▒ ▓█   ▀ ▓██ ▒ ██▒ ██ ▀█   █ ▒████▄    ▓██▒▀█▀ ██▒▓█   ▀          ▓██   ▒▓██▒ ██ ▀█   █ ▒██▀ ██▌▓█   ▀ ▓██ ▒ ██▒",
    "▒█░ █ ░█ ▒███   ▒██░    ▒▓█    ▄ ▒██░  ██▒▓██    ▓██░▒███            ▒ ▓██░ ▒░▒██░  ██▒         ▓██  ▒██░░ ▓██▄   ▒███   ▓██ ░▄█ ▒▓██  ▀█ ██▒▒██  ▀█▄  ▓██    ▓██░▒███            ▒████ ░▒██▒▓██  ▀█ ██▒░██   █▌▒███   ▓██ ░▄█ ▒",
    "░█░ █ ░█ ▒▓█  ▄ ▒██░    ▒▓▓▄ ▄██▒▒██   ██░▒██    ▒██ ▒▓█  ▄          ░ ▓██▓ ░ ▒██   ██░         ▓▓█  ░██░  ▒   ██▒▒▓█  ▄ ▒██▀▀█▄  ▓██▒  ▐▌██▒░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄          ░▓█▒  ░░██░▓██▒  ▐▌██▒░▓█▄   ▌▒▓█  ▄ ▒██▀▀█▄",
    "░░██▒██▓ ░▒████▒░██████▒▒ ▓███▀ ░░ ████▓▒░▒██▒   ░██▒░▒████▒           ▒██▒ ░ ░ ████▓▒░         ▒▒█████▓ ▒██████▒▒░▒████▒░██▓ ▒██▒▒██░   ▓██░ ▓█   ▓██▒▒██▒   ░██▒░▒████▒         ░▒█░   ░██░▒██░   ▓██░░▒████▓ ░▒████▒░██▓ ▒██▒",
    "░ ▓░▒ ▒  ░░ ▒░ ░░ ▒░▓  ░░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒░   ░  ░░░ ▒░ ░           ▒ ░░   ░ ▒░▒░▒░          ░▒▓▒ ▒ ▒ ▒ ▒▓▒ ▒ ░░░ ▒░ ░░ ▒▓ ░▒▓░░ ▒░   ▒ ▒  ▒▒   ▓▒█░░ ▒░   ░  ░░░ ▒░ ░          ▒ ░   ░▓  ░ ▒░   ▒ ▒  ▒▒▓  ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░",
    "  ▒ ░ ░   ░ ░  ░░ ░ ▒  ░  ░  ▒     ░ ▒ ▒░ ░  ░      ░ ░ ░  ░             ░      ░ ▒ ▒░          ░░▒░ ░ ░ ░ ░▒  ░ ░ ░ ░  ░  ░▒ ░ ▒░░ ░░   ░ ▒░  ▒   ▒▒ ░░  ░      ░ ░ ░  ░          ░      ▒ ░░ ░░   ░ ▒░ ░ ▒  ▒  ░ ░  ░  ░▒ ░ ▒░",
    "  ░   ░     ░     ░ ░   ░        ░ ░ ░ ▒  ░      ░      ░              ░      ░ ░ ░ ▒            ░░░ ░ ░ ░  ░  ░     ░     ░░   ░    ░   ░ ░   ░   ▒   ░      ░      ░             ░ ░    ▒ ░   ░   ░ ░  ░ ░  ░    ░     ░░   ░",
    "    ░       ░  ░    ░  ░░ ░          ░ ░         ░      ░  ░                      ░ ░              ░           ░     ░  ░   ░              ░       ░  ░       ░      ░  ░                 ░           ░    ░       ░  ░   ░",
    "                        ░                                                                                                                                                                                ░",
  ];

  async function typeLine(text, className = "") {
    const row = document.createElement("div");
    row.className = `boot-direct-line ${className}`.trim();
    output.appendChild(row);

    if (!text) {
      row.innerHTML = "&nbsp;";
      await wait(14);
      return;
    }

    for (let index = 0; index < text.length; index += 1) {
      row.textContent += text[index];
      panel.scrollTop = panel.scrollHeight;
      await wait(1);
    }
    panel.scrollTop = panel.scrollHeight;
    await wait(10);
  }

  async function boot() {
    input.disabled = true;
    form.classList.add("is-hidden");
    for (const text of lines) {
      const className = banner.includes(text)
        ? "ascii"
        : sideArt.includes(text)
          ? "art"
          : text === "WELCOME TO FINDSENSE"
            ? "welcome"
            : text.startsWith("[success]")
              ? "success"
              : text.startsWith("[system]")
                ? "system"
                : text === "TYPE START TO CONTINUE"
                  ? "continue"
                  : "";
      await typeLine(text, className);
    }
    form.classList.remove("is-hidden");
    input.disabled = false;
    panel.scrollTop = panel.scrollHeight;
    input.focus();
  }

  function finishBoot() {
    if (terminal.dataset.finished === "true") return;
    terminal.dataset.finished = "true";
    document.body.classList.add("boot-complete");
    document.body.classList.remove("boot-locked");
    window.dispatchEvent(new CustomEvent("findsense:start-main"));
    setTimeout(() => terminal.remove(), 950);
  }

  async function runProgressBar() {
    const row = document.createElement("div");
    row.className = "boot-direct-line progress";
    output.appendChild(row);

    const width = 24;
    for (let percent = 0; percent <= 100; percent += 1) {
      const filled = Math.round((percent / 100) * width);
      row.textContent = `[${"█".repeat(filled)}${"-".repeat(width - filled)}] ${percent}%`;
      panel.scrollTop = panel.scrollHeight;
      await wait(6);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const command = input.value.trim().toLowerCase();
    if (command !== "start" && command !== "initialize") {
      await typeLine(`findsense@core:~$ ${input.value}`, "echo");
      await typeLine("command not found. type start", "error");
      input.value = "";
      value.textContent = "";
      input.focus();
      return;
    }

    await typeLine(`findsense@core:~$ ${input.value}`, "echo");
    input.disabled = true;
    form.classList.add("is-hidden");
    await runProgressBar();
    await wait(120);
    await typeLine("");
    for (const line of finalBanner) {
      await typeLine(line, "final");
    }
    await wait(520);
    finishBoot();
  });

  input.addEventListener("input", () => {
    value.textContent = input.value;
  });

  terminal.addEventListener("click", () => input.focus());
  window.addEventListener("load", boot);
})();
