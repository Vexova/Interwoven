/* =========================================================
   FULL DIRECTORY PAGE BEHAVIOR
   Combines the Executive Board / Social Media Team (data/board.js)
   with every chapter president (data/chapters.js) into one
   directory. Headshots are still being collected for chapter
   leads, so cards fall back to the same placeholder pattern used
   on the About page until real photos are added.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    renderDirectory();
  });

  function esc(s) {
    return window.IWEscapeHTML ? window.IWEscapeHTML(s) : s;
  }

  function placeName(name) {
    return name.replace(/^Interwoven\s*/i, "").trim();
  }

  function cardHTML(entry) {
    return `
      <button class="board-card" type="button" aria-expanded="false">
        <div class="board-photo tone-${entry.tone}">
          ${
            entry.photo
              ? `<img src="${entry.photo}" alt="${esc(entry.name)}">`
              : `<span>[Headshot pending]</span>`
          }
        </div>
        <div class="board-name">${esc(entry.name)}</div>
        <div class="board-detail">
          <div class="inner">
            <p style="font-weight:600; color:var(--text);">${esc(entry.role)}</p>
            <a href="mailto:${esc(entry.email)}">${esc(entry.email)}</a>
          </div>
        </div>
        <p class="toggle-hint">Tap for contact info</p>
      </button>`;
  }

  function renderDirectory() {
    const tones = ["teal", "coral", "amber", "ink"];

    // Executive Board + Social Media Team
    const boardMount = document.getElementById("directory-board");
    if (boardMount && window.IW_BOARD) {
      boardMount.innerHTML = window.IW_BOARD.map((b) =>
        cardHTML({ name: b.name, role: b.role, email: b.email, tone: b.tone, photo: b.photo })
      ).join("");
    }

    // Chapter presidents
    const chapterMount = document.getElementById("directory-chapters");
    if (chapterMount && window.IW_CHAPTERS) {
      chapterMount.innerHTML = window.IW_CHAPTERS.map((c, i) =>
        cardHTML({
          name: c.president,
          role: `Chapter President, ${placeName(c.name)}`,
          email: c.email.split(",")[0].trim(),
          tone: tones[i % tones.length],
          photo: null,
        })
      ).join("");
    }

    // Wire up tap/click reveal (same behavior as About page board cards)
    document.querySelectorAll(".board-card").forEach((card) => {
      card.addEventListener("click", () => {
        const open = card.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".board-card").forEach((c) => c.setAttribute("aria-expanded", "false"));
        card.setAttribute("aria-expanded", String(!open));
      });
    });

    if (window.IWRevealScan) window.IWRevealScan();
  }
})();
