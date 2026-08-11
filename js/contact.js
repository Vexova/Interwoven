/* =========================================================
   CONTACT PAGE BEHAVIOR
   The contact form was removed — this page now just shows
   direct contact info (email, chapters, get involved, social)
   plus the FAQ accordion below.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".accordion-item").forEach((item) => {
      const trigger = item.querySelector(".accordion-trigger");
      const panel = item.querySelector(".accordion-panel");
      trigger.addEventListener("click", () => {
        const isOpen = item.dataset.open === "true";
        document.querySelectorAll(".accordion-item").forEach((other) => {
          if (other !== item) {
            other.dataset.open = "false";
            other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
            other.querySelector(".accordion-panel").style.maxHeight = "0px";
          }
        });
        item.dataset.open = String(!isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = isOpen ? "0px" : panel.scrollHeight + "px";
      });
    });
  });
})();
