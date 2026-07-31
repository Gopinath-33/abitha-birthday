/* ============================================================
   OUR BUCKET LIST — a shared checklist, backed by jsonblob.com
   (same no-signup storage as the guestbook). Auto-creates itself
   on first run and shows the ID to save into
   CONFIG.bucketList.blobId for permanent, shared storage.
   ============================================================ */

(function () {
  "use strict";

  const listEl = document.getElementById("bucket-list");
  const form = document.getElementById("bucket-form");
  const input = document.getElementById("bucket-input");
  const statusEl = document.getElementById("bucket-status");
  const setupBanner = document.getElementById("bucket-setup-banner");
  const progressFill = document.getElementById("bucket-progress-fill");
  const progressLabel = document.getElementById("bucket-progress-label");

  if (!form) return;

  const API = "https://jsonblob.com/api/jsonBlob";
  let activeBlobId = ((CONFIG.bucketList && CONFIG.bucketList.blobId) || "").trim();

  // Single source of truth kept in memory. We only re-fetch from the
  // server on initial load — every add/toggle/delete after that works
  // off this array and pushes the result to the server, so a stale
  // cached GET can never clobber data you just saved.
  let items = [];

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

  function showSetupBanner(newId) {
    if (!setupBanner) return;
    setupBanner.classList.remove("hidden");
    setupBanner.innerHTML =
      `<strong>Bucket list created ✦</strong> To make it permanent, open ` +
      `<code>js/config.js</code> and set:<br>` +
      `<code>bucketList: { blobId: "${newId}" }</code><br>` +
      `Until then, this works for today's visit but resets after you close the page.`;
  }

  function ensureBlobId() {
    if (activeBlobId) return Promise.resolve(activeBlobId);
    const starter = (CONFIG.bucketList && CONFIG.bucketList.starterItems) || [];
    const initial = starter.map((text) => ({ text, done: false }));
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initial)
    }).then((res) => {
      const location = res.headers.get("Location") || "";
      const id = location.split("/").filter(Boolean).pop();
      if (!id) throw new Error("Could not create bucket list storage.");
      activeBlobId = id;
      items = initial;
      showSetupBanner(id);
      return id;
    });
  }

  function renderItems() {
    listEl.innerHTML = "";
    items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "bucket-item" + (item.done ? " done" : "");
      row.innerHTML =
        `<button type="button" class="bucket-check" data-index="${index}" aria-label="Toggle done">${item.done ? "✓" : ""}</button>` +
        `<span class="bucket-text">${escapeHtml(item.text)}</span>` +
        `<button type="button" class="bucket-delete" data-index="${index}" aria-label="Remove item">✕</button>`;
      listEl.appendChild(row);
    });

    listEl.querySelectorAll(".bucket-check").forEach((btn) => {
      btn.addEventListener("click", () => toggleItem(parseInt(btn.dataset.index, 10)));
    });
    listEl.querySelectorAll(".bucket-delete").forEach((btn) => {
      btn.addEventListener("click", () => deleteItem(parseInt(btn.dataset.index, 10)));
    });

    updateProgress();
  }

  function updateProgress() {
    const total = items.length;
    const done = items.filter((i) => i.done).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressLabel) progressLabel.textContent = `${done}/${total} done`;
  }

  function persist() {
    return ensureBlobId().then((id) =>
      fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(items)
      })
    );
  }

  function loadItems() {
    ensureBlobId()
      .then((id) => fetch(`${API}/${id}`, { cache: "no-store" }))
      .then((r) => r.json())
      .then((data) => {
        items = Array.isArray(data) ? data : [];
        renderItems();
      })
      .catch(() => setStatus("Couldn't load the list right now — check your connection.", "error"));
  }

  function toggleItem(index) {
    if (!items[index]) return;
    items[index].done = !items[index].done;
    renderItems();
    persist().catch(() => setStatus("Couldn't update that item — please try again.", "error"));
  }

  function deleteItem(index) {
    if (!confirm("Remove this item?")) return;
    items.splice(index, 1);
    renderItems();
    persist().catch(() => setStatus("Couldn't remove that item — please try again.", "error"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    items.push({ text, done: false });
    renderItems();
    input.value = "";
    setStatus("Added! ✦", "success");
    if (typeof spawnFloater === "function") {
      spawnFloater(window.innerWidth / 2, window.innerHeight / 2, "✅", 4);
    }
    persist().catch(() => setStatus("Couldn't save that item — please try again.", "error"));
  });

  document.addEventListener("DOMContentLoaded", loadItems);
})();
