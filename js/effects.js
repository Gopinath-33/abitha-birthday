/* ============================================================
   EFFECTS — ambient romantic motion + UI chrome shared by both
   the daily countdown page and the birthday celebration page.
   ============================================================ */

/* ---------- Loading screen + unlock reveal ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const page = document.getElementById("page");
  const unlock = document.getElementById("unlock-overlay");

  setTimeout(() => {
    if (loader) loader.classList.add("hidden");

    if (unlock) {
      // Little "unlocking today" ritual before the page itself appears.
      const icon = document.getElementById("unlock-icon");
      setTimeout(() => {
        if (icon) { icon.textContent = "🔓"; icon.classList.add("opened"); }
      }, 550);
      setTimeout(() => {
        unlock.classList.add("hidden");
        if (page) page.classList.add("is-visible");
      }, 1250);
    } else if (page) {
      page.classList.add("is-visible");
    }
  }, 500);
});

/* ---------- Theme toggle (light / dark) ---------- */
(function themeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  // Default to the visitor's system preference; kept in memory only
  // (no localStorage — this is a shareable static page, not a logged-in app).
  let isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme();

  btn.addEventListener("click", () => {
    isDark = !isDark;
    applyTheme();
  });

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    btn.textContent = isDark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
})();

/* ---------- Background music toggle ---------- */
(function musicToggle() {
  const btn = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-audio");
  if (!btn || !audio) return;

  let playing = false;
  btn.addEventListener("click", () => {
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Autoplay-policy rejection or missing file — fail silently in UI,
        // the toggle simply won't visually flip to "playing".
      });
    }
    playing = !playing;
    btn.textContent = playing ? "🔊" : "🔈";
    btn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  });
})();

/* ---------- Romantic cursor trail (desktop / mouse only) ---------- */
(function cursorTrail() {
  if (window.matchMedia("(hover: none)").matches) return;
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.appendChild(dot);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x, ty = y;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  (function loop() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    requestAnimationFrame(loop);
  })();

  // Occasional little sparkle burst on click, for delight
  window.addEventListener("click", (e) => {
    spawnFloater(e.clientX, e.clientY, "✦", 1);
  });
})();

/* ---------- Floating hearts / flowers / sparkles ambient layer ---------- */
(function floaters() {
  const layer = document.getElementById("floaters");
  if (!layer) return;
  const symbols = ["❤️", "💗", "🌸", "✨", "💫", "🌷"];

  function spawn() {
    const el = document.createElement("span");
    el.className = "floater";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const size = 14 + Math.random() * 18;
    el.style.fontSize = size + "px";
    el.style.left = Math.random() * 100 + "vw";
    el.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
    const duration = 7 + Math.random() * 6;
    el.style.animationDuration = duration + "s";
    layer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  setInterval(spawn, 900);
  for (let i = 0; i < 4; i++) setTimeout(spawn, i * 250);
})();

function spawnFloater(x, y, symbol, count) {
  const layer = document.getElementById("floaters");
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "floater";
    el.textContent = symbol;
    el.style.left = x + "px";
    el.style.bottom = window.innerHeight - y + "px";
    el.style.fontSize = "16px";
    el.style.animationDuration = "3.5s";
    layer.appendChild(el);
    setTimeout(() => el.remove(), 3700);
  }
}

/* ---------- Scratch card reveal (day image) ---------- */
(function scratchCard() {
  const canvas = document.getElementById("scratch-canvas");
  const frame = canvas ? canvas.closest(".day-image-frame") : null;
  const hint = document.getElementById("scratch-hint");
  if (!canvas || !frame) return;

  const ctx = canvas.getContext("2d");
  let scratching = false;
  let strokeCount = 0;
  let revealed = false;

  function drawCover() {
    const rect = frame.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.classList.remove("revealed");
    if (hint) hint.classList.remove("revealed");
    revealed = false;
    strokeCount = 0;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#e8c878");
    grad.addColorStop(0.5, "#e8749a");
    grad.addColorStop(1, "#9b5de5");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // light sparkle texture
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 1.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function erase(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  function pointFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    canvas.classList.add("revealed");
    if (hint) hint.classList.add("revealed");
  }

  function handleStart(e) {
    scratching = true;
    const p = pointFromEvent(e);
    erase(p.x, p.y);
  }
  function handleMove(e) {
    if (!scratching) return;
    e.preventDefault();
    const p = pointFromEvent(e);
    erase(p.x, p.y);
    strokeCount += 1;
    if (strokeCount > 18) reveal();
  }
  function handleEnd() { scratching = false; }

  canvas.addEventListener("mousedown", handleStart);
  canvas.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleEnd);
  canvas.addEventListener("touchstart", handleStart, { passive: true });
  canvas.addEventListener("touchmove", handleMove, { passive: false });
  canvas.addEventListener("touchend", handleEnd);
  canvas.addEventListener("click", () => { if (strokeCount === 0) reveal(); }); // accessibility fallback

  window.addEventListener("resize", () => { if (!revealed) drawCover(); });

  // Exposed so countdown.js can re-cover the card whenever the day's image changes
  window.resetScratchCard = drawCover;
  drawCover();
})();

