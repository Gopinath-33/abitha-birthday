/* ============================================================
   HEART CATCH — tap falling hearts. Reaching the goal unlocks
   a surprise message (see CONFIG.heartCatch in config.js).
   ============================================================ */

(function () {
  "use strict";

  const field = document.getElementById("heart-field");
  const countEl = document.getElementById("heart-count");
  const goalEl = document.getElementById("heart-goal");
  const startBtn = document.getElementById("heart-start");
  const surpriseEl = document.getElementById("heart-surprise");
  const surpriseTitle = document.getElementById("heart-surprise-title");
  const surpriseText = document.getElementById("heart-surprise-text");

  if (!field) return;

  const goal = (CONFIG.heartCatch && CONFIG.heartCatch.goal) || 30;
  if (goalEl) goalEl.textContent = goal;

  let caught = 0;
  let spawnTimer = null;
  let running = false;
  const symbols = ["❤️", "💗", "💕"];

  function updateCount() {
    if (countEl) countEl.textContent = caught;
  }

  function spawnHeart() {
    if (!running) return;
    const heart = document.createElement("button");
    heart.type = "button";
    heart.className = "falling-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 88 + "%";
    const duration = 3.2 + Math.random() * 1.8;
    heart.style.animationDuration = duration + "s";
    heart.setAttribute("aria-label", "Catch heart");

    heart.addEventListener("click", () => {
      if (!running) return;
      caught += 1;
      updateCount();
      heart.remove();
      if (caught >= goal) finishGame();
    });

    field.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 100);
  }

  function startGame() {
    caught = 0;
    updateCount();
    running = true;
    if (surpriseEl) surpriseEl.classList.add("hidden");
    if (startBtn) { startBtn.textContent = "Playing…"; startBtn.disabled = true; }
    spawnTimer = setInterval(spawnHeart, 550);
  }

  function finishGame() {
    running = false;
    clearInterval(spawnTimer);
    field.innerHTML = "";
    if (startBtn) { startBtn.textContent = "Play Again"; startBtn.disabled = false; }
    if (surpriseEl && surpriseTitle && surpriseText) {
      const cfg = CONFIG.heartCatch || {};
      surpriseTitle.textContent = cfg.surpriseTitle || "You did it! 💕";
      surpriseText.textContent = cfg.surpriseMessage || "";
      surpriseEl.classList.remove("hidden");
    }
    if (typeof spawnFloater === "function") {
      spawnFloater(window.innerWidth / 2, window.innerHeight * 0.4, "🎉", 10);
    }
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      clearInterval(spawnTimer);
      field.innerHTML = "";
      startGame();
    });
  }

  updateCount();
})();
