/* =========================================================
   KFGC MEDIA APP — script.js
   Handles:
   - Mobile menu toggle
   - Hero slider (auto, arrows, dots)
   - Touch / swipe support
   - Dark mode toggle
   - Keyboard accessibility
   - PWA install prompt
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================
     MOBILE MENU
  ===================== */
  const menuToggle = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("show");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    primaryNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =====================
     HERO SLIDER
  ===================== */
  const slider = document.querySelector(".slider");
  const slidesContainer = document.querySelector(".slides");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".controls .prev");
  const nextBtn = document.querySelector(".controls .next");
  const dotsContainer = document.querySelector(".dots");

  if (!slider || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideInterval;
  const AUTO_SLIDE_DELAY = 6000;

  // Create dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-selected", "false");
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartAutoSlide();
      dot.focus();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("button");

  function updateSlider() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((slide, idx) => {
      slide.setAttribute("aria-hidden", idx !== currentIndex);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
      dot.setAttribute("aria-selected", idx === currentIndex ? "true" : "false");
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Button controls
  nextBtn?.addEventListener("click", () => { nextSlide(); restartAutoSlide(); });
  prevBtn?.addEventListener("click", () => { prevSlide(); restartAutoSlide(); });

  // Touch swipe support
  let startX = 0;
  slider.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  slider.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const threshold = 50;
    if (startX - endX > threshold) nextSlide();
    else if (endX - startX > threshold) prevSlide();
    restartAutoSlide();
  });

  // Pause on hover
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  /* ---- KEYBOARD NAVIGATION ---- */
  slider.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") {
      nextSlide();
      restartAutoSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
      restartAutoSlide();
    }
  });

  // Allow dot navigation with left/right arrows when focused
  dots.forEach(dot => {
    dot.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") {
        const next = (currentIndex + 1) % slides.length;
        goToSlide(next);
        dots[next].focus();
        restartAutoSlide();
      } else if (e.key === "ArrowLeft") {
        const prev = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prev);
        dots[prev].focus();
        restartAutoSlide();
      }
    });
  });

  // Initialize slider
  updateSlider();
  startAutoSlide();

  /* =====================
     DARK MODE TOGGLE
  ===================== */
  const themeToggleBtn = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  themeToggleBtn?.addEventListener("click", () => {
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (metaTheme) metaTheme.setAttribute("content", isDark ? "#0e1624" : "#08203a");
  });

  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark");
    metaTheme?.setAttribute("content", "#0e1624");
  }

  
  // Dark mode toggle
const toggle = document.getElementById("darkToggle");
const icon = toggle.querySelector("i");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  icon.classList.replace("fa-moon", "fa-sun");
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  icon.classList.toggle("fa-moon", !isDark);
  icon.classList.toggle("fa-sun", isDark);

  localStorage.setItem("theme", isDark ? "dark" : "light");
});
  /* =====================
     PWA INSTALL PROMPT
  ===================== */
  let deferredPrompt;
  const installBtn = document.getElementById("installBtn");

  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });

  installBtn?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
});