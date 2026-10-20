// js/booking.js - Simulated Booking System, Checkout, PDF Generation & Invoicing
/**
 * TripSmart Integrated Booking & Billing Engine
 */

class TripBookingManager {
  constructor() {
    this.appliedCoupon = null;
    this.discountAmount = 0;
    this.coupons = {
      'TRIP10': { type: 'percent', value: 10, max: 1500, desc: '10% off on simulated bookings (up to ₹1,500)' },
      'BUDGET500': { type: 'flat', value: 500, min: 3000, desc: 'Flat ₹500 off on plans above ₹3,000' },
      'FESTIVE15': { type: 'percent', value: 15, max: 2000, desc: 'Festive special 15% off' },
      'EARLYBIRD': { type: 'flat', value: 800, min: 5000, desc: 'Early bird ₹800 discount' }
    };
  }

  /**
   * Apply coupon code
   */
  applyCoupon(code, subtotal) {
    const cleanCode = (code || '').trim().toUpperCase();
    const coupon = this.coupons[cleanCode];
    if (!coupon) {
      return { success: false, message: "Invalid promo code. Try TRIP10 or BUDGET500." };
    }

    if (coupon.min && subtotal < coupon.min) {
      return { success: false, message: `Minimum trip subtotal of ₹${coupon.min} required for this coupon.` };
    }

    let discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.min((subtotal * coupon.value) / 100, coupon.max || Infinity);
    } else {
      discount = coupon.value;
    }

    this.appliedCoupon = cleanCode;
    this.discountAmount = Math.round(discount);

