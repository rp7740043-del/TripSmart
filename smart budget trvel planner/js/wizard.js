// js/wizard.js - The 6-Step Multi-Step Planning Wizard
/**
 * TripSmart 6-Step Travel Planning Wizard Engine
 */

class TripWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.historyState = []; // For Undo functionality
    this.chartInstances = { donut: null, bar: null };
    
    // Active trip model
    this.trip = {
      id: "trip_" + Date.now(),
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
      preference: "Standard",
      tripType: "Friends",
      interests: ["Beaches", "Food", "Adventure"],
      itinerary: [],
      expenses: {
        transport: { name: "Inter-City Travel (Goa Express 3AC)", tier: "standard", mode: "train", cost: 2240, editable: true, category: "transport" },
        hotel: { name: "Hotel Accommodation (BloomSuites 3 Nights)", tier: "standard", cost: 10200, nights: 3, ratePerNight: 3400, editable: true, category: "hotel" },
        local_transport: { name: "Local Transport (Scooters Rental 3 Days)", tier: "budget", cost: 2400, editable: true, category: "local_transport" },
        food: { name: "Food & Regional Dining (Local Fish Thali & Cafes)", tier: "budget", cost: 3200, editable: true, category: "food" },
        activities: { name: "Activities & Sightseeing (Scuba Diving & Forts)", tier: "budget", cost: 2498, editable: true, category: "activities" },
        shopping: { name: "Shopping & Local Bazaars", tier: "budget", cost: 1200, editable: true, category: "shopping" },
        buffer: { name: "Emergency Buffer Fund (10%)", tier: "standard", cost: 1800, percent: 10, editable: true, category: "buffer" }
      },
      customExpenses: [],
      bookings: []
    };
  }

  init() {
    this.bindEvents();
    this.prefillDemoData();
    this.renderCurrentStep();
  }

  saveSnapshot() {
    this.historyState.push(JSON.stringify(this.trip));
    if (this.historyState.length > 10) this.historyState.shift();
  }

  undoLastEdit() {
    if (this.historyState.length > 0) {
      const prev = this.historyState.pop();
      this.trip = JSON.parse(prev);
      this.renderCurrentStep();
      window.App.showToast("Action reverted successfully", "info");
    } else {
      window.App.showToast("No previous actions to undo", "warning");
    }
  }

  prefillDemoData() {
    // Check if there's a draft trip in localStorage
    const savedDraft = localStorage.getItem('tripsmart_active_trip');
    if (savedDraft) {
      try {
        this.trip = JSON.parse(savedDraft);
      } catch(e){}
    }
  }

  saveDraft() {
    localStorage.setItem('tripsmart_active_trip', JSON.stringify(this.trip));
  }

  bindEvents() {
    // Date calculation listener
    const startInput = document.getElementById('wizard-start-date');
    const endInput = document.getElementById('wizard-end-date');
    if (startInput && endInput) {
      const recalculateDates = () => {
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        if (!isNaN(start) && !isNaN(end) && end >= start) {
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          this.trip.days = diffDays;
          this.trip.nights = Math.max(1, diffDays - 1);
          this.trip.startDate = startInput.value;
          this.trip.endDate = endInput.value;
          const displayEl = document.getElementById('calculated-days-text');
          if (displayEl) {
            displayEl.textContent = `${this.trip.days} Days / ${this.trip.nights} Nights`;
          }
        }
      };
      startInput.addEventListener('change', recalculateDates);
      endInput.addEventListener('change', recalculateDates);
    }
  }

  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;

    // Validate Step 1 before proceeding
    if (this.currentStep === 1 && stepNumber > 1) {
      if (!this.validateStep1()) return;
      this.generateTripPlan();
    }

    this.currentStep = stepNumber;
    this.renderCurrentStep();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  nextStep() {
    this.goToStep(this.currentStep + 1);
  }

  prevStep() {
    this.goToStep(this.currentStep - 1);
  }

  validateStep1() {
    const fromInput = document.getElementById('wizard-from-city');
    const toInput = document.getElementById('wizard-destination');
    const budgetInput = document.getElementById('wizard-budget');

    if (!fromInput || !fromInput.value.trim()) {
      window.App.showToast("Please enter a departure city", "warning");
      return false;
    }
    if (!toInput || !toInput.value.trim()) {
      window.App.showToast("Please choose a destination", "warning");
      return false;
    }

    this.trip.startingCity = fromInput.value.trim();
    const destName = toInput.value.trim();
    const allDest = window.TRIPSMART_DESTINATIONS || [];
    const matched = allDest.find(d => d.name.toLowerCase() === destName.toLowerCase()) || allDest[0];

    this.trip.destinationId = matched.id;
    this.trip.destinationName = matched.name;
    this.trip.destinationState = matched.state;

    if (budgetInput && budgetInput.value) {
      this.trip.totalBudget = Number(budgetInput.value);
    }

    // Capture travelers
    const adultsEl = document.getElementById('wizard-adults-count');
    const childrenEl = document.getElementById('wizard-children-count');
    if (adultsEl) this.trip.adults = Number(adultsEl.value) || 2;
    if (childrenEl) this.trip.children = Number(childrenEl.value) || 0;

    // Capture preference & trip type
    const prefChecked = document.querySelector('input[name="travel_preference"]:checked');
    if (prefChecked) this.trip.preference = prefChecked.value;

    const typeChecked = document.querySelector('input[name="trip_type"]:checked');
    if (typeChecked) this.trip.tripType = typeChecked.value;

    // Interests
    const selectedInterests = [];
    document.querySelectorAll('input[name="trip_interest"]:checked').forEach(cb => {
      selectedInterests.push(cb.value);
    });
    this.trip.interests = selectedInterests;

    this.saveDraft();
    return true;
  }

  loadDestinationIntoWizard(destId) {
    const all = window.TRIPSMART_DESTINATIONS || [];
    const dest = all.find(d => d.id === destId);
    if (!dest) return;

    this.trip.destinationId = dest.id;
    this.trip.destinationName = dest.name;
    this.trip.destinationState = dest.state;
    this.trip.days = dest.ideal_days || 3;
    this.trip.nights = Math.max(1, (dest.ideal_days || 3) - 1);
    this.trip.totalBudget = (dest.avg_daily_cost.standard * (dest.ideal_days || 3) * (this.trip.adults || 2));

    const toInput = document.getElementById('wizard-destination');
    const budgetInput = document.getElementById('wizard-budget');
    if (toInput) toInput.value = dest.name;
    if (budgetInput) budgetInput.value = this.trip.totalBudget;

    this.currentStep = 1;
    this.renderCurrentStep();
  }

  // ==========================================
  // Step 2: Generate Day-Wise Itinerary Plan
  // ==========================================
  generateTripPlan() {
    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.id === this.trip.destinationId);
    const attractions = dest ? dest.attractions : [];
    const daysCount = this.trip.days || 3;
    const itinerary = [];

    // Day 1: Departure & Arrival Check-in
    const day1Activities = [
      { id: "act_dep", time: "06:30 AM", title: `Outbound Journey: ${this.trip.startingCity} to ${this.trip.destinationName}`, category: "Transport", fee: 0, duration: "6 hrs", notes: "Boarding flight/train with scenic views." },
      { id: "act_checkin", time: "01:30 PM", title: `Hotel Check-in & Freshen Up`, category: "Hotel", fee: 0, duration: "1.5 hrs", notes: "Welcome drink & room orientation." }
    ];

    if (attractions.length > 0) {
      day1Activities.push({
        id: "attr_0",
        time: "04:30 PM",
        title: attractions[0].name,
        category: attractions[0].category,
        fee: attractions[0].fee,
        duration: attractions[0].timeNeeded,
        notes: attractions[0].description
      });
    }
    itinerary.push({ dayNumber: 1, title: "Arrival & Orientation", activities: day1Activities });

    // Intermediate Sightseeing Days
    let attrIndex = 1;
    for (let day = 2; day < daysCount; day++) {
      const dayActs = [];
      const morningAttr = attractions[attrIndex] || { name: `${dest.name} Morning Heritage Walk`, category: "Sightseeing", fee: 50, timeNeeded: "2.5 hrs", description: "Lush stroll enjoying pleasant morning temperatures." };
      attrIndex = (attrIndex + 1) % Math.max(1, attractions.length);

      const afternoonAttr = attractions[attrIndex] || { name: `${dest.name} Landmark Tour`, category: "Culture", fee: 40, timeNeeded: "2 hrs", description: "Explore celebrated regional traditions." };
      attrIndex = (attrIndex + 1) % Math.max(1, attractions.length);

      dayActs.push({
        id: `attr_d${day}_1`,
        time: "09:30 AM",
        title: morningAttr.name,
        category: morningAttr.category,
        fee: morningAttr.fee,
        duration: morningAttr.timeNeeded,
        notes: morningAttr.description
      });

      dayActs.push({
        id: `attr_d${day}_2`,
        time: "02:30 PM",
        title: afternoonAttr.name,
        category: afternoonAttr.category,
        fee: afternoonAttr.fee,
        duration: afternoonAttr.timeNeeded,
        notes: afternoonAttr.description
      });

      dayActs.push({
        id: `food_d${day}`,
        time: "07:30 PM",
        title: `Authentic Dinner: ${dest.local_foods[0] ? dest.local_foods[0].name : 'Local Specialty'}`,
        category: "Food",
        fee: dest.local_foods[0] ? dest.local_foods[0].price : 200,
        duration: "1.5 hrs",
        notes: dest.local_foods[0] ? dest.local_foods[0].desc : "Delicious traditional meal."
      });

      itinerary.push({ dayNumber: day, title: `Exploring ${this.trip.destinationName}`, activities: dayActs });
    }

    // Final Day: Souvenirs & Return
    const finalActs = [];
    if (attractions.length > 2) {
      finalActs.push({
        id: `attr_final`,
        time: "10:00 AM",
        title: attractions[2].name,
        category: attractions[2].category,
        fee: attractions[2].fee,
        duration: attractions[2].timeNeeded,
        notes: attractions[2].description
      });
    }
    finalActs.push({
      id: "act_shopping",
      time: "02:00 PM",
      title: "Local Market Souvenirs & Artisan Handicrafts",
      category: "Shopping",
      fee: 0,
      duration: "2 hrs",
      notes: "Pick up local treats and souvenirs for friends & family."
    });
    finalActs.push({
      id: "act_return",
      time: "06:00 PM",
      title: `Return Journey to ${this.trip.startingCity}`,
      category: "Transport",
      fee: 0,
      duration: "6 hrs",
      notes: "Departing with memorable photographs and memories."
    });

    itinerary.push({ dayNumber: daysCount, title: "Farewell & Journey Home", activities: finalActs });

    this.trip.itinerary = itinerary;
    this.calculateExpensesFromDataset();
  }

  calculateExpensesFromDataset() {
    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.id === this.trip.destinationId) || {};
    const travelers = this.trip.adults || 2;
    const nights = this.trip.nights || 3;
    const days = this.trip.days || 4;

    // Pick hotel based on preference
    let hotelRate = 3200;
    let hotelTier = 'standard';
    let hotelName = `${dest.name || 'City'} Standard Hotel`;

    if (this.trip.preference === 'Budget') {
      hotelTier = 'budget';
      hotelRate = dest.hotels ? dest.hotels.budget.pricePerNight : 850;
      hotelName = dest.hotels ? dest.hotels.budget.name : 'Budget Backpacker Inn';
    } else if (this.trip.preference === 'Premium') {
      hotelTier = 'premium';
      hotelRate = dest.hotels ? dest.hotels.luxury.pricePerNight : 9500;
      hotelName = dest.hotels ? dest.hotels.luxury.name : 'Luxury Heritage Palace';
    } else {
      hotelTier = 'standard';
      hotelRate = dest.hotels ? dest.hotels.standard.pricePerNight : 3200;
      hotelName = dest.hotels ? dest.hotels.standard.name : 'Standard Comfort Resort';
    }

    const hotelTotal = hotelRate * nights;

    // Transport (Train/Flight/Bus)
    let transportCost = 1120 * travelers; // standard 3AC default
    let transportMode = 'train';
    let transportTier = '3ac';
    if (this.trip.preference === 'Premium') {
      transportCost = 3800 * travelers;
      transportMode = 'flight';
      transportTier = 'flight';
    } else if (this.trip.preference === 'Budget') {
      transportCost = 450 * travelers;
      transportMode = 'train';
      transportTier = 'sleeper';
    }

    // Local Transport
    let localTransportCost = 400 * days;
    if (this.trip.preference === 'Premium') localTransportCost = 1800 * days;
    else if (this.trip.preference === 'Budget') localTransportCost = 250 * days;

    // Food
    const foodCost = (this.trip.preference === 'Premium' ? 1200 : (this.trip.preference === 'Budget' ? 400 : 700)) * days * travelers;

    // Activities
    const activitiesCost = (this.trip.preference === 'Premium' ? 2500 : 900) * travelers;

    // Shopping
    const shoppingCost = 1200;

    // Emergency Buffer (10%)
    const runningSum = hotelTotal + transportCost + localTransportCost + foodCost + activitiesCost + shoppingCost;
    const bufferCost = Math.round(runningSum * 0.1);

    this.trip.expenses = {
      transport: { name: `Inter-City Travel (${transportMode.toUpperCase()})`, tier: transportTier, mode: transportMode, cost: transportCost, editable: true, category: "transport" },
      hotel: { name: hotelName, tier: hotelTier, cost: hotelTotal, nights: nights, ratePerNight: hotelRate, editable: true, category: "hotel" },
      local_transport: { name: `Local Transit (${days} Days)`, tier: this.trip.preference.toLowerCase(), cost: localTransportCost, editable: true, category: "local_transport" },
      food: { name: `Food & Meals (${travelers} Travelers)`, tier: this.trip.preference.toLowerCase(), cost: foodCost, editable: true, category: "food" },
      activities: { name: `Activities & Entry Passes`, tier: this.trip.preference.toLowerCase(), cost: activitiesCost, editable: true, category: "activities" },
      shopping: { name: `Shopping & Souvenirs`, tier: "budget", cost: shoppingCost, editable: true, category: "shopping" },
      buffer: { name: `Emergency Buffer (10%)`, tier: "standard", cost: bufferCost, editable: true, category: "buffer" }
    };
  }

  // ==========================================
  // Render Step Content
  // ==========================================
  renderCurrentStep() {
    // Update progress tracker
    document.querySelectorAll('.step-indicator').forEach((ind, index) => {
      const step = index + 1;
      ind.classList.remove('active', 'completed');
      if (step === this.currentStep) {
        ind.classList.add('active');
      } else if (step < this.currentStep) {
        ind.classList.add('completed');
      }
    });

    const progressPercent = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    const fillEl = document.querySelector('.wizard-progress-fill');
    if (fillEl) fillEl.style.width = `${progressPercent}%`;

    // Toggle step contents
    document.querySelectorAll('.wizard-step-content').forEach(view => {
      view.classList.remove('active');
    });

    const activeView = document.getElementById(`wizard-step-${this.currentStep}`);
    if (activeView) activeView.classList.add('active');

    // Trigger step-specific renders
    if (this.currentStep === 2) this.renderStep2();
    if (this.currentStep === 3) this.renderStep3();
    if (this.currentStep === 4) this.renderStep4();
    if (this.currentStep === 5) this.renderStep5();
    if (this.currentStep === 6) this.renderStep6();
  }

  // ==========================================
  // Step 2 Render: Timeline & Drag-and-Drop
  // ==========================================
  renderStep2() {
    const tabsContainer = document.getElementById('step2-day-tabs');
    const timelineContainer = document.getElementById('step2-timeline');
    if (!tabsContainer || !timelineContainer) return;

    tabsContainer.innerHTML = '';
    const itinerary = this.trip.itinerary || [];

    itinerary.forEach((day, index) => {
      const btn = document.createElement('button');
      btn.className = `day-tab-btn ${index === 0 ? 'active' : ''}`;
      btn.textContent = `Day ${day.dayNumber}: ${day.title}`;
      btn.onclick = () => {
        document.querySelectorAll('.day-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderTimelineForDay(day.dayNumber);
      };
      tabsContainer.appendChild(btn);
    });

    this.renderTimelineForDay(1);
  }

  renderTimelineForDay(dayNumber) {
    const timelineContainer = document.getElementById('step2-timeline');
    if (!timelineContainer) return;
    timelineContainer.innerHTML = '';

    const dayObj = (this.trip.itinerary || []).find(d => d.dayNumber === dayNumber);
    if (!dayObj || !dayObj.activities) {
      timelineContainer.innerHTML = '<p class="text-muted">No activities planned for this day.</p>';
      return;
    }

    dayObj.activities.forEach((act, actIndex) => {
      const card = document.createElement('div');
      card.className = 'timeline-item';
      card.draggable = true;
      card.dataset.index = actIndex;
      card.dataset.day = dayNumber;

      card.innerHTML = `
        <div class="timeline-head">
          <span class="timeline-time"><i data-lucide="clock" style="width:14px;height:14px;"></i> ${act.time} (${act.duration || '2 hrs'})</span>
          <span class="tag tag-primary">${act.category}</span>
          <span class="drag-handle" title="Drag to reorder"><i data-lucide="grip-vertical" style="width:16px;height:16px;"></i></span>
        </div>
        <h4 style="font-size:1.05rem; margin-bottom:4px;">${act.title}</h4>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:8px;">${act.notes || ''}</p>
        <div style="font-size:0.85rem; font-weight:700; color:var(--text-main);">
          Estimated Cost: ${act.fee > 0 ? window.TravelTools.formatMoney(act.fee) : '<span class="tag tag-success">Free Entry</span>'}
        </div>
      `;

      // Drag and drop event listeners
      card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', actIndex);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      timelineContainer.appendChild(card);
    });

    // Handle dragover and reorder
    timelineContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingCard = document.querySelector('.timeline-item.dragging');
      if (!draggingCard) return;

      const afterElement = this.getDragAfterElement(timelineContainer, e.clientY);
      if (afterElement == null) {
        timelineContainer.appendChild(draggingCard);
      } else {
        timelineContainer.insertBefore(draggingCard, afterElement);
      }
    });

    timelineContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      // Re-read order of activities
      const newActs = [];
      timelineContainer.querySelectorAll('.timeline-item').forEach(el => {
        const idx = Number(el.dataset.index);
        newActs.push(dayObj.activities[idx]);
      });
      dayObj.activities = newActs;
      this.saveSnapshot();
      window.App.showToast("Itinerary activity order updated", "success");
    });

    if (window.lucide) window.lucide.createIcons();
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.timeline-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // ==========================================
  // Step 3 Render: 3-Column Expense Comparison
  // ==========================================
  renderStep3() {
    const container = document.getElementById('step3-expense-categories');
    if (!container) return;
    container.innerHTML = '';

    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.id === this.trip.destinationId) || {};
    const travelers = this.trip.adults || 2;
    const nights = this.trip.nights || 3;

    const categories = [
      {
        id: "transport",
        title: "Inter-City Travel (Outbound & Return)",
        options: [
          { tier: "budget", name: "Sleeper Train / AC Bus", price: 420 * travelers, rating: 4.2, features: ["Standard berth booking", "Overnight travel", "Direct route"] },
          { tier: "standard", name: "3AC / Vande Bharat Express", price: 1120 * travelers, rating: 4.8, isBestValue: true, features: ["Air conditioned comfort", "Punctual express run", "Bedroll & charging point"] },
          { tier: "premium", name: "Direct Flight / 1AC Rajdhani", price: 3400 * travelers, rating: 4.9, features: ["Fastest 1h 15m travel", "15kg baggage included", "Airport lounge access"] }
        ]
      },
      {
        id: "hotel",
        title: "Accommodation & Stay",
        options: [
          { tier: "budget", name: "Backpacker Hostel / Shack", price: (dest.hotels ? dest.hotels.budget.pricePerNight : 850) * nights, rating: 4.4, features: ["Bunk / Economy room", "Free High Speed WiFi", "Traveler social lounge"] },
          { tier: "standard", name: "Comfort Resort / 3-Star", price: (dest.hotels ? dest.hotels.standard.pricePerNight : 3200) * nights, rating: 4.7, isBestValue: true, features: ["Swimming pool", "Buffet breakfast included", "Air-conditioned private room"] },
          { tier: "premium", name: "Luxury Heritage / 5-Star Palace", price: (dest.hotels ? dest.hotels.luxury.pricePerNight : 9500) * nights, rating: 4.95, features: ["Private balcony views", "Spa & Butler assistance", "Fine dining restaurant"] }
        ]
      },
      {
        id: "local_transport",
        title: "Local Travel & Sightseeing Transit",
        options: [
          { tier: "budget", name: "Scooter / Activa Rental", price: 400 * this.trip.days, rating: 4.6, isBestValue: true, features: ["Freedom to explore lanes", "Helmet included", "Best for couples & friends"] },
          { tier: "standard", name: "City Auto / Shared Cabs", price: 700 * this.trip.days, rating: 4.4, features: ["Point-to-point hops", "No driving hassle", "Metered fares"] },
          { tier: "premium", name: "Dedicated Private AC Cab", price: 1800 * this.trip.days, rating: 4.8, features: ["Full-day driver at disposal", "Air-conditioned comfort", "Covers distant spots"] }
        ]
      },
      {
        id: "food",
        title: "Food & Dining Experience",
        options: [
          { tier: "budget", name: "Local Street Food & Mess Thalis", price: 350 * this.trip.days * travelers, rating: 4.7, isBestValue: true, features: ["Authentic regional taste", "Local fish / veg thalis", "Famous street stalls"] },
          { tier: "standard", name: "Casual Dining & Beach Cafes", price: 750 * this.trip.days * travelers, rating: 4.6, features: ["Continental & North Indian", "Ambient cafe seating", "Coolers & desserts"] },
          { tier: "premium", name: "Fine Dining & Beachfront Candlelight", price: 1600 * this.trip.days * travelers, rating: 4.9, features: ["Chef's tasting menu", "Candlelight coastal dinner", "Premium beverages"] }
        ]
      }
    ];

    categories.forEach(cat => {
      const block = document.createElement('div');
      block.className = 'expense-category-block';

      const selectedTier = (this.trip.expenses[cat.id] && this.trip.expenses[cat.id].tier) || 'standard';

      let cardsHtml = '';
      cat.options.forEach(opt => {
        const isSelected = opt.tier === selectedTier;
        cardsHtml += `
          <div class="tier-card ${isSelected ? 'selected' : ''} ${opt.isBestValue ? 'best-value' : ''}" onclick="window.WizardApp.selectExpenseTier('${cat.id}', '${opt.tier}', ${opt.price}, '${opt.name}')">
            ${opt.isBestValue ? '<span class="best-value-badge">Best Value</span>' : ''}
            <div class="tier-name">${opt.name}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">★ ${opt.rating} Rating</div>
            <div class="tier-price">${window.TravelTools.formatMoney(opt.price)}</div>
            <ul class="tier-features">
              ${opt.features.map(f => `<li>✓ ${f}</li>`).join('')}
            </ul>
            <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}" style="margin-top:auto;">
              ${isSelected ? 'Selected' : 'Choose This'}
            </button>
          </div>
        `;
      });

      block.innerHTML = `
        <div class="category-block-header">
          <h4 style="font-size:1.25rem;">${cat.title}</h4>
        </div>
        <div class="tier-cards-grid">
          ${cardsHtml}
        </div>
      `;

      container.appendChild(block);
    });
  }

  selectExpenseTier(categoryKey, tier, cost, name) {
    this.saveSnapshot();
    if (!this.trip.expenses[categoryKey]) {
      this.trip.expenses[categoryKey] = {};
    }
    this.trip.expenses[categoryKey].tier = tier;
    this.trip.expenses[categoryKey].cost = cost;
    this.trip.expenses[categoryKey].name = name;

    // Recalculate emergency buffer 10%
    let sum = 0;
    for (const key in this.trip.expenses) {
      if (key !== 'buffer' && this.trip.expenses[key]) {
        sum += this.trip.expenses[key].cost || 0;
      }
    }
    if (this.trip.expenses.buffer) {
      this.trip.expenses.buffer.cost = Math.round(sum * 0.1);
    }

    this.renderStep3();
    window.App.showToast(`Updated ${categoryKey} to ${tier.toUpperCase()}`, "success");
  }

  // ==========================================
  // Step 4 Render: Budget Customizer & Live Charts
  // ==========================================
  renderStep4() {
    this.updateBudgetSummaryStats();
    this.renderExpenseEditTable();
    this.renderBudgetCharts();
  }

  updateBudgetSummaryStats() {
    const totalBudget = Number(this.trip.totalBudget) || 20000;
    let totalPlanned = 0;

    for (const key in this.trip.expenses) {
      if (this.trip.expenses[key] && typeof this.trip.expenses[key].cost === 'number') {
        totalPlanned += this.trip.expenses[key].cost;
      }
    }
    (this.trip.customExpenses || []).forEach(ce => totalPlanned += Number(ce.amount) || 0);

    this.trip.totalPlanned = totalPlanned;
    const remaining = totalBudget - totalPlanned;
    const percentUsed = Math.round((totalPlanned / totalBudget) * 100);

    const plannedEl = document.getElementById('stat-total-planned');
    const budgetEl = document.getElementById('stat-total-budget');
    const remainingEl = document.getElementById('stat-remaining-budget');
    const percentEl = document.getElementById('stat-percent-used');
    const perPersonEl = document.getElementById('stat-per-person');
    const alertBar = document.getElementById('budget-color-alert');

    if (plannedEl) plannedEl.textContent = window.TravelTools.formatMoney(totalPlanned);
    if (budgetEl) budgetEl.textContent = window.TravelTools.formatMoney(totalBudget);
    if (remainingEl) {
      remainingEl.textContent = window.TravelTools.formatMoney(Math.abs(remaining));
      remainingEl.style.color = remaining >= 0 ? 'var(--success)' : 'var(--danger)';
    }
    if (percentEl) percentEl.textContent = `${percentUsed}%`;
    if (perPersonEl) {
      const perHead = Math.round(totalPlanned / Math.max(1, this.trip.adults || 2));
      perPersonEl.textContent = `${window.TravelTools.formatMoney(perHead)} / person`;
    }

    // Color Alert Logic: Green (<80%), Orange (80-100%), Red (>100%)
    if (alertBar) {
      alertBar.className = 'budget-alert-bar';
      if (percentUsed <= 80) {
        alertBar.classList.add('alert-under');
        alertBar.innerHTML = `<span>🟢 <strong>Healthy Budget:</strong> You are well under your budget! (${percentUsed}% used)</span> <span>₹${remaining.toLocaleString('en-IN')} Surplus</span>`;
      } else if (percentUsed <= 100) {
        alertBar.classList.add('alert-warning');
        alertBar.innerHTML = `<span>🟠 <strong>Budget Warning:</strong> You're approaching your limit (${percentUsed}% used). Consider trimming minor items.</span> <span>₹${remaining.toLocaleString('en-IN')} Left</span>`;
      } else {
        alertBar.classList.add('alert-over');
        alertBar.innerHTML = `<span>🔴 <strong>Over Budget by ₹${Math.abs(remaining).toLocaleString('en-IN')}!</strong> Click the "Optimize My Budget" button below to automatically adjust costs.</span> <button class="btn btn-sm btn-accent" onclick="window.WizardApp.triggerBudgetOptimizer()">Optimize Now</button>`;
      }
    }
  }

  renderExpenseEditTable() {
    const tbody = document.getElementById('step4-expenses-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Standard categories
    for (const key in this.trip.expenses) {
      const item = this.trip.expenses[key];
      if (!item) continue;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${item.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">${key}</div>
        </td>
        <td>
          <span class="tag tag-primary">${(item.tier || 'standard').toUpperCase()}</span>
        </td>
        <td>
          <span class="inline-editable" onclick="window.WizardApp.promptInlineEdit('${key}')" title="Click to edit cost">
            <strong>${window.TravelTools.formatMoney(item.cost)}</strong>
            <span class="edit-icon">✏️</span>
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="window.WizardApp.resetExpenseItem('${key}')" title="Reset to default">Reset</button>
        </td>
      `;
      tbody.appendChild(tr);
    }

    // Custom Expenses
    (this.trip.customExpenses || []).forEach((ce, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${ce.title}</strong>
          <span class="tag tag-accent" style="margin-left:6px;">Custom</span>
        </td>
        <td>${ce.category || 'Misc'}</td>
        <td>
          <span class="inline-editable" onclick="window.WizardApp.promptEditCustom(${index})">
            <strong>${window.TravelTools.formatMoney(ce.amount)}</strong>
            <span class="edit-icon">✏️</span>
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline text-danger" onclick="window.WizardApp.deleteCustomExpense(${index})" title="Delete custom item">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  promptInlineEdit(key) {
    const item = this.trip.expenses[key];
    if (!item) return;
    const newAmount = prompt(`Enter new cost in ₹ for ${item.name}:`, item.cost);
    if (newAmount !== null && !isNaN(Number(newAmount)) && Number(newAmount) >= 0) {
      this.saveSnapshot();
      item.cost = Number(newAmount);
      this.renderStep4();
      window.App.showToast(`Updated cost for ${item.name}`, "success");
    }
  }

  promptEditCustom(index) {
    const item = this.trip.customExpenses[index];
    if (!item) return;
    const newAmount = prompt(`Edit amount for "${item.title}":`, item.amount);
    if (newAmount !== null && !isNaN(Number(newAmount))) {
      this.saveSnapshot();
      item.amount = Number(newAmount);
      this.renderStep4();
    }
  }

  deleteCustomExpense(index) {
    this.saveSnapshot();
    this.trip.customExpenses.splice(index, 1);
    this.renderStep4();
    window.App.showToast("Custom expense removed", "info");
  }

  resetExpenseItem(key) {
    this.saveSnapshot();
    this.calculateExpensesFromDataset();
    this.renderStep4();
    window.App.showToast("Reset to standard estimates", "info");
  }

  addCustomExpense(title, category, amount) {
    if (!title || !amount) {
      window.App.showToast("Please enter an expense name and amount", "warning");
      return;
    }
    this.saveSnapshot();
    if (!this.trip.customExpenses) this.trip.customExpenses = [];
    this.trip.customExpenses.push({
      title,
      category,
      amount: Number(amount)
    });
    this.renderStep4();
    window.App.showToast(`Added custom expense: ${title}`, "success");
  }

  // ==========================================
  // Chart.js Visualizations (Donut & Bar)
  // ==========================================
  renderBudgetCharts() {
    if (typeof Chart === 'undefined') return;

    const donutCanvas = document.getElementById('budget-donut-chart');
    const barCanvas = document.getElementById('budget-bar-chart');
    if (!donutCanvas || !barCanvas) return;

    // Destroy existing instances to prevent memory leaks
    if (this.chartInstances.donut) this.chartInstances.donut.destroy();
    if (this.chartInstances.bar) this.chartInstances.bar.destroy();

    const labels = [];
    const values = [];
    const colors = ['#0d9488', '#0284c7', '#f97316', '#eab308', '#8b5cf6', '#ec4899', '#64748b'];

    for (const key in this.trip.expenses) {
      if (this.trip.expenses[key]) {
        labels.push(key.toUpperCase());
        values.push(this.trip.expenses[key].cost);
      }
    }

    // 1. Donut Chart
    this.chartInstances.donut = new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: document.body.getAttribute('data-theme') === 'dark' ? '#1e293b' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        },
        cutout: '65%'
      }
    });

    // 2. Bar Chart: Budget vs Planned
    const targetBudget = Number(this.trip.totalBudget) || 20000;
    const totalPlanned = Number(this.trip.totalPlanned) || 18000;

    this.chartInstances.bar = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: ['Target Budget', 'Total Planned'],
        datasets: [{
          label: 'INR (₹)',
          data: [targetBudget, totalPlanned],
          backgroundColor: [
            '#0d9488',
            totalPlanned > targetBudget ? '#ef4444' : '#10b981'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // ==========================================
  // "Optimize My Budget" Trigger
  // ==========================================
  triggerBudgetOptimizer() {
    this.saveSnapshot();
    const result = window.BudgetOptimizer.optimize(this.trip);
    if (!result) return;

    if (result.alreadyOptimized) {
      window.App.showModal(
        "Trip Already Optimized!",
        `
        <div style="text-align:center; padding:10px 0;">
          <div style="font-size:3rem; margin-bottom:12px;">🎉</div>
          <h4>Your trip is already within budget!</h4>
          <p style="color:var(--text-muted); margin-bottom:20px;">
            Target: <strong>${window.TravelTools.formatMoney(result.targetBudget)}</strong> | Planned: <strong>${window.TravelTools.formatMoney(result.currentTotal)}</strong>
          </p>
          <div class="card" style="background:var(--bg-page); text-align:left;">
            <h5 style="margin-bottom:10px;">💡 Recommended Smart Savings Tips:</h5>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem;">
              ${result.tips.map(t => `<li><strong>${t.title}:</strong> ${t.desc}</li>`).join('')}
            </ul>
          </div>
        </div>
        `
      );
      return;
    }

    // Apply optimized trip state
    this.trip = result.updatedTrip;
    this.renderStep4();

    // Show animated changelog modal
    const changelogHtml = result.changes.map(c => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--border-color);">
        <div>
          <strong>${c.category}</strong>
          <div style="font-size:0.8rem; color:var(--text-muted);">${c.from} ➔ ${c.to}</div>
        </div>
        <span class="tag tag-success" style="font-size:0.85rem;">Saved ₹${c.saved.toLocaleString('en-IN')}</span>
      </div>
    `).join('');

    const tipsHtml = result.tips.map(t => `
      <div style="padding:10px; background:var(--bg-page); border-radius:8px; margin-top:8px; font-size:0.85rem;">
        <strong>💡 ${t.title}:</strong> ${t.desc}
      </div>
    `).join('');

    window.App.showModal(
      "⚡ Budget Optimized Successfully!",
      `
      <div>
        <p style="margin-bottom:16px;">We systematically adjusted high-cost categories to fit your budget perfectly:</p>
        <div class="card" style="padding:10px; margin-bottom:16px;">
          ${changelogHtml}
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:16px;">
          <span>Total Saved: <strong style="color:var(--success)">₹${result.totalSaved.toLocaleString('en-IN')}</strong></span>
          <span>New Total: <strong>${window.TravelTools.formatMoney(result.finalTotal)}</strong></span>
        </div>
        <h5>Smart Savings Advice for ${this.trip.destinationName}:</h5>
        ${tipsHtml}
      </div>
      `
    );

    window.App.showToast(`Optimized! Saved ₹${result.totalSaved.toLocaleString('en-IN')}`, "success");
  }

  // ==========================================
  // Step 5 Render: Service Booking Table & Checkout
  // ==========================================
  renderStep5() {
    const tableBody = document.getElementById('step5-booking-items-tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const eligibleItems = [
      { key: "transport", title: this.trip.expenses.transport.name, category: "Train / Flight", cost: this.trip.expenses.transport.cost, provider: "Indian Railways / Airline" },
      { key: "hotel", title: this.trip.expenses.hotel.name, category: "Hotel Stay", cost: this.trip.expenses.hotel.cost, provider: "Hotel Direct Network" },
      { key: "local_transport", title: this.trip.expenses.local_transport.name, category: "Local Transit", cost: this.trip.expenses.local_transport.cost, provider: "Verified Rental Partners" },
      { key: "activities", title: this.trip.expenses.activities.name, category: "Activities", cost: this.trip.expenses.activities.cost, provider: "Local Operator" }
    ];

    eligibleItems.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="booking-item-check" data-cost="${item.cost}" data-key="${item.key}" checked onchange="window.WizardApp.updateBookingSelectedTotal()"></td>
        <td>
          <strong>${item.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${item.provider}</div>
        </td>
        <td><span class="tag tag-primary">${item.category}</span></td>
        <td><strong>${window.TravelTools.formatMoney(item.cost)}</strong></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="window.WizardApp.openBookingModal('${item.title}', ${item.cost}, '${item.category}')">Book Now</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    this.updateBookingSelectedTotal();
  }

  updateBookingSelectedTotal() {
    let total = 0;
    document.querySelectorAll('.booking-item-check:checked').forEach(cb => {
      total += Number(cb.dataset.cost) || 0;
    });

    const displayEl = document.getElementById('step5-selected-total');
    if (displayEl) {
      displayEl.textContent = window.TravelTools.formatMoney(total);
    }
  }

  openBookingModal(title, amount, category) {
    const modalContent = `
      <div>
        <div style="margin-bottom:16px;">
          <span class="demo-mode-badge">⚡ DEMO MODE - SIMULATED CHECKOUT</span>
        </div>
        <h4 style="margin-bottom:6px;">${title}</h4>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">Category: ${category} | Amount: <strong>${window.TravelTools.formatMoney(amount)}</strong></p>

        <form id="simulated-booking-form" onsubmit="event.preventDefault(); window.WizardApp.submitSimulatedBooking('${title}', ${amount}, '${category}')">
          <div class="form-group">
            <label>Primary Traveler Full Name *</label>
            <input type="text" id="traveler-name" required value="Rohan Patil">
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>Age *</label>
              <input type="number" id="traveler-age" required value="28" min="1" max="100">
            </div>
            <div class="form-group">
              <label>Gender *</label>
              <select id="traveler-gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" id="traveler-phone" required value="+91 98765 43210">
            </div>
            <div class="form-group">
              <label>Email Address *</label>
              <input type="email" id="traveler-email" required value="rohan.traveler@example.com">
            </div>
          </div>
          <div class="form-group">
            <label>ID Proof Type *</label>
            <select id="traveler-id-type">
              <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
              <option value="Voter ID">Voter ID</option>
            </select>
          </div>

          <div class="form-group" style="margin-top:20px;">
            <label>Select Simulated Payment Mode</label>
            <div class="payment-tabs">
              <button type="button" class="payment-tab-btn active" onclick="window.WizardApp.selectPaymentTab(this, 'upi')">📱 UPI (GPay/PhonePe)</button>
              <button type="button" class="payment-tab-btn" onclick="window.WizardApp.selectPaymentTab(this, 'card')">💳 Credit/Debit Card</button>
              <button type="button" class="payment-tab-btn" onclick="window.WizardApp.selectPaymentTab(this, 'netbanking')">🏦 Net Banking</button>
            </div>
            <div id="payment-mode-ui" style="background:var(--bg-page); padding:16px; border-radius:8px; text-align:center;">
              <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:8px;">Scan simulated QR Code with any UPI app</p>
              <div style="display:inline-block; padding:10px; background:white; border-radius:8px; border:1px solid var(--border-color);">
                <div style="width:140px; height:140px; background:repeating-linear-gradient(45deg, #0d9488 0, #0d9488 10px, #ffffff 10px, #ffffff 20px); border-radius:4px; display:flex; align-items:center; justify-content:center; color:#0f766e; font-weight:800; font-size:0.8rem;">
                  UPI DEMO QR
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px;">
            <button type="button" class="btn btn-outline" onclick="window.App.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-pay-simulated">Pay & Confirm (${window.TravelTools.formatMoney(amount)})</button>
          </div>
        </form>
      </div>
    `;

    window.App.showModal(`Book Service: ${title}`, modalContent);
  }

  selectPaymentTab(btn, mode) {
    document.querySelectorAll('.payment-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const uiEl = document.getElementById('payment-mode-ui');
    if (!uiEl) return;

    if (mode === 'card') {
      uiEl.innerHTML = `
        <div style="text-align:left;">
          <div class="form-group" style="margin-bottom:10px;">
            <label style="font-size:0.8rem;">Card Number</label>
            <input type="text" value="4532 •••• •••• 8892" disabled>
          </div>
          <div class="form-grid-2">
            <div class="form-group" style="margin-bottom:0;"><label style="font-size:0.8rem;">Expiry</label><input type="text" value="08/29" disabled></div>
            <div class="form-group" style="margin-bottom:0;"><label style="font-size:0.8rem;">CVV</label><input type="password" value="•••" disabled></div>
          </div>
        </div>
      `;
    } else if (mode === 'netbanking') {
      uiEl.innerHTML = `
        <div style="text-align:left;">
          <label style="font-size:0.8rem; font-weight:700;">Popular Banks</label>
          <div style="display:flex; gap:10px; margin-top:6px;">
            <span class="tag tag-primary">HDFC Bank</span>
            <span class="tag tag-primary">State Bank of India</span>
            <span class="tag tag-primary">ICICI Bank</span>
            <span class="tag tag-primary">Axis Bank</span>
          </div>
        </div>
      `;
    } else {
      uiEl.innerHTML = `
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:8px;">Scan simulated QR Code with any UPI app</p>
        <div style="display:inline-block; padding:10px; background:white; border-radius:8px; border:1px solid var(--border-color);">
          <div style="width:140px; height:140px; background:repeating-linear-gradient(45deg, #0d9488 0, #0d9488 10px, #ffffff 10px, #ffffff 20px); border-radius:4px; display:flex; align-items:center; justify-content:center; color:#0f766e; font-weight:800; font-size:0.8rem;">
            UPI DEMO QR
          </div>
        </div>
      `;
    }
  }

  async submitSimulatedBooking(title, amount, category) {
    const payBtn = document.getElementById('btn-pay-simulated');
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.textContent = "Processing simulated transaction...";
    }

    const travelerName = document.getElementById('traveler-name') ? document.getElementById('traveler-name').value : "Rohan Patil";

    const result = await window.BookingManager.processSimulatedPayment({
      title,
      amount,
      category,
      destination: this.trip.destinationName,
      travelerName
    });

    window.App.closeModal();

    window.App.showModal(
      "🎊 Booking Confirmed!",
      `
      <div style="text-align:center; padding:15px 0;">
        <div style="font-size:3.5rem; margin-bottom:12px;">🎉</div>
        <h4>Simulation Successful!</h4>
        <p style="color:var(--text-muted); margin-bottom:16px;">Reference Code: <strong style="color:var(--primary); font-size:1.1rem;">${result.referenceId}</strong></p>
        <p style="font-size:0.9rem; margin-bottom:20px;">A confirmation voucher has been generated and saved to your Bookings tab.</p>
        <button class="btn btn-primary" onclick="window.App.closeModal(); window.WizardApp.renderStep5();">Done</button>
      </div>
      `
    );

    window.App.showToast(`Booking ${result.referenceId} confirmed!`, "success");
  }

  bookAllSelected() {
    let selectedCost = 0;
    const selectedItems = [];
    document.querySelectorAll('.booking-item-check:checked').forEach(cb => {
      selectedCost += Number(cb.dataset.cost) || 0;
      selectedItems.push(cb.dataset.key);
    });

    if (selectedCost === 0) {
      window.App.showToast("Please select at least one item to book", "warning");
      return;
    }

    this.openBookingModal(`Complete Package (${selectedItems.length} Services)`, selectedCost, "Bundle Package");
  }

  // ==========================================
  // Step 6 Render: Final Itinerary & Bills
  // ==========================================
  renderStep6() {
    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.id === this.trip.destinationId) || {};
    
    // Header Info
    const destHeader = document.getElementById('step6-dest-header');
    if (destHeader) {
      destHeader.textContent = `${this.trip.startingCity} ➔ ${this.trip.destinationName} (${this.trip.days} Days / ${this.trip.nights} Nights)`;
    }

    // Bill invoice table
    const invoiceTbody = document.getElementById('step6-invoice-tbody');
    if (invoiceTbody) {
      invoiceTbody.innerHTML = '';
      for (const key in this.trip.expenses) {
        const item = this.trip.expenses[key];
        if (item) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${item.name}</td>
            <td>${(item.tier || 'standard').toUpperCase()}</td>
            <td style="text-align:right;"><strong>${window.TravelTools.formatMoney(item.cost)}</strong></td>
          `;
          invoiceTbody.appendChild(tr);
        }
      }
    }

    // Calculate final invoice
    const inv = window.BookingManager.calculateInvoice(this.trip.totalPlanned || 18000);
    const subtotalEl = document.getElementById('step6-subtotal');
    const discountEl = document.getElementById('step6-discount');
    const gstEl = document.getElementById('step6-gst');
    const feeEl = document.getElementById('step6-fee');
    const grandTotalEl = document.getElementById('step6-grand-total');

    if (subtotalEl) subtotalEl.textContent = window.TravelTools.formatMoney(inv.subtotal);
    if (discountEl) discountEl.textContent = `- ${window.TravelTools.formatMoney(inv.discount)}`;
    if (gstEl) gstEl.textContent = window.TravelTools.formatMoney(inv.gst);
    if (feeEl) feeEl.textContent = window.TravelTools.formatMoney(inv.convenienceFee);
    if (grandTotalEl) grandTotalEl.textContent = window.TravelTools.formatMoney(inv.grandTotal);
  }

  saveTripToMyTrips() {
    const tripsKey = 'tripsmart_saved_trips';
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(tripsKey)) || [];
    } catch(e){}

    const newTripRecord = {
      ...this.trip,
      id: "trip_" + Date.now(),
      savedAt: new Date().toISOString()
    };

    saved.unshift(newTripRecord);
    localStorage.setItem(tripsKey, JSON.stringify(saved));
    window.App.showToast(`Saved trip to ${this.trip.destinationName}!`, "success");
  }
}

window.WizardApp = new TripWizard();
