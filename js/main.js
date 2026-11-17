
const navLinks = [
  ["Home", "index.html"],
  ["Home 2", "home2.html"],
  ["About Us", "about.html"],
  ["Services", "services.html"],
  ["Blog", "blog.html"],
  ["Pricing", "pricing.html"],
  ["Contact", "contact.html"]
];

function getCurrentPage() {
  const path = window.location.pathname;
  let filename = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
  if (!filename || filename === "" || filename === "index.html") {
    return "index.html";
  }
  return filename;
}

function header() {
  const current = getCurrentPage();
  const user = (window.VeraStore && typeof window.VeraStore.getCurrentUser === "function") 
    ? window.VeraStore.getCurrentUser() 
    : null;

  let ctaLink = "login.html?redirect=apply.html";
  let ctaText = 'Start Your Filing <i class="bi bi-arrow-up-right ms-1"></i>';
  let userStatusHtml = '';
  let signOutHtml = '';

  if (user) {
    userStatusHtml = `
      <div class="px-3 py-2 border-bottom mb-2 profile-user-header">
        <div class="small fw-bold text-ink profile-user-name">${user.name}</div>
        <div class="profile-user-email">${user.email} <span class="profile-role-badge">(${user.role === 'admin' ? 'Admin' : 'Client'})</span></div>
      </div>
    `;
    signOutHtml = `
      <a href="#" id="navSignOutLink" class="nav-sign-out-btn mt-1 pt-2 border-top"><i class="bi bi-box-arrow-left me-2"></i>Sign out</a>
    `;
    if (user.role === 'admin') {
      ctaLink = "admin.html";
      ctaText = 'Admin Workspace <i class="bi bi-shield-check ms-1"></i>';
    } else {
      ctaLink = "apply.html";
    }
  }

  // Profile menu containing exactly: Login/Register, Admin Dashboard, Client Dashboard
  const profileMenuHtml = `
    ${userStatusHtml}
    <a href="login.html"><i class="bi bi-box-arrow-in-right me-2"></i>Login / Register</a>
    <a href="admin.html"><i class="bi bi-speedometer2 me-2"></i>Admin Dashboard</a>
    <a href="dashboard.html"><i class="bi bi-grid me-2"></i>Client Dashboard</a>
    ${signOutHtml}
  `;
  
  const navItemsHtml = navLinks.map(([name, url]) => {
    let isActive = false;
    const target = url.toLowerCase();
    
    if (current === target) {
      isActive = true;
    } else if ((current === "index.html" || current === "") && target === "index.html") {
      isActive = true;
    } else if (current === "service-detail.html" && target === "services.html") {
      isActive = true;
    } else if (current === "blog-detail.html" && target === "blog.html") {
      isActive = true;
    }
    
    return `<a href="${url}" class="nav-link-item${isActive ? " active" : ""}" ${isActive ? 'aria-current="page"' : ''}>${name}</a>`;
  }).join("");

  return `
  <header class="site-nav">
    <div class="container nav-inner">
      <a class="brand" href="index.html">
        <span class="brand-mark"><i class="bi bi-layers"></i></span>
        <span>
          <span class="brand-name d-block">VeraLedger</span>
          <span class="brand-tag d-block">TAX & ACCOUNTING, MADE CLEAR</span>
        </span>
      </a>

      <nav class="main-nav" id="mainNav">
        ${navItemsHtml}
        <div class="mobile-cta-wrap d-lg-none mt-3 pt-3 border-top w-100 text-center">
          <a class="btn-brand d-block w-100" href="${ctaLink}">${ctaText}</a>
        </div>
      </nav>

      <div class="mobile-controls">
        <button class="icon-btn" id="themeToggleMobile" aria-label="Toggle theme"><i class="bi bi-moon-stars"></i></button>
        <button class="icon-btn" id="directionToggleMobile" aria-label="Toggle text direction">RTL</button>
        <button class="icon-btn mobile-menu-btn" id="menuToggle" aria-label="Open menu"><i class="bi bi-list fs-4"></i></button>
      </div>

      <div class="nav-actions">
        <button class="icon-btn" id="themeToggle" title="Toggle theme"><i class="bi bi-moon-stars"></i></button>
        <button class="icon-btn" id="directionToggle" title="Switch LTR / RTL">RTL</button>
        
        <div class="profile-wrap">
          <button class="icon-btn" id="profileToggle" title="Account menu"><i class="bi bi-person"></i></button>
          <div class="profile-menu" id="profileMenu">
            ${profileMenuHtml}
          </div>
        </div>

        <a href="${ctaLink}" class="btn-brand nav-cta">${ctaText}</a>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-4">
          <a class="brand footer-brand mb-3" href="index.html">
            <span class="brand-mark"><i class="bi bi-layers"></i></span>
            <span>
              <span class="brand-name d-block">VeraLedger</span>
              <span class="brand-tag d-block">TAX & ACCOUNTING, MADE CLEAR</span>
            </span>
          </a>
          <p class="footer-copy mt-3">We make tax and accounting tasks easier to understand and simpler to manage. Get organized support, clear updates and a secure place for your important documents.</p>
          <div class="socials mt-4">
            <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
            <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="#" aria-label="X"><i class="bi bi-twitter-x"></i></a>
          </div>
        </div>

        <div class="col-6 col-lg-2">
          <div class="footer-title">Quick Links</div>
          <ul class="footer-links">
            ${navLinks.map(([n, u]) => `<li><a href="${u}">${n}</a></li>`).join("")}
          </ul>
        </div>

        <div class="col-6 col-lg-2">
          <div class="footer-title">Support</div>
          <ul class="footer-links">
            <li><a href="help-center.html">Help centre</a></li>
            <li><a href="faq.html">FAQs</a></li>
            <li><a href="terms.html">Terms &amp; conditions</a></li>
            <li><a href="privacy.html">Privacy policy</a></li>
            <li><a href="support.html">Contact support</a></li>
          </ul>
        </div>

        <div class="col-lg-4">
          <div class="footer-title">Get in touch</div>
          <ul class="footer-links">
            <li><i class="bi bi-envelope me-2"></i>hello@veraledger.example</li>
            <li><i class="bi bi-telephone me-2"></i>+91 98765 43210</li>
            <li><i class="bi bi-geo-alt me-2"></i>Business District, Chennai, Tamil Nadu, India</li>
            <li><i class="bi bi-clock me-2"></i>Mon – Fri, 9:30 AM – 6:00 PM</li>
          </ul>
          <a href="contact.html" class="btn-light-brand d-inline-block mt-3">Talk to our team <i class="bi bi-arrow-up-right ms-1"></i></a>
        </div>
      </div>

      <div class="footer-bottom d-flex flex-wrap justify-content-between gap-2">
        <span>© 2026 VeraLedger. All rights reserved.</span>
        <span>Designed for clarity. Built around trust.</span>
      </div>
    </div>
  </footer>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const headerElem = document.getElementById("siteHeader");
  const footerElem = document.getElementById("siteFooter");
  
  if (headerElem) headerElem.innerHTML = header();
  if (footerElem) footerElem.innerHTML = footer();

  const body = document.body;
  const urlParams = new URLSearchParams(window.location.search);
  const paramTheme = urlParams.get("theme");
  const savedTheme = paramTheme || localStorage.getItem("vl-theme");
  if (savedTheme === "dark") body.classList.add("dark-mode");

  const savedDir = localStorage.getItem("vl-dir");
  if (savedDir === "rtl") {
    body.classList.add("rtl");
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
  }

  function updateThemeIcon() {
    const isDark = body.classList.contains("dark-mode");
    ["themeToggle", "themeToggleMobile"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = isDark 
          ? '<i class="bi bi-sun"></i>' 
          : '<i class="bi bi-moon-stars"></i>';
        el.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
        el.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      }
    });
  }

  function updateDirectionLabel() {
    const isRtl = body.classList.contains("rtl");
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    ["directionToggle", "directionToggleMobile"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        // Toggle text: When in LTR mode, shows RTL (to switch to RTL); when in RTL mode, shows LTR (to switch to LTR)
        el.textContent = isRtl ? "LTR" : "RTL";
        el.setAttribute("title", isRtl ? "Switch to Left-to-Right layout" : "Switch to Right-to-Left layout");
        el.setAttribute("aria-label", isRtl ? "Switch to Left-to-Right layout" : "Switch to Right-to-Left layout");
      }
    });
  }

  updateThemeIcon();
  updateDirectionLabel();

  function toggleTheme() {
    body.classList.toggle("dark-mode");
    localStorage.setItem("vl-theme", body.classList.contains("dark-mode") ? "dark" : "light");
    updateThemeIcon();
  }

  function toggleDirection() {
    body.classList.toggle("rtl");
    localStorage.setItem("vl-dir", body.classList.contains("rtl") ? "rtl" : "ltr");
    updateDirectionLabel();
  }

  ["themeToggle", "themeToggleMobile"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", toggleTheme);
  });

  ["directionToggle", "directionToggleMobile"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", toggleDirection);
  });

  document.getElementById("menuToggle")?.addEventListener("click", () => {
    document.getElementById("mainNav")?.classList.toggle("open");
  });

  document.getElementById("profileToggle")?.addEventListener("click", () => {
    document.getElementById("profileMenu")?.classList.toggle("show");
  });

  document.getElementById("navSignOutLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (window.VeraStore) window.VeraStore.logout();
    window.location.href = "login.html";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-wrap")) {
      document.getElementById("profileMenu")?.classList.remove("show");
    }
  });

  // Sticky header scroll watcher
  function handleScroll() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Demo form handlers
  document.querySelectorAll("form[data-demo-form]").forEach(f => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = f.querySelector(".form-message");
      if (msg) {
        msg.textContent = "Thanks! This demo form is ready to be connected to a backend.";
      }
    });
  });

  // Interactive Tax Estimator Tabs
  const calcData = {
    salaried: {
      heading: "Section 80C, 80D, HRA & NPS Optimization",
      desc: "We compare Old vs. New Tax Regimes line by line, ensuring every eligible exemption from home loans, health insurance, and retirement plans is fully utilized.",
      time: "Within 24 Hours",
      notice: "100% Audit Shield",
      savings: "₹38,500*",
      features: [
        "Line-by-line Form 16 / AIS analysis",
        "Dual regime (Old vs New) tax modeling",
        "1-on-1 Certified CPA review before filing",
        "Year-round acknowledgement archive"
      ]
    },
    freelancer: {
      heading: "Section 44ADA Presumptive Taxation & Expense Claims",
      desc: "Optimize your professional tax liability using 50% presumptive income rules, software/hardware expense deductions, and international client invoicing.",
      time: "Within 36 Hours",
      notice: "Cross-Border Verified",
      savings: "₹64,200*",
      features: [
        "Section 44ADA 50% expense write-off check",
        "Foreign remittance FIRC / inward receipt audit",
        "Advance tax schedule & quarterly planning",
        "Dedicated freelance-specialist CPA"
      ]
    },
    business: {
      heading: "GST Returns, Input Tax Credit (ITC) & P&L Audit",
      desc: "Maximize input tax credit reconciliation, ensure compliant e-invoicing, and prepare comprehensive financial statements for banks and investors.",
      time: "Within 48 Hours",
      notice: "Zero ITC Reversal Guarantee",
      savings: "₹1,12,000*",
      features: [
        "GSTR-2B vs Books 100% ITC automated match",
        "Monthly / Quarterly filing reconciliation",
        "Director remuneration & TDS planning",
        "Dedicated business accounting manager"
      ]
    }
  };

  const calcTabs = document.querySelectorAll("#calcTabs .calc-tab-btn");
  calcTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      calcTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tabKey = btn.getAttribute("data-tab");
      const data = calcData[tabKey];
      if (!data) return;

      const heading = document.getElementById("calcHeading");
      const desc = document.getElementById("calcDesc");
      const time = document.getElementById("calcTime");
      const notice = document.getElementById("calcNotice");
      const savings = document.getElementById("calcSavings");
      const list = document.getElementById("calcList");

      if (heading) heading.textContent = data.heading;
      if (desc) desc.textContent = data.desc;
      if (time) time.textContent = data.time;
      if (notice) notice.textContent = data.notice;
      if (savings) savings.textContent = data.savings;
      if (list) {
        list.innerHTML = data.features.map(f => `<li><i class="bi bi-check-circle-fill"></i> ${f}</li>`).join("");
      }
    });
  });

  // ==========================================
  // Home 2: Interactive Tax-Readiness Checklist
  // ==========================================
  const checklistGrid = document.getElementById("checklistGrid");
  if (checklistGrid) {
    const checkboxes = checklistGrid.querySelectorAll('input[type="checkbox"]');
    const scoreEl = document.getElementById("readinessScore");
    const statusEl = document.getElementById("readinessStatus");
    const badgeEl = document.getElementById("checkedCountBadge");
    const progressEl = document.getElementById("checklistProgress");
    const tipEl = document.getElementById("checklistRecommendation");

    function updateChecklistScore() {
      const total = checkboxes.length;
      let checked = 0;
      checkboxes.forEach(cb => {
        const itemCard = cb.closest(".checklist-item");
        if (cb.checked) {
          checked++;
          if (itemCard) itemCard.classList.add("checked");
        } else {
          if (itemCard) itemCard.classList.remove("checked");
        }
      });

      const percentage = Math.round((checked / total) * 100);

      if (scoreEl) scoreEl.textContent = `${percentage}%`;
      if (progressEl) progressEl.style.width = `${percentage}%`;
      if (badgeEl) badgeEl.innerHTML = `<i class="bi bi-check2-all me-1"></i> ${checked} of ${total} Items Ready`;

      if (statusEl) {
        if (percentage === 100) {
          statusEl.textContent = "100% Tax Ready 🎉";
          statusEl.style.color = "var(--aqua)";
        } else if (percentage >= 75) {
          statusEl.textContent = "Nearly Audit-Ready";
          statusEl.style.color = "var(--teal2)";
        } else if (percentage >= 50) {
          statusEl.textContent = "Good Progress";
          statusEl.style.color = "var(--ink)";
        } else {
          statusEl.textContent = "Preparation Needed";
          statusEl.style.color = "var(--gold)";
        }
      }

      if (tipEl) {
        if (percentage === 100) {
          tipEl.innerHTML = `<i class="bi bi-patch-check-fill text-success me-1"></i> <strong>All set!</strong> You have all verified records required for expedited same-day ITR/GST filing.`;
        } else if (percentage >= 50) {
          tipEl.innerHTML = `<i class="bi bi-info-circle text-teal2 me-1"></i> Missing documents? Our CPAs can retrieve your AIS, Form 26AS, and capital gains statements directly with your consent.`;
        } else {
          tipEl.innerHTML = `<i class="bi bi-exclamation-circle text-warning me-1"></i> Start by uploading your PAN and Form 16/Salary slips to reach 50% readiness immediately.`;
        }
      }
    }

    checkboxes.forEach(cb => {
      cb.addEventListener("change", updateChecklistScore);
    });

    // Checklist Category Filters
    const filterBtns = document.querySelectorAll("#checklistFilters .checklist-pill-btn");
    const items = checklistGrid.querySelectorAll(".check-category");

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");

        items.forEach(item => {
          const cat = item.getAttribute("data-cat");
          if (filter === "all" || cat === filter) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });

    // Run initial tally
    updateChecklistScore();
  }

  // ==========================================
  // Home 2: Consultation Form Submission
  // ==========================================
  const consultForm = document.getElementById("consultationForm");
  const consultSuccess = document.getElementById("consultSuccessMsg");
  if (consultForm && consultSuccess) {
    consultForm.addEventListener("submit", (e) => {
      e.preventDefault();
      consultForm.classList.add("d-none");
      consultSuccess.classList.remove("d-none");
    });
  }
});
