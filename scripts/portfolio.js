// Wait for DOM to be fully loaded before initializing all scripts
document.addEventListener("DOMContentLoaded", () => {
  // Initialize smooth scrolling for navigation
  initSmoothScrolling();

  // Initialize sticky navbar
  initStickyNavbar();

  // Initialize Lucide icons
  initLucideIcons();

  // Initialize theme toggler
  initThemeToggler();

  // Initialize portfolio carousel
  initPortfolioCarousel();

  // Initialize contact form validation
  initContactForm();
});

// Smooth scrolling navigation
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll("nav a[data-section]");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");
      const section = document.getElementById(sectionId);

      if (section) {
        // Add active class to current nav link
        navLinks.forEach((navLink) => navLink.classList.remove("active"));
        link.classList.add("active");

        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// Sticky navbar functionality
function initStickyNavbar() {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  });
}

// Initialize Lucide icons
function initLucideIcons() {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  } else {
    console.warn("Lucide icons library not loaded");
  }
}

// Theme toggler functionality
function initThemeToggler() {
  const toggleButton = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const html = document.documentElement;

  if (!toggleButton || !icon) return;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.classList.toggle("dark", savedTheme === "dark");
    updateThemeIcon();
  }

  toggleButton.addEventListener("click", () => {
    html.classList.toggle("dark");

    // Save theme preference
    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );

    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (icon.hasAttribute("data-lucide")) {
      icon.setAttribute(
        "data-lucide",
        html.classList.contains("dark") ? "sun" : "moon"
      );

      if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
      }
    }
  }
}

// Portfolio carousel functionality
function initPortfolioCarousel() {
  const carousel = document.getElementById("portfolio-carousel");
  const dotsContainer = document.getElementById("carousel-dots");

  if (!carousel || !dotsContainer) return;

  const items = carousel.querySelectorAll(".carousel-item");
  if (items.length === 0) return;

  let currentSlide = 0;
  let itemsPerView = getItemsPerView();
  let totalSlides = Math.ceil(items.length / itemsPerView);
  let autoplayInterval = null;

  // Initialize carousel
  function initCarousel() {
    // Create dots
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.onclick = function () {
        goToSlide(i);
        resetAutoplay();
      };
      dotsContainer.appendChild(dot);
    }

    // Set initial position
    updateCarousel();
    startAutoplay();
  }

  // Get items per view based on screen width
  function getItemsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }

  // Go to specific slide
  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  // Update carousel position and dots
  function updateCarousel() {
    const slideWidth = 100 / itemsPerView;
    const offset = currentSlide * slideWidth * itemsPerView;
    carousel.style.transform = `translateX(-${offset}%)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  // Start autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(function () {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }, 5000);
  }

  // Stop autoplay
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Reset autoplay
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Add pause on hover
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  // Handle window resize
  window.addEventListener("resize", function () {
    const newItemsPerView = getItemsPerView();

    if (newItemsPerView !== itemsPerView) {
      itemsPerView = newItemsPerView;
      totalSlides = Math.ceil(items.length / itemsPerView);
      currentSlide = Math.min(currentSlide, totalSlides - 1);
      initCarousel();
    }
  });

  // Initialize on load
  initCarousel();
}

// Contact form validation
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const formInputs = contactForm.querySelectorAll(".form-control");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  // Form validation
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;
    let firstInvalidInput = null;

    // Check required fields
    formInputs.forEach((input) => {
      if (input.hasAttribute("required") && !input.value.trim()) {
        input.classList.add("error");
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = input;
      } else if (
        input.id === "email" &&
        input.value &&
        !isValidEmail(input.value)
      ) {
        input.classList.add("error");
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = input;
      } else {
        input.classList.remove("error");
      }
    });

    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }

    if (isValid) {
      // Show loading state
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerText = "Sending...";
      }

      // Simulate form submission (in a real app, you'd replace this with an actual AJAX call)
      setTimeout(() => {
        alert("Form submitted successfully!");
        contactForm.reset();

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerText = "Send Message";
        }
      }, 1000);
    }
  });

  // Remove error class on input
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (input.classList.contains("error")) {
        if (input.id === "email" && input.value && !isValidEmail(input.value)) {
          return; // Keep error for invalid email
        }
        input.classList.remove("error");
      }
    });
  });
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
