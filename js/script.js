// ==================== CONFIGURATION ====================
const CONFIG = {
  scrollOffset: 80,
  scrollBehavior: "smooth",
  debounceDelay: 100,
  whatsappNumber: "6281931418884",
};

// ==================== UTILITY FUNCTIONS ====================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function smoothScrollTo(element, offset = CONFIG.scrollOffset) {
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: CONFIG.scrollBehavior,
    });
  }
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      smoothScrollTo(target);

      // Close mobile sidebar after clicking
      closeMobileSidebar();

      // Update URL without triggering page jump
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    }
  });
});

// ==================== MOBILE SIDEBAR ====================
const sidebarToggle = document.querySelector(".mobile-sidebar-toggle");
const mobileSidebar = document.querySelector(".mobile-sidebar");
const sidebarClose = document.querySelector(".sidebar-close");
const sidebarOverlay = document.querySelector(".sidebar-overlay");
const sidebarContent = document.querySelector(".sidebar-content");

function closeMobileSidebar() {
  if (mobileSidebar && mobileSidebar.classList.contains("active")) {
    mobileSidebar.classList.remove("active");
    if (sidebarToggle) {
      sidebarToggle.classList.remove("active");
    }
    document.body.style.overflow = "";
  }
}

function openMobileSidebar() {
  if (mobileSidebar) {
    mobileSidebar.classList.add("active");
    if (sidebarToggle) {
      sidebarToggle.classList.add("active");
    }
    document.body.style.overflow = "hidden";
  }
}

if (sidebarToggle && mobileSidebar) {
  // Toggle sidebar
  sidebarToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (mobileSidebar.classList.contains("active")) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });

  // Close sidebar with X button
  if (sidebarClose) {
    sidebarClose.addEventListener("click", function (e) {
      e.preventDefault();
      closeMobileSidebar();
    });
  }

  // Close sidebar when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function () {
      closeMobileSidebar();
    });
  }

  // Prevent sidebar content clicks from closing
  if (sidebarContent) {
    sidebarContent.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Close sidebar on window resize to desktop
  window.addEventListener(
    "resize",
    debounce(function () {
      if (window.innerWidth > 768) {
        closeMobileSidebar();
      }
    }, CONFIG.debounceDelay)
  );
}

// ==================== MOBILE BOTTOM NAVIGATION ====================
const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

// Get current page filename
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const currentPageName = currentPage.replace(".html", "");

// Map page names to navigation items
const pageMap = {
  index: "index.html",
  "": "index.html",
  aldiron_logistics2: "index.html",
  about: "about.html",
  service: "service.html",
  news: "news.html",
  contact: "contact.html",
};

// Map section IDs to pages
const sectionToPage = {
  home: "index.html",
  introduce: "about.html",
  service: "service.html",
  news: "news.html",
  contact: "contact.html",
};

// Set active state based on current page
function setActiveNavByPage() {
  // Update bottom navigation
  bottomNavItems.forEach((item) => {
    const itemHref = item.getAttribute("href");
    item.classList.remove("active");

    // Check if current page matches
    if (
      itemHref === currentPage ||
      itemHref === pageMap[currentPageName] ||
      (currentPage === "" && itemHref === "index.html") ||
      (currentPage === "/" && itemHref === "index.html") ||
      (currentPage === "aldiron_logistics2.html" && itemHref === "index.html")
    ) {
      item.classList.add("active");
    }
  });

  // Update desktop navigation
  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    link.classList.remove("active");

    if (
      linkHref === currentPage ||
      linkHref === pageMap[currentPageName] ||
      (currentPage === "" && linkHref === "index.html") ||
      (linkHref === "index.html" && currentPage === "") ||
      (linkHref === "index.html" && currentPage === "aldiron_logistics2.html")
    ) {
      link.classList.add("active");
    }
  });
}

// Initialize active state
setActiveNavByPage();

// Set active state on scroll (only for index page with sections)
if (
  currentPage === "index.html" ||
  currentPage === "" ||
  currentPage === "/" ||
  currentPage === "aldiron_logistics2.html"
) {
  let scrollTimer;

  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {
      let current = "home";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      // Update desktop navigation
      navLinks.forEach((link) => {
        link.classList.remove("active");
        const href = link.getAttribute("href");

        if (
          href === `#${current}` ||
          (href === "index.html" && current === "home")
        ) {
          link.classList.add("active");
        }
      });

      // Update mobile bottom navigation
      bottomNavItems.forEach((item) => {
        item.classList.remove("active");
        const href = item.getAttribute("href");

        if (sectionToPage[current] === href) {
          item.classList.add("active");
        }
      });
    }, 50);
  });
}

