/* ============================================================
   CHAT WITH CUPID — talks to a Cloudflare Worker (see
   cloudflare-worker/worker.js) which proxies to a free AI API.
   Conversation history lives in memory only for this session.
   ============================================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
  const windowEl = document.getElementById("chat-window");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const nameEl = document.getElementById("chat-bot-name");

  if (!form) return;

  const cfg = CONFIG.chatbot || {};
  const botName = cfg.botName || "Cupid";
  if (nameEl) nameEl.textContent = botName;

  const configured = cfg.workerUrl && !cfg.workerUrl.startsWith("YOUR_");
  let history = [];
  let greeted = false;

  function addBubble(role, text) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + (role === "user" ? "user" : "bot");
    bubble.textContent = text;
    windowEl.appendChild(bubble);
    windowEl.scrollTop = windowEl.scrollHeight;
    return bubble;
  }

  function greetOnce() {
    if (greeted) return;
    greeted = true;
    addBubble("bot", `Hi, I'm ${botName} 💘 I'm the little AI living in this site — say hello!`);
    if (!configured) {
      addBubble("bot", "(Chat isn't connected yet — add your Worker URL in js/config.js to bring me to life.)");
    }
  }

  // Modal mode (index/birthday/quiz/guestbook) — opens as a popup over the page.
  // Standalone mode (chatbot.html) — no overlay/trigger exist, so just greet immediately.
  const overlay = document.getElementById("chat-overlay");
  const fabBtn = document.getElementById("chat-fab-btn");
  const closeBtn = document.getElementById("chat-close");

  if (overlay && fabBtn) {
    fabBtn.addEventListener("click", () => {
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      greetOnce();
      setTimeout(() => input.focus(), 200);
    });
    function closeChat() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
    if (closeBtn) closeBtn.addEventListener("click", closeChat);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeChat(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeChat(); });
  } else {
    greetOnce();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg || !configured) {
      if (!configured) addBubble("bot", "I'm not connected yet — check js/config.js.");
      return;
    }

    addBubble("user", msg);
    input.value = "";
    sendBtn.disabled = true;

    const typingBubble = addBubble("bot", `${botName} is typing…`);
    typingBubble.classList.add("typing");

    fetch(cfg.workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, history })
    })
      .then((r) => r.json())
      .then((data) => {
        typingBubble.remove();
        const reply = data.reply || "Hmm, I lost my train of thought. Try again? 💭";
        addBubble("bot", reply);
        history.push({ role: "user", content: msg });
        history.push({ role: "assistant", content: reply });
        if (history.length > 12) history = history.slice(-12);
      })
      .catch(() => {
        typingBubble.remove();
        addBubble("bot", "Couldn't reach the AI just now — please try again in a moment.");
      })
      .finally(() => {
        sendBtn.disabled = false;
        input.focus();
      });
  });
  } // end init
})();
