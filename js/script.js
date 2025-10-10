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

// ==================== NAVIGATION ACTIVE STATE ====================
const navLinks = document.querySelectorAll(".nav-menu a");
const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
const sections = document.querySelectorAll("section[id]");

// Get current page filename
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const currentPageName = currentPage.replace(".html", "");

// Map page names to navigation items
const pageMap = {
  index: "index.html",
  "": "index.html",
  aldiron_logistics: "index.html",
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
      (currentPage === "aldiron_logistics.html" && itemHref === "index.html")
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
      (linkHref === "index.html" && currentPage === "aldiron_logistics.html")
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
  currentPage === "aldiron_logistics.html"
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
      (currentPage === "aldiron_logistics.html" && href === "index.html")
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

// ==================== BOOKING & TRACKING SYSTEM ====================

// Dummy Data untuk Tracking
const dummyTrackingData = {
  ALR001234567: {
    trackingNumber: "ALR001234567",
    status: "delivered",
    sender: "PT. Maju Jaya",
    recipient: "Ahmad Fauzi",
    origin: "Jakarta",
    destination: "Surabaya",
    weight: "15 kg",
    service: "Express (1-2 days)",
    estimatedDelivery: "2025-01-12 14:00",
    history: [
      {
        date: "2025-01-12 14:30",
        status: "Package Delivered",
        location: "Surabaya - Received by Ahmad Fauzi",
        active: true,
      },
      {
        date: "2025-01-12 08:15",
        status: "Out for Delivery",
        location: "Surabaya Distribution Center",
        active: false,
      },
      {
        date: "2025-01-11 22:00",
        status: "Arrived at Destination Hub",
        location: "Surabaya Hub",
        active: false,
      },
      {
        date: "2025-01-11 18:30",
        status: "In Transit",
        location: "Semarang Transit Point",
        active: false,
      },
      {
        date: "2025-01-11 10:00",
        status: "Departed from Origin",
        location: "Jakarta Distribution Center",
        active: false,
      },
      {
        date: "2025-01-11 08:00",
        status: "Package Picked Up",
        location: "Jakarta - PT. Maju Jaya",
        active: false,
      },
    ],
  },
  ALR002345678: {
    trackingNumber: "ALR002345678",
    status: "in-transit",
    sender: "Toko Elektronik Sejahtera",
    recipient: "Budi Santoso",
    origin: "Bandung",
    destination: "Bali",
    weight: "8 kg",
    service: "Regular (3-5 days)",
    estimatedDelivery: "2025-01-13 16:00",
    history: [
      {
        date: "2025-01-11 14:20",
        status: "In Transit",
        location: "Yogyakarta Transit Point",
        active: true,
      },
      {
        date: "2025-01-10 20:00",
        status: "Departed from Origin",
        location: "Bandung Distribution Center",
        active: false,
      },
      {
        date: "2025-01-10 15:30",
        status: "Package Picked Up",
        location: "Bandung - Toko Elektronik Sejahtera",
        active: false,
      },
    ],
  },
  ALR003456789: {
    trackingNumber: "ALR003456789",
    status: "out-for-delivery",
    sender: "CV. Berkah Mandiri",
    recipient: "Siti Nurhaliza",
    origin: "Medan",
    destination: "Pekanbaru",
    weight: "22 kg",
    service: "Express (1-2 days)",
    estimatedDelivery: "2025-01-10 17:00",
    history: [
      {
        date: "2025-01-10 07:45",
        status: "Out for Delivery",
        location: "Pekanbaru Distribution Center",
        active: true,
      },
      {
        date: "2025-01-10 01:30",
        status: "Arrived at Destination Hub",
        location: "Pekanbaru Hub",
        active: false,
      },
      {
        date: "2025-01-09 18:00",
        status: "In Transit",
        location: "Dumai Transit Point",
        active: false,
      },
      {
        date: "2025-01-09 12:00",
        status: "Departed from Origin",
        location: "Medan Distribution Center",
        active: false,
      },
      {
        date: "2025-01-09 09:15",
        status: "Package Picked Up",
        location: "Medan - CV. Berkah Mandiri",
        active: false,
      },
    ],
  },
  ALR004567890: {
    trackingNumber: "ALR004567890",
    status: "pending",
    sender: "UD. Sumber Rezeki",
    recipient: "Eko Prasetyo",
    origin: "Samarinda",
    destination: "Balikpapan",
    weight: "5 kg",
    service: "Same Day",
    estimatedDelivery: "2025-01-10 18:00",
    history: [
      {
        date: "2025-01-10 06:00",
        status: "Booking Confirmed",
        location: "Samarinda - UD. Sumber Rezeki",
        active: true,
      },
    ],
  },
};

// Tab Switching
const tabButtons = document.querySelectorAll(".tab-btn");
const bookingFormElement = document.getElementById("bookingForm");
const trackingFormElement = document.getElementById("trackingForm");

tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const targetTab = this.getAttribute("data-tab");

    // Remove active from all tabs and forms
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active to clicked tab
    this.classList.add("active");

    // Show corresponding form
    if (targetTab === "booking") {
      bookingFormElement.classList.add("active");
      document.getElementById("trackingResult").style.display = "none";
    } else if (targetTab === "tracking") {
      trackingFormElement.classList.add("active");
    }
  });
});

