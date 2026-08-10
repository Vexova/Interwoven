/* =========================================================
   CONTACT PAGE BEHAVIOR
   No backend, so we build a pre-filled mailto: link. Swap this
   for a real form service (Formspree, Google Forms, etc.) when
   Interwoven is ready to collect submissions directly.
   ========================================================= */
(function () {
  "use strict";

  const CONTACT_EMAIL = "interwoven00@gmail.com";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const subject = form.subject.value.trim() || "Message from the Interwoven site";
        const message = form.message.value.trim();

        const errorEl = document.getElementById("contact-error");
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!name || !email || !emailValid || !message) {
          errorEl.classList.add("is-visible");
          errorEl.textContent = !emailValid && email
            ? "That email address doesn't look right — please double-check it."
            : "Please fill in your name, email, and message before sending.";
          errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        errorEl.classList.remove("is-visible");

        const mailSubject = encodeURIComponent(`[Interwoven] ${subject}`);
        const mailBody = encodeURIComponent(`${message}\n\n—\n${name}\n${email}${phone ? "\n" + phone : ""}`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

        document.getElementById("contact-success").classList.add("is-visible");
        form.reset();
      });
    }

    // Simple FAQ accordion
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
