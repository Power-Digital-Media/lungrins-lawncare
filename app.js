/**
 * Lungrin's Lawncare - Interactive Client Script
 * Owner: Luke Lungrin | (601) 906-1281 / (601) 906-1282
 * Flora, Pocahontas, and surrounding MS areas
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initEstimateCalculator();
  initBeforeAfterSlider();
  initServiceAreaChecker();
  initFaqAccordion();
  initContactForm();
  initCopyrightYear();
});

/* -------------------------------------------------------------
 * 1. Mobile Menu Toggle
 * ----------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    } else {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    });
  });
}

/* -------------------------------------------------------------
 * 2. Interactive Estimate Calculator
 * ----------------------------------------------------------- */
function initEstimateCalculator() {
  const lotButtons = document.querySelectorAll('.lot-btn');
  const freqButtons = document.querySelectorAll('.freq-btn');
  const serviceCheckboxes = document.querySelectorAll('#service-options input[type="checkbox"]');
  const priceDisplay = document.getElementById('price-display');
  const priceUnit = document.getElementById('price-unit');
  const lockEstimateBtn = document.getElementById('lock-estimate-btn');

  let selectedLot = 'small';
  let selectedFreq = 'weekly';

  // Base pricing matrix [min, max]
  const lotBasePrices = {
    small: [40, 55],       // Under 0.25 acre
    medium: [55, 75],      // 0.25 - 0.5 acre
    large: [75, 110],      // 0.5 - 1.0 acre
    xlarge: [110, 185]     // 1.0 - 2+ acres
  };

  // Additional service cost increments [min, max]
  const serviceAddons = {
    mowing: [0, 0], // Included in base
    mulch: [65, 125],
    shrubs: [35, 70],
    leaf: [45, 85],
    gutters: [50, 95],
    cleanup: [55, 110]
  };

  // Frequency multipliers
  const freqMultipliers = {
    weekly: { factor: 1.0, label: '/ visit (approx.)' },
    biweekly: { factor: 1.15, label: '/ cut (approx.)' },
    onetime: { factor: 1.30, label: 'est. total (one-time)' }
  };

  function calculateEstimate() {
    let [minPrice, maxPrice] = lotBasePrices[selectedLot] || [45, 65];

    let hasSelectedMowing = false;
    let selectedServicesCount = 0;

    serviceCheckboxes.forEach(cb => {
      const parentLabel = cb.closest('.service-checkbox');
      if (cb.checked) {
        parentLabel.classList.add('selected');
        if (cb.value === 'mowing') {
          hasSelectedMowing = true;
        } else if (serviceAddons[cb.value]) {
          minPrice += serviceAddons[cb.value][0];
          maxPrice += serviceAddons[cb.value][1];
        }
        selectedServicesCount++;
      } else {
        parentLabel.classList.remove('selected');
      }
    });

    // If mowing is unchecked, adjust base to just the add-on tasks
    if (!hasSelectedMowing && selectedServicesCount > 0) {
      minPrice = Math.max(40, minPrice - (lotBasePrices[selectedLot][0] * 0.7));
      maxPrice = Math.max(60, maxPrice - (lotBasePrices[selectedLot][1] * 0.7));
    } else if (selectedServicesCount === 0) {
      minPrice = 0;
      maxPrice = 0;
    }

    // Apply frequency multiplier
    const multiplier = freqMultipliers[selectedFreq].factor;
    const finalMin = Math.round(minPrice * multiplier);
    const finalMax = Math.round(maxPrice * multiplier);

    if (selectedServicesCount === 0) {
      priceDisplay.textContent = '$0';
      priceUnit.textContent = 'Please select at least 1 service';
    } else {
      priceDisplay.textContent = `$${finalMin} – $${finalMax}`;
      priceUnit.textContent = freqMultipliers[selectedFreq].label;
    }
  }

  // Lot Size Button clicks
  lotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lotButtons.forEach(b => {
        b.classList.remove('active', 'border-brand-500', 'bg-brand-950/60');
        b.classList.add('border-slate-700', 'bg-slate-800/80');
      });
      btn.classList.add('active', 'border-brand-500', 'bg-brand-950/60');
      btn.classList.remove('border-slate-700', 'bg-slate-800/80');
      selectedLot = btn.getAttribute('data-size');
      calculateEstimate();
    });
  });

  // Frequency Button clicks
  freqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      freqButtons.forEach(b => {
        b.classList.remove('active', 'border-brand-500', 'bg-brand-950/60');
        b.classList.add('border-slate-700', 'bg-slate-800/80');
      });
      btn.classList.add('active', 'border-brand-500', 'bg-brand-950/60');
      btn.classList.remove('border-slate-700', 'bg-slate-800/80');
      selectedFreq = btn.getAttribute('data-freq');
      calculateEstimate();
    });
  });

  // Checkbox changes
  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateEstimate);
  });

  // Lock estimate button click -> transfer info to contact form
  if (lockEstimateBtn) {
    lockEstimateBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      const notesField = document.getElementById('form-notes');
      
      const activeServices = Array.from(serviceCheckboxes)
        .filter(c => c.checked)
        .map(c => c.closest('label').querySelector('.text-sm').innerText.trim())
        .join(', ');

      const currentEstimate = priceDisplay.textContent;
      
      if (notesField) {
        notesField.value = `Online Estimate: ${currentEstimate} (${selectedFreq.toUpperCase()} for ${selectedLot.toUpperCase()} yard).\nSelected Services: ${activeServices}.\nLooking forward to hearing from you Luke!`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('form-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  }

  // Initial calculation run
  calculateEstimate();
}

/* -------------------------------------------------------------
 * 3. Interactive Before & After Comparison Slider
 * ----------------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-container');
  const beforeLayer = document.getElementById('before-layer');
  const beforeImg = document.getElementById('before-img');
  const handle = document.getElementById('slider-handle');

  if (!container || !beforeLayer || !handle) return;

  let isSliding = false;

  function updateSliderWidth(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    
    // Clamp between 2% and 98%
    let percentage = (offsetX / rect.width) * 100;
    percentage = Math.max(2, Math.min(98, percentage));

    beforeLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;

    // Ensure the inner before image retains the full width of the container
    if (beforeImg) {
      beforeImg.style.width = `${rect.width}px`;
    }
  }

  // Sync size on window resize
  function syncImageWidth() {
    if (container && beforeImg) {
      beforeImg.style.width = `${container.offsetWidth}px`;
    }
  }
  window.addEventListener('resize', syncImageWidth);
  syncImageWidth();

  // Mouse events
  container.addEventListener('mousedown', (e) => {
    isSliding = true;
    updateSliderWidth(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isSliding) return;
    updateSliderWidth(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isSliding = false;
  });

  // Touch events for mobile phones & tablets
  container.addEventListener('touchstart', (e) => {
    isSliding = true;
    if (e.touches.length > 0) {
      updateSliderWidth(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isSliding || e.touches.length === 0) return;
    updateSliderWidth(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isSliding = false;
  });
}

/* -------------------------------------------------------------
 * 4. Service Area Checker
 * ----------------------------------------------------------- */
function initServiceAreaChecker() {
  const checkBtn = document.getElementById('check-area-btn');
  const input = document.getElementById('address-check-input');
  const result = document.getElementById('area-check-result');

  if (!checkBtn || !input || !result) return;

  function evaluateArea() {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      result.innerHTML = '<span class="text-amber-400">Please enter a town or zip code to check.</span>';
      return;
    }

    const coreServiceAreas = ['flora', '39071', 'pocahontas', 'kearney', 'bentonia', 'madison', '39110'];
    const isCore = coreServiceAreas.some(area => query.includes(area));

    if (isCore) {
      result.innerHTML = `
        <div class="p-3 rounded-lg bg-brand-950/80 border border-brand-500 text-brand-300 text-xs sm:text-sm">
          <i class="fa-solid fa-circle-check text-brand-400 mr-1"></i>
          <strong>Great news!</strong> We have active weekly/bi-weekly routes in <strong>${input.value}</strong>.
          <a href="tel:6019061281" class="underline font-bold text-white ml-1">Call Luke at (601) 906-1281</a> to secure your spot!
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="p-3 rounded-lg bg-slate-900 border border-slate-600 text-slate-300 text-xs sm:text-sm">
          <i class="fa-solid fa-location-dot text-amber-400 mr-1"></i>
          Luke frequently services acreage and properties across Madison County and surrounding MS communities. 
          <a href="tel:6019061281" class="underline font-bold text-brand-400 ml-1">Call/Text (601) 906-1281</a> or <a href="tel:6019061282" class="underline font-bold text-brand-400">(601) 906-1282</a> to confirm your address!
        </div>
      `;
    }
  }

  checkBtn.addEventListener('click', evaluateArea);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      evaluateArea();
    }
  });
}