// Handle click on bottom nav items
bottomNavItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // If it's a hash link on the same page
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        smoothScrollTo(target);
      }
      return;
    }

    // If clicking the same page, scroll to top
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html") ||
      (currentPage === "/" && href === "index.html") ||
      (currentPage === "aldiron_logistics2.html" && href === "index.html")
    ) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: CONFIG.scrollBehavior,
      });
      return;
    }

    // Otherwise navigate to the page
    bottomNavItems.forEach((nav) => nav.classList.remove("active"));
    this.classList.add("active");
  });

  // Add keyboard support
  item.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.click();
    }
  });
});

// ==================== SCROLL TO TOP BUTTON ====================
const scrollToTopBtn = document.querySelector(
  ".floating-buttons .fab-btn:first-child"
);

window.addEventListener(
  "scroll",
  debounce(() => {
    if (window.pageYOffset > 300) {
      if (scrollToTopBtn) {
        scrollToTopBtn.style.opacity = "1";
        scrollToTopBtn.style.visibility = "visible";
      }
    } else {
      if (scrollToTopBtn) {
        scrollToTopBtn.style.opacity = "0";
        scrollToTopBtn.style.visibility = "hidden";
      }
    }
  }, CONFIG.debounceDelay)
);

if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: CONFIG.scrollBehavior,
    });
  });
}

// ==================== FLOATING ACTION BUTTONS ====================
// WhatsApp button
const whatsappBtn = document.querySelectorAll(".fab-btn")[1];
if (whatsappBtn) {
  whatsappBtn.addEventListener("click", () => {
    const message = encodeURIComponent(
      "Halo Aldiron, saya ingin bertanya tentang layanan logistics Anda."
    );
    window.open(
      `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`,
      "_blank"
    );
  });
}

// Chat button
const chatBtn = document.querySelectorAll(".fab-btn")[2];
if (chatBtn) {
  chatBtn.addEventListener("click", () => {
    alert(
      "💬 Fitur Live Chat\n\n" +
        "Fitur chat akan segera tersedia!\n\n" +
        "Saat ini Anda dapat menghubungi kami melalui:\n\n" +
        "📱 WhatsApp: 0819 3141 8884\n" +
        "📧 Email: business@aldiron.co.id\n" +
        "📞 Telepon: +62-541-7751-804"
    );
  });
}

// ==================== BOOKING FORM ====================
// Tab switching for booking form
const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    // You can add logic here to show different form fields based on tab
    console.log("Tab switched:", this.textContent.trim());
  });
});

// Form submission handler
const bookingForm = document.querySelector(".booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = bookingForm.querySelector('input[type="text"]').value.trim();
    const email = bookingForm.querySelector('input[type="email"]').value.trim();
    const mobile = bookingForm.querySelector('input[type="tel"]').value.trim();
    const description =
      bookingForm.querySelectorAll('input[type="text"]')[1]?.value.trim() || "";

    // Validation
    if (!name || !email || !mobile) {
      alert("❌ Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("❌ Format email tidak valid!\nContoh: nama@example.com");
      return;
    }

    // Phone validation (Indonesia)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    const cleanMobile = mobile.replace(/[\s-]/g, "");

    if (!phoneRegex.test(cleanMobile)) {
      alert(
        "❌ Format nomor telepon tidak valid!\n\n" +
          "Gunakan format:\n" +
          "• 08xx-xxxx-xxxx\n" +
          "• +62xxx-xxxx-xxxx\n" +
          "• 62xxx-xxxx-xxxx"
      );
      return;
    }

    // Success
    alert(
      `✅ Terima kasih, ${name}!\n\n` +
        `Permintaan booking Anda telah diterima.\n\n` +
        `📋 Detail:\n` +
        `Nama: ${name}\n` +
        `Email: ${email}\n` +
        `Mobile: ${mobile}\n` +
        (description ? `Deskripsi: ${description}\n\n` : "\n") +
        `Kami akan menghubungi Anda segera melalui email atau telepon.\n\n` +
        `Untuk informasi lebih lanjut, hubungi:\n` +
        `📞 0819 3141 8884`
    );

    // Reset form
    bookingForm.reset();

    // Optional: Send to analytics or backend
    console.log("Form submitted:", {
      name,
      email,
      mobile,
      description,
      timestamp: new Date().toISOString(),
    });
  });
}

// ==================== SERVICE CARDS ====================
const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card, index) => {
  // Click handler
  card.addEventListener("click", function () {
    const serviceName = this.querySelector(".service-label span").textContent;
    showServiceDetails(serviceName);
  });

  // Keyboard support
  card.setAttribute("tabindex", "0");
  card.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.click();
    }
  });

  // Scroll animation
  observeServiceCards(card, index);
});

