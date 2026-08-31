# Arena Master

/goal Build a complete, responsive, mobile-first single-page web application for "Arena OF Legends" — a premier competitive gaming and cue-sports destination focused strictly on pure gameplay, tournaments, hourly table/console bookings, and group lockouts (no birthday parties or food/catering).

---

### 1. Brand Identity & Visual Aesthetic

- Brand Name: "ARENA OF LEGENDS"

- Tagline: "PLAY • COMPETE • WIN • REPEAT"

- Color Palette (Strictly matched to brand identity):

  - Primary Background: #06080F (Deep Obsidian Void with subtle midnight blue undertones)

  - Champion Gold (Primary Brand & Accents): #FFB800 (Vibrant Gold) & #E5A000 (Metallic Gold gradient)

  - Primary Action / Conversion CTA: #FFB800 (Champion Gold button with #06080F text) and #FF2A55 (High-Octane Crimson Neon)

  - Zone Indicator Accents:

    - 🎮 Console Blue Neon: #0088FF / #00D8F6

    - 🎱 Snooker Green Glow: #00E676 / #00C853

    - 🥖 French Billiards Red Glow: #FF2A55

  - Surface Glass: `rgba(10, 14, 26, 0.8)` with `backdrop-blur-xl`, subtle 1px metallic gold border `rgba(255, 184, 0, 0.15)` and soft glow hover transitions.

---

### 2. Exact Venue Rates & Equipment Inventory

Ensure all interactive calculators, spec cards, and booking funnels strictly feature these exact zones and rates:

1. 🎮 Console VIP Arena:

   - 2 × PlayStation 5 Rigs (DualSense controllers, 4K 120Hz displays, pro gaming recliners)

   - Rate: ₹300 / hour per console

   - Featured Titles: EA FC, Mortal Kombat, WWE 2K, GTA V, Spider-Man, Rocket League, Tekken

2. 🎱 Championship Snooker Zone:

   - 2 × English Snooker Championship Boards (Tournament-grade 6811 cloth, professional brass cue sets, overhead precision lights) — ₹250 / hour per board

   - 1 × French Billiards / Carom Board (Heated tournament bed, precision balls) — ₹150 / hour

   - Amenities: Pro chalk/rests, spectator viewing lounge, digital scoreboard integration

---

### 3. High-Converting Page Architecture

1. Metallic Frosted Sticky Navbar (`Navbar.jsx`):

   - Brand Logo: "ARENA OF LEGENDS" with a gold crown icon and subtle neon trim.

   - Jump links: [Gaming & Cue Zones, Competitive Passes, Live Rate Calculator, Leaderboard, Location].

   - Desktop CTAs: "📞 WhatsApp / Call" + Champion Gold button "⚡ Book a Slot".

   - Mobile: Slide-over drawer with instant click-to-call trigger.