    return {
      success: true,
      code: cleanCode,
      discount: this.discountAmount,
      message: `Coupon ${cleanCode} applied! You saved ₹${this.discountAmount.toLocaleString('en-IN')}`
    };
  }

  /**
   * Calculate invoice breakdown
   */
  calculateInvoice(itemsTotal) {
    const subtotal = Number(itemsTotal) || 0;
    const discount = this.discountAmount;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    
    // Standard GST simulation: 5% on trains/tours, 12% on hotel/flights -> blended ~8%
    const gst = Math.round(discountedSubtotal * 0.08);
    const convenienceFee = itemsTotal > 0 ? 199 : 0;
    const grandTotal = discountedSubtotal + gst + convenienceFee;

    return {
      subtotal,
      discount,
      gst,
      convenienceFee,
      grandTotal
    };
  }

  /**
   * Trigger simulated payment
   */
  async processSimulatedPayment(paymentData) {
    // Show spinner in modal
    return new Promise(resolve => {
      setTimeout(async () => {
        // Trigger Confetti Celebration if canvas-confetti is loaded
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randRef = `TS-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

        const bookingRecord = {
          id: randRef,
          title: paymentData.title || "TripSmart Comprehensive Booking",
          destination: paymentData.destination || "Trip",
          amount: paymentData.amount || 0,
          traveler: paymentData.traveler || {},
          items: paymentData.items || [],
          paymentMethod: paymentData.paymentMethod || "UPI Simulation",
          status: "Confirmed",
          createdAt: new Date().toISOString()
        };

        // Persist to Mock API / LocalStorage
        await window.MockAPI.createBooking(bookingRecord);

        resolve({
          success: true,
          referenceId: randRef,
          booking: bookingRecord
        });
      }, 1200);
    });
  }

  /**
   * Generate downloadable PDF Itinerary and Tax Invoice
   */
  downloadPdfItinerary(trip, invoiceData) {
    if (!window.jspdf) {
      alert("jsPDF library is still initializing. Please try again in a few seconds.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Brand Header
    doc.setFillColor(13, 148, 136); // Teal
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("TripSmart – Travel Itinerary & Tax Invoice", 14, 20);

    doc.setFontSize(9);
    doc.text("Smart Budget Travel Planner with Cost Optimization | DEMO MODE", 14, 27);

    // Trip Details Overview
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Trip Overview", 14, 44);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Destination: ${trip.destinationName || 'India'} (${trip.destinationState || ''})`, 14, 52);
    doc.text(`Starting Point: ${trip.startingCity || 'Pune'}`, 14, 58);
    doc.text(`Dates: ${trip.startDate || 'N/A'} to ${trip.endDate || 'N/A'} (${trip.days} Days, ${trip.nights} Nights)`, 14, 64);
    doc.text(`Travelers: ${trip.adults || 2} Adults, ${trip.children || 0} Children | Style: ${trip.preference || 'Standard'}`, 14, 70);

    // Bill & Expense Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Cost Breakdown & Booking Bill", 14, 84);

    let y = 92;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (trip.expenses) {
      for (const cat in trip.expenses) {
        const item = trip.expenses[cat];
        if (item && item.cost) {
          doc.text(`• ${item.name || cat}:`, 18, y);
          doc.text(`INR ${item.cost.toLocaleString('en-IN')}`, 160, y, { align: "right" });
          y += 7;
        }
      }
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(14, y + 2, 196, y + 2);
    y += 10;

    // Invoice Totals
    const inv = invoiceData || this.calculateInvoice(trip.totalPlanned || 15000);
    doc.text(`Subtotal:`, 120, y);
    doc.text(`INR ${inv.subtotal.toLocaleString('en-IN')}`, 196, y, { align: "right" });
    y += 6;

    if (inv.discount > 0) {
      doc.setTextColor(16, 185, 129); // Success Green
      doc.text(`Promo Discount (${this.appliedCoupon}):`, 120, y);
      doc.text(`- INR ${inv.discount.toLocaleString('en-IN')}`, 196, y, { align: "right" });
      y += 6;
    }

    doc.setTextColor(15, 23, 42);
    doc.text(`Taxes & GST (Simulated ~8%):`, 120, y);
    doc.text(`INR ${inv.gst.toLocaleString('en-IN')}`, 196, y, { align: "right" });
    y += 6;

    doc.text(`Convenience & Service Fee:`, 120, y);
    doc.text(`INR ${inv.convenienceFee.toLocaleString('en-IN')}`, 196, y, { align: "right" });
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setFillColor(248, 250, 252);
    doc.rect(116, y - 5, 84, 12, 'F');
    doc.text(`Grand Total:`, 120, y + 2);
    doc.text(`INR ${inv.grandTotal.toLocaleString('en-IN')}`, 196, y + 2, { align: "right" });

    // Itinerary Highlights summary
    y += 24;
    doc.setFontSize(12);
    doc.text("Day-Wise Sightseeing Sequence Highlights", 14, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.name.toLowerCase() === (trip.destinationName || '').toLowerCase());
    if (dest && dest.attractions) {
      dest.attractions.slice(0, 5).forEach((att, idx) => {
        doc.text(`Day ${Math.floor(idx/2)+1} Spot ${idx+1}: ${att.name} (${att.timeNeeded}, Entry: INR ${att.fee})`, 18, y);
        y += 6;
      });
    } else {
      doc.text("Day 1: Arrival & Check-in -> Evening Promenade & Local Cuisine Walk", 18, y); y += 6;
      doc.text("Day 2: Full-Day Sightseeing & Top Attractions Tour", 18, y); y += 6;
      doc.text("Day 3: Adventure & Leisure -> Return Journey", 18, y); y += 6;
    }

    // Footer Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Disclaimer: TripSmart prototype demonstration document. Real bookings require IRCTC/airline supplier access.", 14, 285);

    // Save PDF
    const filename = `TripSmart_${trip.destinationName || 'Trip'}_Itinerary.pdf`;
    doc.save(filename);
  }

  /**
   * Share trip on WhatsApp
   */
  shareOnWhatsApp(trip) {
    const text = encodeURIComponent(
      `✈️ *TripSmart Travel Plan: ${trip.startingCity} to ${trip.destinationName}*\n` +
      `📅 Duration: ${trip.days} Days (${trip.startDate} to ${trip.endDate})\n` +
      `👥 Travelers: ${trip.adults} Adults\n` +
      `💰 Optimized Budget: ₹${(trip.totalPlanned || 0).toLocaleString('en-IN')} (Target: ₹${(trip.totalBudget || 0).toLocaleString('en-IN')})\n` +
      `🚀 Planned with TripSmart Smart Budget Optimizer!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  /**
   * Share via Email
   */
  shareViaEmail(trip) {
    const subject = encodeURIComponent(`Our Trip to ${trip.destinationName} - Planned via TripSmart`);
    const body = encodeURIComponent(
      `Hey!\n\nHere is our smart travel itinerary for ${trip.destinationName}:\n` +
      `Dates: ${trip.startDate} to ${trip.endDate} (${trip.days} Days)\n` +
      `Starting City: ${trip.startingCity}\n` +
      `Total Planned Budget: INR ${(trip.totalPlanned || 0).toLocaleString('en-IN')}\n\n` +
      `Check out all bookings and cost optimization on TripSmart!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
}

window.BookingManager = new TripBookingManager();
