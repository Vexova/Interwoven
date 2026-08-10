/* =========================================================
   CHAPTERS PAGE BEHAVIOR
   Requires: data/chapters.js, js/main.js, Leaflet (CDN)
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    renderDirectory();
    initMap();
  });

  function esc(s) {
    return window.IWEscapeHTML ? window.IWEscapeHTML(s) : s;
  }

  function initials(name) {
    return name
      .replace(/^Interwoven\s*/i, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  /* ---------- Directory cards ---------- */
  function renderDirectory() {
    const mount = document.getElementById("chapter-directory");
    if (!mount || !window.IW_CHAPTERS) return;
    mount.innerHTML = window.IW_CHAPTERS.map(
      (c) => `
      <div class="chapter-card" data-reveal>
        <div class="chapter-avatar">${esc(initials(c.name))}</div>
        <h4 class="h4">${esc(c.name)}</h4>
        <p class="loc">${esc([c.city, c.region, c.country].filter(Boolean).join(", "))}</p>
        <p class="text-soft" style="font-size:.85rem;">${esc(c.president)} &middot; President</p>
        <a href="mailto:${esc(c.email.split(",")[0].trim())}">Email chapter →</a>
      </div>`
    ).join("");
    if (window.IWRevealScan) window.IWRevealScan();
  }

  /* ---------- Map ----------
     Uses Leaflet + OpenStreetMap tiles (no API key). If the Leaflet
     library didn't load — e.g. no network access — show a clear
     fallback instead of a broken/blank map. */
  function initMap() {
    const el = document.getElementById("chapters-map");
    if (!el || !window.IW_CHAPTERS) return;

    if (typeof L === "undefined") {
      el.outerHTML = `<div class="map-fallback">
        <div>
          <p style="font-weight:600; margin-bottom:6px;">Map couldn't load.</p>
          <p>Check your connection, or browse the full list of chapters below.</p>
        </div>
      </div>`;
      return;
    }

    const map = L.map(el, { scrollWheelZoom: false }).setView([20, 10], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    const chapters = window.IW_CHAPTERS;

    // Subtle thread line connecting chapters in roster order
    const threadColors = ["#397F7F", "#F17053", "#E6AC46"];
    for (let i = 0; i < chapters.length - 1; i++) {
      L.polyline(
        [
          [chapters[i].lat, chapters[i].lng],
          [chapters[i + 1].lat, chapters[i + 1].lng],
        ],
        { color: threadColors[i % threadColors.length], weight: 1.6, opacity: 0.45, dashArray: "1 8" }
      ).addTo(map);
    }

    const markerIcon = (color) =>
      L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

    const bounds = [];
    chapters.forEach((c, i) => {
      const color = threadColors[i % threadColors.length];
      const marker = L.marker([c.lat, c.lng], { icon: markerIcon(color), title: c.name }).addTo(map);
      marker.bindTooltip(c.name, { direction: "top", offset: [0, -8] });
      marker.bindPopup(
        `<div class="map-popup">
           <h4>${esc(c.name)}</h4>
           <p>${esc([c.city, c.region, c.country].filter(Boolean).join(", "))}</p>
           <p><strong>${esc(c.president)}</strong> &middot; Chapter President</p>
           <p><a href="mailto:${esc(c.email.split(",")[0].trim())}">${esc(c.email.split(",")[0].trim())}</a></p>
         </div>`
      );
      bounds.push([c.lat, c.lng]);
    });

    if (bounds.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
  }
})();
