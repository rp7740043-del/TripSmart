// js/app.js - Main Application Router, State Management, Views & Multi-Language Dictionary
/**
 * TripSmart Application Controller
 */

class TripSmartApp {
  constructor() {
    this.currentView = 'home';
    this.currentLang = localStorage.getItem('tripsmart_lang') || 'en';
    this.currentTheme = localStorage.getItem('tripsmart_theme') || 'light';
    
    // Multi-Language Translation Dictionary
    this.translations = {
      en: {
        navHome: "Home",
        navPlan: "Plan Trip",
        navDestinations: "Destinations",
        navMyTrips: "My Trips",
        navBookings: "Bookings",
        navAbout: "About",
        heroTag: "Smart Budget Travel Planner & Optimizer",
        heroTitle: "Travel Smarter, Plan Better, Spend Less.",
        heroSubtitle: "Integrated multi-mode itinerary generator with automatic cost optimization, 3-tier comparisons, and seamless simulated bookings.",
        btnPlanNow: "Start Planning",
        btnExplore: "Explore Destinations",
        fromLabel: "FROM CITY",
        toLabel: "DESTINATION",
        datesLabel: "DATES",
        travelersLabel: "TRAVELERS",
        budgetLabel: "BUDGET (INR)",
        btnSearch: "Plan My Trip"
      },
      hi: {
        navHome: "होम",
        navPlan: "ट्रिप प्लान करें",
        navDestinations: "गंतव्य (Places)",
        navMyTrips: "मेरी यात्राएं",
        navBookings: "बुकिंग्स",
        navAbout: "हमारे बारे में",
        heroTag: "स्मार्ट बजट ट्रैवल प्लानर और ऑप्टिमाइज़र",
        heroTitle: "समझदारी से घूमें, बजट बचाएं, आनंद लें।",
        heroSubtitle: "ट्रेन, होटल, स्थानीय परिवहन और दर्शनीय स्थलों का एक संपूर्ण एकीकृत ट्रैवल प्लानर।",
        btnPlanNow: "अभी प्लान करें",
        btnExplore: "जगहें देखें",
        fromLabel: "शुरुआती शहर",
        toLabel: "गंतव्य स्थान",
        datesLabel: "तारीखें",
        travelersLabel: "यात्री",
        budgetLabel: "बजट (₹)",
        btnSearch: "ट्रिप खोजें"
      },
      mr: {
        navHome: "मुख्यपृष्ठ",
        navPlan: "सहल आखा",
        navDestinations: "पर्यटन स्थळे",
        navMyTrips: "माझ्या सहली",
        navBookings: "बुकिंग्ज",
        navAbout: "माहिती",
        heroTag: "स्मार्ट बजेट ट्रॅव्हल प्लॅनर",
        heroTitle: "स्मार्ट प्रवास, उत्तम नियोजन, कमी खर्च.",
        heroSubtitle: "रेल्वे, हॉटेल आणि फिरण्याचे एकाच ठिकाणी संपूर्ण बजेट व्यवस्थापन.",
        btnPlanNow: "नियोजन सुरू करा",
        btnExplore: "स्थळे पहा",
        fromLabel: "प्रस्थान शहर",
        toLabel: "गंतव्य ठिकाण",
        datesLabel: "दिनांक",
        travelersLabel: "प्रवासी",
        budgetLabel: "बजेट (₹)",
        btnSearch: "प्लॅन करा"
      }
    };
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.initDemoTrip();
    this.initRouter();
    this.renderDestinationsGallery();
    this.renderPopularCarousel();
    this.renderMyTripsView();
    this.renderBookingsView();
    this.updateLanguageUI();

    // Init Lucide Icons
    if (window.lucide) window.lucide.createIcons();

    // Init Chatbot
    const chatContainer = document.getElementById('chatbot-messages-wrap');
    if (chatContainer && window.TripChatbot) {
      window.TripChatbot.init(chatContainer);
    }

    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.log("Service Worker registration skipped or restricted in this context.");
      });
    }

    console.log("TripSmart App successfully initialized.");
  }

  // Pre-fill demo trip (Pune -> Goa, 4 days, 20,000, 2 travellers)
  initDemoTrip() {
    const tripsKey = 'tripsmart_saved_trips';
    const existing = localStorage.getItem(tripsKey);
    if (!existing) {
      const demoTrip = {
        id: "trip_demo_goa_pune",
        startingCity: "Pune",
        destinationId: "goa",
        destinationName: "Goa",
        destinationState: "Goa",
        startDate: "2026-10-24",
        endDate: "2026-10-28",
        days: 4,
        nights: 3,
        adults: 2,
        children: 0,
        totalBudget: 20000,
        totalPlanned: 18838,
        preference: "Standard",
        tripType: "Friends",
        interests: ["Beaches", "Food", "Adventure"],
        savedAt: new Date().toISOString(),
        expenses: {
          transport: { name: "Goa Express 3AC (Pune ➔ Madgaon)", tier: "standard", cost: 2240 },
          hotel: { name: "BloomSuites Calangute (3 Nights)", tier: "standard", cost: 10200 },
          local_transport: { name: "Scooters Rental (3 Days)", tier: "budget", cost: 1200 },
          food: { name: "Authentic Coastal Fish Curry & Shacks", tier: "budget", cost: 2800 },
          activities: { name: "Grand Island Scuba & Aguada Fort", tier: "budget", cost: 2398 }
        }
      };
      localStorage.setItem(tripsKey, JSON.stringify([demoTrip]));
    }
  }

  // Router based on window.location.hash
  initRouter() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  }

  handleHashChange() {
    let hash = window.location.hash.slice(1) || 'home';
    let params = null;

    if (hash.startsWith('detail/')) {
      const parts = hash.split('/');
      hash = 'detail';
      params = parts[1];
    }

    this.navigate(hash, params);
  }

  navigate(viewName, params = null) {
    this.currentView = viewName;
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
    } else {
      const homeView = document.getElementById('view-home');
      if (homeView) homeView.classList.add('active');
    }

    // Set active link in navbar
    const activeLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
    if (activeLink) activeLink.classList.add('active');

    // View specific load handlers
    if (viewName === 'detail' && params) {
      this.renderDestinationDetail(params);
    } else if (viewName === 'my-trips') {
      this.renderMyTripsView();
    } else if (viewName === 'bookings') {
      this.renderBookingsView();
    } else if (viewName === 'plan') {
      if (window.WizardApp) window.WizardApp.renderCurrentStep();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  }

  // Theme Management
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('tripsmart_theme', theme);
    document.body.setAttribute('data-theme', theme);

    const themeIcon = document.getElementById('theme-toggle-icon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    }
    if (window.lucide) window.lucide.createIcons();

    // Redraw charts if in step 4
    if (this.currentView === 'plan' && window.WizardApp && window.WizardApp.currentStep === 4) {
      window.WizardApp.renderBudgetCharts();
    }
  }

  // Language Dictionary Switching
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('tripsmart_lang', lang);
      this.updateLanguageUI();
    }
  }

  updateLanguageUI() {
    const t = this.translations[this.currentLang] || this.translations['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });

    const langSelect = document.getElementById('lang-select');
    if (langSelect) langSelect.value = this.currentLang;
  }

  // ==========================================
  // Render Destinations Gallery & Filters
  // ==========================================
  renderDestinationsGallery(filterRegion = 'all', filterSearch = '', filterTag = 'all') {
    const galleryGrid = document.getElementById('destinations-gallery-grid');
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    let destinations = window.TRIPSMART_DESTINATIONS || [];

    // Region Filter
    if (filterRegion !== 'all') {
      destinations = destinations.filter(d => d.region.toLowerCase() === filterRegion.toLowerCase());
    }

    // Search query filter
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase().trim();
      destinations = destinations.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.state.toLowerCase().includes(q) ||
        d.category.some(c => c.toLowerCase().includes(q))
      );
    }

    // Tag filter
    if (filterTag !== 'all') {
      destinations = destinations.filter(d => 
        d.category.some(c => c.toLowerCase() === filterTag.toLowerCase())
      );
    }

    const countEl = document.getElementById('destinations-count-label');
    if (countEl) countEl.textContent = `Showing ${destinations.length} Destinations`;

    destinations.forEach(dest => {
      const card = document.createElement('div');
      card.className = 'destination-card';

      const isFav = window.TravelTools.isInWishlist(dest.id);

      card.innerHTML = `
        <div class="destination-img-wrap">
          <img src="${dest.image_url}" alt="${dest.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'">
          <button class="wishlist-btn ${isFav ? 'active' : ''}" onclick="window.App.toggleWishlist('${dest.id}', this)" title="Save to Wishlist">
            ♥
          </button>
          <div class="dest-rating-pill">
            ★ ${dest.rating} (${dest.popularity_score}%)
          </div>
        </div>
        <div class="destination-body">
          <div class="dest-region">${dest.region} India • ${dest.state}</div>
          <h3 class="destination-title">${dest.name}</h3>
          <div class="dest-tags">
            ${dest.category.slice(0, 3).map(c => `<span class="tag">${c}</span>`).join('')}
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">
            <span>🗓️ Best: <strong>${dest.best_season}</strong></span> • <span>⌛ ${dest.ideal_days} Days</span>
          </div>
          <div class="dest-pricing-row">
            <div>
              <div class="dest-price-label">Standard Daily Avg</div>
              <div class="dest-price-value">${window.TravelTools.formatMoney(dest.avg_daily_cost.standard)}</div>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-outline" onclick="window.location.hash='#detail/${dest.id}'">Details</button>
              <button class="btn btn-sm btn-primary" onclick="window.App.planTripFor('${dest.id}')">Plan Trip</button>
            </div>
          </div>
        </div>
      `;

      galleryGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  renderPopularCarousel() {
    const popularContainer = document.getElementById('popular-destinations-carousel');
    if (!popularContainer) return;
    popularContainer.innerHTML = '';

    const popular = (window.TRIPSMART_DESTINATIONS || []).slice(0, 6);
    popular.forEach(dest => {
      const card = document.createElement('div');
      card.className = 'destination-card';
      card.innerHTML = `
        <div class="destination-img-wrap">
          <img src="${dest.image_url}" alt="${dest.name}" loading="lazy">
          <div class="dest-rating-pill">★ ${dest.rating}</div>
        </div>
        <div class="destination-body">
          <div class="dest-region">${dest.region} India</div>
          <h3 class="destination-title">${dest.name}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Ideal for ${dest.category[0] || 'Travel'} & relaxation</p>
          <div class="dest-pricing-row">
            <div>
              <div class="dest-price-label">Starts at</div>
              <div class="dest-price-value">${window.TravelTools.formatMoney(dest.avg_daily_cost.budget)}/day</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="window.App.planTripFor('${dest.id}')">Plan</button>
          </div>
        </div>
      `;
      popularContainer.appendChild(card);
    });
  }

  planTripFor(destId) {
    if (window.WizardApp) {
      window.WizardApp.loadDestinationIntoWizard(destId);
      window.location.hash = '#plan';
    }
  }

  toggleWishlist(destId, btn) {
    const added = window.TravelTools.toggleWishlist(destId);
    if (btn) btn.classList.toggle('active', added);
    this.showToast(added ? "Added to your Wishlist!" : "Removed from Wishlist", "info");
  }

  // ==========================================
  // Render Destination Detail View
  // ==========================================
  renderDestinationDetail(destId) {
    const container = document.getElementById('view-detail');
    if (!container) return;

    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.id === destId);
    if (!dest) {
      container.innerHTML = '<div class="container" style="padding:60px 0;"><h3>Destination not found</h3></div>';
      return;
    }

    const attractionsHtml = dest.attractions.map(a => `
      <div class="card" style="padding:16px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <strong>${a.name}</strong>
          <span class="tag tag-primary">${a.timeNeeded}</span>
        </div>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:6px;">${a.description}</p>
        <div style="font-size:0.82rem; font-weight:700;">Ticket Fee: ${a.fee > 0 ? window.TravelTools.formatMoney(a.fee) : 'Free Entry'}</div>
      </div>
    `).join('');

    const foodsHtml = dest.local_foods.map(f => `
      <div class="card" style="padding:14px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <strong>${f.name}</strong>
          <span style="font-weight:700; color:var(--primary);">${window.TravelTools.formatMoney(f.price)}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted);">${f.desc}</p>
      </div>
    `).join('');

    const carbonEst = window.TravelTools.calculateCarbon("Train", 650, 2);

    container.innerHTML = `
      <div class="container" style="padding:40px 0;">
        <button class="btn btn-outline btn-sm" onclick="window.history.back()" style="margin-bottom:20px;">
          ← Back to Destinations
        </button>

        <div style="position:relative; height:380px; border-radius:var(--radius-lg); overflow:hidden; margin-bottom:35px; box-shadow:var(--shadow-xl);">
          <img src="${dest.image_url}" alt="${dest.name}" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%); display:flex; align-items:flex-end; padding:35px; color:white;">
            <div>
              <span class="tag tag-accent" style="margin-bottom:8px;">★ ${dest.rating} Rating</span>
              <h1 style="font-size:2.8rem; color:white; margin-bottom:8px;">${dest.name}, ${dest.state}</h1>
              <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <span>📍 ${dest.region} India</span>
                <span>🗓️ Best Months: <strong>${dest.best_season}</strong></span>
                <span>⌛ Ideal Stay: <strong>${dest.ideal_days} Days</strong></span>
                <span>🌿 Eco Rating: <strong>${dest.eco_score || 'A'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:35px;">
          <div>
            <!-- Sample 3-Tier Budget -->
            <div class="card" style="margin-bottom:30px;">
              <h3 style="margin-bottom:18px;">Estimated Daily Cost by Travel Style</h3>
              <div class="tier-cards-grid">
                <div class="budget-stat-box">
                  <div class="stat-label">Budget Traveler</div>
                  <div class="stat-value" style="font-size:1.4rem;">${window.TravelTools.formatMoney(dest.avg_daily_cost.budget)}<span style="font-size:0.8rem; font-weight:normal;">/day</span></div>
                  <p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Hostels, street eats, local buses</p>
                </div>
                <div class="budget-stat-box" style="border-color:var(--primary);">
                  <div class="stat-label" style="color:var(--primary);">Standard (Recommended)</div>
                  <div class="stat-value" style="font-size:1.4rem; color:var(--primary);">${window.TravelTools.formatMoney(dest.avg_daily_cost.standard)}<span style="font-size:0.8rem; font-weight:normal;">/day</span></div>
                  <p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">3-star hotels, cafes, scooters/cabs</p>
                </div>
                <div class="budget-stat-box">
                  <div class="stat-label">Luxury / Premium</div>
                  <div class="stat-value" style="font-size:1.4rem;">${window.TravelTools.formatMoney(dest.avg_daily_cost.premium)}<span style="font-size:0.8rem; font-weight:normal;">/day</span></div>
                  <p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">5-star resorts, private cars, fine dining</p>
                </div>
              </div>
            </div>

            <!-- Top Attractions -->
            <h3 style="margin-bottom:16px;">Top Attractions & Highlights</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:35px;">
              ${attractionsHtml}
            </div>

            <!-- Famous Local Foods -->
            <h3 style="margin-bottom:16px;">Must-Try Regional Specialties</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:35px;">
              ${foodsHtml}
            </div>
          </div>

          <!-- Sidebar Information & Plan CTA -->
          <div>
            <div class="card" style="position:sticky; top:90px;">
              <h4 style="margin-bottom:16px;">Plan Your Trip to ${dest.name}</h4>
              <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:20px;">
                Generate day-wise optimized itineraries, compare flight/train options, and customize your total budget with one click.
              </p>
              <button class="btn btn-primary btn-lg" style="width:100%; margin-bottom:14px;" onclick="window.App.planTripFor('${dest.id}')">
                Plan a Trip Here 🚀
              </button>
              <button class="btn btn-outline" style="width:100%;" onclick="window.App.compareWithModal('${dest.id}')">
                ⚖️ Compare with Another Place
              </button>

              <hr style="margin:20px 0; border:none; border-top:1px solid var(--border-color);">

              <div style="font-size:0.88rem; display:flex; flex-direction:column; gap:10px;">
                <div>🚆 <strong>Nearest Station:</strong><br><span style="color:var(--text-muted);">${dest.nearest_railway}</span></div>
                <div>✈️ <strong>Nearest Airport:</strong><br><span style="color:var(--text-muted);">${dest.nearest_airport}</span></div>
                <div>🌱 <strong>Carbon Footprint:</strong><br><span style="color:var(--text-muted);">~${carbonEst.totalKg} kg CO2 by train (${carbonEst.treesEquivalent} tree offset)</span></div>
                <div>🚨 <strong>Emergency Contact:</strong><br><span style="color:var(--text-muted);">Police: ${dest.emergency.police} | Hospital: ${dest.emergency.hospital}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // Render My Trips View
  // ==========================================
  renderMyTripsView() {
    const container = document.getElementById('my-trips-list');
    if (!container) return;
    container.innerHTML = '';

    const tripsKey = 'tripsmart_saved_trips';
    let savedTrips = [];
    try {
      savedTrips = JSON.parse(localStorage.getItem(tripsKey)) || [];
    } catch(e){}

    if (savedTrips.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align:center; padding:50px;">
          <div style="font-size:3rem; margin-bottom:10px;">🎒</div>
          <h4>No saved trips yet</h4>
          <p style="color:var(--text-muted); margin-bottom:20px;">Use our 6-Step Wizard to build, optimize, and save your travel dreams!</p>
          <button class="btn btn-primary" onclick="window.location.hash='#plan'">Plan a Trip Now</button>
        </div>
      `;
      return;
    }

    savedTrips.forEach((trip, index) => {
      const card = document.createElement('div');
      card.className = 'card card-hover';
      card.style.marginBottom = '20px';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:15px;">
          <div>
            <span class="tag tag-primary" style="margin-bottom:8px;">${trip.tripType || 'Vacation'} • ${trip.days || 3} Days</span>
            <h3 style="font-size:1.45rem; margin-bottom:4px;">${trip.startingCity} ➔ ${trip.destinationName}</h3>
            <p style="color:var(--text-muted); font-size:0.9rem;">
              Dates: ${trip.startDate || 'N/A'} to ${trip.endDate || 'N/A'} | Travelers: ${trip.adults || 2} Adults
            </p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">TOTAL PLANNED</div>
            <div style="font-size:1.6rem; font-weight:800; color:var(--primary);">${window.TravelTools.formatMoney(trip.totalPlanned || 15000)}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Budget: ${window.TravelTools.formatMoney(trip.totalBudget || 20000)}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:16px; border-top:1px solid var(--border-color); flex-wrap:wrap; gap:10px;">
          <div style="display:flex; gap:10px;">
            <button class="btn btn-sm btn-primary" onclick="window.App.loadSavedTripIntoWizard(${index})">Open in Wizard</button>
            <button class="btn btn-sm btn-outline" onclick="window.BookingManager.downloadPdfItinerary(window.App.getSavedTrip(${index}))">📄 PDF</button>
            <button class="btn btn-sm btn-outline" onclick="window.BookingManager.shareOnWhatsApp(window.App.getSavedTrip(${index}))">WhatsApp</button>
          </div>
          <button class="btn btn-sm btn-ghost text-danger" onclick="window.App.deleteSavedTrip(${index})">🗑️ Delete</button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  getSavedTrip(index) {
    try {
      const list = JSON.parse(localStorage.getItem('tripsmart_saved_trips')) || [];
      return list[index];
    } catch(e) { return null; }
  }

  loadSavedTripIntoWizard(index) {
    const trip = this.getSavedTrip(index);
    if (!trip || !window.WizardApp) return;
    window.WizardApp.trip = trip;
    window.WizardApp.currentStep = 4; // Open in budget customizer
    window.location.hash = '#plan';
  }

  deleteSavedTrip(index) {
    if (confirm("Are you sure you want to delete this saved trip?")) {
      const tripsKey = 'tripsmart_saved_trips';
      let list = JSON.parse(localStorage.getItem(tripsKey)) || [];
      list.splice(index, 1);
      localStorage.setItem(tripsKey, JSON.stringify(list));
      this.renderMyTripsView();
      this.showToast("Trip deleted", "info");
    }
  }

  // ==========================================
  // Render Bookings Hub
  // ==========================================
  renderBookingsView() {
    const container = document.getElementById('bookings-list-table');
    if (!container) return;
    container.innerHTML = '';

    const bookings = window.MockAPI.getBookings();
    if (bookings.length === 0) {
      container.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">No bookings found yet. Complete a checkout in Step 5!</td></tr>`;
      return;
    }

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      const isCancelled = b.status === 'Cancelled';

      tr.innerHTML = `
        <td><strong>${b.id}</strong></td>
        <td>
          <strong>${b.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${b.provider || 'Partner'}</div>
        </td>
        <td><span class="tag tag-primary">${b.category}</span></td>
        <td>${b.date}</td>
        <td><strong>${window.TravelTools.formatMoney(b.amount)}</strong></td>
        <td>
          <span class="tag ${isCancelled ? 'tag-danger' : 'tag-success'}">${b.status}</span>
        </td>
        <td>
          ${!isCancelled ? `<button class="btn btn-sm btn-outline text-danger" onclick="window.App.cancelBookingItem('${b.id}')">Cancel</button>` : '<span style="font-size:0.75rem; color:var(--text-muted);">Refunded</span>'}
        </td>
      `;
      container.appendChild(tr);
    });
  }

  async cancelBookingItem(id) {
    if (confirm(`Do you wish to cancel booking ${id}? (Simulated 100% refund)`)) {
      const res = await window.MockAPI.cancelBooking(id);
      if (res.success) {
        this.renderBookingsView();
        this.showToast(`Booking ${id} cancelled and refund simulated.`, "info");
      }
    }
  }

  // ==========================================
  // Modal & Toast Helpers
  // ==========================================
  showModal(title, bodyHtml) {
    const overlay = document.getElementById('app-modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    if (!overlay || !titleEl || !bodyEl) return;

    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    overlay.classList.add('active');
  }

  closeModal() {
    const overlay = document.getElementById('app-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="flex:1; font-size:0.9rem;">${message}</div>
      <button style="color:var(--text-light); font-size:1.1rem; cursor:pointer;" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4000);
  }

  // Destination Compare Modal
  compareWithModal(currentId) {
    const all = window.TRIPSMART_DESTINATIONS || [];
    const current = all.find(d => d.id === currentId) || all[0];
    const optionsHtml = all.filter(d => d.id !== currentId).map(d => `<option value="${d.id}">${d.name} (${d.state})</option>`).join('');

    const bodyHtml = `
      <div>
        <p style="margin-bottom:14px;">Select another destination to compare with <strong>${current.name}</strong>:</p>
        <div class="form-group">
          <select id="compare-select-target" onchange="window.App.renderComparisonResults('${current.id}', this.value)">
            ${optionsHtml}
          </select>
        </div>
        <div id="comparison-results-box" style="margin-top:20px;"></div>
      </div>
    `;

    this.showModal(`Compare ${current.name}`, bodyHtml);
    const select = document.getElementById('compare-select-target');
    if (select) this.renderComparisonResults(current.id, select.value);
  }

  renderComparisonResults(id1, id2) {
    const box = document.getElementById('comparison-results-box');
    if (!box) return;

    const comp = window.TravelTools.compareDestinations(id1, id2);
    box.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
        <div class="card" style="padding:16px;">
          <h4>${comp.d1.name}</h4>
          <p style="font-size:0.8rem; color:var(--text-muted);">${comp.d1.state}</p>
          <div style="margin-top:10px; font-size:0.85rem;">
            <div>Avg Daily: <strong>${window.TravelTools.formatMoney(comp.d1.avg_daily_cost.standard)}</strong></div>
            <div>Rating: ★ ${comp.d1.rating}</div>
            <div>Best: ${comp.d1.best_season}</div>
          </div>
        </div>
        <div class="card" style="padding:16px;">
          <h4>${comp.d2.name}</h4>
          <p style="font-size:0.8rem; color:var(--text-muted);">${comp.d2.state}</p>
          <div style="margin-top:10px; font-size:0.85rem;">
            <div>Avg Daily: <strong>${window.TravelTools.formatMoney(comp.d2.avg_daily_cost.standard)}</strong></div>
            <div>Rating: ★ ${comp.d2.rating}</div>
            <div>Best: ${comp.d2.best_season}</div>
          </div>
        </div>
      </div>
      <div style="text-align:center; padding:10px; background:var(--primary-light); border-radius:8px; font-size:0.9rem;">
        💡 <strong>${comp.cheaper}</strong> is more budget-friendly by approx ${window.TravelTools.formatMoney(Math.abs(comp.budgetDiff))}/day!
      </div>
    `;
  }
}

window.App = new TripSmartApp();
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