// ==================== BOOKING FORM HANDLER ====================
if (bookingFormElement) {
  bookingFormElement.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("bookingName").value.trim();
    const email = document.getElementById("bookingEmail").value.trim();
    const mobile = document.getElementById("bookingMobile").value.trim();
    const from = document.getElementById("bookingFrom").value.trim();
    const to = document.getElementById("bookingTo").value.trim();
    const weight = document.getElementById("bookingWeight").value.trim();
    const service = document.getElementById("bookingService").value;
    const description = document
      .getElementById("bookingDescription")
      .value.trim();

    // Validation
    if (!name || !email || !mobile || !from || !to || !weight || !service) {
      showAlert(
        "❌ Error",
        "Mohon lengkapi semua field yang wajib diisi!",
        "error"
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert(
        "❌ Invalid Email",
        "Format email tidak valid!\nContoh: nama@example.com",
        "error"
      );
      return;
    }

    // Phone validation
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    const cleanMobile = mobile.replace(/[\s-]/g, "");

    if (!phoneRegex.test(cleanMobile)) {
      showAlert(
        "❌ Invalid Phone",
        "Format nomor telepon tidak valid!\n\nGunakan format:\n• 08xx-xxxx-xxxx\n• +62xxx-xxxx-xxxx\n• 62xxx-xxxx-xxxx",
        "error"
      );
      return;
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    // Save booking data (in real app, send to backend)
    console.log("Booking submitted:", {
      trackingNumber,
      name,
      email,
      mobile,
      from,
      to,
      weight,
      service,
      description,
      timestamp: new Date().toISOString(),
    });

    // Show success modal
    showBookingSuccess(trackingNumber, name, from, to);

    // Reset form
    bookingFormElement.reset();
  });
}

// Generate Tracking Number
function generateTrackingNumber() {
  const prefix = "ALR";
  const random = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, "0");
  return `${prefix}${random}`;
}

