/* ============================================================
   ROSE GARDEN — a visual echo of the countdown. One rose blooms
   per day that's passed; the whole garden is in bloom on her
   birthday. Uses the same date math as countdown.js.
   ============================================================ */

(function () {
  "use strict";

  const grid = document.getElementById("garden-grid");
  const messageEl = document.getElementById("garden-message");
  if (!grid) return;

  function atMidnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function computeBloomState() {
    const today = atMidnight(new Date());
    const start = atMidnight(new Date(CONFIG.year, CONFIG.startMonth - 1, CONFIG.startDay));
    const bday = atMidnight(new Date(CONFIG.year, CONFIG.birthdayMonth - 1, CONFIG.birthdayDay));
    const total = CONFIG.totalDays;

    if (today < start) return { bloomed: 0, total, phase: "before" };
    if (today >= bday) return { bloomed: total, total, phase: "birthday" };

    const msPerDay = 24 * 60 * 60 * 1000;
    const elapsed = Math.round((today - start) / msPerDay);
    const bloomed = Math.min(total, elapsed + 1);
    return { bloomed, total, phase: "counting" };
  }

  function render() {
    const state = computeBloomState();
    grid.innerHTML = "";

    for (let i = 1; i <= state.total; i++) {
      const cell = document.createElement("div");
      const isBloomed = i <= state.bloomed;
      const isToday = i === state.bloomed && state.phase === "counting";
      cell.className = "rose-cell" + (isBloomed ? " bloomed" : "") + (isToday ? " today" : "");
      cell.innerHTML = `<span class="rose-emoji">${isBloomed ? "🌹" : "🥀"}</span><span class="rose-day">${i}</span>`;
      grid.appendChild(cell);
    }

    if (messageEl) {
      if (state.phase === "birthday") {
        messageEl.textContent = CONFIG.roseGarden.fullBloomMessage;
      } else if (state.phase === "before") {
        messageEl.textContent = "The garden hasn't been planted yet — come back on the start date. 🌱";
      } else {
        messageEl.textContent = `${state.bloomed} of ${state.total} roses have bloomed so far. ✦`;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
