window.FindsenseMotion = (() => {
  function boot() {
    window.FindsenseLiveFeed?.startAmbient();
    window.FindsenseTerminal?.boot();
    window.FindsenseParallax?.bind();
  }

  return { boot };
})();
