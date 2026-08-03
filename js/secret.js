/* ============================================================
   SECRET PAGE — checks the password against CONFIG.secretPage,
   then reveals the letter, future vision, and media one stage
   at a time as she scrolls.
   ============================================================ */

(function () {
  "use strict";

  const cfg = (CONFIG && CONFIG.secretPage) || {};

  const lockScreen = document.getElementById("secret-lock-screen");
  const lockIcon = document.getElementById("secret-lock-icon");
  const input = document.getElementById("secret-password-input");
  const unlockBtn = document.getElementById("secret-unlock-btn");
  const errorMsg = document.getElementById("secret-error-msg");
  const hintEl = document.getElementById("secret-hint");
  const content = document.getElementById("secret-content");

  if (hintEl && cfg.hint) {
    hintEl.textContent = `Hint: ${cfg.hint}`;
  }

  function normalize(str) {
    return (str || "").trim().toLowerCase();
  }

  function tryUnlock() {
    const attempt = normalize(input.value);
    const correct = normalize(cfg.password);

    if (!attempt) return;

    if (attempt === correct) {
      unlock();
    } else {
      if (input) input.classList.add("error");
      if (lockIcon) {
        lockIcon.classList.remove("shake");
        // force reflow so the animation can re-trigger on repeat wrong tries
        void lockIcon.offsetWidth;
        lockIcon.classList.add("shake");
      }
      if (errorMsg) errorMsg.textContent = "Not quite... try again 💭";
      setTimeout(() => {
        if (input) input.classList.remove("error");
      }, 400);
    }
  }

  function unlock() {
    if (lockIcon) lockIcon.textContent = "🔓";
    if (errorMsg) errorMsg.textContent = "";

    populateContent();
    setupSecretAudio();

    setTimeout(() => {
      if (lockScreen) lockScreen.style.display = "none";
      if (content) content.classList.add("unlocked");
      setupStageReveal();
    }, 500);
  }

  function populateContent() {
    const letterEl = document.getElementById("secret-letter-text");
    const visionEl = document.getElementById("secret-vision-text");
    const mediaWrap = document.getElementById("secret-media-wrap");

    if (letterEl) letterEl.textContent = cfg.deepLetter || "";
    if (visionEl) visionEl.textContent = cfg.futureVision || "";

    if (mediaWrap && cfg.mediaSrc) {
      let mediaHtml = "";
      if (cfg.mediaType === "video") {
        mediaHtml = `<video src="${cfg.mediaSrc}" controls playsinline></video>`;
      } else {
        mediaHtml = `<img src="${cfg.mediaSrc}" alt="A special moment" loading="lazy">`;
      }
      if (cfg.mediaCaption) {
        mediaHtml += `<p class="secret-media-caption">${cfg.mediaCaption}</p>`;
      }
      mediaWrap.innerHTML = mediaHtml;
    }
  }

  function setupSecretAudio() {
    const audio = document.getElementById("secret-audio");
    const wrap = document.getElementById("secret-audio-wrap");
    const playBtn = document.getElementById("secret-audio-play-btn");
    const playIcon = document.getElementById("secret-audio-play-icon");
    const captionEl = document.getElementById("secret-audio-caption");
    if (!audio || !playBtn) return;

    if (captionEl) captionEl.textContent = cfg.audioCaption || "";

    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {
          // playback blocked — she can tap again to retry
        });
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => {
      if (playIcon) playIcon.textContent = "❚❚";
      if (wrap) wrap.classList.add("playing");
    });
    audio.addEventListener("pause", () => {
      if (playIcon) playIcon.textContent = "▶";
      if (wrap) wrap.classList.remove("playing");
    });
    audio.addEventListener("ended", () => {
      if (playIcon) playIcon.textContent = "▶";
      if (wrap) wrap.classList.remove("playing");
    });
    audio.addEventListener("error", () => {
      if (captionEl) captionEl.textContent = "Add your voice message at assets/audio/secret-voice.mp3";
    });
  }

  function setupStageReveal() {
    const stages = document.querySelectorAll(".secret-stage");
    if (!stages.length) return;

    if (!("IntersectionObserver" in window)) {
      stages.forEach((el) => el.classList.add("revealed"));
      return;
    }

    // Reveal the first stage immediately since it's already in view
    // right after unlock.
    stages[0].classList.add("revealed");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    stages.forEach((el) => io.observe(el));
  }

  if (unlockBtn) unlockBtn.addEventListener("click", tryUnlock);
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") tryUnlock();
    });
  }
})();