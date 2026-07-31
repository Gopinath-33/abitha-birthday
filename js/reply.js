/* ============================================================
   REPLY TO ME — popup form wired to EmailJS.
   Fill in CONFIG.emailjs (config.js) with your own keys.
   No secret key is ever hardcoded here — only the PUBLIC key,
   which is meant to be used client-side by design in EmailJS.
   ============================================================ */

(function () {
  "use strict";

  const openBtn = document.getElementById("reply-open");
  const overlay = document.getElementById("reply-overlay");
  const closeBtn = document.getElementById("reply-close");
  const form = document.getElementById("reply-form");
  const status = document.getElementById("form-status");
  const sendBtn = document.getElementById("reply-send");

  if (!openBtn || !overlay || !form) return;

  let emailjsReady = false;

  function ensureEmailJsInitialized() {
    if (emailjsReady) return true;
    if (typeof emailjs === "undefined") return false;
    if (
      !CONFIG.emailjs.publicKey ||
      CONFIG.emailjs.publicKey.startsWith("YOUR_")
    ) {
      return false; // placeholders not filled in yet
    }
    emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
    emailjsReady = true;
    return true;
  }

  function openModal() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setStatus("", "");
  }
  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "form-status" + (type ? " " + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("reply-name").value.trim();
    const message = document.getElementById("reply-message").value.trim();

    if (!name || !message) {
      setStatus("Please fill in your name and a message. 💌", "error");
      return;
    }

    const configured = ensureEmailJsInitialized();
    if (!configured) {
      setStatus(
        "Reply form isn't fully set up yet — add your EmailJS keys in js/config.js.",
        "error"
      );
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending…";
    setStatus("Sending your message…", "");

    emailjs
      .send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
        name: name,
        message: message,
        to_email: CONFIG.emailjs.toEmail
      })
      .then(function () {
        setStatus("Sent! Your message is on its way. 💗", "success");
        form.reset();
        spawnFloater(window.innerWidth / 2, window.innerHeight / 2, "❤️", 6);
        setTimeout(closeModal, 1600);
      })
      .catch(function (err) {
        console.error("EmailJS error:", err);
        setStatus("Something went wrong sending that — please try again.", "error");
      })
      .finally(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send ❤️";
      });
  });
})();
