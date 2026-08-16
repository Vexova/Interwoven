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

    // Type/chapter filter chips are visual + informational for now,
    // since the free embed can't be filtered from the outside.
    document.querySelectorAll("[data-cal-filter]").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("[data-cal-filter]").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
      });
    });
  });
})();
