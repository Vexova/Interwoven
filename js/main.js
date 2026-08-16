/* =========================================================
   INTERWOVEN – SHARED SITE BEHAVIOR
   Include on every page, before any page-specific script.
   ========================================================= */
(function () {
  "use strict";

  window.IW_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMobileNav();
    initActiveNavLink();
    initScrollReveal();
    initCounters();
    initThreadGlow();
    initPageSweep();
    initNewsletterModal();
    initFooterNewsletter();
    initFooterYear();
  });

  /* ---------- Header: transparent over hero, solid on scroll ----------
     Pages without a tall .hero (every interior page) keep the header
     solid at all times – there's no scroll runway to be transparent
     over, and being transparent there would sit on top of content. */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    if (!document.querySelector(".hero")) {
      header.classList.add("is-solid");
      return;
    }
    const threshold = Math.max(120, window.innerHeight * 0.5);
    const onScroll = () => header.classList.toggle("is-solid", window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".primary-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Active nav link ---------- */
  function initActiveNavLink() {
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".primary-nav a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Scroll reveal ----------
     Safe to call more than once: content rendered dynamically
     *after* DOMContentLoaded (e.g. cards built from a data file)
     wouldn't otherwise get picked up, so call window.IWRevealScan()
     any time new [data-reveal] elements are added to the page. */
  let revealObserver = null;
  function initScrollReveal() {
    const items = document.querySelectorAll("[data-reveal]:not([data-reveal-bound])");
    if (!items.length) return;

    if (window.IW_REDUCED_MOTION || !("IntersectionObserver" in window)) {
      items.forEach((el) => {
        el.classList.add("is-visible");
        el.setAttribute("data-reveal-bound", "");
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
    }
    items.forEach((el) => {
      el.setAttribute("data-reveal-bound", "");
      revealObserver.observe(el);
    });
  }
  window.IWRevealScan = initScrollReveal;

  /* ---------- Impact counters ---------- */
  function initCounters() {
    const counters = document.querySelectorAll(".impact-number[data-target]");
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || "";
      if (window.IW_REDUCED_MOTION) {
        el.textContent = target + suffix;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => io.observe(el));
  }

  /* ---------- Thread cursor glow ----------
     Any wrapper with [data-thread-zone] containing a
     .thread-canvas svg with a <g class="glow-layer"> gets a
     soft radial highlight that follows the pointer, giving the
     "ripple travels through the nearby thread" interaction. */
  function initThreadGlow() {
    if (window.IW_REDUCED_MOTION) return;
    document.querySelectorAll("[data-thread-zone]").forEach((zone) => {
      const glow = zone.querySelector(".glow-layer");
      if (!glow) return;
      zone.addEventListener("pointermove", (e) => {
        const rect = zone.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.setProperty("--mx", x + "px");
        glow.style.setProperty("--my", y + "px");
        glow.style.opacity = "1";
      });
      zone.addEventListener("pointerleave", () => {
        glow.style.opacity = "0";
      });
    });
  }

  /* ---------- Page transition sweep ----------
     Intercepts same-origin internal .html link clicks, plays a
     brief thread-sweep overlay, then navigates. */
  function initPageSweep() {
    const sweep = document.getElementById("page-sweep");
    if (!sweep || window.IW_REDUCED_MOTION) return;

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || link.target === "_blank") return;
      if (!href.endsWith(".html") && !href.includes(".html#")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      sweep.classList.add("is-active");
      window.setTimeout(() => {
        window.location.href = href;
      }, 320);
    });
  }

  /* ---------- Newsletter modal (shown once per visit window, after a short delay so it's actually seen) ---------- */
  function initNewsletterModal() {
    const overlay = document.getElementById("newsletter-overlay");
    if (!overlay) return;

    const DISMISS_KEY = "iw_newsletter_dismissed_at";
    const RESHOW_AFTER_MS = 1000 * 60 * 60 * 24 * 14; // 2 weeks
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < RESHOW_AFTER_MS) return;

    function open() {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
    }
    function dismiss() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }

    window.setTimeout(() => {
      if (!window.IW_REDUCED_MOTION) open();
      else open(); // still show for reduced-motion users, just without the entrance animation
    }, 2500);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) dismiss();
    });
    overlay.querySelectorAll("[data-close-newsletter]").forEach((btn) => btn.addEventListener("click", dismiss));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) dismiss();
    });

    const form = overlay.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        // No backend yet -- wire this to an email service (Mailchimp,
        // ConvertKit, Google Forms, etc.) when ready. No confirmation
        // message is shown; the modal just closes.
        dismiss();
        form.reset();
      });
    }
  }

  /* ---------- Footer newsletter mini-form ---------- */
  function initFooterNewsletter() {
    const form = document.getElementById("footer-newsletter-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // No backend yet -- wire this to an email service when ready.
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  function initFooterYear() {
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Utilities ---------- */
  window.IWDebounce = function (fn, delay) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay || 200);
    };
  };
  window.IWEscapeHTML = function (str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  };
})();
