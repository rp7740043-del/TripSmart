# TripSmart – Smart Budget Travel Planner with Integrated Booking and Cost Optimization

**TripSmart** is a modern, responsive, multi-page web application designed like a cutting-edge travel tech startup. It eliminates the friction of traditional fragmented travel booking by providing day-wise itinerary generation, 3-tier expense comparisons (Budget / Standard / Premium), inline budget customization, live Chart.js visualizations, an automated **"Optimize My Budget"** engine, simulated checkout with unique references, and downloadable PDF itineraries with GST tax invoices.

---

## 🌟 Key Features

### 1. Unified Landing Page
- **Problem & Solution Comparison:** Highlights the pain points of fragmented booking vs. TripSmart's unified sequencing and cost optimizer.
- **Hero Banner:** Quick search form with datalist autocompletes, date picker, travelers counter, and budget presets.
- **Panoramic Collage:** High-resolution imagery of iconic Indian destinations (beaches, palaces, mountains, houseboats).
- **"How It Works" (6-Step Workflow):** Clear step illustrations with SVG iconography.
- **Popular Destinations Carousel:** Quick-plan triggers and real-time rating badges.
- **Testimonials, FAQ Accordion & Newsletter CTA.**

### 2. The 6-Step Multi-Step Planning Wizard
- **Step 1 – Enter Trip Details:**
  - Departure city & destination autocompletes.
  - Automatic calculation of days and nights from dates.
  - Adults & children traveler counters.
  - Target budget input with quick presets (₹10,000, ₹20,000, ₹35,000, ₹50,000, ₹1,00,000).
  - Preference selector (Budget / Standard / Premium / Mixed).
  - Trip group type (Solo, Couple, Friends, Family, Pilgrimage, Adventure).
  - Multi-select theme chips (Beaches, History, Food, Adventure, Nature, Spiritual, Shopping).
- **Step 2 – Generate Travel Plan:**
  - Day-wise itinerary sequence: Outbound travel, check-in, nearest-first sightseeing spots, return journey.
  - Interactive drag-and-drop reordering of activities within each day.
  - "Regenerate" button to re-roll activities.
  - Interactive SVG Route Map visualizer.
- **Step 3 – Compare Each Expense (3-Tier Cards):**
  - Side-by-side cards: **Cheapest (Budget)** / **Standard (Best Value)** / **Premium (Luxury)**.
  - Covers: Trains/Buses/Flights, Hotels, Local Transport, Food, Activities, Shopping, and Emergency Buffer (10%).
- **Step 4 – Customize Your Budget (Everything Editable & Live Charts):**
  - Switch category tiers on the fly.
  - Inline editing for amounts, quantities, days, and traveler counts.
  - "Add Custom Expense" with instant recalculation.
  - Live budget summary dashboard: Total budget, planned, remaining, % used, and per-person split.
  - Dynamic **Chart.js Donut Chart** (Category Breakdown) & **Bar Chart** (Target vs Planned).
  - Color-coded alerts: Green (<80%), Orange (80–100%), Red (>100% over-budget alert).
  - **"Optimize My Budget" Magic Button:** Automatically steps down high-cost categories until the trip fits under budget, displaying an animated changelog (e.g. *"Hotel: Premium → Standard saves ₹6,000"*) and 2–3 smart savings tips.
  - Undo button to revert edits.
- **Step 5 – Book Each Service:**
  - Individual "Book Now", "Book Selected", and "Book All" bundle checkout.
  - Traveler details modal (Name, age, gender, phone, email, ID proof type).
  - Promo code discounts (`TRIP10` for 10% off, `BUDGET500` for ₹500 off).
  - Simulated payment modes (UPI QR scan simulation, Credit/Debit Card, Net Banking) with **"Demo Mode"** badge.
  - Processing spinner followed by celebratory **canvas-confetti** blast.
  - Generates unique reference code (e.g. `TS-20261020-8492`).
  - Booking status tags (Confirmed / Cancelled) with cancellation & simulated refund.
- **Step 6 – Final Itinerary & Bills:**
  - Complete printable master itinerary.
  - Booking details table with provider and reference IDs.
  - Itemized Tax Invoice / Bill table (Subtotal, GST @ 8%, Convenience fee, Grand Total).
  - **Download PDF Itinerary & Bill** via `jsPDF`.
  - Native print formatting (`@media print`).
  - Share via WhatsApp (`wa.me` deep-link) and Email.
  - "Save to My Trips" with browser localStorage persistence.

