/* ============================================================
   WHEEL OF LOVE — spins and lands on a random option from
   CONFIG.wheelOptions.
   ============================================================ */

(function () {
  "use strict";

  const wheel = document.getElementById("love-wheel");
  const spinBtn = document.getElementById("wheel-spin");
  const resultEl = document.getElementById("wheel-result");
  const legendEl = document.getElementById("wheel-legend");

  if (!wheel) return;

  const options = (CONFIG.wheelOptions && CONFIG.wheelOptions.length) ? CONFIG.wheelOptions : ["Surprise 🎁"];
  const segColors = ["#e8749a", "#9b5de5", "#e8c878", "#ffd6e8", "#c77dd1", "#f4e3a1"];
  const segAngle = 360 / options.length;

  function buildWheelBackground() {
    const stops = options
      .map((_, i) => {
        const color = segColors[i % segColors.length];
        const from = i * segAngle;
        const to = (i + 1) * segAngle;
        return `${color} ${from}deg ${to}deg`;
      })
      .join(", ");
    wheel.style.background = `conic-gradient(${stops})`;
  }

  function buildLegend() {
    if (!legendEl) return;
    legendEl.innerHTML = "";
    options.forEach((opt, i) => {
      const item = document.createElement("div");
      item.className = "wheel-legend-item";
      item.innerHTML =
        `<span class="wheel-swatch" style="background:${segColors[i % segColors.length]}"></span>` +
        `<span>${opt}</span>`;
      legendEl.appendChild(item);
    });
  }

  let currentRotation = 0;
  let spinning = false;

  function spin() {
    if (spinning) return;
    spinning = true;
    if (resultEl) resultEl.textContent = "";
    if (spinBtn) spinBtn.disabled = true;

    const chosenIndex = Math.floor(Math.random() * options.length);
    // land in the middle of the chosen segment, at the top pointer (0deg reference)
    const segmentMid = chosenIndex * segAngle + segAngle / 2;
    const extraSpins = 5 * 360;
    // wheel rotates so that (360 - segmentMid) aligns with the top pointer
    const targetRotation = currentRotation + extraSpins + (360 - segmentMid) - (currentRotation % 360);

    currentRotation = targetRotation;
    wheel.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
      spinning = false;
      if (spinBtn) spinBtn.disabled = false;
      if (resultEl) resultEl.textContent = `You got: ${options[chosenIndex]}`;
      if (typeof spawnFloater === "function") {
        spawnFloater(window.innerWidth / 2, window.innerHeight * 0.4, "✨", 6);
      }
    }, 3200);
  }

  if (spinBtn) spinBtn.addEventListener("click", spin);

  buildWheelBackground();
  buildLegend();
})();
