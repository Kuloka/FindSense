window.FindsenseLiquidDrops = (() => {
  const BLOB_COUNT = 64;
  const FIELD_SCALE = 16;
  const THRESHOLD = 1.08;
  const EDGE_WIDTH = 0.46;
  const VISCOSITY = 0.992;
  const ATTRACTION_DISTANCE = 120;
  const ATTRACTION_FORCE = 0.000018;

  let canvas;
  let context;
  let fieldCanvas;
  let fieldContext;
  let width = 0;
  let height = 0;
  let fieldWidth = 0;
  let fieldHeight = 0;
  let blobs = [];
  let imageData;
  let lastRender = 0;
  let isVisible = true;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function createBlob() {
    const radius = random(18, 48);
    return {
      x: random(-width * 0.1, width * 1.1),
      y: random(-height * 0.25, height * 1.05),
      vx: random(-0.12, 0.12),
      vy: random(0.02, 0.22),
      radius,
      drift: random(0, Math.PI * 2),
    };
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    fieldWidth = Math.ceil(width / FIELD_SCALE);
    fieldHeight = Math.ceil(height / FIELD_SCALE);

    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    fieldCanvas.width = fieldWidth;
    fieldCanvas.height = fieldHeight;
    imageData = fieldContext.createImageData(fieldWidth, fieldHeight);
    blobs = Array.from({ length: BLOB_COUNT }, createBlob);
  }

  function applyAttraction() {
    for (let i = 0; i < blobs.length; i += 1) {
      const a = blobs[i];
      for (let j = i + 1; j < blobs.length; j += 1) {
        const b = blobs[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq <= 1 || distanceSq > ATTRACTION_DISTANCE * ATTRACTION_DISTANCE) continue;

        const distance = Math.sqrt(distanceSq);
        const pull = (1 - distance / ATTRACTION_DISTANCE) * ATTRACTION_FORCE;
        const forceX = dx * pull;
        const forceY = dy * pull;
        a.vx += forceX * b.radius;
        a.vy += forceY * b.radius;
        b.vx -= forceX * a.radius;
        b.vy -= forceY * a.radius;
      }
    }
  }

  function updateBlobs() {
    applyAttraction();

    for (const blob of blobs) {
      blob.drift += 0.006;
      blob.vx += Math.sin(blob.drift) * 0.0018;
      blob.vy += 0.0018;
      blob.vx *= VISCOSITY;
      blob.vy *= VISCOSITY;
      blob.x += blob.vx;
      blob.y += blob.vy;

      if (blob.x < -blob.radius * 2) blob.x = width + blob.radius;
      if (blob.x > width + blob.radius * 2) blob.x = -blob.radius;
      if (blob.y > height + blob.radius * 2) {
        blob.x = random(-width * 0.08, width * 1.08);
        blob.y = random(-height * 0.32, -blob.radius);
        blob.vx = random(-0.1, 0.1);
        blob.vy = random(0.02, 0.16);
      }
    }
  }

  function smoothStep(edge0, edge1, value) {
    const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function drawField() {
    const data = imageData.data;
    let pointer = 0;

    for (let y = 0; y < fieldHeight; y += 1) {
      const py = y * FIELD_SCALE;
      for (let x = 0; x < fieldWidth; x += 1) {
        const px = x * FIELD_SCALE;
        let density = 0;

        for (const blob of blobs) {
          const dx = px - blob.x;
          const dy = py - blob.y;
          const distanceSq = dx * dx + dy * dy + 36;
          density += (blob.radius * blob.radius) / distanceSq;
        }

        const alpha = smoothStep(THRESHOLD - EDGE_WIDTH, THRESHOLD + EDGE_WIDTH, density);
        const glass = Math.min(1, alpha);
        const highlight = Math.max(0, Math.min(1, (density - THRESHOLD) * 0.18));

        data[pointer] = 180 + highlight * 58;
        data[pointer + 1] = 208 + highlight * 38;
        data[pointer + 2] = 238 + highlight * 17;
        data[pointer + 3] = Math.round(glass * 72);
        pointer += 4;
      }
    }

    fieldContext.putImageData(imageData, 0, 0);
    context.clearRect(0, 0, width, height);
    context.save();
    context.imageSmoothingEnabled = true;
    context.filter = "blur(10px) saturate(1.28)";
    context.globalCompositeOperation = "screen";
    context.drawImage(fieldCanvas, 0, 0, width, height);
    context.filter = "blur(2px)";
    context.globalAlpha = 0.46;
    context.drawImage(fieldCanvas, 0, 0, width, height);
    context.restore();
  }

  function render() {
    if (!isVisible) {
      requestAnimationFrame(render);
      return;
    }

    const now = performance.now();
    if (now - lastRender < 33) {
      requestAnimationFrame(render);
      return;
    }
    lastRender = now;

    updateBlobs();
    drawField();
    requestAnimationFrame(render);
  }

  function boot() {
    canvas = document.querySelector("#liquidDropsCanvas");
    if (!canvas) return;
    context = canvas.getContext("2d", { alpha: true });
    fieldCanvas = document.createElement("canvas");
    fieldContext = fieldCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      isVisible = document.visibilityState === "visible";
    });
    render();
  }

  return { boot };
})();