### 3. Comprehensive Indian Destinations Dataset (54 Destinations)
- Rich dataset stored in `data/destinations.json` and embedded in `js/data.js` for offline reliability.
- Covers: Goa, Jaipur, Udaipur, Manali, Varanasi, Leh-Ladakh, Munnar, Alleppey, Rishikesh, Agra, Hampi, Andaman, Darjeeling, Amritsar, Pune, Mumbai, Lonavala, Mahabaleshwar, Haridwar, Shimla, Srinagar, Pondicherry, Dharamshala, Coorg, Ooty, Delhi, Rann of Kutch, Statue of Unity, Jodhpur, Jaisalmer, Khajuraho, Mysore, Kochi, Gangtok, Shillong, Hyderabad, Puri, Madurai, Rameswaram, Tirupati, Kolkata, Kodaikanal, Nashik, Shirdi, Aurangabad, Mahabalipuram, Ujjain, Mount Abu, Kedarnath/Badrinath, Gokarna, Spiti Valley, Varkala, Pushkar, Auli.
- Each destination includes: ID, state, region, category tags, best season, best months, ideal days, daily cost tiers, nearest railway & airport, top 4–7 attractions (with fees and timings), local foods, transport options, 3 hotel tiers, activities, rating, popularity score, photo, and emergency contacts.

### 4. Advanced Suite of 18 Features
1. **Smart Destination Suggestions:** "Where can I go in ₹10,000?" quick budget finder.
2. **Budget Calculator & Per-Day Planner:** Instant daily run-rate computation.
3. **Season & Weather Advisor:** Best months and climate guidance.
4. **Packing Checklist:** Auto-generated by destination type (Beach, Mountains, Spiritual) with checkable items.
5. **Trip Comparison Tool:** Side-by-side comparison of 2 destinations on budget, rating, and weather.
6. **Group Expense Splitter:** Peer debt settlement calculator ("Who owes whom").
7. **Wishlist / Favourites:** Heart button on all destination cards with counter badge.
8. **Multi-Destination Sequence Optimization:** Nearest-distance routing model.
9. **Reviews & Ratings:** Feedback indicators on stays and activities.
10. **Live Currency Converter:** Instant conversion across ₹ INR, $ USD, € EUR, £ GBP, and AED.
11. **Emergency Info:** Tailored police, hospital, ambulance, and tourist helplines per destination.
12. **Offers & Coupons:** Promo codes (`TRIP10`, `BUDGET500`) applied at checkout.
13. **Real-Time Actual Expense Tracker:** Track actual spends vs planned budget during the trip.
14. **In-App Notifications:** Alerts for departures and price drops.
15. **"Ask TripSmart" AI Chatbot Assistant:** Floating conversational assistant with rule-based answers and quick-reply chips.
16. **User Profile Modal:** Demo profile (Rohan Patil) with travel stats.
17. **Offline-Friendly PWA:** Service worker (`sw.js`), manifest (`manifest.json`), multi-language toggle (English / हिंदी / मराठी), and keyboard navigation accessibility.
18. **Eco-Friendly Travel Tag & Carbon Footprint Estimator:** CO2 emission calculation based on transit mode (Train vs Bus vs Flight) with tree offset metrics.

---

## 🛠️ Technical Integration Roadmap (From About Page)

| Booking Category | Integration Needed | Architecture Implementation in TripSmart |
|---|---|---|
| **Train tickets in India** | Authorized railway booking integration (IRCTC) or an eligible principal partner. | Simulated in `MockAPI.searchTrains()` with train numbers, classes (Sleeper, 3AC, 2AC, Vande Bharat), timings, and PNR generation. |
| **Hotels** | Hotel inventory and reservation API or direct hotel CRS partnerships (Amadeus, Sabre, RateGain). | Structured in `MockAPI.searchHotels()` supporting Budget, Standard, and Luxury tiers with rate calculation. |
| **Flights and buses** | Supplier or aggregator booking and ticketing APIs (GDS, RedBus API, Skyscanner). | Modeled with realistic flight durations, airline carriers (IndiGo, Air India), and intercity electric buses (Zingbus, IntrCity). |
| **Activities & Sightseeing** | Attraction operators or ticketing partners (GetYourGuide, Viator, ASI ticketing). | Built into `MockAPI.searchActivities()` with duration, entry fees, and slot reservations. |
| **Payments** | Payment gateway (Razorpay, Stripe, Cashfree, Pine Labs UPI). | Simulated in `BookingManager.processSimulatedPayment()` supporting UPI QR, Cards, and Net Banking with Demo Mode validation. |
| **Booking history & database** | Backend and database (Node.js + Express + MongoDB/PostgreSQL). | Persisted locally via `localStorage` with complete offline capability, PWA caching, and jsPDF invoice rendering. |

---

## 🚀 How to Run Locally

You can run TripSmart immediately without installing any external packages:

### Option 1: Direct Browser Launch
Simply double-click or open `index.html` directly in Google Chrome, Edge, Firefox, or Safari. All styles, icons, datasets, and scripts run client-side.

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 3000
```
Then navigate to: `http://localhost:3000`

Using Node.js:
```bash
npx serve -l 3000
```