2. Pure-Competitive Hero Section (`Hero.jsx`):

   - Headline: "PLAY. COMPETE. WIN. REPEAT."

   - Sub-headline: "Elite PlayStation 5 VIP setups, championship English Snooker, and French Billiards. Zero lag, tournament-grade equipment, pure competition."

   - Dual Conversion CTAs:

     - Primary Action (#FFB800 Gold): "⚡ Reserve Console or Snooker Table" (Smooth-scrolls to calculator/form).

     - Secondary Action (Crimson Neon border): "🏆 View Tournaments & Squad Passes".

   - Live Trust Spec Badges:

     - "🎮 2x PS5 VIP Stations (₹300/hr)"

     - "🎱 2x English Snooker Boards (₹250/hr)"

     - "🥖 1x French Board (₹150/hr)"

     - "🏆 Weekly Ranked Tournaments"

3. Dedicated Zones & Rates Matrix (`ZonesMatrix.jsx`):

   - 3 Tabbed / Horizontal Snap Cards:

     - Card 1 (Cyan Glow): "PlayStation 5 VIP Lounge" — ₹300/hr (2 Setups, 4K 120Hz displays, 2-4 players per setup).

     - Card 2 (Green Glow): "English Snooker Championship Tables" — ₹250/hr (2 Tables, pro cues, match-ready lighting).

     - Card 3 (Red Glow): "French Billiards / Carom Table" — ₹150/hr (1 Board, precision cloth).

   - Each card has a direct "Book This Zone" button that auto-selects that zone in the form below.

4. Competitive Squad Passes & Full Arena Lockouts (`CompetitivePasses.jsx`):

   - 3 Focused Gaming Passes (No food/birthday elements):

     - Pass 1: "Duelist Pass" — 2 Hours PS5 or Snooker solo/duo session.

     - Pass 2: "Squad LAN & Cue Clash" (Marked MOST POPULAR with gold crown badge) — 3 Hours multi-zone access across PS5 and English Snooker for squads (up to 8 players).

     - Pass 3: "Full Arena Lockout / Tournament Host" — Exclusive 4+ hour private venue takeover (both PS5s, both English Snooker boards, and French table) for local LAN brackets and private squad tournaments.

   - "Select Pass" button that pre-populates the booking calculator.

5. Dynamic Slot Price Estimator & 3-Step Lead Capture Funnel (`PartyCalculator.jsx` & `LeadForm.jsx`):

   - Interactive Live Calculator:

     - Zone Selectors: Toggles for PS5 (₹300/hr), English Snooker (₹250/hr), and French Board (₹150/hr).

     - Stepper Controls: Hours needed (1 to 6 hours), Number of players (1 to 20+).

     - Dynamic total cost automatically computed in INR (₹).

   - Frictionless 3-Step Lead Funnel:

     - Step 1: Selected Zones, Date & Preferred Time Slot.

     - Step 2: Player Count & Estimated Price (pre-filled from calculator).

     - Step 3: Contact Info (Full Name, WhatsApp/Phone number, Preferred Game/Match format).

   - High-Contrast Submit Button: "Lock In Time Slot & Get WhatsApp Confirmation".

   - Instant visual confirmation modal: "Slot Request Sent! Arena OF Legends staff will WhatsApp/call you within 15 minutes to lock your station."

6. Social Proof, Rules & Venue Location Hub (`VenueInfo.jsx`):

   - Verified 4.9★ Google Reviews rating badge featuring feedback from competitive gamers and cue-sports players.

   - Quick Player Guidelines Accordion (clean equipment etiquette, advance booking confirmation, controller/cue care).

   - Dark-styled Google Maps card with address, operating hours, and a 1-tap "Get Directions" link.

   - 1-Click WhatsApp Quick Chat floating trigger.

7. Persistent Mobile Bottom Conversion Bar (`MobileBottomBar.jsx`):

   - Fixed to the bottom on mobile devices (`fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#06080F]/95 backdrop-blur-xl border-t border-gold/20 p-3`).

   - Split 2-button layout:

     - Left: "📞 Call Arena" (`tel:` link).

     - Right (#FFB800 Gold): "⚡ Reserve Slot" (Instant jump to booking form).

---

### 4. Technical Stack & Execution Instructions

- Tech Stack: React + Vite + Tailwind CSS + Lucide-react (or Shadcn/ui).

- Styling Tokens:

  - Custom Tailwind colors: `arena-dark: '#06080F'`, `arena-gold: '#FFB800'`, `arena-crimson: '#FF2A55'`, `arena-cyan: '#00D8F6'`, `arena-green: '#00E676'`.

- Mobile Touch UX: 44px minimum touch targets, zero layout shifts, smooth horizontal swipeable cards on mobile viewports (375px–390px).

- State Integration: Direct state sync from Zone Selection $\rightarrow$ Dynamic Calculator $\rightarrow$ Final Lead Form.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7cad46cc-e814-4ea2-b13a-01ffb15e5f70).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
