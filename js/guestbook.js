/* ============================================================
   GUESTBOOK — a small shared notes wall, backed by jsonblob.com
   (a free JSON store with NO signup/API key needed). The first
   time this page runs with no blobId configured, it automatically
   creates a new blob and shows you its ID to save into
   CONFIG.guestbook.blobId — after that, notes persist for good.
   ============================================================ */

(function () {
  "use strict";

  const listEl = document.getElementById("guestbook-list");
  const emptyEl = document.getElementById("guestbook-empty");
  const form = document.getElementById("guestbook-form");
  const statusEl = document.getElementById("guestbook-status");
  const sendBtn = document.getElementById("guestbook-send");
  const setupBanner = document.getElementById("guestbook-setup-banner");

  if (!form) return;

  const API = "https://jsonblob.com/api/jsonBlob";
  let activeBlobId = ((CONFIG.guestbook && CONFIG.guestbook.blobId) || "").trim();

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (type ? " " + type : "");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderEntries(entries) {
    listEl.innerHTML = "";
    if (!entries || entries.length === 0) {
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    }
    if (emptyEl) emptyEl.classList.add("hidden");
    entries.forEach((entry, originalIndex) => {
      const card = document.createElement("div");
      card.className = "guestbook-entry";
      const safeDate = entry.date ? new Date(entry.date).toLocaleDateString() : "";
      card.innerHTML =
        `<button type="button" class="guestbook-delete" data-index="${originalIndex}" aria-label="Delete note">✕</button>` +
        `<div class="guestbook-entry-name">${escapeHtml(entry.name || "Someone")}</div>` +
        `<div class="guestbook-entry-note">${escapeHtml(entry.note || "")}</div>` +
        (safeDate ? `<div class="guestbook-entry-date">${safeDate}</div>` : "");
      listEl.prepend(card); // newest first, without breaking index-to-entry mapping
    });

    listEl.querySelectorAll(".guestbook-delete").forEach((btn) => {
      btn.addEventListener("click", () => deleteEntry(parseInt(btn.dataset.index, 10)));
    });
  }

  function deleteEntry(index) {
    if (!confirm("Delete this note?")) return;
    ensureBlobId()
      .then((id) =>
        fetch(`${API}/${id}`)
          .then((r) => r.json())
          .then((data) => {
            const entries = Array.isArray(data) ? data : [];
            entries.splice(index, 1);
            return fetch(`${API}/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(entries)
            }).then(() => entries);
          })
      )
      .then((entries) => renderEntries(entries))
      .catch(() => setStatus("Couldn't delete that note — please try again.", "error"));
  }

  function showSetupBanner(newId) {
    if (!setupBanner) return;
    setupBanner.classList.remove("hidden");
    setupBanner.innerHTML =
      `<strong>Guestbook created ✦</strong> To make these notes permanent, ` +
      `open <code>js/config.js</code> and set:<br>` +
      `<code>guestbook: { blobId: "${newId}" }</code><br>` +
      `Until then, this works for today's visit but won't be saved after you close the page.`;
  }

  // Creates a brand-new blob if none is configured yet.
  function ensureBlobId() {
    if (activeBlobId) return Promise.resolve(activeBlobId);
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([])
    }).then((res) => {
      const location = res.headers.get("Location") || "";
      const id = location.split("/").filter(Boolean).pop();
      if (!id) throw new Error("Could not create guestbook storage.");
      activeBlobId = id;
      showSetupBanner(id);
      return id;
    });
  }

  function loadEntries() {
    ensureBlobId()
      .then((id) => fetch(`${API}/${id}`))
      .then((r) => r.json())
      .then((data) => renderEntries(Array.isArray(data) ? data : []))
      .catch(() => setStatus("Couldn't load the guestbook right now — check your connection.", "error"));
  }

  function notifyByEmail(name, note) {
    if (typeof emailjs === "undefined") return;
    const cfg = CONFIG.emailjs || {};
    if (!cfg.publicKey || cfg.publicKey.startsWith("YOUR_")) return; // not configured
    try {
      emailjs.init({ publicKey: cfg.publicKey });
      emailjs.send(cfg.serviceId, cfg.templateId, {
        name: `${name} (Guestbook)`,
        message: note,
        to_email: cfg.toEmail
      });
    } catch (e) {
      // silent — a missed notification shouldn't block the guestbook itself
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("guestbook-name").value.trim();
    const note = document.getElementById("guestbook-note").value.trim();

    if (!name || !note) {
      setStatus("Please add your name and a note. 💌", "error");
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Adding…";
    setStatus("Adding your note…", "");

    ensureBlobId()
      .then((id) =>
        fetch(`${API}/${id}`)
          .then((r) => r.json())
          .then((data) => {
            const entries = Array.isArray(data) ? data : [];
            entries.push({ name, note, date: new Date().toISOString() });
            return fetch(`${API}/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(entries)
            }).then(() => entries);
          })
      )
      .then((entries) => {
        renderEntries(entries);
        setStatus("Added! 💗", "success");
        notifyByEmail(name, note);
        form.reset();
        if (typeof spawnFloater === "function") {
          spawnFloater(window.innerWidth / 2, window.innerHeight / 2, "💌", 5);
        }
      })
      .catch(() => setStatus("Something went wrong adding that — please try again.", "error"))
      .finally(() => {
        sendBtn.disabled = false;
        sendBtn.textContent = "Add to Guestbook 💌";
      });
  });

  document.addEventListener("DOMContentLoaded", loadEntries);
})();
