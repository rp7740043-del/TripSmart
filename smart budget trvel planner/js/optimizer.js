// js/optimizer.js - Smart Budget Downgrade & Cost Optimization Algorithm
/**
 * Automatically downgrades highest expense categories step-by-step
 * until the trip fits within the user's target budget, producing an itemized changelog
 * and actionable contextual savings tips.
 */

class TripBudgetOptimizer {
  constructor() {
    this.downgradePriority = ['hotel', 'transport', 'local_transport', 'activities', 'shopping', 'buffer'];
  }

  /**
   * Run the optimization engine
   * @param {Object} trip - The current trip planning state
   * @returns {Object} result - { success, changes, totalSaved, newTotal, tips, updatedTrip }
   */
  optimize(trip) {
    if (!trip) return null;

    const targetBudget = Number(trip.totalBudget) || 20000;
    let plannedTotal = this.calculateTotal(trip);
    
    // If already under budget, provide optimization tips without forceful downgrades
    if (plannedTotal <= targetBudget) {
      return {
        alreadyOptimized: true,
        targetBudget,
        currentTotal: plannedTotal,
        surplus: targetBudget - plannedTotal,
        message: "Your trip is already within budget! Here are recommendations to save even more.",
        tips: this.getSavingsTips(trip)
      };
    }

    const changes = [];
    const updatedTrip = JSON.parse(JSON.stringify(trip)); // Deep clone
    let iterations = 0;
    const maxIterations = 15;

    while (plannedTotal > targetBudget && iterations < maxIterations) {
      iterations++;
      let stepChanged = false;

      // 1. Check Hotel Tier
      if (updatedTrip.expenses.hotel && updatedTrip.expenses.hotel.tier === 'premium') {
        const standardCost = Math.round(updatedTrip.expenses.hotel.cost * 0.45);
        const saved = updatedTrip.expenses.hotel.cost - standardCost;
        changes.push({
          category: "Hotel Accommodation",
          from: "Luxury Palace / 5-Star Resort",
          to: "Standard Heritage / 3-Star Hotel",
          saved: saved
        });
        updatedTrip.expenses.hotel.tier = 'standard';
        updatedTrip.expenses.hotel.cost = standardCost;
        stepChanged = true;
      } else if (updatedTrip.expenses.hotel && updatedTrip.expenses.hotel.tier === 'standard') {
        const budgetCost = Math.round(updatedTrip.expenses.hotel.cost * 0.4);
        const saved = updatedTrip.expenses.hotel.cost - budgetCost;
        changes.push({
          category: "Hotel Accommodation",
          from: "Standard Hotel",
          to: "Budget Hostel / Boutique Homestay",
          saved: saved
        });
        updatedTrip.expenses.hotel.tier = 'budget';
        updatedTrip.expenses.hotel.cost = budgetCost;
        stepChanged = true;
      }

      plannedTotal = this.calculateTotal(updatedTrip);
      if (plannedTotal <= targetBudget) break;

      // 2. Check Outbound / Return Transport
      if (updatedTrip.expenses.transport && updatedTrip.expenses.transport.mode === 'flight') {
        const trainCost = Math.round(updatedTrip.expenses.transport.cost * 0.38);
        const saved = updatedTrip.expenses.transport.cost - trainCost;
        changes.push({
          category: "Inter-City Travel",
          from: "Direct Flight",
          to: "Vande Bharat / 3AC Train",
          saved: saved
        });
        updatedTrip.expenses.transport.mode = 'train';
        updatedTrip.expenses.transport.tier = '3ac';
        updatedTrip.expenses.transport.cost = trainCost;
        stepChanged = true;
      } else if (updatedTrip.expenses.transport && updatedTrip.expenses.transport.tier === '2ac') {
        const sleeperCost = Math.round(updatedTrip.expenses.transport.cost * 0.35);
        const saved = updatedTrip.expenses.transport.cost - sleeperCost;
        changes.push({
          category: "Inter-City Travel",
          from: "2AC / CC Train",
          to: "Sleeper Class Train / Overnight AC Bus",
          saved: saved
        });
        updatedTrip.expenses.transport.tier = 'sleeper';
        updatedTrip.expenses.transport.cost = sleeperCost;
        stepChanged = true;
      }

      plannedTotal = this.calculateTotal(updatedTrip);
      if (plannedTotal <= targetBudget) break;

      // 3. Check Local Transport
      if (updatedTrip.expenses.local_transport && updatedTrip.expenses.local_transport.tier === 'premium') {
        const standardCost = Math.round(updatedTrip.expenses.local_transport.cost * 0.4);
        const saved = updatedTrip.expenses.local_transport.cost - standardCost;
        changes.push({
          category: "Local Transport",
          from: "Private AC Cab with Chauffeur",
          to: "Rental Scooter / City Auto Rickshaw",
          saved: saved
        });
        updatedTrip.expenses.local_transport.tier = 'budget';
        updatedTrip.expenses.local_transport.cost = standardCost;
        stepChanged = true;
      }

      plannedTotal = this.calculateTotal(updatedTrip);
      if (plannedTotal <= targetBudget) break;

      // 4. Check Shopping and Buffer
      if (updatedTrip.expenses.shopping && updatedTrip.expenses.shopping.cost > 1000) {
        const trimmed = Math.round(updatedTrip.expenses.shopping.cost * 0.5);
        const saved = updatedTrip.expenses.shopping.cost - trimmed;
        changes.push({
          category: "Shopping & Souvenirs",
          from: "Uncapped Budget",
          to: "Optimized Souvenir Allowance",
          saved: saved
        });
        updatedTrip.expenses.shopping.cost = trimmed;
        stepChanged = true;
      }

      plannedTotal = this.calculateTotal(updatedTrip);
      if (plannedTotal <= targetBudget) break;

      // 5. Buffer trim from 10% to 5%
      if (updatedTrip.expenses.buffer && updatedTrip.expenses.buffer.cost > 1000) {
        const reducedBuffer = Math.round(updatedTrip.expenses.buffer.cost * 0.6);
        const saved = updatedTrip.expenses.buffer.cost - reducedBuffer;
        changes.push({
          category: "Emergency Buffer",
          from: "10% Buffer",
          to: "Smart 5% Essential Buffer",
          saved: saved
        });
        updatedTrip.expenses.buffer.cost = reducedBuffer;
        stepChanged = true;
      }

      plannedTotal = this.calculateTotal(updatedTrip);
      if (!stepChanged) break; // Cannot downgrade further
    }

    const originalTotal = this.calculateTotal(trip);
    const finalTotal = this.calculateTotal(updatedTrip);
    const totalSaved = originalTotal - finalTotal;

    return {
      success: true,
      changes,
      originalTotal,
      finalTotal,
      totalSaved,
      targetBudget,
      fitsBudget: finalTotal <= targetBudget,
      updatedTrip,
      tips: this.getSavingsTips(updatedTrip)
    };
  }

  calculateTotal(trip) {
    if (!trip || !trip.expenses) return 0;
    let sum = 0;
    for (const key in trip.expenses) {
      if (trip.expenses[key] && typeof trip.expenses[key].cost === 'number') {
        sum += trip.expenses[key].cost;
      }
    }
    return sum;
  }

  getSavingsTips(trip) {
    return [
      {
        icon: "calendar",
        title: "Travel Mid-Week",
        desc: "Trains and hotels in India are up to 25% cheaper between Tuesday and Thursday compared to Friday night weekends."
      },
      {
        icon: "utensils",
        title: "Eat Like a Local",
        desc: "Savor regional thalis and street food legends for ₹120–₹180 per meal rather than expensive multi-cuisine hotel dining."
      },
      {
        icon: "tag",
        title: "Coupon Code Applied",
        desc: "Apply promo code TRIP10 at Step 5 checkout to save an extra 10% (up to ₹1,500) on all bookings."
      }
    ];
  }
}

window.BudgetOptimizer = new TripBudgetOptimizer();
