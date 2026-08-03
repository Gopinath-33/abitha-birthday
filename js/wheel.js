/* ============================================================
   WHEEL OF LOVE — spins and lands on a random option from
   CONFIG.wheelOptions (rewards + dares). One spin per day is
   allowed; spinning 7 days in a row unlocks a bonus message.
   Every spin result is emailed to you via EmailJS.
   ============================================================ */

(function () {
  "use strict";

  const wheel = document.getElementById("love-wheel");
  const spinBtn = document.getElementById("wheel-spin");
  const resultEl = document.getElementById("wheel-result");
  const legendEl = document.getElementById("wheel-legend");
  const streakEl = document.getElementById("wheel-streak");

  if (!wheel) return;

  const rawOptions = (CONFIG.wheelOptions && CONFIG.wheelOptions.length)
    ? CONFIG.wheelOptions
    : [{ label: "Surprise 🎁", dare: false }];

  // Normalize in case any entry is still a plain string (backward-compat).
  const options = rawOptions.map((o) =>
    typeof o === "string" ? { label: o, dare: false } : o
  );

  const segColors = ["#e8749a", "#9b5de5", "#e8c878", "#ffd6e8", "#c77dd1", "#f4e3a1"];
  const dareBorder = "#ff4d6d";
  const segAngle = 360 / options.length;

  const STREAK_KEY = "loveWheelStreak";

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
      const swatchStyle = opt.dare
        ? `background:${segColors[i % segColors.length]};border:2px solid ${dareBorder};`
        : `background:${segColors[i % segColors.length]};`;
      item.innerHTML =
        `<span class="wheel-swatch" style="${swatchStyle}"></span>` +
        `<span>${opt.label}${opt.dare ? " (dare)" : ""}</span>`;
      legendEl.appendChild(item);
    });
  }

  /* ---------- Streak helpers ---------- */
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function yesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function loadStreak() {
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      if (!raw) return { lastSpinDate: null, streak: 0 };
      const parsed = JSON.parse(raw);
      return { lastSpinDate: parsed.lastSpinDate || null, streak: parsed.streak || 0 };
    } catch (e) {
      return { lastSpinDate: null, streak: 0 };
    }
  }

  function saveStreak(state) {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(state));
    } catch (e) {
      // storage unavailable — streak just won't persist, that's fine
    }
  }

  function renderStreak(streak, alreadySpunToday) {
    if (!streakEl) return;
    if (alreadySpunToday) {
      streakEl.textContent = `🔥 ${streak}-day streak — come back tomorrow for your next spin!`;
    } else {
      streakEl.textContent = streak > 0
        ? `🔥 ${streak}-day streak — spin today to keep it going!`
        : `Spin once a day to build your streak 🔥`;
    }
  }

  function updateStreakOnSpin() {
    const state = loadStreak();
    const today = todayStr();
    if (state.lastSpinDate === yesterdayStr()) {
      state.streak += 1;
    } else if (state.lastSpinDate !== today) {
      state.streak = 1;
    }
    state.lastSpinDate = today;
    saveStreak(state);
    return state.streak;
  }

  function hasSpunToday() {
    const state = loadStreak();
    return state.lastSpinDate === todayStr();
  }

  /* ---------- Email the result ---------- */
  function emailResult(resultLabel, isDare, streak) {
    if (typeof emailjs === "undefined" || !CONFIG.emailjs) return;
    try {
      emailjs.init(CONFIG.emailjs.publicKey);
      const message = isDare
        ? `Wheel of Love spin landed on a DARE: "${resultLabel}" (streak: ${streak} day${streak === 1 ? "" : "s"})`
        : `Wheel of Love spin result: "${resultLabel}" (streak: ${streak} day${streak === 1 ? "" : "s"})`;
      emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
        name: CONFIG.herName || "Wheel of Love",
        message: message
      });
    } catch (e) {
      // silent fail — don't block the on-screen experience if email fails
    }
  }

  let currentRotation = 0;
  let spinning = false;

  function spin() {
    if (spinning) return;

    if (hasSpunToday()) {
      if (resultEl) resultEl.textContent = "You've already spun today — come back tomorrow! 🔥";
      return;
    }

    spinning = true;
    if (resultEl) resultEl.textContent = "";
    if (spinBtn) spinBtn.disabled = true;

    const chosenIndex = Math.floor(Math.random() * options.length);
    const chosen = options[chosenIndex];
    // land in the middle of the chosen segment, at the top pointer (0deg reference)
    const segmentMid = chosenIndex * segAngle + segAngle / 2;
    const extraSpins = 5 * 360;
    // wheel rotates so that (360 - segmentMid) aligns with the top pointer
    const targetRotation = currentRotation + extraSpins + (360 - segmentMid) - (currentRotation % 360);

    currentRotation = targetRotation;
    wheel.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
      spinning = false;
      if (spinBtn) spinBtn.disabled = true; // stays disabled — one spin per day

      const streak = updateStreakOnSpin();

      if (resultEl) {
        resultEl.textContent = chosen.dare
          ? `Dare time: ${chosen.label}`
          : `You got: ${chosen.label}`;
      }

      renderStreak(streak, true);

      if (typeof spawnFloater === "function") {
        spawnFloater(window.innerWidth / 2, window.innerHeight * 0.4, chosen.dare ? "🔥" : "✨", 6);
      }

      if (streak > 0 && streak % 7 === 0 && CONFIG.wheelStreakUnlockMessage) {
        setTimeout(() => {
          if (resultEl) {
            resultEl.textContent += ` — ${CONFIG.wheelStreakUnlockMessage}`;
          }
        }, 600);
      }

      emailResult(chosen.label, chosen.dare, streak);
    }, 3200);
  }

  if (spinBtn) spinBtn.addEventListener("click", spin);

  buildWheelBackground();
  buildLegend();

  // Reflect today's spin state on load (button locked if already spun).
  const initialStreakState = loadStreak();
  const alreadySpun = hasSpunToday();
  if (alreadySpun && spinBtn) spinBtn.disabled = true;
  renderStreak(initialStreakState.streak, alreadySpun);
  if (alreadySpun && resultEl) {
    resultEl.textContent = "You've already spun today — come back tomorrow! 🔥";
  }
})();