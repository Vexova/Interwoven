/* =========================================================
   ABOUT PAGE BEHAVIOR
   Requires: data/board.js, data/threads.js, js/main.js
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    renderBoard();
    renderThreadDetails();

    // If arriving with a #thread-id hash (e.g. from the homepage "Learn
    // More" links), scroll to that section after content renders.
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) window.setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  });

  function esc(s) {
    return window.IWEscapeHTML ? window.IWEscapeHTML(s) : s;
  }

  /* ---------- Executive board + Social Media team ----------
     Info is exposed on hover AND on click/focus (not hover-only),
     so it works with keyboard and touch, not just a mouse. */
  function renderBoardGroup(mountId, members) {
    const mount = document.getElementById(mountId);
    if (!mount || !members.length) return;

    mount.innerHTML = members.map(
      (b) => `
      <button class="board-card" type="button" aria-expanded="false" data-id="${b.id}">
        <div class="board-photo tone-${b.tone}">
          <span>[Headshot: ${esc(b.name)} — see assets/README.md]</span>
        </div>
        <div class="board-name">${esc(b.name)}</div>
        <div class="board-detail">
          <div class="inner">
            <p style="font-weight:600; color:var(--text);">${esc(b.role)}</p>
            <a href="mailto:${esc(b.email)}">${esc(b.email)}</a>
            ${b.phone ? `<p>${esc(b.phone)}</p>` : ""}
          </div>
        </div>
        <p class="toggle-hint">Tap for contact info</p>
      </button>`
    ).join("");

    mount.querySelectorAll(".board-card").forEach((card) => {
      card.addEventListener("click", () => {
        const open = card.getAttribute("aria-expanded") === "true";
        mount.querySelectorAll(".board-card").forEach((c) => c.setAttribute("aria-expanded", "false"));
        card.setAttribute("aria-expanded", String(!open));
      });
    });
  }

  function renderBoard() {
    if (!window.IW_BOARD) return;
    renderBoardGroup(
      "board-grid-exec",
      window.IW_BOARD.filter((b) => b.team === "executive")
    );
    renderBoardGroup(
      "board-grid-social",
      window.IW_BOARD.filter((b) => b.team === "social")
    );
  }

  /* ---------- Thread detail sections ---------- */
  function renderThreadDetails() {
    const mount = document.getElementById("thread-details");
    if (!mount || !window.IW_THREADS) return;

    mount.innerHTML = window.IW_THREADS.map(
      (t, i) => `
      <section class="thread-detail" id="${t.id}" data-reveal>
        <span class="num">0${i + 1}</span>
        <h3 class="h3">${esc(t.name)}</h3>
        <p style="font-weight:600; margin-top:6px;">${esc(t.tagline)}</p>
        <p class="text-soft" style="margin-top:14px; max-width:65ch;">${esc(t.long)}</p>
      </section>`
    ).join("");

    if (window.IWRevealScan) window.IWRevealScan();
  }
})();
