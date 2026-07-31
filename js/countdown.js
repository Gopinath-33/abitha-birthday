/* ============================================================
   COUNTDOWN — reads the visitor's real device date every time
   the page loads (and re-checks periodically) and reveals ONLY
   today's content. Nothing about tomorrow is ever injected into
   the DOM, so there is nothing later to "peek" at in devtools —
   only today's day-number and image path are ever created.
   ============================================================ */

(function () {
  "use strict";

  /**
   * Optional preview mode for the person building/testing the site:
   *   index.html?preview=17   → force-render Day 17
   * Never use this in the link you share with her — it's dev-only
   * and still respects the real gating rules on any date without it.
   */
  function getPreviewOverride() {
    const params = new URLSearchParams(window.location.search);
    const val = params.get("preview");
    if (!val) return null;
    const n = parseInt(val, 10);
    if (Number.isNaN(n) || n < 1 || n > CONFIG.totalDays) return null;
    return n;
  }

  function atMidnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function computeState() {
    const today = atMidnight(new Date());
    const start = atMidnight(new Date(CONFIG.year, CONFIG.startMonth - 1, CONFIG.startDay));
    const bday = atMidnight(new Date(CONFIG.year, CONFIG.birthdayMonth - 1, CONFIG.birthdayDay));

    const msPerDay = 24 * 60 * 60 * 1000;
    const elapsed = Math.round((today - start) / msPerDay);

    if (today < start) {
      return { phase: "before", daysUntilStart: Math.round((start - today) / msPerDay) };
    }
    if (today >= bday) {
      return { phase: "birthday" };
    }
    // On the start date elapsed = 0 -> Day 30. Each day after subtracts 1.
    const dayNumber = CONFIG.totalDays - elapsed;
    return { phase: "counting", dayNumber: Math.max(0, Math.min(CONFIG.totalDays, dayNumber)) };
  }

  let typeTimer = null;
  function typeWriter(el, text) {
    if (typeTimer) clearInterval(typeTimer);
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      el.textContent = text;
      return;
    }
    el.textContent = "";
    let i = 0;
    typeTimer = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i += 1;
      if (i >= text.length) clearInterval(typeTimer);
    }, 26);
  }

  function renderCounting(dayNumber) {
    const quote = CONFIG.quotes[CONFIG.totalDays - dayNumber] || CONFIG.quotes[CONFIG.quotes.length - 1];
    const imgSrc = `assets/images/days/day-${dayNumber}.jpg`;
    const progressPct = Math.round(((CONFIG.totalDays - dayNumber) / CONFIG.totalDays) * 100);

    document.getElementById("headline").textContent =
      `Advance Happy Birthday, My Dear ${CONFIG.herName} ❤️`;
    document.getElementById("day-number").textContent = dayNumber;
    document.getElementById("day-label").textContent =
      dayNumber === 1 ? "Day To Go" : "Days To Go";
    typeWriter(document.getElementById("quote"), quote);

    const milestoneEl = document.getElementById("milestone-badge");
    if (milestoneEl) {
      const msg = CONFIG.milestones && CONFIG.milestones[dayNumber];
      if (msg) {
        milestoneEl.textContent = msg;
        milestoneEl.classList.remove("hidden");
      } else {
        milestoneEl.classList.add("hidden");
      }
    }

    const img = document.getElementById("day-image");
    img.src = imgSrc;
    img.alt = `Day ${dayNumber} — a little something for ${CONFIG.herName}`;
    if (typeof window.resetScratchCard === "function") {
      // let the new image start loading before re-covering the frame
      requestAnimationFrame(() => window.resetScratchCard());
    }

    const medallionImg = document.getElementById("medallion-img");
    medallionImg.src = imgSrc;

    setProgress(progressPct);
    animateRing(progressPct);

    document.querySelectorAll(".fade-swap-target").forEach((el) => {
      el.classList.remove("fade-swap");
      // reflow to restart animation
      void el.offsetWidth;
      el.classList.add("fade-swap");
    });
  }

  function renderBeforeStart(daysUntilStart) {
    document.getElementById("headline").textContent =
      `Something Sweet Is Coming, ${CONFIG.herName} ✦`;
    document.getElementById("day-number").textContent = CONFIG.totalDays;
    document.getElementById("day-label").textContent = "Countdown Begins Soon";
    document.getElementById("quote").textContent =
      `The countdown unlocks in ${daysUntilStart} day${daysUntilStart === 1 ? "" : "s"} — on ${CONFIG.startMonth}/${CONFIG.startDay}. Come back then. ✦`;

    const img = document.getElementById("day-image");
    img.src = `assets/images/days/day-${CONFIG.totalDays}.jpg`;
    img.alt = "Preview";
    document.getElementById("medallion-img").src = img.src;

    setProgress(0);
    animateRing(0);
  }

  function setProgress(pct) {
    document.getElementById("progress-fill").style.width = pct + "%";
    document.getElementById("progress-percent").textContent = pct + "%";
  }

  function animateRing(pct) {
    const circle = document.getElementById("medallion-progress-circle");
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference - (pct / 100) * circumference}`;
  }

  function formatHMS(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  }

  let clockTimer = null;
  function startLiveClock(targetDate, label) {
    const wrap = document.getElementById("live-clock-wrap");
    const labelEl = document.getElementById("live-clock-label");
    const clockEl = document.getElementById("live-clock");
    if (!wrap || !clockEl) return;
    wrap.classList.remove("hidden");
    labelEl.textContent = label;
    if (clockTimer) clearInterval(clockTimer);
    function tick() {
      clockEl.textContent = formatHMS(targetDate - new Date());
    }
    tick();
    clockTimer = setInterval(tick, 1000);
  }

  function goToBirthdayPage() {
    window.location.href = "birthday.html";
  }

  function init() {
    const startLabelEl = document.getElementById("progress-start-label");
    if (startLabelEl) {
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      startLabelEl.textContent = `${monthNames[CONFIG.startMonth - 1]} ${CONFIG.startDay}`;
    }

    const preview = getPreviewOverride();
    const state = preview ? { phase: "counting", dayNumber: preview } : computeState();

    if (state.phase === "birthday") {
      goToBirthdayPage();
      return;
    }
    if (state.phase === "before") {
      renderBeforeStart(state.daysUntilStart);
      const start = atMidnight(new Date(CONFIG.year, CONFIG.startMonth - 1, CONFIG.startDay));
      startLiveClock(start, "Countdown Unlocks In");
    } else {
      renderCounting(state.dayNumber);
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      startLiveClock(nextMidnight, "Next Surprise Unlocks In");
    }

    // Re-check at local midnight (and as a safety net, every hour) so a page
    // left open overnight flips to the next day/phase without a manual reload.
    scheduleMidnightCheck();
  }

  function scheduleMidnightCheck() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 1, 0);
    const msUntilMidnight = nextMidnight - now;
    setTimeout(() => {
      init();
    }, msUntilMidnight);
    // extra safety net
    setInterval(() => {
      const s = computeState();
      if (s.phase === "birthday") goToBirthdayPage();
    }, 60 * 60 * 1000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