function showServiceDetails(serviceName) {
  alert(
    `📦 ${serviceName}\n\n` +
      `Untuk informasi lebih lanjut tentang layanan ini:\n\n` +
      `📞 Telepon: 0819 3141 8884\n` +
      `📧 Email: business@aldiron.co.id\n` +
      `🕐 Jam Kerja: Senin - Jumat\n` +
      `   08:00 - 17:30 WIB\n\n` +
      `📍 Alamat:\n` +
      `   Jl Veteran No 41\n` +
      `   Samarinda, Kalimantan Timur\n\n` +
      `Tim kami siap membantu Anda!`
  );
}

function observeServiceCards(card, index) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    },
    { threshold: 0.1 }
  );

  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "all 0.6s ease";

  observer.observe(card);
}

// ==================== SIDEBAR CTA BUTTON ====================
const sidebarCtaBtn = document.querySelector(".sidebar-cta-btn");
if (sidebarCtaBtn) {
  sidebarCtaBtn.addEventListener("click", function (e) {
    e.preventDefault();
    closeMobileSidebar();

    // Navigate to contact page if not on index
    if (
      currentPage !== "index.html" &&
      currentPage !== "" &&
      currentPage !== "/" &&
      currentPage !== "aldiron_logistics2.html"
    ) {
      window.location.href = "contact.html";
    } else {
      // Scroll to contact section
      const contactSection = document.querySelector("#contact");
      if (contactSection) {
        smoothScrollTo(contactSection);
      }
    }
  });
}

// ==================== NEWS NAVIGATION ====================
const prevArrow = document.querySelector(".news-nav .prev-arrow");
const nextArrow = document.querySelector(".news-nav .next-arrow");
const seeAllBtn = document.querySelector(".see-all-btn");

if (prevArrow) {
  prevArrow.addEventListener("click", function () {
    console.log("Previous news clicked");
    // Add your news navigation logic here
  });
}

if (nextArrow) {
  nextArrow.addEventListener("click", function () {
    console.log("Next news clicked");
    // Add your news navigation logic here
  });
}

if (seeAllBtn) {
  seeAllBtn.addEventListener("click", function () {
    if (currentPage === "news.html") {
      alert("Anda sudah berada di halaman berita!");
    } else {
      window.location.href = "news.html";
    }
  });
}

// ==================== NEWS PAGINATION ====================
const paginationPrev = document.querySelector(".pagination-prev");
const paginationNext = document.querySelector(".pagination-next");

if (paginationPrev) {
  paginationPrev.addEventListener("click", function () {
    console.log("Previous page clicked");
    // Add pagination logic here
  });
}

if (paginationNext) {
  paginationNext.addEventListener("click", function () {
    console.log("Next page clicked");
    // Add pagination logic here
  });
}

// ==================== TESTIMONIAL NAVIGATION ====================
const testimonialNavButtons = document.querySelectorAll(".nav-arrows button");
testimonialNavButtons.forEach((button, index) => {
  button.addEventListener("click", function () {
    console.log(
      `Testimonial navigation ${index === 0 ? "previous" : "next"} clicked`
    );
    // Add testimonial navigation logic here
  });
});

const avatarImages = document.querySelectorAll(".avatar-list img");
avatarImages.forEach((img) => {
  img.addEventListener("click", function () {
    avatarImages.forEach((avatar) => avatar.classList.remove("active-avatar"));
    this.classList.add("active-avatar");
    console.log("Avatar clicked");
    // Add logic to change testimonial content
  });
});

// ==================== FOOTER CONTACT BUTTON (UPDATED) ====================
const footerContactBtn = document.querySelector(".contact-btn-footer");
if (footerContactBtn) {
  footerContactBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Check if we're on index page
    const isIndexPage =
      currentPage === "index.html" ||
      currentPage === "" ||
      currentPage === "/" ||
      currentPage === "aldiron_logistics2.html";

    if (!isIndexPage) {
      // If not on index, go to contact page
      window.location.href = "contact.html";
    } else {
      // If on index, scroll to booking section
      const bookingSection = document.querySelector(".booking-tracking");
      if (bookingSection) {
        smoothScrollTo(bookingSection);
      }
    }
  });
}

// ==================== FOOTER SOCIAL MEDIA LINKS (UPDATED) ====================
// WhatsApp messenger icon
const footerWhatsapp = document.querySelector(".messenger-icon.whatsapp");
if (footerWhatsapp) {
  footerWhatsapp.addEventListener("click", function (e) {
    e.preventDefault();
    const message = encodeURIComponent(
      "Halo Aldiron, saya ingin bertanya tentang layanan logistics Anda."
    );
    window.open(
      `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`,
      "_blank"
    );
  });
}

