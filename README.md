# Health Check Holidays — Frontend Prototype

A React prototype for the Health Check Holidays platform. Built using British service design principles (GOV.UK / NHS style): content-first, progressive disclosure, plain language, and trust through restraint.

---

## Quick start

```bash
npm install
npm run dev
```

Requires Node 18+. Uses Vite + React + React Router. No backend — all data is local mock data in `src/data/`.

---

## Project structure

```
src/
  components/       Reusable UI components (nav, cards, buttons, timeline)
  pages/            One file per page/route
    HomePage.jsx
    DestinationsPage.jsx
    ShopPage.jsx          ← Airbnb-style browsing + package detail
    PackageDetailPage.jsx
    BookingFlow.jsx       ← 5-step booking form
    AccountPage.jsx       ← Dashboard with 4 tabs
    ItineraryPage.jsx     ← Printable day-by-day itinerary
  data/
    packages.js           ← All destination + screening package data
    itineraries.js        ← Day-by-day itinerary content per destination
  App.jsx
  main.jsx
  index.css             ← Design tokens + global styles
```

---

## Design system

### Colour palette

| Token | Hex | Usage |
|---|---|---|
| `--hch-green-900` | `#0b2e24` | Footer background |
| `--hch-green-800` | `#0d5c4a` | Primary brand, buttons, header |
| `--hch-green-600` | `#0F6E56` | Links, prices, accent text |
| `--hch-green-200` | `#5DCAA5` | Logo accent, hero highlights |
| `--hch-green-50` | `#E1F5EE` | Tints, tag backgrounds, insets |
| `--hch-amber-400` | `#BA7517` | Star ratings, warning accents |
| `--hch-blue-400` | `#378ADD` | Sightseeing timeline dots |
| `--hch-gray-400` | `#888780` | Travel timeline dots |

### Typography
- Font: System sans-serif stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- Two weights only: `400` (body) and `500` (headings, labels)
- Heading sizes: h1 = 26px, h2 = 22px, h3 = 18px, h4 = 15px
- Sentence case always. Never ALL CAPS or Title Case in UI.

### Component patterns

**Inset callout** — left-border block for important but non-alarming information:
```jsx
<div className="inset">
  <strong>Before you start:</strong> No referral needed.
</div>
```

**Step indicator** — shows progress through a multi-step flow. Active step in brand green, completed in teal tint.

**Service card** — package browsing card with destination, title, tags, price, rating. Click goes to detail page.

**Timeline row** — colour-coded dot + time + title + description. Used in itinerary. Dot colours encode activity type (health, explore, food, travel).

**Booking box** — sticky sidebar on package detail. Shows price breakdown, traveller selector, reserve CTA.

---

## Key pages to build on

### ShopPage — Airbnb-style browsing
- Filter chips (tier, accreditation, language, budget)
- Destination dropdown
- Card grid with wishlist hearts
- Results count updates on filter

**To extend:** connect to a real API, add map view toggle, add date range picker with availability.

### PackageDetailPage — package detail + booking box
- What's included checklist
- Partner hospitals with ratings
- Sample itinerary
- Sticky booking box with live price calculation (price × travellers + coord fee)
- "You save ~$X vs US" dynamic calculation

**To extend:** add real availability calendar, hotel bundling, real payment flow (Stripe).

### AccountPage — 4-tab dashboard
- My trips (upcoming, pending, past) with contextual actions
- Saved wishlist
- Health profile (age, interests, conditions, allergies)
- Documents (results PDFs, pre-arrival guides, hospital cards)

**To extend:** connect to auth (Clerk/Auth0/Supabase), real document storage (S3), results viewer.

### ItineraryPage — printable day-by-day plan
- Per-destination itinerary data from `src/data/itineraries.js`
- Health check day visually distinct (dark green pill, hospital info card)
- Activity types colour-coded
- `window.print()` produces clean print layout via `@media print` CSS
- Pre-screening tips appear day before hospital day

**To extend:** editable activities, drag-and-drop day reordering, hotel/restaurant booking links.

---

## Data model

### Package (src/data/packages.js)
```js
{
  id: 'japan-comp',
  destination: 'Japan',
  city: 'Tokyo',
  tier: 'comprehensive',        // 'essential' | 'comprehensive' | 'advanced'
  price: 299,
  usEquivalent: 2400,
  isJci: true,
  isEnglish: true,
  rating: 4.9,
  reviewCount: 312,
  emoji: '🗾',
  bgColor: '#E1F5EE',
  badge: 'Most popular',
  includes: [...],
  hospitals: [...],
  itinerarySummary: '...',
}
```

### Itinerary day (src/data/itineraries.js)
```js
{
  day: 3,
  label: 'Health check day',
  isHealthDay: true,
  date: 'Monday 16 June',
  events: [
    {
      time: '07:30',
      type: 'health',           // 'health' | 'explore' | 'food' | 'travel'
      title: 'Arrive St. Luke\'s',
      description: '...',
      tag: 'Health check',
    }
  ]
}
```

---

## Suggested next features

| Feature | Complexity | Notes |
|---|---|---|
| Auth + user accounts | Medium | Clerk or Supabase Auth recommended |
| Real package search + filtering API | Medium | Simple REST or Supabase table |
| Stripe payment flow | Medium | Reservation deposit model |
| Results viewer | Medium | PDF viewer + plain-English traffic lights per test |
| Itinerary editor | High | Drag-and-drop day builder |
| Hotel bundling | High | Integrate with a hotel API (e.g. Amadeus) |
| Corporate/group bookings | High | Multi-user account, invoice flow |
| Map view for destinations | Low | Mapbox or Google Maps embed |

---

## Design principles (brief)

This prototype follows British service design conventions:

1. **One job per page** — each page answers one question or completes one task
2. **Progressive disclosure** — show only what the user needs right now
3. **Plain language** — short sentences, no jargon, active voice
4. **Signposting** — breadcrumbs, step indicators, "before you start" insets
5. **Trust through restraint** — no marketing noise, no decorative clutter
6. **Descriptive CTAs** — "Save and continue" not "Next →"

Reference: [GOV.UK Design System](https://design-system.service.gov.uk/)

---

## Contact

Built as an investor/CTO prototype for Health Check Holidays.  
Questions: speak to the product owner.
