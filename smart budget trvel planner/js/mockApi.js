// js/mockApi.js - Simulated API Architecture for Indian Travel Integrations
/**
 * TripSmart Mock API Layer
 * Note: This prototype simulates bookings with mock data. 
 * Real booking requires authorized supplier connections (IRCTC, Hotel CRS, Amadeus/Sabre, Razorpay).
 */

class TripSmartMockAPI {
  constructor() {
    this.storageKey = 'tripsmart_bookings_v1';
    this.initDemoBookings();
  }

  // Pre-fill demo booking if none exists
  initDemoBookings() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      const demoBookings = [
        {
          id: "TS-20261020-8492",
          title: "Goa Express 3AC (Pune → Madgaon)",
          category: "Train",
          provider: "Indian Railways (IRCTC Partner)",
          date: "2026-10-24",
          travelers: 2,
          amount: 2240,
          status: "Confirmed",
          pnr: "421-9876543",
          seats: "B3 - 21, 22 (Lower/Middle)",
          createdAt: new Date().toISOString()
        },
        {
          id: "TS-20261020-4103",
          title: "BloomSuites Calangute (3 Nights)",
          category: "Hotel",
          provider: "Bloom Hotels Network",
          date: "2026-10-25 to 2026-10-28",
          travelers: 2,
          amount: 10200,
          status: "Confirmed",
          roomType: "Deluxe Pool View",
          createdAt: new Date().toISOString()
        },
        {
          id: "TS-20261020-9931",
          title: "Grand Island Scuba & Dolphin Safari",
          category: "Activity",
          provider: "Goa Watersports Association",
          date: "2026-10-26",
          travelers: 2,
          amount: 4998,
          status: "Confirmed",
          timeSlot: "08:30 AM",
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(demoBookings));
    }
  }

  // Helper simulated network latency
  async _delay(ms = 350) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Search available trains between city pairs
   */
  async searchTrains(fromCity, toDest, date) {
    await this._delay();
    const routes = window.TRIPSMART_ROUTES || [];
    const matchedRoute = routes.find(
      r => r.from.toLowerCase() === fromCity.toLowerCase() && 
           r.to.toLowerCase() === toDest.toLowerCase()
    );

    if (matchedRoute && matchedRoute.trains) {
      return matchedRoute.trains;
    }

    // Dynamic fallback generation based on destination name
    return [
      {
        name: `${toDest} Superfast Express`,
        number: "12" + Math.floor(100 + Math.random() * 900),
        dep: "06:15",
        arr: "14:45",
        duration: "8h 30m",
        classes: { sleeper: 380, "3ac": 980, "2ac": 1420, "1ac": 2350 }
      },
      {
        name: `${toDest} Vande Bharat Express`,
        number: "20" + Math.floor(100 + Math.random() * 900),
        dep: "07:30",
        arr: "13:45",
        duration: "6h 15m",
        classes: { cc: 1190, ec: 2180 }
      },
      {
        name: `${fromCity} - ${toDest} Jan Shatabdi`,
        number: "120" + Math.floor(10 + Math.random() * 90),
        dep: "15:20",
        arr: "22:50",
        duration: "7h 30m",
        classes: { "2s": 180, cc: 690 }
      }
    ];
  }

  /**
   * Search hotels for a destination
   */
  async searchHotels(destId, checkIn, checkOut, guests, tier = 'standard') {
    await this._delay();
    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.id === destId);
    if (dest && dest.hotels) {
      return dest.hotels;
    }
    return {
      budget: { name: "Zostel Backpacker Stay", pricePerNight: 850, rating: 4.4, amenities: ["WiFi", "Lounge", "Lockers"] },
      standard: { name: "Sarovar Premiere Inn", pricePerNight: 3200, rating: 4.7, amenities: ["Pool", "AC", "Breakfast Included"] },
      luxury: { name: "Taj Royal Palace & Spa", pricePerNight: 9500, rating: 4.9, amenities: ["Heritage Suites", "Butler Service", "Spa"] }
    };
  }

  /**
   * Search local transport choices
   */
  async searchLocalTransport(destId, days = 3) {
    await this._delay();
    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.id === destId);
    if (dest && dest.local_transport) {
      return dest.local_transport;
    }
    return [
      { mode: "Scooter / Bike Rental", costPerDay: 400, desc: "Flexible two-wheeler rental", icon: "bike" },
      { mode: "Local Auto / E-Rickshaw", costPerDay: 500, desc: "Point-to-point quick hops", icon: "auto" },
      { mode: "Private Cab with Driver", costPerDay: 1600, desc: "Dedicated full-day sightseeing", icon: "car" }
    ];
  }

  /**
   * Search activities and entry attractions
   */
  async searchActivities(destId) {
    await this._delay();
    const dest = (window.TRIPSMART_DESTINATIONS || []).find(d => d.id === destId);
    if (dest && dest.activities) {
      return dest.activities;
    }
    return [
      { id: "act_highlights", name: "Guided City Highlights Tour", duration: "3 hrs", price: 650, tier: "budget", category: "Sightseeing" },
      { id: "act_adventure", name: "Outdoor Adventure Excursion", duration: "4 hrs", price: 1500, tier: "standard", category: "Adventure" }
    ];
  }

  /**
   * Create Booking (Simulated payment and reservation)
   */
  async createBooking(bookingPayload) {
    await this._delay(600);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `TS-${dateStr}-${randSuffix}`;

    const newBooking = {
      id: referenceId,
      title: bookingPayload.title || "Custom Service Booking",
      category: bookingPayload.category || "General",
      provider: bookingPayload.provider || "TripSmart Verified Partner",
      date: bookingPayload.date || new Date().toISOString().slice(0, 10),
      travelers: bookingPayload.travelers || 1,
      amount: bookingPayload.amount || 0,
      status: "Confirmed",
      travelerName: bookingPayload.travelerName || "Guest Traveler",
      paymentMethod: bookingPayload.paymentMethod || "UPI Simulation",
      createdAt: new Date().toISOString()
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    localStorage.setItem(this.storageKey, JSON.stringify(bookings));

    return {
      success: true,
      booking: newBooking,
      message: "Booking confirmed successfully in simulation mode."
    };
  }

  /**
   * Get all persisted bookings
   */
  getBookings() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load bookings from localStorage", e);
      return [];
    }
  }

  /**
   * Cancel booking with refund simulation
   */
  async cancelBooking(bookingId) {
    await this._delay(400);
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = "Cancelled";
      bookings[index].cancelledAt = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(bookings));
      return { success: true, booking: bookings[index] };
    }
    return { success: false, error: "Booking not found" };
  }
}

// Attach to window
window.MockAPI = new TripSmartMockAPI();
