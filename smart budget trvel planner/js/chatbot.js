// js/chatbot.js - "Ask TripSmart" AI Assistant Rule Engine
/**
 * Interactive travel chatbot offering instant guidance on budgets, 
 * itineraries, packing, weather, and destinations.
 */

class TripSmartAssistant {
  constructor() {
    this.messagesContainer = null;
    this.history = [];
  }

  init(containerEl) {
    this.messagesContainer = containerEl;
    if (this.messagesContainer && this.messagesContainer.children.length === 0) {
      this.addBotMessage(
        "👋 Namaste! I'm your **TripSmart AI Guide**.\n\n" +
        "I can help you plan trips, find places under your budget, recommend food, and optimize travel expenses! How can I help you today?",
        [
          "Where can I go in ₹10,000?",
          "Best beach destinations?",
          "Budget tips for Goa",
          "What should I pack for mountains?"
        ]
      );
    }
  }

  addUserMessage(text) {
    if (!this.messagesContainer) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = text;
    this.messagesContainer.appendChild(bubble);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    // Simulate thinking delay
    setTimeout(() => {
      this.generateReply(text);
    }, 450);
  }

  addBotMessage(markdownText, quickReplies = []) {
    if (!this.messagesContainer) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    
    // Simple markdown parse
    let html = markdownText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    bubble.innerHTML = html;

    if (quickReplies && quickReplies.length > 0) {
      const repliesWrap = document.createElement('div');
      repliesWrap.className = 'chat-quick-replies';
      quickReplies.forEach(qr => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-pill';
        btn.textContent = qr;
        btn.onclick = () => {
          this.addUserMessage(qr);
        };
        repliesWrap.appendChild(btn);
      });
      bubble.appendChild(repliesWrap);
    }

    this.messagesContainer.appendChild(bubble);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  generateReply(userInput) {
    const input = (userInput || '').toLowerCase();
    const destinations = window.TRIPSMART_DESTINATIONS || [];

    // 1. Budget Query (e.g. ₹10000, 15000, 5000)
    const budgetMatch = input.match(/(\d+)\s*(k|thousand|rupees|₹|inr)?/);
    if ((input.includes('budget') || input.includes('where can i go') || input.includes('under')) && budgetMatch) {
      let amount = parseInt(budgetMatch[1]);
      if (budgetMatch[2] === 'k') amount *= 1000;
      else if (amount < 200) amount *= 1000; // e.g. "under 10"

      const options = window.TravelTools.suggestDestinationsByBudget(amount, 3);
      if (options.length > 0) {
        const top3 = options.slice(0, 3).map(d => `• **${d.name}** (${d.state}): ~₹${d.avg_daily_cost.budget * 3}/person for 3 days`).join('\n');
        this.addBotMessage(
          `Here are amazing getaways you can explore within **₹${amount.toLocaleString('en-IN')}** for a 3-day trip:\n\n${top3}\n\nWould you like me to create an optimized itinerary for one of these?`,
          options.slice(0, 3).map(d => `Plan trip to ${d.name}`)
        );
        return;
      }
    }

    // 2. Beach Query
    if (input.includes('beach') || input.includes('sea') || input.includes('coastal')) {
      const beaches = destinations.filter(d => d.category.some(c => c.toLowerCase().includes('beach'))).slice(0, 4);
      const list = beaches.map(b => `• **${b.name}**: ${b.best_season} (Avg ₹${b.avg_daily_cost.budget}/day)`).join('\n');
      this.addBotMessage(
        `Top handpicked Indian beach destinations for you:\n\n${list}\n\n💡 *Tip: Gokarna and Varkala are great budget alternatives to North Goa during peak season!*`,
        ["Plan trip to Goa", "Plan trip to Gokarna", "Plan trip to Varkala"]
      );
      return;
    }

    // 3. Mountain / Snow Query
    if (input.includes('mountain') || input.includes('hill') || input.includes('snow') || input.includes('trek')) {
      const hills = destinations.filter(d => d.category.some(c => c.toLowerCase().includes('mountain') || c.toLowerCase().includes('hill') || c.toLowerCase().includes('snow'))).slice(0, 4);
      const list = hills.map(h => `• **${h.name}** (${h.state}): ${h.best_season}`).join('\n');
      this.addBotMessage(
        `Serene mountain and hill destinations to escape to:\n\n${list}\n\nManali and Auli offer prime snowfall during Dec–Feb, while Munnar and Coorg offer lush green rolling estates.`,
        ["Plan trip to Manali", "Plan trip to Munnar", "What to pack for snow?"]
      );
      return;
    }

    // 4. Packing Tips
    if (input.includes('pack') || input.includes('clothes') || input.includes('luggage')) {
      this.addBotMessage(
        "🎒 **Smart Packing Checklist Essentials**:\n\n" +
        "1. Government Photo ID (Aadhaar / Voter ID / Passport) + 2 Photocopies\n" +
        "2. Universal Power Bank (10,000mAh) & Waterproof Mobile Pouch\n" +
        "3. Basic Medical Kit: Paracetamol, ORS electrolytes, motion sickness tablets\n" +
        "4. Layered clothing (Thermal inner-wear for mountains, breathable linen for beaches)\n\n" +
        "You can view and check off your full personalized list in our **Packing Checklist Tool**!",
        ["Open Packing Checklist", "Where can I go in ₹10,000?"]
      );
      return;
    }

    // 5. Goa Specific Tips
    if (input.includes('goa')) {
      this.addBotMessage(
        "🌴 **Smart Tips for Goa Travel**:\n\n" +
        "• **Transport**: Rent an Activa/scooter for ~₹400/day. Avoid high airport taxi fees by booking GoaMiles or state shuttle buses.\n" +
        "• **Stays**: South Goa (Palolem, Agonda) is quieter and cheaper than North Goa (Baga, Calangute).\n" +
        "• **Food**: Try local Goan fish curry thali at small family-run 'bars & restaurants' for ₹200.\n" +
        "• **Coupons**: Use promo code `TRIP10` when booking!",
        ["Plan trip to Goa", "Check Goa hotels", "Where can I go in ₹15,000?"]
      );
      return;
    }

    // 6. Direct "Plan trip to [Destination]"
    const planMatch = input.match(/plan trip to\s+([a-z\s]+)/);
    if (planMatch) {
      const destName = planMatch[1].trim();
      const matched = destinations.find(d => d.name.toLowerCase().includes(destName));
      if (matched) {
        this.addBotMessage(
          `Awesome choice! Starting the 6-Step Wizard for **${matched.name}** (${matched.state})...\n\nRedirecting you right now!`,
          []
        );
        setTimeout(() => {
          if (window.WizardApp) {
            window.WizardApp.loadDestinationIntoWizard(matched.id);
            window.Router.navigate('plan');
          }
        }, 800);
        return;
      }
    }

    // 7. General Fallback
    this.addBotMessage(
      "I'm here to help you get the best value travel experience across India! You can ask me:\n\n" +
      "• Suggestions by budget (e.g., 'Where can I go in ₹20,000?')\n" +
      "• Recommendations by theme (Beaches, Heritage, Spiritual, Treks)\n" +
      "• Destination budget breakdowns and food specialties\n" +
      "• Packing checklists & safety helplines",
      [
        "Where can I go in ₹10,000?",
        "Best heritage places?",
        "How does budget optimizer work?",
        "Discounts and promo codes"
      ]
    );
  }
}

window.TripChatbot = new TripSmartAssistant();