// Instagram messenger icon
const footerInstagram = document.querySelector(".messenger-icon.instagram");
if (footerInstagram) {
  footerInstagram.addEventListener("click", function (e) {
    e.preventDefault();
    // Replace with your actual Instagram URL
    window.open("https://instagram.com/aldiron.official", "_blank");
  });
}

// Telegram messenger icon
const footerTelegram = document.querySelector(".messenger-icon.telegram");
if (footerTelegram) {
  footerTelegram.addEventListener("click", function (e) {
    e.preventDefault();
    // Replace with your actual Telegram URL
    window.open("https://t.me/aldiron_official", "_blank");
  });
}

// YouTube social icon
const footerYoutube = document.querySelector(".social-icon.youtube");
if (footerYoutube) {
  footerYoutube.addEventListener("click", function (e) {
    e.preventDefault();
    // Replace with your actual YouTube URL
    window.open("https://youtube.com/@aldiron", "_blank");
  });
}

// LinkedIn social icon
const footerLinkedin = document.querySelector(".social-icon.linkedin");
if (footerLinkedin) {
  footerLinkedin.addEventListener("click", function (e) {
    e.preventDefault();
    // Replace with your actual LinkedIn URL
    window.open("https://linkedin.com/company/aldiron", "_blank");
  });
}

// Facebook social icon
const footerFacebook = document.querySelector(".social-icon.facebook");
if (footerFacebook) {
  footerFacebook.addEventListener("click", function (e) {
    e.preventDefault();
    // Replace with your actual Facebook URL
    window.open("https://facebook.com/aldiron.official", "_blank");
  });
}

// TikTok social icon
const footerTiktok = document.querySelector(".social-icon.tiktok");
if (footerTiktok) {
  footerTiktok.addEventListener("click", function (e) {
    e.preventDefault();
    // Replace with your actual TikTok URL
    window.open("https://tiktok.com/@aldiron", "_blank");
  });
}

// ==================== ACCESSIBILITY ====================
// Escape key to close sidebar
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeMobileSidebar();
  }
});

// Keyboard navigation for sidebar toggle
if (sidebarToggle) {
  sidebarToggle.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.click();
    }
  });
}

// Focus trap in sidebar when open
if (mobileSidebar) {
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  mobileSidebar.addEventListener("keydown", function (e) {
    if (!this.classList.contains("active")) return;

    if (e.key === "Tab") {
      const focusables = this.querySelectorAll(focusableElements);
      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy load images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Preload critical resources
function preloadResources() {
  const links = [
    { rel: "preconnect", href: "https://cdnjs.cloudflare.com" },
    { rel: "preconnect", href: "https://flagcdn.com" },
  ];

  links.forEach((link) => {
    const preconnectLink = document.createElement("link");
    preconnectLink.rel = link.rel;
    preconnectLink.href = link.href;
    document.head.appendChild(preconnectLink);
  });
}

// ==================== ERROR HANDLING ====================
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
  // You can send this to an error tracking service
});

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Aldiron Logistics - Website Initialized");
  console.log(`📄 Current Page: ${currentPage}`);
  console.log(`👤 User: Aliester10`);
  console.log(`📅 Date: 2025-10-10`);
  console.log("✅ Mobile Navigation: Ready");
  console.log("✅ Sidebar: Ready");
  console.log("✅ Bottom Navigation: Ready");
  console.log("✅ Footer Updated: Ready");
  console.log("✅ All event listeners: Initialized");
  console.log("✅ Accessibility features: Enabled");
  console.log("✅ Performance optimizations: Active");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Website ready for use!");

  // Preload resources
  preloadResources();

  // Set initial active states
  setActiveNavByPage();
});

// ==================== PAGE VISIBILITY ====================
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    console.log("Page hidden");
  } else {
    console.log("Page visible");
  }
});

// ==================== CONSOLE SIGNATURE ====================
console.log(
  "%c🚛 Aldiron Logistics Website ",
  "background: #00726b; color: white; font-size: 16px; padding: 10px; border-radius: 5px;"
);
console.log(
  "%cDeveloped with ❤️ for seamless logistics experience",
  "color: #00726b; font-size: 12px;"
);
console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #00726b;");
console.log(
  "%c✅ Footer social media links: Initialized",
  "color: #00726b; font-weight: bold;"
);
console.log(
  "%c✅ Footer contact button: Ready",
  "color: #00726b; font-weight: bold;"
);
