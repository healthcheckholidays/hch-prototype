// Data for the 10-step /book flow. Japan is the only live destination —
// other countries are shown greyed out for realism. Clinics and packages
// are fetched live from Supabase (see src/lib/supabase.js) — only the
// generic/static parts of the flow stay hardcoded here.

export const COUNTRIES = [
  { id: 'japan', name: 'Japan', flag: '🗾', tagline: 'World-leading diagnostics · Tokyo', active: true },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', tagline: 'English-first · No visa required', active: false },
  { id: 'south-korea', name: 'South Korea', flag: '🇰🇷', tagline: 'Executive check-ups · Seoul', active: false },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭', tagline: 'Best value · Bangkok', active: false },
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', tagline: 'Underrated gem · Taipei', active: false },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', tagline: 'Most affordable · Kuala Lumpur', active: false },
  { id: 'hong-kong', name: 'Hong Kong', flag: '🇭🇰', tagline: 'Advanced tier · English-speaking', active: false },
  { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', tagline: 'Emerging destination', active: false },
]

export const PREP_INSTRUCTIONS = [
  'Fast for 8 hours before your appointment — water only, no coffee, juice, or food.',
  'Bring your passport and booking confirmation email — required for all international patients.',
  'Wear comfortable, loose-fitting clothing for ease during the ECG and blood draw.',
  'Avoid strenuous exercise and alcohol for 24 hours before your screening.',
  'Arrive 15 minutes early to complete check-in at the International Centre.',
]

// The 6 fixed interest categories from the CEO spec.
export const INTEREST_CATEGORIES = [
  { id: 'art-culture', label: 'Art & Culture', emoji: '🎨' },
  { id: 'food-dining', label: 'Food & Dining', emoji: '🍜' },
  { id: 'historic-sites', label: 'Historic Sites', emoji: '⛩️' },
  { id: 'nature-hiking', label: 'Nature & Hiking', emoji: '🥾' },
  { id: 'sports-watching', label: 'Sports Watching', emoji: '🏟️' },
  { id: 'social-connection', label: 'Social Connection', emoji: '🤝' },
]

// Step 7's centre tile — hardcoded, locked, cannot be moved or deleted.
export const SCREENING_TILE = {
  time: '09:00',
  title: 'Morning Medical Screening',
  subtitle: 'St. Luke\'s International Hospital',
}

// Fixed pool of Tokyo experiences for Step 7 — every interest combination
// in Step 6 leads to this same pool. 8 tiles are shown at once (the 9th
// grid cell is the locked centre tile); clicking a tile cycles it through
// this array, looping back to the start once every option has been shown.
export const TOKYO_ACTIVITIES = [
  { emoji: '⛩️', title: 'Senso-ji Temple, Asakusa' },
  { emoji: '🎨', title: 'Mori Art Museum' },
  { emoji: '🍜', title: 'Tsukiji Outer Market food tour' },
  { emoji: '🥾', title: 'Mount Takao day hike' },
  { emoji: '🏟️', title: 'Sumo tournament at Ryogoku Kokugikan' },
  { emoji: '🤝', title: 'Izakaya crawl with a local guide' },
  { emoji: '🌳', title: 'Shinjuku Gyoen National Garden' },
  { emoji: '🛍️', title: 'Ginza flagship stores' },
  { emoji: '🌃', title: 'Shibuya Sky sunset & bar' },
  { emoji: '♨️', title: 'Hakone onsen day trip' },
]

// Preferred travel window options for Step 8.
export const TRAVEL_WINDOWS = [
  'October 2026',
  'November 2026',
  'December 2026',
  'January 2027',
  'February 2027',
  'March 2027',
]

// The 3 medical intake Yes/No toggles for Step 8.
export const MEDICAL_QUESTIONS = [
  { id: 'cardiovascular', label: 'Do you have any existing cardiovascular conditions?' },
  { id: 'implants', label: 'Do you have any metal implants, clips, or pacemakers?' },
  { id: 'bloodThinners', label: 'Are you currently taking prescribed blood-thinning medications?' },
]

export const LEAD_CAPTURE_LEGAL_COPY =
  "Booking Request Initiated! To safely secure your slot at our partner clinic in compliance with global medical data regulations, a dedicated Health Check Holidays concierge will contact you within 48 hours to unlock your fully encrypted medical upload portal, finalize your dates, and lock in your custom itinerary."

export const stripeLegalCopy = (clinicName) =>
  `Secure checkout powered by Stripe. Payments are encrypted and routed directly to ${clinicName || 'the partner clinic'}'s international healthcare account. Health Check Holidays does not hold, store, or process client medical funds.`

// Builds the Day 1 / Day 2 / Day 3+ itinerary for Step 10, blending the
// user's Step 7 lifestyle tile selections into the travel grid around the
// locked Day 2 medical screening slot.
export const buildDynamicItinerary = (finalActivities) => {
  const day1 = {
    day: 1,
    label: 'Arrival',
    date: 'Day 1',
    isHealthDay: false,
    preDayTip: null,
    events: [
      { time: 'Arrival', type: 'travel', title: 'Airport Arrival', description: 'Land at Narita or Haneda Airport. Clear immigration and collect luggage.' },
      { time: 'Afternoon', type: 'travel', title: 'Private Transfer', description: 'A private driver takes you directly to your hotel — no trains or transfers to navigate on arrival day.' },
      { time: 'Evening', type: 'explore', title: 'Evening Relaxation', description: 'Settle in and rest. Light dinner near your hotel recommended before tomorrow.' },
    ],
  }

  const day2 = {
    day: 2,
    label: 'Health check day',
    date: 'Day 2',
    isHealthDay: true,
    preDayTip: { label: 'Before your screening tomorrow', text: 'Fast for 8 hours before your appointment — water only. Arrive 15 minutes early.' },
    events: [
      { time: SCREENING_TILE.time, type: 'health', title: SCREENING_TILE.title, description: `${SCREENING_TILE.subtitle} — International Centre. Confirmed slot, locked from your itinerary preview.`, tags: ['Confirmed'] },
      { time: 'Afternoon', type: 'explore', title: 'Afternoon Art Gallery', description: 'A relaxed gallery visit to unwind after your screening — Mori Art Museum or teamLab, depending on opening hours.' },
    ],
  }

  // Spread the remaining selected lifestyle tiles across Day 3+ (3 per day).
  const laterDays = []
  for (let i = 0; i < finalActivities.length; i += 3) {
    const chunk = finalActivities.slice(i, i + 3)
    const dayNum = 3 + Math.floor(i / 3)
    laterDays.push({
      day: dayNum,
      label: 'Tokyo lifestyle day',
      date: `Day ${dayNum}`,
      isHealthDay: false,
      preDayTip: null,
      events: chunk.map((activity, idx) => ({
        time: ['Morning', 'Afternoon', 'Evening'][idx] || 'Later',
        type: idx === 1 ? 'food' : 'explore',
        title: activity.title,
        description: `Part of your personalised itinerary, selected during booking.`,
      })),
    })
  }

  return [day1, day2, ...laterDays]
}
