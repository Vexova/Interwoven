/* =========================================================
   CALENDAR PAGE BEHAVIOR
   Embeds the real, live Interwoven Google Calendar (decoded
   from the cid= param in the calendar link in the brief) – no
   API key required for a read-only embed.

   NOTE ON FILTERS: Google's free embed iframe doesn't expose a
   way to filter *within* an embedded calendar by custom category
   from the outside (that needs the Calendar API + a key). The
   type/chapter chips below are wired up and ready – once
   Interwoven adds a Calendar API key, swap fetchEventsViaAPI()
   in place of the iframe to get real client-side filtering.
   ========================================================= */
(function () {
  "use strict";

  const CALENDAR_ID = "bd726dba1477fcb48032310f3a304dc42c22dbc47e7f8827b29f6dba85622800@group.calendar.google.com";

  document.addEventListener("DOMContentLoaded", () => {
    const frame = document.getElementById("calendar-frame");
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";

    function setMode(mode) {
      const src =
        `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}` +
        `&ctz=${encodeURIComponent(tz)}&mode=${mode}&showTitle=0&showPrint=0&showTabs=0&showCalendars=0`;
      frame.src = src;
    }
    setMode("MONTH");

    document.querySelectorAll("[data-cal-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-cal-view]").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        setMode(btn.dataset.calView);
      });
    });

    // Type/chapter filters are visual + informational for now, since the
    // free embed can't be filtered from the outside. "All" and the two
    // standalone buttons (Podcast Recording Times, By Chapter) behave as
    // a single-select row; the two dropdowns (In-Person / Online) each
    // reveal two sub-options, and selecting one closes the menu and marks
    // that dropdown as the active filter.
    const topLevelFilters = document.querySelectorAll('.cal-filters > [data-cal-filter]');
    const dropdowns = document.querySelectorAll(".cal-dropdown");

    function clearAllSelections() {
      topLevelFilters.forEach((b) => b.setAttribute("aria-pressed", "false"));
      dropdowns.forEach((d) => {
        d.querySelector(".cal-dropdown-toggle").classList.remove("has-selection");
        d.querySelectorAll("[data-cal-filter]").forEach((b) => b.setAttribute("aria-pressed", "false"));
      });
    }

    topLevelFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        clearAllSelections();
        btn.setAttribute("aria-pressed", "true");
      });
    });

    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".cal-dropdown-toggle");
      const menu = dropdown.querySelector(".cal-dropdown-menu");

      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains("is-open");
        dropdowns.forEach((d) => {
          d.classList.remove("is-open");
          d.querySelector(".cal-dropdown-toggle").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          dropdown.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
        }
      });

      menu.querySelectorAll("[data-cal-filter]").forEach((option) => {
        option.addEventListener("click", () => {
          clearAllSelections();
          option.setAttribute("aria-pressed", "true");
          toggle.classList.add("has-selection");
          dropdown.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    });

    document.addEventListener("click", () => {
      dropdowns.forEach((d) => {
        d.classList.remove("is-open");
        d.querySelector(".cal-dropdown-toggle").setAttribute("aria-expanded", "false");
      });
    });
  });
})();