/* ---------- Daily streak counter ----------
   Tracks consecutive-day visits so she can see how many days in a
   row she's opened the site. Needs localStorage, which only works
   once this is hosted for real (e.g. GitHub Pages/Netlify) — inside
   a sandboxed preview it fails quietly and the badge just hides.

   IMPORTANT: date keys are built and parsed using LOCAL date parts
   only (getFullYear/getMonth/getDate) — never toISOString() or
   new Date("YYYY-MM-DD"), both of which round-trip through UTC and
   silently shift the date by your timezone offset. That mismatch
   was causing consecutive real-world days to compute a 2-day gap
   instead of 1, so the streak kept resetting to 1 instead of
   incrementing. ---------- */
(function streakCounter() {
  const el = document.getElementById("streak-badge");
  if (!el) return;
  try {
    function localKey(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    function keyToLocalDate(key) {
      const [y, m, d] = key.split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = localKey(today);

    const lastVisit = window.localStorage.getItem("abitha_last_visit");
    let streak = parseInt(window.localStorage.getItem("abitha_streak") || "0", 10) || 0;

    if (lastVisit === todayKey) {
      // already visited today — just display the existing streak
    } else if (lastVisit) {
      const diffDays = Math.round((today - keyToLocalDate(lastVisit)) / 86400000);
      streak = diffDays === 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }

    window.localStorage.setItem("abitha_last_visit", todayKey);
    window.localStorage.setItem("abitha_streak", String(streak));

    el.textContent = `🔥 ${streak} day${streak === 1 ? "" : "s"} streak`;
    el.classList.remove("hidden");
  } catch (e) {
    el.classList.add("hidden"); // storage unavailable — hide rather than show wrong data
  }
})();

/* ---------- Secret easter egg: tap the countdown number 7x fast ---------- */
(function secretEasterEgg() {
  const trigger = document.querySelector("[data-secret-trigger]");
  const overlay = document.getElementById("secret-overlay");
  const closeBtn = document.getElementById("secret-close");
  const textEl = document.getElementById("secret-text");
  if (!trigger || !overlay) return;

  if (textEl && typeof CONFIG !== "undefined") {
    textEl.textContent = CONFIG.secretMessage;
  }

  let taps = 0;
  let resetTimer = null;

  trigger.addEventListener("click", () => {
    taps += 1;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { taps = 0; }, 2200);

    if (taps >= 7) {
      taps = 0;
      overlay.classList.add("open");
      spawnFloater(window.innerWidth / 2, window.innerHeight / 2, "💫", 8);
    }
  });

  function closeSecret() { overlay.classList.remove("open"); }
  if (closeBtn) closeBtn.addEventListener("click", closeSecret);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeSecret(); });
})();

/* ---------- WhatsApp share ---------- */
(function shareButton() {
  const btn = document.getElementById("share-whatsapp");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const text = (typeof CONFIG !== "undefined" ? CONFIG.shareText : "Check this out:") + " " + window.location.href;
    const url = "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  });
})();

/* ---------- Lazy loading (native attribute already used in HTML,
   this is a light polyfill-style safety net for older browsers) ---------- */
(function lazyLoadSafety() {
  if ("loading" in HTMLImageElement.prototype) return;
  const imgs = document.querySelectorAll("img[loading='lazy']");
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        io.unobserve(img);
      }
    });
  });
  imgs.forEach((img) => io.observe(img));
})();

/* ============================================================
   CONFETTI (birthday page)
   ============================================================ */
function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#e8749a", "#9b5de5", "#e8c878", "#ffd6e8", "#ffffff"];
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h,
    size: 5 + Math.random() * 6,
    speed: 1.5 + Math.random() * 2.5,
    drift: Math.random() * 2 - 1,
    rot: Math.random() * 360,
    rotSpeed: Math.random() * 6 - 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.random() > 0.5 ? "rect" : "circle"
  }));

  let running = true;
  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    pieces.forEach((p) => {
      p.y += p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;
      if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    requestAnimationFrame(frame);
  }
  frame();

  // Taper off after ~9s so the page doesn't feel busy forever
  setTimeout(() => {
    let fade = 1;
    const fadeOut = setInterval(() => {
      fade -= 0.05;
      canvas.style.opacity = fade;
      if (fade <= 0) { running = false; clearInterval(fadeOut); canvas.style.display = "none"; }
    }, 100);
  }, 9000);
}

/* ============================================================
   FIREWORKS (birthday page)
   ============================================================ */
function startFireworks() {
  const canvas = document.getElementById("fireworks-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#e8749a", "#9b5de5", "#e8c878", "#ffd6e8", "#ffffff", "#f4e3a1"];
  let particles = [];

  function burst(x, y) {
    const count = 34;
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color
      });
    }
  }

  function randomBurst() {
    burst(w * (0.2 + Math.random() * 0.6), h * (0.15 + Math.random() * 0.35));
  }

  const burstInterval = setInterval(randomBurst, 1100);
  randomBurst();

  let running = true;
  function frame() {
    if (!running) return;
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.alpha -= 0.012;
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter((p) => p.alpha > 0);
    requestAnimationFrame(frame);
  }
  frame();

  setTimeout(() => {
    clearInterval(burstInterval);
    setTimeout(() => { running = false; canvas.style.opacity = 0; }, 3000);
  }, 14000);
}