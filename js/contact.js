// ==================== MOBILE SIDEBAR & BOTTOM NAV ====================
document.addEventListener("DOMContentLoaded", function () {
  // Mobile Sidebar Toggle
  const sidebarToggle = document.querySelector(".mobile-sidebar-toggle");
  const mobileSidebar = document.querySelector(".mobile-sidebar");
  const sidebarClose = document.querySelector(".sidebar-close");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");

  function closeSidebar() {
    if (mobileSidebar) {
      mobileSidebar.classList.remove("active");
      document.body.style.overflow = "";
    }
    if (sidebarToggle) {
      sidebarToggle.classList.remove("active");
    }
  }

  function openSidebar() {
    if (mobileSidebar) {
      mobileSidebar.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    if (sidebarToggle) {
      sidebarToggle.classList.add("active");
    }
  }

  // Toggle Sidebar
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (mobileSidebar.classList.contains("active")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  // Close Sidebar
  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  // Close on Overlay Click
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  // Close on ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSidebar();
    }
  });

  // Close on resize to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });

  // Bottom Nav Active State
  const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  bottomNavItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (
      href === currentPage ||
      (href === "contact.html" && currentPage.includes("contact"))
    ) {
      item.classList.add("active");
    }
  });

  // Sidebar CTA Button
  const sidebarCtaBtn = document.querySelector(".sidebar-cta-btn");
  if (sidebarCtaBtn) {
    sidebarCtaBtn.addEventListener("click", function () {
      closeSidebar();
      // Scroll to form
      const formSection = document.querySelector(".booking-section");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Floating Buttons
  const fabBtns = document.querySelectorAll(".fab-btn");

  // Scroll to top button
  if (fabBtns[0]) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        fabBtns[0].style.opacity = "1";
        fabBtns[0].style.visibility = "visible";
      } else {
        fabBtns[0].style.opacity = "0";
        fabBtns[0].style.visibility = "hidden";
      }
    });

    fabBtns[0].addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // WhatsApp button
  if (fabBtns[1]) {
    fabBtns[1].addEventListener("click", function () {
      window.open("https://wa.me/6281531418884", "_blank");
    });
  }

  // Chat button
  if (fabBtns[2]) {
    fabBtns[2].addEventListener("click", function () {
      alert("Chat feature coming soon!");
    });
  }

  // Contact Form Handling
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Form submitted successfully! We will contact you soon.");
      contactForm.reset();
    });
  }

  console.log("✅ Contact Page Mobile Navigation Initialized");
});
