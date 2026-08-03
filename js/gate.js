/* ============================================================
   GATE — the very first page she opens. Checks the real device
   clock; if the countdown's start date/time hasn't arrived yet,
   shows a live "unlocking in" clock, a rotating teaser line, and
   a progress bar for the final 24 hours before unlock. The instant
   the clock crosses midnight of the start date, it auto-redirects
   to index.html. If she opens the link after that moment, it
   redirects immediately — no waiting screen shown.
   ============================================================ */

(function () {
  "use strict";

  const TEASERS = [
    "Something sweet is waiting for you… ✨",
    "Just a little longer, my love. 💕",
    "Patience looks good on you. 🌸",
    "This is going to be worth the wait. ✦",
    "Almost there — I promise it's worth it. 💗"
  ];

  function getTarget() {
    return new Date(CONFIG.year, CONFIG.startMonth - 1, CONFIG.startDay, 0, 0, 0, 0);
  }

  function formatHMS(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  }

  function goToIndex() {
    window.location.href = "index.html";
  }

  function startTeaserRotation() {
    const el = document.getElementById("gate-teaser");
    if (!el) return;
    let i = 0;
    el.textContent = TEASERS[0];
    setInterval(() => {
      i = (i + 1) % TEASERS.length;
      el.style.opacity = "0";
      setTimeout(() => {
        el.textContent = TEASERS[i];
        el.style.opacity = "1";
      }, 500);
    }, 4000);
  }

  function updateProgress(target) {
    const fillEl = document.getElementById("gate-progress-fill");
    const pctEl = document.getElementById("gate-progress-percent");
    if (!fillEl || !pctEl) return;

    const dayMs = 24 * 60 * 60 * 1000;
    const windowStart = target.getTime() - dayMs;
    const now = Date.now();

    let pct;
    if (now <= windowStart) {
      pct = 0; // more than 24h left — bar stays empty until the final day
    } else {
      pct = Math.round(((now - windowStart) / dayMs) * 100);
      pct = Math.max(0, Math.min(100, pct));
    }

    fillEl.style.width = pct + "%";
    pctEl.textContent = pct + "%";
  }

  function init() {
    const target = getTarget();
    const now = new Date();

    // Already past the unlock moment — don't make her wait, go straight in.
    if (now >= target) {
      goToIndex();
      return;
    }

    const clockEl = document.getElementById("gate-clock");
    const wrapEl = document.getElementById("gate-clock-wrap");
    if (wrapEl) wrapEl.classList.remove("hidden");

    startTeaserRotation();

    function tick() {
      const remaining = target - new Date();
      if (remaining <= 0) {
        goToIndex();
        return;
      }
      if (clockEl) clockEl.textContent = formatHMS(remaining);
      updateProgress(target);
    }

    tick();
    setInterval(tick, 1000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();