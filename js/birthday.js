/* ============================================================
   BIRTHDAY PAGE — populates content from config.js and kicks
   off the celebration animations. Also guards the page itself:
   if someone bookmarks/shares this URL early, it bounces back
   to the countdown until the real date arrives.
   ============================================================ */

(function () {
  "use strict";

  function atMidnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function isBirthdayYet() {
    const preview = new URLSearchParams(window.location.search).get("preview");
    if (preview === "birthday") return true; // dev-only override for testing
    const today = atMidnight(new Date());
    const bday = atMidnight(new Date(CONFIG.year, CONFIG.birthdayMonth - 1, CONFIG.birthdayDay));
    return today >= bday;
  }

  function populate() {
    document.getElementById("bday-title").textContent = `Happy Birthday ${CONFIG.herName} ❤️`;
    document.getElementById("love-signoff").textContent = CONFIG.loveLetterSignoff;
    document.getElementById("final-message").textContent = CONFIG.finalSurprise;

    const tl = document.getElementById("timeline");
    tl.innerHTML = "";
    CONFIG.timeline.forEach((item) => {
      const li = document.createElement("div");
      li.className = "timeline-item reveal-pending";
      li.innerHTML = `<div class="timeline-date">${item.date}</div><div class="timeline-text">${item.text}</div>`;
      tl.appendChild(li);
    });

    renderRelationshipStat();
    setupTimelineReveal();
    setupPortal();
    setupBalloonField();
    setupGiftBox();
    setupZodiac();
    setupSurpriseVideo();
    setupSectionReveal();
    setupHandwrittenLetter();
    setupFlowerBloom();
    setupNextYearCountdown();
  }

  /* ---------- Relationship duration stat ---------- */
  function renderRelationshipStat() {
    const el = document.getElementById("relationship-stat");
    const rel = CONFIG.relationship;
    if (!el || !rel || !rel.startDate) return;
    const start = new Date(rel.startDate);
    if (isNaN(start.getTime())) return;

    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (now.getDate() < start.getDate()) months -= 1;
    if (months < 0) { years -= 1; months += 12; }

    const parts = [];
    if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
    parts.push(`${months} month${months === 1 ? "" : "s"}`);

    el.innerHTML = `<strong>${parts.join(", ")}</strong> ${rel.label || "of us"}`;
    el.classList.remove("hidden");
  }

  /* ---------- Timeline scroll-reveal ---------- */
  function setupTimelineReveal() {
    const items = document.querySelectorAll(".timeline-item.reveal-pending");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("revealed"), i * 120);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Candle blow + make-a-wish ---------- */
  function setupPortal() {
    const portalWrap = document.getElementById("portal-wrap");
    const portal = document.getElementById("portal");
    const hint = document.getElementById("cake-hint");
    const wishPanel = document.getElementById("wish-panel");
    const wishBtn = document.getElementById("wish-btn");
    const wishCount = document.getElementById("wish-count");
    if (!portalWrap || !portal) return;

    let opened = false;
    let wishes = 0;

    portalWrap.addEventListener("click", () => {
      if (opened) return;
      opened = true;
      portal.classList.add("open");
      if (hint) hint.classList.add("hidden");
      if (wishPanel) wishPanel.classList.remove("hidden");
      spawnFloater(window.innerWidth / 2, window.innerHeight * 0.4, "✨", 10);
    });

    if (wishBtn) {
      wishBtn.addEventListener("click", () => {
        wishes += 1;
        wishCount.textContent = `You've made ${wishes} wish${wishes === 1 ? "" : "es"} 💫`;
        spawnFloater(window.innerWidth / 2, window.innerHeight * 0.55, "💫", 4);
      });
    }
  }

  /* ---------- Balloon pop mini-game ---------- */
  function setupBalloonField() {
    const field = document.getElementById("balloon-field");
    if (!field || !CONFIG.balloonMessages) return;
    field.innerHTML = "";
    CONFIG.balloonMessages.forEach((msg) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "balloon";
      b.setAttribute("aria-label", "Pop balloon");
      b.addEventListener("click", () => {
        if (b.classList.contains("popped")) return;
        b.classList.add("popped");
        spawnFloater(
          b.getBoundingClientRect().left + 23,
          b.getBoundingClientRect().top + 29,
          "✨",
          5
        );
        showToast(msg);
      });
      field.appendChild(b);
    });
  }

  function showToast(message) {
    let toast = document.getElementById("balloon-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "balloon-toast";
      toast.style.cssText =
        "position:fixed;left:50%;bottom:26px;transform:translateX(-50%);" +
        "max-width:86vw;padding:12px 18px;border-radius:14px;z-index:600;" +
        "background:rgba(45,27,61,0.88);color:#fff;font-family:'Poppins',sans-serif;" +
        "font-size:0.9rem;text-align:center;opacity:0;transition:opacity .35s ease;";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => { toast.style.opacity = "1"; });
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => { toast.style.opacity = "0"; }, 2600);
  }

  /* ---------- Virtual gift box ---------- */
  function setupGiftBox() {
    const wrap = document.getElementById("gift-box-wrap");
    const box = document.getElementById("gift-box");
    const hint = document.getElementById("gift-hint");
    const reveal = document.getElementById("gift-reveal");
    const revealTitle = document.getElementById("gift-reveal-title");
    const revealText = document.getElementById("gift-reveal-text");
    if (!wrap || !box) return;

    const gift = CONFIG.giftReveal || {};
    let opened = false;

    wrap.addEventListener("click", () => {
      if (opened) return;
      opened = true;
      box.classList.add("shake");
      setTimeout(() => {
        box.classList.remove("shake");
        box.classList.add("opened");
        if (hint) hint.classList.add("hidden");
        spawnFloater(window.innerWidth / 2, window.innerHeight * 0.45, "🎉", 8);
        setTimeout(() => {
          if (revealTitle) revealTitle.textContent = gift.title || "";
          if (revealText) revealText.textContent = gift.message || "";
          if (reveal) reveal.classList.remove("hidden");
        }, 400);
      }, 500);
    });
  }

  /* ---------- Zodiac fun section ---------- */
  const ZODIAC_EMOJI = {
    aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋",
    leo: "♌", virgo: "♍", libra: "♎", scorpio: "♏",
    sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓"
  };

  function setupZodiac() {
    const z = CONFIG.zodiac;
    if (!z) return;
    const youEmoji = document.getElementById("zodiac-you-emoji");
    const youName = document.getElementById("zodiac-you-name");
    const herEmoji = document.getElementById("zodiac-her-emoji");
    const herName = document.getElementById("zodiac-her-name");
    const blurb = document.getElementById("zodiac-blurb");
    const barsWrap = document.getElementById("zodiac-bars");
    if (!youEmoji || !herEmoji) return;

    const yourKey = (z.yourSign || "").toLowerCase();
    const herKey = (z.herSign || "").toLowerCase();
    youEmoji.textContent = ZODIAC_EMOJI[yourKey] || "✨";
    youName.textContent = z.yourSign || "";
    herEmoji.textContent = ZODIAC_EMOJI[herKey] || "✨";
    herName.textContent = z.herSign || "";
    if (blurb) blurb.textContent = z.blurb || "";

    if (barsWrap && Array.isArray(z.stats)) {
      barsWrap.innerHTML = "";
      z.stats.forEach((stat) => {
        const row = document.createElement("div");
        row.className = "zodiac-bar-row";
        row.innerHTML =
          `<span class="zodiac-bar-label">${stat.label}</span>` +
          `<span class="zodiac-bar-track"><span class="zodiac-bar-fill" style="width:0%"></span></span>` +
          `<span class="zodiac-bar-pct">${stat.pct}%</span>`;
        barsWrap.appendChild(row);
        requestAnimationFrame(() => {
          setTimeout(() => {
            row.querySelector(".zodiac-bar-fill").style.width = stat.pct + "%";
          }, 100);
        });
      });
    }
  }

  /* ---------- Surprise video ---------- */
  function setupSurpriseVideo() {
    const video = document.getElementById("surprise-video");
    const poster = document.getElementById("video-poster");
    const missing = document.getElementById("video-missing");
    const captionEl = document.getElementById("video-caption");
    if (!video) return;

    const cfg = CONFIG.surpriseVideo || {};
    if (captionEl) captionEl.textContent = cfg.caption || "";

    video.addEventListener("error", showMissing);
    const source = video.querySelector("source");
    if (source) source.addEventListener("error", showMissing);

    if (poster) {
      poster.addEventListener("click", () => {
        poster.classList.add("hidden");
        video.classList.remove("hidden");
        video.setAttribute("controls", "");
        video.play().catch(() => {
          // Autoplay might be blocked — controls are already visible so
          // she can just press play herself.
        });
      });
    }

    function showMissing() {
      video.classList.add("hidden");
      if (poster) poster.classList.add("hidden");
      if (missing) missing.classList.remove("hidden");
    }
  }

  /* ---------- Gentle scroll-reveal for section cards ---------- */
  function setupSectionReveal() {
    const cards = document.querySelectorAll(".glass-card");
    if (!cards.length) return;
    if (!("IntersectionObserver" in window)) return;

    cards.forEach((el) => el.classList.add("reveal-pending"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((el) => io.observe(el));
  }

  /* ---------- Handwritten letter: word-by-word reveal with a following pen ---------- */
  function setupHandwrittenLetter() {
    const wrap = document.getElementById("handwritten-wrap");
    const letterEl = document.getElementById("love-letter");
    const signoffEl = document.getElementById("love-signoff");
    const pen = document.getElementById("pen-icon");
    if (!wrap || !letterEl) return;

    const rawText = CONFIG.loveLetter || "";
    const paragraphs = rawText.split(/\n+/).filter((p) => p.trim().length);

    letterEl.innerHTML = "";
    const wordSpans = [];

    paragraphs.forEach((para, pIdx) => {
      para.trim().split(/\s+/).forEach((word) => {
        const span = document.createElement("span");
        span.className = "letter-word";
        span.textContent = word;
        letterEl.appendChild(span);
        letterEl.appendChild(document.createTextNode(" "));
        wordSpans.push(span);
      });
      if (pIdx < paragraphs.length - 1) {
        letterEl.appendChild(document.createElement("br"));
        letterEl.appendChild(document.createElement("br"));
      }
    });

    // Re-set the signoff text each time populate() runs (kept separate
    // from the word-span letter body since it reveals as one block).
    if (signoffEl) signoffEl.textContent = CONFIG.loveLetterSignoff || "";

    // No IntersectionObserver support — just show everything instantly.
    if (!("IntersectionObserver" in window)) {
      wordSpans.forEach((s) => s.classList.add("revealed"));
      if (signoffEl) signoffEl.classList.add("revealed");
      return;
    }

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let started = false;
    function startWriting() {
      if (started) return;
      started = true;

      if (reduceMotion) {
        wordSpans.forEach((s) => s.classList.add("revealed"));
        if (signoffEl) signoffEl.classList.add("revealed");
        return;
      }

      if (pen) pen.classList.add("active");
      let i = 0;

      function revealNext() {
        if (i >= wordSpans.length) {
          if (pen) pen.classList.remove("active");
          if (signoffEl) signoffEl.classList.add("revealed");
          return;
        }
        const span = wordSpans[i];
        span.classList.add("revealed");

        if (pen) {
          const wrapRect = wrap.getBoundingClientRect();
          const wordRect = span.getBoundingClientRect();
          const x = wordRect.right - wrapRect.left;
          const y = wordRect.top - wrapRect.top;
          pen.style.transform = `translate(${x}px, ${y}px)`;
        }

        i += 1;
        setTimeout(revealNext, 42); // writing speed — lower = faster
      }
      revealNext();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startWriting();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(wrap);
  }

  /* ---------- Growing flower tied to scroll progress THROUGH ITS OWN SECTION
     (not the whole page) — otherwise, if this card sits deep down the page,
     the flower looks already fully bloomed the moment it scrolls into view. */
  function setupFlowerBloom() {
    const svg = document.getElementById("flower-svg");
    const caption = document.getElementById("flower-caption");
    if (!svg) return;

    const section = svg.closest(".glass-card") || svg.closest(".flower-scroll-wrap") || svg;
    const stem = svg.querySelector(".flower-stem");
    const leaves = svg.querySelectorAll(".flower-leaf");
    const head = svg.querySelector(".flower-head");
    const petals = svg.querySelectorAll(".petal");

    const captions = [
      "Just a seed so far…",
      "Something's starting to grow 🌱",
      "Almost there…",
      "Nearly in full bloom…",
      "Fully bloomed — just like us. 🌸"
    ];

    let ticking = false;

    function update() {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // progress = 0 when the section's top just enters the bottom of the
      // viewport, progress = 1 once the section has fully scrolled past the
      // top of the viewport. This ties the animation to "how much of this
      // card have you scrolled through", not the whole document.
      const totalRange = vh + rect.height;
      const scrolledPast = vh - rect.top;
      const progress = totalRange > 0 ? Math.min(1, Math.max(0, scrolledPast / totalRange)) : 0;

      // Stem grows from 0% to 60% of scroll progress
      const stemProgress = Math.min(1, progress / 0.6);
      stem.style.strokeDashoffset = String(110 - 110 * stemProgress);

      // Leaves unfurl between 30%-60%
      const leafProgress = Math.min(1, Math.max(0, (progress - 0.3) / 0.3));
      leaves.forEach((leaf) => {
        leaf.style.opacity = leafProgress;
        leaf.style.transform = `scale(${leafProgress})`;
      });

      // Flower head opens between 55%-100%
      const bloomProgress = Math.min(1, Math.max(0, (progress - 0.55) / 0.45));
      head.style.transform = `translate(100px,120px) scale(${bloomProgress})`;
      petals.forEach((p) => {
        p.style.fill = bloomProgress > 0.9 ? "var(--rose)" : "var(--rose-soft)";
      });

      if (caption) {
        const idx = Math.min(captions.length - 1, Math.floor(progress * captions.length));
        caption.textContent = captions[idx];
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- Countdown to next year's birthday ---------- */
  function setupNextYearCountdown() {
    const lineEl = document.getElementById("next-year-line");
    const clockEl = document.getElementById("next-year-clock");
    if (!lineEl || !clockEl) return;

    const today = atMidnight(new Date());
    let target = atMidnight(new Date(CONFIG.year, CONFIG.birthdayMonth - 1, CONFIG.birthdayDay));
    if (target <= today) {
      target = atMidnight(new Date(CONFIG.year + 1, CONFIG.birthdayMonth - 1, CONFIG.birthdayDay));
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const daysLeft = Math.round((target - today) / msPerDay);
    lineEl.textContent = `${daysLeft} day${daysLeft === 1 ? "" : "s"} until I get to do this all over again ❤️`;

    function formatHMS(ms) {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
    }

    function tick() {
      clockEl.textContent = formatHMS(target - new Date());
    }
    tick();
    setInterval(tick, 1000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    /*if (!isBirthdayYet()) {
      window.location.href = "index.html";
      return;
    }*/
   if (!isBirthdayYet()) {
      window.location.href = "index.html";
      return;
    }
    populate();
    startConfetti();
    startFireworks();
  });
})();