/* -------------------------------------------------------------
 * 5. FAQ Accordion
 * ----------------------------------------------------------- */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-btn');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen = !content.classList.contains('hidden');

      // Close all other FAQs
      faqButtons.forEach(otherBtn => {
        otherBtn.classList.remove('active');
        otherBtn.nextElementSibling.classList.add('hidden');
      });

      if (!isOpen) {
        btn.classList.add('active');
        content.classList.remove('hidden');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 6. Contact Form & Direct SMS Generation
 * ----------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('quote-form');
  const successCard = document.getElementById('form-success-card');
  const smsDirectBtn = document.getElementById('sms-direct-btn');
  const resetBtn = document.getElementById('reset-form-btn');

  if (!form || !successCard) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const address = document.getElementById('form-address').value.trim();
    const service = document.getElementById('form-service').value;
    const notes = document.getElementById('form-notes').value.trim();

    // Prepare SMS body
    let smsText = `Hi Luke! I'm interested in an estimate for lawn care.\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nService: ${service}`;
    if (notes) {
      smsText += `\nNotes: ${notes}`;
    }

    const encodedSms = encodeURIComponent(smsText);
    const smsUrl = `sms:6019061281?body=${encodedSms}`;

    if (smsDirectBtn) {
      smsDirectBtn.href = smsUrl;
    }

    // Display confirmation card
    successCard.classList.remove('hidden');

    // Attempt to prompt SMS app on mobile devices
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setTimeout(() => {
        window.location.href = smsUrl;
      }, 800);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      successCard.classList.add('hidden');
    });
  }
}

/* -------------------------------------------------------------
 * 7. Dynamic Copyright Year
 * ----------------------------------------------------------- */
function initCopyrightYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