// Show Booking Success Modal
function showBookingSuccess(trackingNumber, name, from, to) {
  const modal = document.createElement("div");
  modal.className = "success-modal";
  modal.innerHTML = `
    <div class="success-modal-content">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h3>Booking Berhasil!</h3>
      <p>Terima kasih <strong>${name}</strong>,<br>
      Pengiriman Anda dari <strong>${from}</strong> ke <strong>${to}</strong> telah dikonfirmasi.</p>
      
      <div class="tracking-number-display">
        <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 13px;">Nomor Resi Anda:</p>
        <strong>${trackingNumber}</strong>
      </div>
      
      <p style="font-size: 13px; color: #6b7280;">
        <i class="fas fa-info-circle"></i> Simpan nomor resi ini untuk tracking paket Anda
      </p>
      
      <button class="btn-submit" onclick="closeSuccessModal()">
        <i class="fas fa-check"></i> OK, MENGERTI
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // Auto close after 8 seconds
  setTimeout(() => {
    closeSuccessModal();
  }, 8000);
}

// Close Success Modal
function closeSuccessModal() {
  const modal = document.querySelector(".success-modal");
  if (modal) {
    modal.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// ==================== TRACKING FORM HANDLER ====================
if (trackingFormElement) {
  trackingFormElement.addEventListener("submit", function (e) {
    e.preventDefault();

    const trackingNumber = document
      .getElementById("trackingNumber")
      .value.trim()
      .toUpperCase();

    if (!trackingNumber) {
      showAlert("❌ Error", "Mohon masukkan nomor resi!", "error");
      return;
    }

    // Search in dummy data
    const trackingData = dummyTrackingData[trackingNumber];

    if (trackingData) {
      displayTrackingResult(trackingData);
    } else {
      showAlert(
        "❌ Not Found",
        `Nomor resi "${trackingNumber}" tidak ditemukan.\n\n` +
          `Coba gunakan nomor resi berikut untuk testing:\n` +
          `• ALR001234567 (Delivered)\n` +
          `• ALR002345678 (In Transit)\n` +
          `• ALR003456789 (Out for Delivery)\n` +
          `• ALR004567890 (Pending)`,
        "error"
      );
    }
  });
}

// Display Tracking Result
function displayTrackingResult(data) {
  const resultDiv = document.getElementById("trackingResult");

  // Populate data
  document.getElementById("resultTrackingNumber").textContent =
    data.trackingNumber;

  const statusBadge = document.getElementById("resultStatus");
  statusBadge.textContent = formatStatus(data.status);
  statusBadge.className = `status-badge status-${data.status}`;

  document.getElementById("resultSender").textContent = data.sender;
  document.getElementById("resultRecipient").textContent = data.recipient;
  document.getElementById("resultOrigin").textContent = data.origin;
  document.getElementById("resultDestination").textContent = data.destination;
  document.getElementById("resultWeight").textContent = data.weight;
  document.getElementById("resultService").textContent = data.service;
  document.getElementById("resultEstimated").textContent =
    data.estimatedDelivery;

  // Build timeline
  const timeline = document.getElementById("trackingTimeline");
  timeline.innerHTML = "";

  data.history.forEach((item) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = `timeline-item ${item.active ? "active" : ""}`;
    timelineItem.innerHTML = `
      <div class="timeline-date">${item.date}</div>
      <div class="timeline-status">${item.status}</div>
      <div class="timeline-location">
        <i class="fas fa-map-marker-alt"></i>
        ${item.location}
      </div>
    `;
    timeline.appendChild(timelineItem);
  });

  // Show result
  resultDiv.style.display = "block";

  // Smooth scroll to result
  setTimeout(() => {
    smoothScrollTo(resultDiv, 100);
  }, 300);
}

// Close Tracking Result
const closeTrackingBtn = document.getElementById("closeTracking");
if (closeTrackingBtn) {
  closeTrackingBtn.addEventListener("click", function () {
    document.getElementById("trackingResult").style.display = "none";
    document.getElementById("trackingNumber").value = "";
  });
}

// Format Status Text
function formatStatus(status) {
  const statusMap = {
    pending: "Pending",
    "in-transit": "In Transit",
    "out-for-delivery": "Out for Delivery",
    delivered: "Delivered",
    failed: "Failed",
  };
  return statusMap[status] || status;
}

// Show Alert Function
function showAlert(title, message, type = "info") {
  alert(`${title}\n\n${message}`);
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
      currentPage !== "aldiron_logistics.html"
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
  });
}

if (nextArrow) {
  nextArrow.addEventListener("click", function () {
    console.log("Next news clicked");
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
  });
}

if (paginationNext) {
  paginationNext.addEventListener("click", function () {
    console.log("Next page clicked");
  });
}

// ==================== TESTIMONIAL NAVIGATION ====================
const testimonialNavButtons = document.querySelectorAll(".nav-arrows button");
testimonialNavButtons.forEach((button, index) => {
  button.addEventListener("click", function () {
    console.log(
      `Testimonial navigation ${index === 0 ? "previous" : "next"} clicked`
    );
  });
});

const avatarImages = document.querySelectorAll(".avatar-list img");
avatarImages.forEach((img) => {
  img.addEventListener("click", function () {
    avatarImages.forEach((avatar) => avatar.classList.remove("active-avatar"));
    this.classList.add("active-avatar");
    console.log("Avatar clicked");
  });
});

// ==================== FOOTER CONTACT BUTTON ====================
const footerContactBtn = document.querySelector(".contact-btn-footer");
if (footerContactBtn) {
  footerContactBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const isIndexPage =
      currentPage === "index.html" ||
      currentPage === "" ||
      currentPage === "/" ||
      currentPage === "aldiron_logistics.html";

    if (!isIndexPage) {
      window.location.href = "contact.html";
    } else {
      const bookingSection = document.querySelector(".booking-tracking");
      if (bookingSection) {
        smoothScrollTo(bookingSection);
      }
    }
  });
}

// ==================== FOOTER SOCIAL MEDIA LINKS ====================
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

const footerInstagram = document.querySelector(".messenger-icon.instagram");
if (footerInstagram) {
  footerInstagram.addEventListener("click", function (e) {
    e.preventDefault();
    window.open("https://instagram.com/aldiron.official", "_blank");
  });
}

const footerTelegram = document.querySelector(".messenger-icon.telegram");
if (footerTelegram) {
  footerTelegram.addEventListener("click", function (e) {
    e.preventDefault();
    window.open("https://t.me/aldiron_official", "_blank");
  });
}

const footerYoutube = document.querySelector(".social-icon.youtube");
if (footerYoutube) {
  footerYoutube.addEventListener("click", function (e) {
    e.preventDefault();
    window.open("https://youtube.com/@aldiron", "_blank");
  });
}

const footerLinkedin = document.querySelector(".social-icon.linkedin");
if (footerLinkedin) {
  footerLinkedin.addEventListener("click", function (e) {
    e.preventDefault();
    window.open("https://linkedin.com/company/aldiron", "_blank");
  });
}

const footerFacebook = document.querySelector(".social-icon.facebook");
if (footerFacebook) {
  footerFacebook.addEventListener("click", function (e) {
    e.preventDefault();
    window.open("https://facebook.com/aldiron.official", "_blank");
  });
}

const footerTiktok = document.querySelector(".social-icon.tiktok");
if (footerTiktok) {
  footerTiktok.addEventListener("click", function (e) {
    e.preventDefault();
    window.open("https://tiktok.com/@aldiron", "_blank");
  });
}

// ==================== ACCESSIBILITY ====================
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeMobileSidebar();
  }
});

if (sidebarToggle) {
  sidebarToggle.addEventListener("keypress", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.click();
    }
  });
}

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
});

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", function () {
  preloadResources();
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
