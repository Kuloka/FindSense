window.FindsenseParallax = (() => {
  function bind() {
    const root = document.documentElement;
    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / window.innerWidth - 0.5).toFixed(4);
      const y = (event.clientY / window.innerHeight - 0.5).toFixed(4);
      root.style.setProperty("--cursor-x", x);
      root.style.setProperty("--cursor-y", y);
    }, { passive: true });
  }

  return { bind };
})();
