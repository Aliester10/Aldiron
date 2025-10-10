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
      (href === "news.html" && currentPage.includes("news"))
    ) {
      item.classList.add("active");
    }
  });

  // Sidebar CTA Button
  const sidebarCtaBtn = document.querySelector(".sidebar-cta-btn");
  if (sidebarCtaBtn) {
    sidebarCtaBtn.addEventListener("click", function () {
      closeSidebar();
      alert("Subscribe to our newsletter for latest news!");
    });
  }

  // News Card Click Handler
  const newsCards = document.querySelectorAll(".news-card");
  newsCards.forEach((card) => {
    card.addEventListener("click", function () {
      console.log("News card clicked");
      // Add your navigation logic here
    });
  });

  console.log("✅ News Page Mobile Navigation Initialized");
});
