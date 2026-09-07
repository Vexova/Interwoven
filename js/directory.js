/* =========================================================
   FULL DIRECTORY PAGE BEHAVIOR
   Combines the Executive Board (data/board.js) with every chapter
   president (data/chapters.js) into one directory. Headshots are
   still being collected for chapter leads, so cards fall back to
   the same placeholder pattern used on the About page until real
   photos are added.
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
        <p class="board-role">${esc(entry.role)}</p>
        ${entry.alwaysShowPhone && entry.phone ? `<p class="board-role always-phone">${esc(entry.phone)}</p>` : ""}
        <div class="board-detail">
          <div class="inner">
            ${entry.email ? `<a href="mailto:${esc(entry.email)}">${esc(entry.email)}</a>` : `<p>Contact coming soon</p>`}
            ${entry.phone && !entry.alwaysShowPhone ? `<p>${esc(entry.phone)}</p>` : ""}
          </div>
        </div>
        <p class="toggle-hint">Tap for contact info</p>
      </button>`;
  }

  function renderDirectory() {

    // Executive Board
    const boardMount = document.getElementById("directory-board");
    if (boardMount && window.IW_BOARD) {
      boardMount.innerHTML = window.IW_BOARD.map((b) =>
        cardHTML({
          name: b.name,
          role: b.role,
          email: b.email,
          phone: b.phone,
          alwaysShowPhone: b.alwaysShowPhone,
          tone: b.tone,
          photo: b.photo,
        })
      ).join("");
    }

    // Social Media Board
    const socialMount = document.getElementById("directory-social");
    if (socialMount && window.IW_SOCIAL_BOARD) {
      socialMount.innerHTML = window.IW_SOCIAL_BOARD.map((b) =>
        cardHTML({
          name: b.name,
          role: b.role,
          email: b.email,
          phone: b.phone,
          alwaysShowPhone: b.alwaysShowPhone,
          tone: b.tone,
          photo: b.photo,
        })
      ).join("");
    }

    // Website Design Board
    const webdesignMount = document.getElementById("directory-webdesign");
    if (webdesignMount && window.IW_WEBDESIGN_BOARD) {
      webdesignMount.innerHTML = window.IW_WEBDESIGN_BOARD.map((b) =>
        cardHTML({
          name: b.name,
          role: b.role,
          email: b.email,
          phone: b.phone,
          alwaysShowPhone: b.alwaysShowPhone,
          tone: b.tone,
          photo: b.photo,
        })
      ).join("");
    }

    // Chapter members (one card per person)
    const chapterMount = document.getElementById("directory-chapters");
    if (chapterMount && window.IW_CHAPTER_MEMBERS) {
      chapterMount.innerHTML = window.IW_CHAPTER_MEMBERS.map((m) =>
        cardHTML({
          name: m.name,
          role: `${m.role}, ${placeName(m.chapter)}`,
          email: m.email,
          tone: m.tone,
          photo: m.photo || null,
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
