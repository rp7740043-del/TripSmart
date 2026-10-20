// js/tools.js - Travel Utilities: Group Splitter, Packing List, Comparator, Carbon Calculator, Currency & Wishlist
/**
 * TripSmart Advanced Travel Utility Suite
 */

class TripSmartTools {
  constructor() {
    this.wishlistKey = 'tripsmart_wishlist';
    this.expenseTrackerKey = 'tripsmart_actual_expenses';
    this.groupSplitterKey = 'tripsmart_group_split';
    this.packingListKey = 'tripsmart_packing_list';
    this.rates = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      AED: 0.044
    };
    this.symbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'AED '
    };
    this.currentCurrency = localStorage.getItem('tripsmart_currency') || 'INR';
  }

  // ==========================================
  // Currency Conversion
  // ==========================================
  setCurrency(curr) {
    if (this.rates[curr]) {
      this.currentCurrency = curr;
      localStorage.setItem('tripsmart_currency', curr);
      return true;
    }
    return false;
  }

  formatMoney(amountInINR) {
    const rate = this.rates[this.currentCurrency] || 1;
    const symbol = this.symbols[this.currentCurrency] || '₹';
    const converted = Math.round(amountInINR * rate);
    return `${symbol}${converted.toLocaleString('en-IN')}`;
  }

  // ==========================================
  // Wishlist / Favourites
  // ==========================================
  getWishlist() {
    try {
      const data = localStorage.getItem(this.wishlistKey);
      return data ? JSON.parse(data) : ['goa', 'manali', 'udaipur'];
    } catch (e) {
      return ['goa', 'manali', 'udaipur'];
    }
  }

  toggleWishlist(destId) {
    let list = this.getWishlist();
    const index = list.indexOf(destId);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(destId);
      added = true;
    }
    localStorage.setItem(this.wishlistKey, JSON.stringify(list));
    this.updateWishlistCountBadge();
    return added;
  }

  isInWishlist(destId) {
    return this.getWishlist().includes(destId);
  }

  updateWishlistCountBadge() {
    const badges = document.querySelectorAll('.wishlist-counter');
    const count = this.getWishlist().length;
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // ==========================================
  // Group Expense Splitter
  // ==========================================
  getGroupExpenses() {
    try {
      const data = localStorage.getItem(this.groupSplitterKey);
      return data ? JSON.parse(data) : [
        { id: 1, title: "Train Tickets", paidBy: "Rohan", amount: 2240, forMembers: ["Rohan", "Pooja"] },
        { id: 2, title: "Beach Shack Dinner", paidBy: "Pooja", amount: 1400, forMembers: ["Rohan", "Pooja"] },
        { id: 3, title: "Scooter Rental & Petrol", paidBy: "Rohan", amount: 900, forMembers: ["Rohan", "Pooja"] }
      ];
    } catch (e) {
      return [];
    }
  }

  saveGroupExpenses(expenses) {
    localStorage.setItem(this.groupSplitterKey, JSON.stringify(expenses));
  }

  calculateSettlements(expenses, members = ["Rohan", "Pooja"]) {
    const balances = {};
    members.forEach(m => balances[m] = 0);

    expenses.forEach(exp => {
      const perHead = exp.amount / (exp.forMembers.length || 1);
      balances[exp.paidBy] = (balances[exp.paidBy] || 0) + exp.amount;
      exp.forMembers.forEach(m => {
        balances[m] = (balances[m] || 0) - perHead;
      });
    });

    const debtors = [];
    const creditors = [];

    for (const [member, balance] of Object.entries(balances)) {
      const rounded = Math.round(balance);
      if (rounded < -1) debtors.push({ member, amount: -rounded });
      else if (rounded > 1) creditors.push({ member, amount: rounded });
    }

    const settlements = [];
    let d = 0, c = 0;
    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const settled = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.member,
        to: creditor.member,
        amount: settled
      });

      debtor.amount -= settled;
      creditor.amount -= settled;

      if (debtor.amount === 0) d++;
      if (creditor.amount === 0) c++;
    }

    return { balances, settlements };
  }

  // ==========================================
  // Auto-Generated Packing Checklist
  // ==========================================
  generatePackingList(destCategory = 'Beach', days = 4) {
    const saved = localStorage.getItem(this.packingListKey);
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }

    const baseItems = [
      { id: "p_id", text: "Government Photo ID (Aadhaar / Voter ID / Passport)", checked: true },
      { id: "p_cash", text: "Cash for small stalls & UPI backup", checked: true },
      { id: "p_chargers", text: "Phone charger & Power bank (10,000 mAh)", checked: false },
      { id: "p_meds", text: "Personal first-aid kit & motion sickness meds", checked: false },
      { id: "p_clothes", text: `${days + 1} sets of comfortable travel wear`, checked: false }
    ];

    if (destCategory.toLowerCase().includes('beach') || destCategory.toLowerCase().includes('islands')) {
      baseItems.push(
        { id: "p_swim", text: "Quick-dry swimwear & beach towel", checked: false },
        { id: "p_sun", text: "High SPF Sunscreen (SPF 50+) & Polarized Sunglasses", checked: false },
        { id: "p_flip", text: "Waterproof slippers / sandals & waterproof pouch", checked: false }
      );
    } else if (destCategory.toLowerCase().includes('snow') || destCategory.toLowerCase().includes('mountains') || destCategory.toLowerCase().includes('cold')) {
      baseItems.push(
        { id: "p_jacket", text: "Down jacket / Windproof thermal inner layer", checked: false },
        { id: "p_gloves", text: "Woollen beanie cap, neck muffler & gloves", checked: false },
        { id: "p_boots", text: "Sturdy trekking shoes with good grip", checked: false }
      );
    } else if (destCategory.toLowerCase().includes('spiritual') || destCategory.toLowerCase().includes('temples')) {
      baseItems.push(
        { id: "p_trad", text: "Traditional modest attire (Kurta / Salwar) for temple entry", checked: false },
        { id: "p_socks", text: "Cotton socks for walking on hot/cold stone temple courtyards", checked: false }
      );
    }

    localStorage.setItem(this.packingListKey, JSON.stringify(baseItems));
    return baseItems;
  }

  savePackingList(items) {
    localStorage.setItem(this.packingListKey, JSON.stringify(items));
  }

  // ==========================================
  // Real-Time Actual Expense Tracker
  // ==========================================
  getActualExpenses() {
    try {
      const data = localStorage.getItem(this.expenseTrackerKey);
      return data ? JSON.parse(data) : [
        { id: 1, title: "Goa Beach Coconut Water & Snacks", category: "Food", amount: 240, date: "2026-10-21" },
        { id: 2, title: "Petrol for Scooter", category: "Transport", amount: 350, date: "2026-10-21" },
        { id: 3, title: "Aguada Fort Entry Tickets", category: "Activities", amount: 100, date: "2026-10-21" }
      ];
    } catch(e) {
      return [];
    }
  }

  addActualExpense(expense) {
    const list = this.getActualExpenses();
    list.unshift({
      id: Date.now(),
      title: expense.title,
      category: expense.category,
      amount: Number(expense.amount),
      date: expense.date || new Date().toISOString().slice(0, 10)
    });
    localStorage.setItem(this.expenseTrackerKey, JSON.stringify(list));
    return list;
  }

  // ==========================================
  // Carbon Footprint Estimator
  // ==========================================
  calculateCarbon(transportMode, km = 650, travelers = 2) {
    // kg CO2 per passenger-km estimates:
    // Flight: 0.18 kg/km
    // Cab: 0.12 kg/km
    // AC Bus: 0.05 kg/km
    // Indian Electric Train: 0.025 kg/km
    let emissionFactor = 0.025; // default train
    const mode = (transportMode || '').toLowerCase();

    if (mode.includes('flight')) emissionFactor = 0.18;
    else if (mode.includes('cab') || mode.includes('car')) emissionFactor = 0.12;
    else if (mode.includes('bus')) emissionFactor = 0.05;
    else if (mode.includes('train')) emissionFactor = 0.025;

    const totalKg = Math.round(km * emissionFactor * travelers);
    const treesEquivalent = Math.max(1, Math.round(totalKg / 22)); // 1 tree absorbs ~22kg/year

    return {
      totalKg,
      treesEquivalent,
      isEcoFriendly: emissionFactor <= 0.05,
      modeName: mode.includes('flight') ? 'Aviation' : (mode.includes('train') ? 'Indian Railways' : 'Roadway')
    };
  }

  // ==========================================
  // Destination Comparator
  // ==========================================
  compareDestinations(id1, id2) {
    const list = window.TRIPSMART_DESTINATIONS || [];
    const d1 = list.find(d => d.id === id1) || list[0];
    const d2 = list.find(d => d.id === id2) || list[1];

    return {
      d1,
      d2,
      budgetDiff: d1.avg_daily_cost.standard - d2.avg_daily_cost.standard,
      cheaper: d1.avg_daily_cost.standard <= d2.avg_daily_cost.standard ? d1.name : d2.name
    };
  }

  // ==========================================
  // Smart "Where can I go in ₹X?" Finder
  // ==========================================
  suggestDestinationsByBudget(maxBudget = 10000, days = 3, month = null) {
    const all = window.TRIPSMART_DESTINATIONS || [];
    const maxPerDay = maxBudget / Math.max(1, days);

    return all.filter(dest => {
      // Must fit in budget at budget or standard tier
      const fitsBudget = (dest.avg_daily_cost.budget * days) <= maxBudget;
      if (!fitsBudget) return false;

      // Optional month filter
      if (month && dest.best_months && !dest.best_months.includes(Number(month))) {
        return false;
      }
      return true;
    }).sort((a, b) => b.popularity_score - a.popularity_score);
  }
}

window.TravelTools = new TripSmartTools();
