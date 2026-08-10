/* =========================================================
   HOME PAGE BEHAVIOR
   Requires: data/threads.js, data/testimonials.js, js/main.js
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    renderThreadCards();
    initTestimonialCarousel();
  });

  /* ---------- Our Threads cards ---------- */
  function renderThreadCards() {
    const mount = document.getElementById("threads-track");
    if (!mount || !window.IW_THREADS) return;
    mount.innerHTML = window.IW_THREADS.map(
      (t, i) => `
      <article class="thread-card" data-reveal style="transition-delay:${i * 70}ms">
        <span class="num">0${i + 1}</span>
        <h3 class="h4">${IWEscapeHTML(t.name)}</h3>
        <p class="text-soft" style="font-size:.85rem; font-weight:600; margin-bottom:6px;">${IWEscapeHTML(t.tagline)}</p>
        <p>${IWEscapeHTML(t.body)}</p>
        <a class="learn-more" href="about.html#${t.id}">Learn More →</a>
      </article>`
    ).join("");
    if (window.IWRevealScan) window.IWRevealScan();
  }

  function IWEscapeHTML(s) {
    return window.IWEscapeHTML ? window.IWEscapeHTML(s) : s;
  }

  /* ---------- Testimonial thread carousel ---------- */
  function initTestimonialCarousel() {
    const track = document.getElementById("testi-track");
    const dotsWrap = document.getElementById("testi-dots");
    if (!track || !window.IW_TESTIMONIALS) return;

    const items = window.IW_TESTIMONIALS;
    let index = 0;
    let timer = null;

    track.innerHTML = items
      .map(
        (t, i) => `
      <div class="testi-slide ${i === 0 ? "is-active" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}">
        <p class="testi-quote">${IWEscapeHTML(t.quote)}</p>
        <p class="testi-meta">${IWEscapeHTML(t.name)}</p>
        <p class="testi-role">${IWEscapeHTML(t.role)}</p>
      </div>`
      )
      .join("");

    dotsWrap.innerHTML = items
      .map((_, i) => `<button type="button" aria-current="${i === 0}" aria-label="Show testimonial ${i + 1}"></button>`)
      .join("");

    const slides = track.querySelectorAll(".testi-slide");
    const dots = dotsWrap.querySelectorAll("button");

    function show(i) {
      index = (i + items.length) % items.length;
      slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
      dots.forEach((d, n) => d.setAttribute("aria-current", String(n === index)));
    }

    dots.forEach((d, i) => d.addEventListener("click", () => { show(i); resetTimer(); }));
    document.getElementById("testi-prev").addEventListener("click", () => { show(index - 1); resetTimer(); });
    document.getElementById("testi-next").addEventListener("click", () => { show(index + 1); resetTimer(); });

    function resetTimer() {
      if (timer) clearInterval(timer);
      if (window.IW_REDUCED_MOTION) return;
      timer = setInterval(() => show(index + 1), 7000);
    }
    resetTimer();
  }
})();
