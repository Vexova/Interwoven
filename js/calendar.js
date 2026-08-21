/* =========================================================
   CALENDAR PAGE BEHAVIOR
   Embeds the real, live Interwoven Google Calendar (decoded
   from the cid= param in the calendar link in the brief) – no
   API key required for a read-only embed.

   NOTE: The type/chapter filter chips (All, In-Person, Online,
   Podcast Recording Times, By Chapter) were removed – Google's
   free embed iframe can't be filtered from the outside without
   the Calendar API + a key, so those buttons never actually
   filtered anything. Only the Month/Week/List view toggle remains.
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
  });
})();
